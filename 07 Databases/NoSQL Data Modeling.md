---
tags: [databases, data-modeling, nosql, mongodb, dynamodb]
level: intermediate
status: reviewed
prereqs: ["[[SQL vs NoSQL]]", "[[Relational Schema Design]]", "[[Partitioning and Sharding]]"]
related: ["[[Wide-Column Stores and Cassandra]]", "[[Materialized Views and Denormalization]]", "[[Transactions and ACID]]", "[[Hot Keys and Hot Partitions]]", "[[Consistent Hashing]]", "[[Replication]]", "[[Zero-Downtime Schema Migrations]]"]
sources:
  - "MongoDB manual: Data Modeling, Embedded vs References, 16 MB BSON document limit, Transactions (replica sets since 4.0, sharded clusters since 4.2; transactionLifetimeLimitSeconds default 60; production guidance of at most 1,000 documents modified per transaction)"
  - "MongoDB blog series 'Building with Patterns' (bucket, computed, extended reference, subset, outlier, schema versioning)"
  - "William Zola, '6 Rules of Thumb for MongoDB Schema Design' (MongoDB blog): one-to-few, one-to-many, one-to-squillions"
  - "AWS DynamoDB Developer Guide: partition limits (3,000 RCU and 1,000 WCU per partition), 400 KB item size, Query 1 MB page and LastEvaluatedKey, Limit applied before FilterExpression, GSIs eventually consistent, LSI 10 GB item collection limit and LSIs only at table creation, TransactWriteItems (up to 100 actions, 4 MB, two underlying writes per item), read/write capacity unit sizes (4 KB / 1 KB)"
  - "Rick Houlihan, Advanced Design Patterns for DynamoDB (AWS re:Invent 2018, DAT401)"
  - "Alex DeBrie, The DynamoDB Book (2020)"
updated: 2026-11-13
---

# NoSQL Data Modeling

> [!summary] TL;DR
> In a relational database you design tables first and write any query later. In a document store (MongoDB) or key-value store (DynamoDB) you do the opposite: list the **access patterns** (the exact reads and writes the app makes, with their rates) first, then shape documents and keys so each pattern is one cheap lookup. You trade flexible queries and joins for predictable, scalable reads.

> [!abstract] Core idea
> - Start from a numbered list of access patterns with expected QPS (queries per second); every pattern must map to one key lookup or one range query.
> - MongoDB: embed what is read together and bounded in size; reference what grows without limit or is shared.
> - DynamoDB: the partition key decides *where* an item lives, the sort key decides its *order*; one `Query` reads one partition key's items in sort order.
> - Single-table design stores several entity types in one table and overloads generic index attributes (`GSI1PK`, `GSI1SK`) to serve many patterns.
> - Both stores support multi-item transactions, but they cost more and are capped, so the model should make most writes touch one item or document.

## Start here: the basics

**The problem in one story.**
In SQL you store data neatly and can ask almost any question later.
A NoSQL store like DynamoDB is very fast and scales far, but only for questions you planned for.
So you first write down every question the app will ask.
Then you shape the data so each question is one cheap lookup.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Document store | A database that stores JSON-like documents | MongoDB |
| Key-value store | A database that finds items by a key | DynamoDB |
| Access pattern | One exact read or write the app makes, with its rate | "List a workspace's invoices by month, 200/s" |
| Embed | Put related data inside the same document | Line items inside the invoice |
| Reference | Store only the ID of related data | `clientId: 42` |
| Partition key | Decides where an item is stored | `WS#acme` |
| Sort key | Decides the order of items under one partition key | `INV#2026-11#0042` |
| Index (GSI) | A second copy of the data keyed differently, for another pattern | Invoices by client |

**Picture it**

```mermaid
flowchart LR
    AP["List access patterns<br/>+ QPS"] --> K["Design keys<br/>and documents"]
    K --> Q1["Pattern 1 → one Query<br/>on PK + SK prefix"]
    K --> Q2["Pattern 2 → one Query<br/>on a GSI"]
```

**Analogy.** A library that only lets you find books by shelf and position, so you decide shelf order based on how people will search.
Where it breaks: a real librarian can still walk every shelf; a full table scan in DynamoDB is slow and costly at scale.

**How the rest of this note builds up**

- First, why query-first design exists (section 1) and the mental model (section 2).
- Then listing access patterns, MongoDB embed vs reference and its design patterns (sections 3.1-3.3).
- Then DynamoDB keys and indexes, single-table design and transactions (sections 3.4-3.6).
- Then the same invoice modelled in both stores with capacity arithmetic (section 4).
- Finally the SDE-3 view: comparisons, hot partitions in production and the deep dive (sections 5-8).

> [!tip] Remember
> In NoSQL, the access patterns come first; every pattern must be one key lookup or one range query.

## 1. Why it exists

InvoiceOps runs on PostgreSQL. Suppose a team moves its invoice reads to DynamoDB and copies the relational schema one-to-one: tables `workspaces`, `clients`, `invoices`, `invoice_items`, `payments`.

The invoice detail page now needs one request for the invoice, one `Query` for its items and one for its payments, then a request for the client.

DynamoDB has no joins, so that is 4 network round trips at about 5–10 ms each (an estimate) instead of one SQL query.

The list page "invoices of client c_1" needs a filter on a non-key attribute, so it becomes a `Scan` of the whole table: at 20 million invoices of about 1 KB, that is roughly 20 GB read per request.

```mermaid
sequenceDiagram
    participant UI as Invoice detail page
    participant D as DynamoDB, tables copied from SQL
    UI->>D: GetItem invoices inv_812
    D-->>UI: invoice row
    UI->>D: Query invoice_items, invoice_id = inv_812
    D-->>UI: 3 lines
    UI->>D: Query payments, invoice_id = inv_812
    D-->>UI: 1 payment
    UI->>D: GetItem clients c_1
    D-->>UI: client row
    Note over UI,D: 4 round trips, about 20 to 40 ms (estimate). SQL did this in one JOIN
    UI->>D: Scan invoices, filter client_id = c_1
    Note over D: reads about 20 GB to return 40 rows
```

The data model did not fail because NoSQL is slow. It failed because it was designed for a database that can answer any query, and DynamoDB answers only the queries its keys were designed for. NoSQL data modeling is the discipline of designing those keys.

## 2. Mental model

**Relational:** model the *data* (entities, relationships, normal forms), then any query works, with indexes added for speed.

**NoSQL:** model the *questions*. Write the access patterns down, then build the storage so that each answer is already sitting together, in the right order, under one key.

```mermaid
flowchart LR
    subgraph REL["Relational: data first"]
        direction LR
        R1["entities and<br/>relationships"] --> R2["normalize into tables"] --> R3["write any query,<br/>add indexes later"]
    end
    subgraph NOS["NoSQL: questions first"]
        direction LR
        N1["list access patterns<br/>with QPS"] --> N2["design keys or<br/>document boundaries"] --> N3["each pattern is one<br/>lookup or range read"]
    end
```

**Analogy:** a library catalogue versus a meal-prep kitchen. The library (SQL) shelves books by a neutral system and lets you ask anything at the desk.

The meal-prep kitchen (NoSQL) packs each customer's lunch box in the morning, because it knows exactly who will ask for what at noon. Handing over a box is instant; answering an unexpected question ("which boxes contain cumin?") means opening every box.

Key terms used below:
- **Access pattern:** one concrete operation, such as "get invoice by id with its lines and payments".
- **Document:** a JSON-like object (stored as BSON in MongoDB) that can nest objects and arrays.
- **Partition key (PK):** the attribute DynamoDB hashes to choose the physical partition that stores an item.
- **Sort key (SK):** the attribute that orders items sharing one partition key.
- **Item collection:** all items with the same partition key.
- **GSI / LSI:** global and local secondary indexes, copies of items keyed differently (explained in section 3.4).
- **RCU / WCU:** read and write capacity units; 1 WCU is one write per second of an item up to 1 KB, and 1 RCU is one strongly consistent read per second of up to 4 KB (or two eventually consistent reads).

## 3. How it works

### 3.1 Step 1: list the access patterns

The first design step is a table of every read and write, with its rate. For InvoiceOps (rates are estimates for a mid-sized deployment):

| # | Access pattern | Type | Expected QPS |
| --- | --- | --- | --- |
| AP1 | Get an invoice with its line items and payments | read | 300 |
| AP2 | List a workspace's invoices for a month, newest first | read | 80 |
| AP3 | List one client's invoices | read | 40 |
| AP4 | List a workspace's overdue invoices by due date | read | 20 |
| AP5 | List the workspaces a user belongs to, and the members of a workspace | read | 200 |
| AP6 | Record a payment and update the invoice's `paid_minor` and status | write | 30 |
| AP7 | Create an invoice with its lines | write | 20 |

Anything not on this list (for example "revenue by country across all tenants") is served elsewhere: an analytics store or a search engine.

Example with numbers: the read patterns add up to 300 + 80 + 40 + 20 + 200 = 640 reads per second and the writes to 30 + 20 = 50 writes per second. AP1 is nearly half of all traffic, so it deserves the cheapest possible shape: one key lookup.

### 3.2 MongoDB: embed or reference

The relational schema maps onto documents like this:

```mermaid
erDiagram
    WORKSPACE ||--o{ CLIENT : has
    WORKSPACE ||--o{ INVOICE : issues
    CLIENT ||--o{ INVOICE : billed
    INVOICE ||--|{ INVOICE_ITEM : contains
    INVOICE ||--o{ PAYMENT : receives
    INVOICE ||--o{ AUDIT_LOG : records
```

```mermaid
flowchart LR
    subgraph inv["invoices collection: one document per invoice"]
        D["_id, workspace_id, number, status<br/>total_minor, paid_minor (computed)<br/>client: {_id, name} (extended reference)<br/>items: [ ... ] (embedded, bounded)<br/>payments: [ ... ] (embedded, few)<br/>schema_version: 2"]
    end
    CL["clients collection<br/>_id, workspace_id, name, email"] -. "referenced by client._id;<br/>name copied" .-> D
    AL["audit_logs collection<br/>invoice_id on every entry<br/>(parent reference)"] -. "invoice_id" .-> D
```

The first diagram is the relational shape; the second shows which parts become one document and which stay in their own collections.

The rules of thumb (from MongoDB's guidance):

| Relationship | Example | Model |
| --- | --- | --- |
| one-to-few, read together | an invoice and its 1–50 line items | **embed** the array in the parent |
| one-to-many (hundreds to thousands) | a workspace and its clients | **reference**: separate documents, with an indexed `workspace_id` |
| one-to-squillions (unbounded) | an invoice and its audit log entries | **parent reference** only: each child stores the parent id; never keep an array of child ids in the parent |
| many-to-many | users and workspaces | arrays of ids on one or both sides, or a membership collection |

Two hard limits drive these rules:
- A document is at most **16 MB**. An array that grows forever (audit entries, comments, events) eventually hits it.
- Every update rewrites the document in the storage engine, and large arrays make updates and index maintenance expensive long before 16 MB. This is the **unbounded array anti-pattern**.

Example with numbers: an invoice with 3 lines of 200 bytes is about 1 KB, so embedding is free. An audit log of 50 entries a day at 300 bytes grows by 15 KB a day; after 3 years it is about 16 MB, the hard cap, and the document was being rewritten on every entry long before that.

### 3.3 MongoDB design patterns

MongoDB's documented design patterns each fix one specific problem:

| Pattern | Idea | InvoiceOps example |
| --- | --- | --- |
| **Bucket** | Group many small time-ordered items into one document per period or per N items | one document per invoice per day of reminder events, with `count` and `events: [...]` |
| **Computed** | Store a derived value at write time instead of summing on every read ([[Materialized Views and Denormalization]]) | `total_minor`, `paid_minor` |
| **Extended reference** | Copy the few fields of a referenced document that the reader needs, so the list page needs no `$lookup` (MongoDB's join stage) | `client: {_id, name}` |
| **Subset** | Embed only the most-used part of a large related set and keep the rest in another collection | the 5 latest payments embedded, the rest in `payments` |
| **Outlier** | Design for the normal case and flag the rare huge one | `has_overflow: true`, with an invoice of 10,000 lines stored in overflow documents |
| **Schema versioning** | Each document carries `schema_version`; code reads every version and upgrades a document when it next writes it (**lazy migration**), while a background job converts the rest | `schema_version: 2` |

```mermaid
flowchart TB
    subgraph before["Unbounded array in one document"]
        B1["invoice inv_812<br/>reminders: 1, 2, 3 ... 4,000"] --> B2["rewritten on every append,<br/>heads toward 16 MB"]
    end
    subgraph after["Bucket pattern"]
        A1["inv_812 / 2026-11-01<br/>count 24, events 1..24"]
        A2["inv_812 / 2026-11-02<br/>count 31, events 1..31"]
        A3["inv_812 / 2026-11-03<br/>count 9, events 1..9 (open bucket)"]
    end
    before -. "split by period" .-> after
```

Bucketing caps each document at one day of events, so appends touch only the open bucket.

### 3.4 DynamoDB: partition key, sort key and indexes

```mermaid
flowchart LR
    Q["Query: PK = WS#acme<br/>AND begins_with(SK, 'INV#2026-11')"] --> R[request router]
    R -- "hash(PK) picks the partition" --> P2
    subgraph P1["partition 1"]
        X1["WS#globex items ..."]
    end
    subgraph P2["partition 2: item collection WS#acme, sorted by SK"]
        direction TB
        S1["CLIENT#c_1"] --> S2["INV#2026-10#inv_700"] --> S3["INV#2026-11#inv_811"] --> S4["INV#2026-11#inv_812"] --> S5["META"]
    end
    P2 -- "contiguous range read, up to 1 MB per page" --> OUT["inv_811, inv_812"]
```

- **Primary key** = partition key alone, or partition key + sort key. It must be unique.
- **`GetItem`** reads one item by full primary key. **`Query`** reads items of *one* partition key, optionally with a sort-key condition (`=`, `<`, `between`, `begins_with`), in sort-key order, forwards or backwards. **`Scan`** reads the whole table and is for exports, not for requests.
- **Composite sort keys** encode a hierarchy so one prefix serves several patterns: `INV#2026-11#inv_812` serves "this month" (`begins_with INV#2026-11`), "this year" (`begins_with INV#2026`) and "all invoices" (`begins_with INV#`).
- **Global secondary index (GSI):** a second copy of the items with a different partition and sort key. It can be added at any time, is replicated asynchronously, and is **eventually consistent**: `ConsistentRead` is not supported on a GSI.
- **Local secondary index (LSI):** same partition key, different sort key. It must be created with the table, supports strongly consistent reads, and limits each item collection (base items plus LSI copies for one partition key) to **10 GB**.
- **Per-partition limits:** one partition serves at most **3,000 RCU and 1,000 WCU** per second. An item is at most **400 KB**.

| | GSI | LSI |
| --- | --- | --- |
| Partition key | different from the table | same as the table |
| When it can be created | any time | only at table creation |
| Consistency | eventually consistent only | strong reads supported |
| Size limit | none per collection | 10 GB per item collection |

Example with numbers: sort keys `INV#2026-10#inv_700`, `INV#2026-11#inv_811`, `INV#2026-11#inv_812` are stored in that byte order inside partition `WS#acme`. `begins_with(SK, "INV#2026-11")` reads the last two as one contiguous range and never touches the first.

### 3.5 Single-table design

Single-table design puts every entity type in one table, with generic key names (`PK`, `SK`, `GSI1PK`, `GSI1SK`), so that related items share a partition and come back from one `Query`.

| PK | SK | GSI1PK | GSI1SK | Other attributes | Serves |
| --- | --- | --- | --- | --- | --- |
| `WS#acme` | `META` | | | name, plan | workspace profile |
| `WS#acme` | `USER#u_9` | `USER#u_9` | `WS#acme` | role | AP5 both ways (adjacency list) |
| `WS#acme` | `CLIENT#c_1` | `CLIENT#c_1` | `META` | name, email | client under its workspace |
| `WS#acme` | `INV#2026-11#inv_812` | `CLIENT#c_1` | `INV#2026-11#inv_812` | status, total_minor, due_date | AP2, AP3 |
| `WS#acme` | `INV#2026-11#inv_812` | | | `GSI2PK = WS#acme#OVERDUE`, `GSI2SK = 2026-10-31` (only while overdue) | AP4 (sparse index) |
| `INVOICE#inv_812` | `META` | | | full invoice, client name | AP1 |
| `INVOICE#inv_812` | `ITEM#001` | | | description, quantity, unit_price_minor | AP1 |
| `INVOICE#inv_812` | `PAY#2026-11-02T10:00Z#p_1` | | | amount_minor, provider_ref | AP1, AP6 |

(The two `WS#acme / INV#...` rows are one item; it is split here to show the `GSI2` attributes.)

How the patterns are served:
- **AP1:** `Query PK = INVOICE#inv_812` returns the invoice, its lines and its payments in one request (the item collection *is* the join).
- **AP2:** `Query PK = WS#acme, begins_with(SK, "INV#2026-11")`, `ScanIndexForward = false` for newest first.
- **AP3:** `Query GSI1 PK = CLIENT#c_1` returns the client row and its invoices. `GSI1` is **overloaded**: for a membership item `GSI1PK` holds a user, for an invoice it holds a client.
- **AP4:** a **sparse index**: only overdue invoices carry `GSI2PK`, so `GSI2` contains only overdue invoices. When the invoice is paid, the app removes the attribute and it leaves the index.
- **AP5:** an **adjacency list**: the membership item `WS#acme / USER#u_9` lists members under the workspace; `GSI1` flips it (`USER#u_9 → WS#acme`) to list a user's workspaces.
- **AP6:** `TransactWriteItems` puts the payment item and updates both copies of the invoice (detail `META` and summary under `WS#acme`) atomically.

```mermaid
flowchart LR
    subgraph BASE["Base table, read by PK"]
        M1["PK WS#acme<br/>SK USER#u_9"]
        M2["PK WS#acme<br/>SK USER#u_12"]
    end
    subgraph GSI["GSI1, read by GSI1PK"]
        G1["GSI1PK USER#u_9<br/>GSI1SK WS#acme"]
        G2["GSI1PK USER#u_9<br/>GSI1SK WS#globex"]
    end
    BASE -- "Query PK = WS#acme<br/>members of the workspace" --> OUT1["u_9, u_12"]
    GSI -- "Query GSI1PK = USER#u_9<br/>workspaces of the user" --> OUT2["acme, globex"]
    M1 -. "async copy with keys flipped" .-> G1
```

The invoice summary appears twice on purpose. That is **denormalization fan-out**: an update to a duplicated field must touch every copy, so keep the duplicated fields few and rarely changing.

**Multi-table design** (one table per entity) is easier to understand, back up and stream per entity, and fine when patterns rarely cross entity types. Single-table design pays off when one request needs several entity types, as AP1 does.

```mermaid
stateDiagram-v2
    [*] --> NotInIndex: invoice created, no GSI2PK
    NotInIndex --> InOverdueIndex: due date passes, app sets GSI2PK and GSI2SK
    InOverdueIndex --> NotInIndex: payment recorded, app removes GSI2PK
    NotInIndex --> [*]
```

The sparse index above is this lifecycle: membership in `GSI2` is controlled by the presence of one attribute.

### 3.6 Transactions in both stores

Both stores have them; neither makes them free.

| | MongoDB | DynamoDB |
| --- | --- | --- |
| Single unit always atomic | one document, including nested arrays | one item |
| Multi-unit transactions | multi-document ACID: replica sets since 4.0, sharded clusters since 4.2 | `TransactWriteItems` / `TransactGetItems`: up to 100 actions and 4 MB, within one Region |
| Limits and cost | default 60 s lifetime; docs advise at most 1,000 documents modified per transaction; write conflicts abort and must be retried | each item costs two underlying reads or writes (prepare and commit), so about twice the capacity |
| Modeling consequence | embed what changes together so most writes are single-document | keep most writes to one item; use transactions for the few cross-item invariants |

Transaction theory (atomicity, isolation) lives in [[Transactions and ACID]] and [[Isolation Levels and MVCC]].

## 4. Worked example

### Whiteboard version

Every access pattern is one `Query` on one partition key, with keys built from entity prefixes:

```go
ws, inv, client := "acme", "inv_812", "c_1"
fmt.Println("AP2 Query PK =", "WS#"+ws, "SK begins_with", "INV#2026-11")
fmt.Println("AP1 Query PK =", "INVOICE#"+inv) // META, ITEM#001.., PAY#...
fmt.Println("AP3 Query GSI1PK =", "CLIENT#"+client)
// Next page: send LastEvaluatedKey back as ExclusiveStartKey.
```

### 4.1 The same invoice in MongoDB

The invoice is one document: embedded `items` and `payments`, an extended reference `client: {_id, name}`, computed `total_minor` (250000) and `paid_minor` (150000), and `schema_version: 2`. The full JSON is in [[NoSQL Data Modeling - Go]].

- AP1 is one `findOne({_id: "inv_812"})`.
- AP2, AP3 and AP4 are served by compound indexes on `{workspace_id: 1, issue_date: -1}`, `{workspace_id: 1, "client._id": 1}` and `{workspace_id: 1, status: 1, due_date: 1}`. MongoDB, unlike DynamoDB, lets you add ad-hoc secondary indexes and filters, so it forgives a missing pattern more easily.
- AP6 is one atomic update on one document, with no transaction needed: a `$push` of the payment and a `$inc` of `paid_minor`, guarded by the filter `payments.provider_ref: {$ne: "pay_Q1z7"}`.

```mermaid
sequenceDiagram
    participant W as Razorpay webhook
    participant API as InvoiceOps API
    participant M as invoices, inv_812
    W->>API: payment pay_Q1z7, 100000
    API->>M: update where _id = inv_812 AND no payment pay_Q1z7, push payment, inc paid_minor
    M-->>API: matched 1, modified 1 (paid_minor 150000 to 250000)
    W->>API: same webhook retried
    API->>M: same update
    M-->>API: matched 0, modified 0 (filter fails, no double payment)
```

The `$ne` condition makes a retried webhook a no-op instead of a double payment. The `$ne` must name the same `provider_ref` that is being pushed (`pay_Q1z7`).

The status change (`paid` once `paid_minor >= total_minor`) can be made in the same single-document write by rewriting the update as an aggregation pipeline (`$set` with `$concatArrays` and `$cond`), because `$push` is not available inside a pipeline update.

What the SQL version had and this one must rebuild: the uniqueness of `(provider, provider_ref)` across all invoices (needs a separate unique index or collection), the client-rename fan-out (the copied `client.name`), and reports across clients (aggregation pipelines).

### 4.2 The same invoice in DynamoDB, with pagination

A page of results ends at the item limit (or 1 MB), and the last sort key comes back as the cursor, `LastEvaluatedKey`. The caller sends it back as `ExclusiveStartKey` until it is absent.

```mermaid
sequenceDiagram
    participant C as Caller
    participant T as Table, PK WS#acme
    C->>T: Query begins_with INV#, limit 3, no start key
    T-->>C: 3 items, LastEvaluatedKey = INV#2026-11#inv_2
    C->>T: Query begins_with INV#, limit 3, ExclusiveStartKey = INV#2026-11#inv_2
    T-->>C: 1 item, no LastEvaluatedKey
    Note over C: 4 invoices in 2 requests
```

The key builders, the in-memory `Query` (prefix, order, cursor), an overloaded GSI query and write sharding are implemented and tested in Go. Runnable Go version: [[NoSQL Data Modeling - Go]]

### 4.3 Capacity arithmetic

- AP1 reads about 3 KB per invoice (meta, 3 lines, 1 payment): one eventually consistent `Query` costs 0.5 RCU (3 KB rounds up to 4 KB, halved). At 300 QPS that is 150 RCU per second, far below any limit.
- AP6 writes a 0.5 KB payment and updates two 1 KB invoice copies in a transaction: 3 items × 1 WCU × 2 (transaction) = 6 WCU per payment, 180 WCU per second at 30 QPS.
- The danger is not the total but one key: if every invoice event of the day were written under `PK = EVENTS#2026-11-03`, that one partition would cap writes at 1,000 WCU per second. That is why a `ShardedPK` function spreads it over N keys.

```mermaid
flowchart LR
    subgraph HOT["One partition key: capped at 1,000 WCU"]
        W1["all writes"] --> H["PK EVENTS#2026-11-03<br/>throttled above 1,000 WCU/s"]
    end
    subgraph SHARD["Write sharding: 10 keys"]
        W2["all writes<br/>hash(event id) mod 10"] --> S0["EVENTS#2026-11-03#0"]
        W2 --> S1["EVENTS#2026-11-03#1"]
        W2 --> S9["... #9"]
    end
    SHARD -- "reader queries all 10 and merges" --> MERGE["up to 10,000 WCU/s"]
```

## 5. Variants and comparison

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Relational (Postgres) | normalized tables, joins, any query | patterns unknown or changing, strong invariants | scaling writes past one primary needs sharding ([[Partitioning and Sharding]]) |
| Postgres + `jsonb` | relational core, document columns for flexible attributes | a few flexible fields in a relational app | GIN indexes on `jsonb` are large ([[Index Types and Index Design]]) |
| MongoDB, embedded documents | aggregate in one document, secondary indexes, aggregation pipeline | data read as whole aggregates, varying shapes | duplication, 16 MB cap, cross-document invariants in code |
| DynamoDB multi-table | one table per entity | simple key lookups, few cross-entity reads | several round trips for joined views |
| DynamoDB single-table | many entity types, overloaded keys and GSIs | known patterns at high, predictable scale | hard to read and evolve; new patterns may need a new GSI and a backfill |
| Wide-column (Cassandra) | partition key + clustering columns, query-per-table | very high write rates, multi-region | no secondary access without another table ([[Wide-Column Stores and Cassandra]]) |

```mermaid
flowchart TD
    S["New data store decision"] --> Q1{"Patterns known and stable,<br/>need to scale past one Postgres primary?"}
    Q1 -- "no" --> PG["Postgres, optionally with jsonb"]
    Q1 -- "yes" --> Q2{"Data read as whole<br/>aggregates, varying shapes?"}
    Q2 -- "yes" --> MG["MongoDB, embedded documents"]
    Q2 -- "no" --> Q3{"Very high write rate<br/>and multi-region writes?"}
    Q3 -- "yes" --> CS["Cassandra, query per table"]
    Q3 -- "no" --> Q4{"Requests join several<br/>entity types?"}
    Q4 -- "yes" --> DS["DynamoDB single-table"]
    Q4 -- "no" --> DM["DynamoDB multi-table"]
```

## 6. Trade-offs and when not to use

- **New questions are expensive.** A pattern you did not plan for means a new index, a backfill or a `Scan`. If the product changes weekly, a relational model is cheaper.
- **Duplication means fan-out.** Copying a client's name into 40,000 invoices makes the rename a 40,000-item background job, and readers see a mix during it.
- **Invariants move into code.** Uniqueness beyond the primary key, foreign keys and cross-item checks are your job. In DynamoDB, uniqueness of a second attribute is done with an extra marker item (`PK = PROVIDER_REF#pay_N8x2`) written in the same transaction with a condition `attribute_not_exists(PK)`.
- **Analytics do not fit.** Aggregations across all items are scans; export to an analytics store instead.
- **When not to use:** the data is relational, the scale fits one Postgres primary (most applications), and the team values ad-hoc queries. [[SQL vs NoSQL]] has the full decision.

## 7. In production

**Real systems.**
- Amazon's own guidance and public talks (Rick Houlihan, re:Invent 2018) popularised single-table design with overloaded GSIs.
- MongoDB's published patterns (bucket, computed, subset, outlier, extended reference, schema versioning) come from its consulting practice and are documented in its "Building with Patterns" series.

**Failure modes and fixes.**
- *Hot partition:* one partition key takes most traffic (a viral workspace, today's date) and is throttled at 3,000 RCU or 1,000 WCU. Fix: write sharding (`KEY#0`…`KEY#9`) with a scatter-gather read, or cache hot reads ([[Hot Keys and Hot Partitions]]). DynamoDB's adaptive capacity and split-for-heat help with uneven load but cannot make one item exceed per-partition limits.
- *GSI throttling backs up the table:* in provisioned mode, a GSI without enough write capacity throttles writes to the base table. Fix: provision GSIs for the base write rate, or use on-demand mode.
- *Reading your own write from a GSI fails:* GSIs are eventually consistent. Fix: read the base item for the user who just wrote, or design the read to use the primary key.
- *Unbounded array hits 16 MB:* Fix: move the growing list into its own collection (parent reference) or bucket it.
- *`Limit` returns nothing:* in DynamoDB, `Limit` counts items *read* before the `FilterExpression` runs, so a page can come back empty with a `LastEvaluatedKey`. Fix: loop until no `LastEvaluatedKey`, and prefer key conditions over filters.
- *Old documents break new code:* Fix: `schema_version` and readers that handle every version ([[Zero-Downtime Schema Migrations]]).

```mermaid
sequenceDiagram
    participant App
    participant Base as Base table
    participant GSI as GSI1
    App->>Base: PutItem invoice inv_900, client c_1
    Base-->>App: ok
    App->>GSI: Query GSI1PK = CLIENT#c_1 (immediately)
    GSI-->>App: list without inv_900
    Note over Base,GSI: async propagation, usually well under a second
    App->>GSI: Query again a moment later
    GSI-->>App: list with inv_900
```

**What to monitor.**
- DynamoDB: `ThrottledRequests`, `ReadThrottleEvents`/`WriteThrottleEvents` per table and GSI, consumed versus provisioned capacity, CloudWatch Contributor Insights for the most-accessed keys.
- MongoDB: document size distribution, slow query log, `COLLSCAN` in query plans, transaction aborts and retries.

## 8. Deep dive

**Why a Query is cheap and a filter is not.** Inside a partition, DynamoDB stores items ordered by sort key, so a sort-key condition is a range read of contiguous items. A `FilterExpression` is applied after the items are read: you pay for every item read, including those dropped. Design keys so the filter becomes a key condition.

```mermaid
flowchart LR
    subgraph KC["Key condition: begins_with SK INV#2026-11"]
        K1["items read: 2<br/>items returned: 2<br/>cost: 2 items"]
    end
    subgraph FE["FilterExpression: status = overdue, Limit 20"]
        F1["items read: 20<br/>3 match the filter<br/>cost: 20 items, page has 3,<br/>LastEvaluatedKey present"]
    end
```

**Sort-key design tricks.**
- Zero-pad numbers (`ITEM#001`, not `ITEM#1`) because sort keys of type string compare byte by byte.
- Use ISO 8601 timestamps (`2026-11-02T10:00Z`) for time order.
- Put a version prefix (`v0#` for the current item, `v1#`, `v2#` for history) to keep the latest version first.
- Prefer ULIDs or KSUIDs over random UUIDs when ids should sort by creation time.

**GSI overloading as a projection.** A GSI is a materialized view maintained by DynamoDB: every write to the base table is propagated asynchronously. Projecting only the needed attributes (`KEYS_ONLY`, `INCLUDE`) shrinks the copy and its write cost. A GSI's own partition key can be hot even when the table's is not, for example `GSI1PK = STATUS#overdue` for all tenants.

**Item collections and LSIs.** With an LSI, one partition key's item collection is limited to 10 GB, because the index lives on the same partitions. Without an LSI, an item collection can grow beyond one partition: DynamoDB splits it by sort key range. Avoid LSIs unless you need strongly consistent alternative sort orders.

**Multi-document transactions in MongoDB under the hood.** A transaction runs on a snapshot (WiredTiger MVCC); a concurrent write to the same document causes a write conflict, and the driver retries with `TransientTransactionError`.

On sharded clusters, a transaction across shards uses a two-phase commit run by a coordinator on one of the participating shards (`mongos` only routes) ([[Two-Phase Commit]]), with higher latency. Embedding what changes together avoids all of it.

**Lazy migration with schema versioning.** v1 invoices stored `amount` as a float; v2 stores `total_minor` as an integer of paise.

Readers convert v1 on the fly (`round(amount * 100)`), writers always write v2, and a background job rewrites the remaining v1 documents with a conditional update (`{schema_version: 1}`) so it never overwrites a newer write.

Once the count of v1 documents is zero, delete the v1 code path.

```mermaid
stateDiagram-v2
    [*] --> Mixed: deploy code that reads v1 and v2, writes v2
    Mixed --> Mixed: a v1 document is written, it becomes v2
    Mixed --> Mixed: background job converts v1 with filter schema_version 1
    Mixed --> AllV2: count of v1 documents reaches zero
    AllV2 --> [*]: delete the v1 read path
```

## 9. Interview questions

> [!question]- How do you start designing a DynamoDB or MongoDB schema?
> List every access pattern with its expected rate and size, and whether it reads or writes. Then design keys (DynamoDB) or document boundaries (MongoDB) so each pattern is one key lookup or one range query. Patterns not on the list go to another store or wait for a new index.

> [!question]- When do you embed and when do you reference in MongoDB?
> Embed one-to-few data that is read with the parent and stays small, such as invoice lines. Reference one-to-many data that is large or shared, such as clients of a workspace. For one-to-squillions data (logs, events), let each child store the parent's id and never keep a growing array in the parent, because of the 16 MB limit and the cost of rewriting large documents.

> [!question]- What is single-table design, and when is it worth it?
> Several entity types live in one table with generic keys, so items read together share a partition key and come back from one `Query`. Overloaded GSIs serve other patterns. It is worth it when patterns are known and requests need several entity types at high scale; otherwise multi-table is easier to operate.

> [!question]- A DynamoDB table is throttled although total consumed capacity is 20% of provisioned. Why?
> Capacity is enforced per partition: one partition serves at most 3,000 RCU and 1,000 WCU. A hot partition key (one viral tenant, today's date) is throttled while other partitions idle. Fix the key: shard writes across N suffixes, cache hot reads, or choose a higher-cardinality partition key.

> [!question]- Can you read your own write through a GSI? (trap)
> Not reliably. GSIs are updated asynchronously and do not support `ConsistentRead`, so a read right after a write may not see it. Read the base table by primary key with `ConsistentRead`, or use an LSI if you need a consistent alternative order and can accept its 10 GB item collection limit.

> [!question]- Do MongoDB and DynamoDB support transactions?
> Yes. MongoDB has multi-document ACID transactions (replica sets since 4.0, sharded clusters since 4.2). DynamoDB has `TransactWriteItems` and `TransactGetItems` with up to 100 actions and 4 MB, costing about twice the capacity. Good models still make most writes single-document or single-item.

> [!question]- Why did my DynamoDB `Query` with `Limit = 20` return 3 items and a `LastEvaluatedKey`?
> `Limit` caps the number of items read before the `FilterExpression` is applied, so 17 were read and filtered out. The page is not the end; keep paging until `LastEvaluatedKey` is absent, and move the filter into the key condition if possible.

## 10. Cheat sheet

- Access patterns first, with QPS; every pattern is a key lookup or range query.
- MongoDB: embed one-to-few, reference one-to-many, parent-reference one-to-squillions; 16 MB documents; no unbounded arrays.
- Patterns: bucket, computed, extended reference, subset, outlier, schema versioning with lazy migration.
- DynamoDB: PK picks the partition, SK orders the item collection; composite SKs like `INV#2026-11#<id>` serve several prefixes.
- Limits: 3,000 RCU / 1,000 WCU per partition, 400 KB item, 1 MB page, LSI 10 GB per item collection, GSIs eventually consistent.
- Single-table + overloaded GSIs + sparse indexes + adjacency lists; denormalized copies need fan-out on update.
- Transactions exist in both (Mongo 4.0+/4.2+, DynamoDB 100 actions) but cost more; model so most writes touch one unit.
- Paginate with `LastEvaluatedKey` → `ExclusiveStartKey`; `Limit` applies before filters.

## Links

- **Runnable code:** [[NoSQL Data Modeling - Go]]
- **Before this:** [[SQL vs NoSQL]], [[Relational Schema Design]], [[Partitioning and Sharding]]
- **Next:** [[Wide-Column Stores and Cassandra]], [[Hot Keys and Hot Partitions]], [[Search Engines and Inverted Indexes]]
- **Compare with:** [[Materialized Views and Denormalization]], [[Consistent Hashing]], [[Transactions and ACID]]

### Watch on YouTube

- [Designing a DynamoDB Table in 4 Steps: From Entities to Access Patterns](https://www.youtube.com/watch?v=JLZOI8patlw) · FooBar Serverless · walks through access-pattern-first modeling exactly as the note describes
- [DynamoDB Single Table Design: Simplify Your Code and Boost Performance with Table Design Strategies](https://www.youtube.com/watch?v=lWCch8GEK4E) · FooBar Serverless · single-table design with GSI1PK/SK overloading, matches note's core idea
