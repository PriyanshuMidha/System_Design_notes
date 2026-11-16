---
tags: [databases, sql, postgres]
level: basic
status: reviewed
prereqs: []
related: ["[[Relational Schema Design]]", "[[Transactions and ACID]]", "[[Indexing Fundamentals]]", "[[Query Plans and EXPLAIN]]", "[[Database Access (database-sql, pgx, sqlc)]]"]
sources:
  - "PostgreSQL 17 docs, SELECT (processing order; output-column names in WHERE, HAVING, GROUP BY, ORDER BY; NULLS FIRST/LAST defaults)"
  - "PostgreSQL 17 docs, INSERT (ON CONFLICT, EXCLUDED, RETURNING) and Transaction Isolation (ON CONFLICT in Read Committed)"
  - "PostgreSQL 17 docs, MERGE; PostgreSQL 17 release notes (MERGE ... RETURNING, merge_action())"
  - "PostgreSQL 17 docs, Window Functions (tutorial 3.5, syntax 4.2.8) and WITH Queries (CTE inlining, recursion)"
  - "PostgreSQL 17 docs, Constraints (CHECK passes on NULL; NULLS NOT DISTINCT) and Appendix A, Error Codes"
  - "PostgreSQL 17 docs, Sequence Manipulation Functions (nextval consumed by ON CONFLICT)"
  - "PostgreSQL 17 docs, Query Planning configuration (join_collapse_limit, geqo_threshold)"
  - "PostgreSQL wiki, Don't Do This (NOT IN)"
  - "MySQL 8.0 docs, Type Conversion in Expression Evaluation (string column compared with a number)"
  - "Codd, A Relational Model of Data for Large Shared Data Banks (CACM, 1970)"
updated: 2026-11-13
---

# SQL Essentials

> [!summary] TL;DR
> SQL is how you ask a relational database for data. You describe **what** you want (which tables, how they connect, which rows, how to group and sort them) and the database decides **how** to fetch it.
>
> Most SQL bugs come from three places: `NULL`, which makes a condition "unknown" instead of true or false; joins that multiply rows; and forgetting the order in which a query's clauses apply.

> [!abstract] Core idea
> - You describe the result, not the steps; the planner picks how to fetch it.
> - Clauses run in a fixed logical order: FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. That is why WHERE cannot see a SELECT alias.
> - `NULL` means unknown: `x = NULL` is never true, so use `IS NULL` and beware `NOT IN` over a column that can be NULL.
> - Joins multiply rows: joining a one-to-many table before summing double-counts money.
> - Values always go in as parameters (`$1`), never by string concatenation.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2, the first four parts of section 3 (schema, clause order, joins, grouping) and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add the rest of section 3 (windows, CTEs, NULL, constraints, upserts), section 4 (worked example), 5 and 6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

**From zero, in 60 seconds** 🟢

A database keeps your data in **tables**: grids of rows and columns, like a spreadsheet.
SQL is the language you use to ask those tables questions.
You say *what* you want, for example "clients who owe more than 1,000 rupees".
You do not say *how* to find it; the database works that out.

```mermaid
flowchart LR
    Q["your question in SQL"] --> D["database works out how"]
    D --> R["small answer table"]
```

Most questions need two tables at once, like invoices and clients.
Gluing them together on a shared column is called a **join**.
Then you can group rows (one group per client) and add up each group.

```mermaid
flowchart LR
    I["invoices"] --> J["join on client_id"]
    C["clients"] --> J
    J --> G["group by client,<br/>add up amounts"]
```

Two things trip up almost everyone: empty values (`NULL`), and joins that quietly copy rows so totals come out too big.

The rest of this note is just these 4 questions:
1. In what order does the database apply the parts of a query?
2. How do joins and grouping turn many rows into an answer?
3. Why does `NULL` behave so strangely?
4. How do you send user values to SQL safely?

**The problem in one story.**
Your company keeps clients, invoices and payments in a database.
Your manager asks: "Which clients owe us more than 1,000 rupees right now?"
You could load everything into your program and loop, but SQL lets you ask the database that exact question in a few lines.
This note teaches how to ask it correctly.

**Words you need first**

| Word | Plain meaning | Tiny example |
|---|---|---|
| Table | A named grid of rows and columns | `invoices` |
| Row | One record | Invoice 42 |
| Query | A SQL statement that reads or changes data | `SELECT id FROM invoices` |
| Join | Combining rows from two tables that match on a column | invoices joined to clients on `client_id` |
| Aggregate | A function that turns many rows into one value | `SUM(amount)`, `COUNT(*)` |
| `NULL` | "Unknown or missing value", not zero and not empty | `paid_at IS NULL` |
| Parameter | A placeholder filled in safely by the driver | `WHERE id = $1` |
| Transaction | A group of statements that succeed or fail together | `BEGIN; ... COMMIT;` |

**Picture it**

```mermaid
flowchart LR
  A[FROM / JOIN] --> B[WHERE]
  B --> C[GROUP BY]
  C --> D[HAVING]
  D --> E[SELECT]
  E --> F[ORDER BY]
  F --> G[LIMIT]
```

**Analogy.**
SQL is like ordering at a restaurant: you say what dish you want, and the kitchen decides how to cook it.
Where it breaks: the kitchen never changes your order, but SQL rules like `NULL` logic can silently change which rows you get.

**How the rest of this note builds up**

- First, why SQL exists and the mental model of "describe the result".
- Then the core: the running schema, clause order, joins, grouping, window functions, CTEs, `NULL`, constraints and upserts.
- Then a worked collections query traced row by row, and building SQL safely from Go.
- Finally, variants, trade-offs, production practice and the SDE-3 deep dive.

> [!tip] Remember
> Describe the result you want, pass values as parameters, and watch out for `NULL` and joins that multiply rows.

## 1. Why it exists 🟢

InvoiceOps' collections page asks: *which clients owe money on overdue invoices, and how late are they?*

Without SQL, the Go service would load every invoice, loop over them and add up balances per client. That is fine for 1,000 invoices.

For a report over a 10-million-row `invoices` table it means pulling about 1.5 GB over the network (an estimate at ~150 bytes per row) to compute three numbers, and rewriting the loop every time the question changes.

SQL sends the question to the data instead. The server filters, joins and adds up next to the storage, then returns three rows. Because the query states only the result, the same text keeps working when you add an index or the table grows tenfold: the planner simply picks a new way to run it.

**Loop in Go vs ask in SQL, as a picture.**

```mermaid
flowchart LR
    subgraph Without SQL
    A["pull 10M rows<br/>(about 1.5 GB)"] --> B["loop in Go"] --> C["3 numbers"]
    end
    subgraph With SQL
    D["send the question"] --> E["database adds up<br/>next to the data"] --> F["3 rows back"]
    end
```

## 2. Mental model 🟢

- A **table** (a *relation* in Codd's 1970 model) holds **rows** that share the same **columns**. Each row is one fact: "invoice INV-102 belongs to client 10 and is overdue".
- A **query** is a pipeline of steps that each take a table and return a table: build rows (`FROM`, `JOIN`), drop rows (`WHERE`), fold rows into groups (`GROUP BY`), drop groups (`HAVING`), compute output columns (`SELECT`), sort (`ORDER BY`), cut (`LIMIT`).
- SQL bends the mathematical model in two ways you must remember: a table can hold **duplicate rows**, and **`NULL`** means "unknown", which adds a third truth value.

**Analogy:** a query is a recipe for a spreadsheet. "Match these two sheets on client id, delete rows that are not overdue, pivot by client, keep pivots above ₹0, sort by amount." You hand over the recipe; the kitchen chooses the knives.

## 3. How it works 🟡

### The running schema

**In plain words:** four small tables used in every example: clients, their invoices, the lines on each invoice, and payments.

A trimmed InvoiceOps schema with four tables. The full DDL is in [[SQL Essentials - Go]]; the production version with tenant-safe keys is in [[Relational Schema Design]]. Columns ending in `_minor` hold money as integer **minor units** (paise): ₹1,500.00 is `150000`.

| Table | Key columns | Rules it carries |
| --- | --- | --- |
| `clients` | `id`, `workspace_id`, `parent_id`, `name`, `email` | `parent_id` points at another client (a subsidiary) or is NULL; `email` may be NULL; `UNIQUE (workspace_id, email)` |
| `invoices` | `id`, `client_id`, `number`, `status`, `total_minor`, `paid_minor`, `issue_date`, `due_date` | `status` is one of six values; `total_minor >= 0`; `UNIQUE (workspace_id, number)` |
| `invoice_items` | `invoice_id`, `description`, `quantity`, `unit_price_minor` | `quantity > 0`; deleted together with the invoice (`ON DELETE CASCADE`) |
| `payments` | `invoice_id`, `amount_minor`, `provider_ref`, `paid_at` | `amount_minor > 0`; `provider_ref` is unique, so a webhook retry cannot double-pay |

```mermaid
erDiagram
    workspaces ||--o{ clients : owns
    workspaces ||--o{ invoices : owns
    clients |o--o{ clients : "parent of"
    clients ||--o{ invoices : "billed on"
    invoices ||--o{ invoice_items : contains
    invoices ||--o{ payments : "settled by"
    invoices {
        bigint id PK
        bigint client_id FK
        text number
        text status
        bigint total_minor
        bigint paid_minor
        date due_date
    }
```

**Sample data** for workspace 1. "Today" is 2026-11-02. Clients: 10 Acme Corp, 11 Acme Labs (a subsidiary: `parent_id = 10`, `email` NULL), 12 Bolt Foods, 13 Cobalt Ltd (no invoices yet).

| invoice | client | status  | total_minor | paid_minor | issue_date | due_date   |
| ------- | ------ | ------- | ----------- | ---------- | ---------- | ---------- |
| INV-101 | 10     | paid    | 120000      | 120000     | 2026-08-16 | 2026-09-15 |
| INV-102 | 10     | overdue | 250000      | 100000     | 2026-09-01 | 2026-10-01 |
| INV-103 | 11     | overdue | 80000       | 0          | 2026-09-20 | 2026-10-20 |
| INV-104 | 12     | sent    | 60000       | 0          | 2026-10-21 | 2026-11-20 |
| INV-105 | 12     | overdue | 45000       | 0          | 2026-08-31 | 2026-09-30 |
| INV-106 | 12     | draft   | 30000       | 0          | NULL       | NULL       |

INV-102 has two line items (₹1,500 logo and ₹1,000 brand guide) and one payment of 100000.

### Logical processing order

**In plain words:** you write SELECT first, but the database reads FROM first. Knowing the real order explains most "why can't I use that name here?" errors.

You write `SELECT … FROM … WHERE …`, but PostgreSQL defines the result as if the clauses ran in this order:

```mermaid
flowchart LR
    W["WITH: CTEs"] --> F["FROM + JOIN: build rows"] --> WH["WHERE: keep rows that are TRUE"] --> G["GROUP BY: fold rows into groups"] --> H["HAVING: keep groups that are TRUE"]
    H --> S["SELECT list: expressions, then window functions"] --> D["DISTINCT"] --> U["UNION / INTERSECT / EXCEPT"] --> O["ORDER BY"] --> L["LIMIT / OFFSET"]
```

What follows from it (PostgreSQL 17):
- `WHERE` cannot use aggregates (no groups exist yet). Filter groups with `HAVING`.
- An output alias works in `ORDER BY` and `GROUP BY`, but not in `WHERE` or `HAVING`. There you repeat the expression.
- Window functions run after `HAVING`, so `WHERE rank <= 3` fails. Wrap the query in a subquery or CTE and filter outside.
- Without `ORDER BY`, rows come back in whatever order was fastest. Never rely on it.
- The order is **logical**. The planner may push filters below joins, reorder inner joins, or read an index in sorted order so no sort runs, as long as the result is the same. See [[Query Plans and EXPLAIN]].

### Joins

**In plain words:** a join lines up rows from two tables that share a value, like matching each invoice to its client by client id.

| Join (clients `c`, invoices `i`)                       | Keeps                                             | Rows on the sample      |
| ------------------------------------------------------ | ------------------------------------------------- | ----------------------- |
| `c JOIN i ON i.client_id = c.id`                       | matched pairs only                                | 6 (Cobalt disappears)   |
| `c LEFT JOIN i ON …`                                   | every client; NULLs where nothing matched         | 7 (Cobalt with NULLs)   |
| `FULL JOIN`                                            | everything from both sides                        | used for reconciliation |
| `CROSS JOIN`                                           | every pair, e.g. clients × months for a report    | 4 × N                   |
| self join `clients c JOIN clients p ON c.parent_id = p.id` | a row with its parent                         | 1 (Acme Labs → Acme Corp) |
| semi-join `WHERE EXISTS (… overdue …)`                 | each client once if any match                     | 3                       |
| anti-join `WHERE NOT EXISTS (…)`                       | clients with no match                             | 1 (Cobalt)              |
| `c LEFT JOIN LATERAL (… WHERE client_id = c.id … LIMIT 1) ON true` | a per-row subquery: each client's latest invoice | 4                 |

`RIGHT JOIN` is a mirrored `LEFT JOIN`; write it as a `LEFT JOIN` for readability. A `FULL JOIN` earns its keep in reconciliation: join your `payments` to the provider's settlement file on `provider_ref`, and rows with NULL on either side are the mismatches.

The most common join bug: a condition on the right-hand table in `WHERE` turns a `LEFT JOIN` back into an inner join, because `NULL = 'overdue'` is not TRUE.

```mermaid
flowchart TB
    subgraph wrong["Condition in WHERE"]
        direction LR
        W1["LEFT JOIN: Cobalt gets<br/>one row, i.status = NULL"] --> W2["WHERE i.status = 'overdue'<br/>NULL = 'overdue' is UNKNOWN"] --> W3["Cobalt row dropped:<br/>the result equals an INNER JOIN"]
    end
    subgraph right["Condition in ON"]
        direction LR
        R1["ON ... AND i.status = 'overdue'<br/>decides which invoices match"] --> R2["Cobalt has no match:<br/>NULL-extended row kept"] --> R3["every client survives"]
    end
```

The condition in `WHERE` is applied after the join, to the NULL-extended rows. The condition in `ON` only decides what counts as a match.

```sql
-- Wrong: clients without an overdue invoice vanish again
SELECT c.name, i.number
FROM clients c
LEFT JOIN invoices i ON i.client_id = c.id
WHERE i.status = 'overdue';
```

```sql
-- Right: the condition decides what matches, not which clients survive
SELECT c.name, i.number
FROM clients c
LEFT JOIN invoices i ON i.client_id = c.id AND i.status = 'overdue';
```

### Grouping and aggregates

**In plain words:** sort rows into piles (one per client), then count or add up each pile. Each pile becomes one output row.

A `LEFT JOIN` from clients to invoices, grouped by client, shows the difference between the two counts. The full query (with `FILTER` columns) and its output table are in [[SQL Essentials - Go]]. The key lines:

```sql
SELECT c.name, count(*) AS joined_rows, count(i.id) AS invoices
FROM clients c LEFT JOIN invoices i ON i.client_id = c.id
GROUP BY c.id, c.name;
```

```mermaid
flowchart LR
    J["joined rows: 7<br/>Acme Corp x2, Acme Labs x1,<br/>Bolt Foods x3, Cobalt x1 (NULLs)"] --> G["GROUP BY c.id: 4 groups"]
    G --> A1["Acme Corp: count(*) 2, count(i.id) 2"]
    G --> A2["Acme Labs: 1, 1"]
    G --> A3["Bolt Foods: 3, 3"]
    G --> A4["Cobalt: count(*) 1, count(i.id) 0,<br/>sum = NULL"]
```

With the `FILTER` columns, the representative open balances are 150000 (Acme Corp), 80000 (Acme Labs), 105000 (Bolt Foods) and NULL (Cobalt).

- Every selected column is either grouped or aggregated. Postgres also accepts columns of a table whose primary key is grouped, so `GROUP BY c.id` alone would allow `c.name`.
- `count(*)` counts rows, `count(col)` counts non-NULL values. Cobalt's NULL-extended row makes `count(*)` 1 and `count(i.id)` 0.
- `sum`, `avg` and `max` over zero rows return NULL, not 0. Use `coalesce(sum(…), 0)` when the API needs a number.
- `FILTER (WHERE …)` aggregates a subset of each group without a second query.

### Window functions

**In plain words:** like grouping, but you keep every row and add a column such as "running total" or "rank within this client".

A window function computes over a set of rows related to the current row, like `GROUP BY` that keeps every row.

```mermaid
flowchart LR
    subgraph p10["PARTITION client 10, ORDER BY issue_date"]
        direction TB
        a1["INV-101  120000<br/>nth 1, billed 120000"] --> a2["INV-102  250000<br/>nth 2, billed 370000, 16 days after"]
    end
    subgraph p12["PARTITION client 12"]
        direction TB
        b1["INV-105  45000<br/>nth 1, billed 45000"] --> b2["INV-104  60000<br/>nth 2, billed 105000, 51 days after"]
    end
```

Each partition is numbered and summed on its own, and no row disappears. The query and its output:

```sql
SELECT client_id, number, issue_date, total_minor,
       row_number() OVER w                                AS nth_invoice,
       sum(total_minor) OVER (w ROWS UNBOUNDED PRECEDING) AS billed_to_date,
       issue_date - lag(issue_date) OVER w                AS days_since_previous
FROM invoices
WHERE workspace_id = 1 AND issue_date IS NOT NULL
WINDOW w AS (PARTITION BY client_id ORDER BY issue_date)
ORDER BY client_id, issue_date;
```

Representative output (PostgreSQL 17):

```text
 client_id | number  | issue_date | total_minor | nth_invoice | billed_to_date | days_since_previous
-----------+---------+------------+-------------+-------------+----------------+---------------------
        10 | INV-101 | 2026-08-16 |      120000 |           1 |         120000 |
        10 | INV-102 | 2026-09-01 |      250000 |           2 |         370000 |                  16
        11 | INV-103 | 2026-09-20 |       80000 |           1 |          80000 |
        12 | INV-105 | 2026-08-31 |       45000 |           1 |          45000 |
        12 | INV-104 | 2026-10-21 |       60000 |           2 |         105000 |                  51
(5 rows)
```

- `PARTITION BY` splits rows into independent windows; `ORDER BY` inside `OVER` orders each one.
- `row_number()` gives 1, 2, 3; `rank()` gives 1, 1, 3 on a tie; `dense_rank()` gives 1, 1, 2.
- With `ORDER BY` and no frame, the default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which includes the current row's **peers** (rows with equal sort values). Two invoices issued on the same day would then share one running total. `ROWS` makes it per row.
- To keep only the latest invoice per client, filter outside, and mind NULLs: in Postgres `DESC` sorts NULLs **first**, so the undated draft INV-106 would win.

```sql
SELECT *
FROM (
  SELECT i.*, row_number() OVER (PARTITION BY client_id
                                 ORDER BY issue_date DESC NULLS LAST, id DESC) AS rn
  FROM invoices i
  WHERE workspace_id = 1
) ranked
WHERE rn = 1;
```

### Subqueries and CTEs

**In plain words:** a query inside a query. A CTE (`WITH name AS (...)`) just gives that inner query a name so the big query reads top to bottom.

- **Scalar subquery:** returns one value, e.g. `(SELECT max(paid_at) FROM payments p WHERE p.invoice_id = i.id)`. It is *correlated*: it refers to the outer row.
- **`IN` / `EXISTS`:** a semi-join. `EXISTS` stops at the first match.
- **Derived table:** a subquery in `FROM`, as in the latest-invoice query above.
- **`LATERAL`:** a subquery in `FROM` that may refer to earlier tables, the clean way to get "top N per row".
- **CTE (`WITH name AS (…)`):** names a step so the query reads top to bottom. Since PostgreSQL 12, a side-effect-free CTE that is referenced once is inlined and optimized like a subquery. `AS MATERIALIZED` forces it to be computed once, separately.

A **recursive CTE** walks a hierarchy. Acme's group balance, including subsidiaries, uses an anchor query (`id = 10`) and a step that joins `clients.parent_id` to the rows found so far. The full SQL is in [[SQL Essentials - Go]].

```mermaid
flowchart LR
    A["anchor: {10}<br/>Acme Corp"] --> S1["step 1: parent_id = 10<br/>adds {11} Acme Labs"] --> S2["step 2: parent_id = 11<br/>finds nothing: stop"]
    S2 --> U["family = {10, 11}"] --> T["sum open balance<br/>150000 + 80000 = 230000"]
```

The anchor yields `{10}`, the first step adds `{11}`, the second step finds nothing and recursion stops. Representative output (PostgreSQL 17): `group_open_minor = 230000` (150000 from INV-102 plus 80000 from INV-103). If the data could contain a cycle, add PostgreSQL 14's `CYCLE id SET is_cycle USING path` clause.

### NULL and three-valued logic

**In plain words:** NULL means "we don't know". Asking "is unknown equal to 5?" gives "don't know", not yes or no, and "don't know" rows get dropped.

A comparison with NULL is neither true nor false but **UNKNOWN**.

| a       | b       | a AND b | a OR b  | NOT a   |
| ------- | ------- | ------- | ------- | ------- |
| TRUE    | UNKNOWN | UNKNOWN | TRUE    | FALSE   |
| FALSE   | UNKNOWN | FALSE   | UNKNOWN | TRUE    |
| UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

- `WHERE` keeps only TRUE rows. `CHECK` rejects only FALSE rows, so `CHECK (due_date >= issue_date)` lets a row with a NULL `due_date` through.
- `email = NULL` is never true. Write `email IS NULL`, or `a IS DISTINCT FROM b` for a NULL-safe "not equal".
- `UNIQUE (workspace_id, email)` allows many NULL emails: NULLs are distinct by default. PostgreSQL 15 added `UNIQUE NULLS NOT DISTINCT` for the other behaviour.
- `ORDER BY` puts NULLs last for `ASC` and first for `DESC` unless you write `NULLS FIRST` or `NULLS LAST`.

**The `NOT IN` trap.** "Clients that are nobody's parent":

```sql
SELECT name FROM clients
WHERE id NOT IN (SELECT parent_id FROM clients);
```

```mermaid
flowchart TD
    Q["id NOT IN (SELECT parent_id ...)<br/>subquery returns {NULL, 10, NULL, NULL}"] --> E["for Acme Labs (11):<br/>11 <> NULL AND 11 <> 10 AND ..."]
    E --> U["11 <> NULL is UNKNOWN<br/>TRUE AND UNKNOWN = UNKNOWN"]
    U --> D["WHERE keeps only TRUE:<br/>row dropped"]
    D --> R["same for Bolt Foods and Cobalt;<br/>Acme Corp fails because 10 is in the list:<br/>0 rows"]
```

Representative output (PostgreSQL 17): **0 rows**. The subquery returns `{NULL, 10, NULL, NULL}`. For Acme Labs (11) the test expands to `11 <> NULL AND 11 <> 10 AND …`, which is UNKNOWN, so the row is dropped.

Bolt Foods and Cobalt Ltd are dropped the same way, and Acme Corp because 10 is in the list. `NOT EXISTS` asks the intended question and returns Acme Labs, Bolt Foods and Cobalt Ltd:

```sql
SELECT c.name FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM clients ch WHERE ch.parent_id = c.id);
```

### Constraints

**In plain words:** rules the database enforces for you, like "this can't be empty" or "no two rows with the same email". Break one and the write is refused.

| Constraint             | Rejects                                                       | SQLSTATE on violation         |
| ---------------------- | ------------------------------------------------------------- | ----------------------------- |
| `NOT NULL`             | a missing value                                               | 23502 not_null_violation      |
| `CHECK (expr)`         | a row where `expr` is FALSE (NULL passes)                     | 23514 check_violation         |
| `UNIQUE`, `PRIMARY KEY`| a duplicate key (a primary key is also NOT NULL)              | 23505 unique_violation        |
| `FOREIGN KEY`          | a reference to a missing row, or deleting a referenced row    | 23503 foreign_key_violation   |
| `EXCLUDE`              | overlapping values, such as a double-booked time range        | 23P01 exclusion_violation     |

Your Go code should map these codes to API errors (23505 → 409 Conflict). Which invariants to encode is a design question for [[Relational Schema Design]]; why they matter for correctness is in [[Transactions and ACID]].

### Writing: RETURNING, upserts and MERGE

**In plain words:** handy write tricks: get the new id back straight away, and "insert, or update if it already exists" in one safe step.

```sql
-- RETURNING hands back generated values in the same round trip
INSERT INTO invoices (workspace_id, client_id, number, status, total_minor)
VALUES (1, 12, 'INV-107', 'draft', 0)
RETURNING id, status;
```

```sql
-- Upsert: a client CSV import; the same email in a workspace updates the name
INSERT INTO clients (workspace_id, name, email)
VALUES (1, 'Bolt Foods Pvt Ltd', 'ap@bolt.test')
ON CONFLICT (workspace_id, email) DO UPDATE
SET name = EXCLUDED.name
RETURNING id, name;
```

In Go, read `RETURNING` with `QueryRowContext(…).Scan(&id)`. Postgres drivers do not support `Result.LastInsertId()`.

```mermaid
flowchart TD
    I["INSERT … ON CONFLICT (workspace_id, email)"] --> P{"probe the arbiter unique index"}
    P -->|"no conflicting row"| N["insert the new row"] --> R1["RETURNING: the new row"]
    P -->|"another transaction is inserting the same key"| Wt["wait for it to commit or abort"] --> P
    P -->|"committed row with the same key"| C{"conflict action"}
    C -->|"DO NOTHING"| S["skip: no row written, no row returned"]
    C -->|"DO UPDATE"| X["lock the existing row, apply SET with EXCLUDED.*"] --> R3["RETURNING: the updated row"]
```

- The conflict target must match a unique index or constraint exactly, here `UNIQUE (workspace_id, email)`. `EXCLUDED` is the row you tried to insert.
- `DO NOTHING … RETURNING` returns **no row** on a conflict, which breaks naive "get or create" code. Follow it with a `SELECT`.
- One statement may not touch the same row twice. A CSV with the same email on two lines fails with "ON CONFLICT DO UPDATE command cannot affect row a second time"; deduplicate the input first.
- `MERGE` (PostgreSQL 15+) syncs a target from a source with `WHEN MATCHED` / `WHEN NOT MATCHED` branches, and PostgreSQL 17 lets it `RETURNING merge_action()`. When other sessions may insert the same keys concurrently, the docs point to `INSERT … ON CONFLICT`, which can switch to an `UPDATE` if a concurrent `INSERT` wins.

```sql
MERGE INTO clients c
USING staged_clients s ON c.workspace_id = s.workspace_id AND c.email = s.email
WHEN MATCHED THEN UPDATE SET name = s.name
WHEN NOT MATCHED THEN INSERT (workspace_id, name, email) VALUES (s.workspace_id, s.name, s.email)
RETURNING merge_action(), c.id;
```

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** the smallest query that answers "who owes us money": join, filter, group, total.

The whole collections question fits in one statement: join, filter, group, filter groups, sort.

```sql
SELECT c.name, SUM(i.total_minor - i.paid_minor) AS owed_minor
FROM   invoices i
JOIN   clients  c ON c.id = i.client_id
WHERE  i.status = 'overdue'
GROUP  BY c.name
HAVING SUM(i.total_minor - i.paid_minor) > 0
ORDER  BY owed_minor DESC;
```

The full version below adds tenant filters, lateness buckets, the traced execution order and a safe query builder.

### The collections query, traced

**In plain words:** one bigger real query, followed row by row so you can see each clause change the table.

The full SQL (about 19 lines: a CTE of open invoices, a join, a group, a `HAVING`, two window functions) is in [[SQL Essentials - Go]]. Here is what each clause does to the six sample invoices.

```mermaid
flowchart LR
    S0["invoices: 6 rows"] -->|"CTE: workspace 1 and status open"| S1["4 rows<br/>INV-102, 103, 104, 105<br/>days late 32, 13, -18, 33"]
    S1 -->|"JOIN clients"| S2["4 rows"]
    S2 -->|"GROUP BY c.id"| S3["3 groups<br/>Acme Corp {102}, Acme Labs {103},<br/>Bolt Foods {104, 105}"]
    S3 -->|"HAVING sum > 0"| S4["3 groups"]
    S4 -->|"SELECT + windows"| S5["total open 335000<br/>sum(sum(...)) OVER () on every row"]
    S5 -->|"ORDER BY rank"| S6["3 rows"]
```

| Step | Clause                                   | Rows                                                                 |
| ---- | ---------------------------------------- | -------------------------------------------------------------------- |
| 1    | CTE: `FROM invoices WHERE …`             | 6 → 4 (INV-102, 103, 104, 105; days late 32, 13, −18, 33)            |
| 2    | `JOIN clients`                           | 4                                                                    |
| 3    | `GROUP BY c.id`                          | 3 groups: Acme Corp {102}, Acme Labs {103}, Bolt Foods {104, 105}    |
| 4    | `HAVING sum > 0`                         | 3                                                                    |
| 5    | `SELECT`, then windows over the 3 groups | total open 335000; `sum(sum(…)) OVER ()` sees it on every row        |
| 6    | `ORDER BY rank`                          | 3                                                                    |

Representative output (PostgreSQL 17):

| name       | open_minor | worst_days_late | pct_of_open | rank |
| ---------- | ---------- | --------------- | ----------- | ---- |
| Acme Corp  | 150000     | 32              | 44.8        | 1    |
| Bolt Foods | 105000     | 33              | 31.3        | 2    |
| Acme Labs  | 80000      | 13              | 23.9        | 3    |

Two details are worth checking against the trace. INV-104 is not late yet (−18 days), so the `FILTER` keeps Bolt Foods' worst lateness at 33 instead of letting a negative number in. And `sum(sum(…)) OVER ()` works because windows run after grouping: the inner `sum` is the per-client aggregate, and the outer one adds the three group rows.

### Building SQL safely from Go

**In plain words:** never glue user text into SQL. Put `$1` in the SQL and pass the value separately, so it can only ever be a value.

Values must travel as **parameters** (`$1`, `$2`). Drivers such as pgx send the SQL text and the values in separate protocol messages by default, so a value can never become SQL. Column names and `ASC`/`DESC` cannot be parameters, so the builder maps user input to fixed fragments from a whitelist and ends every sort with the unique `id`.

```mermaid
sequenceDiagram
    participant U as Client
    participant H as Go handler
    participant B as Build
    participant DB as Postgres
    U->>H: GET /invoices?status=overdue' OR '1'='1&sort=-due_date&limit=20
    H->>B: Filter{status: the evil string, sort: -due_date, limit: 20}
    B->>B: look up -due_date in the whitelist, check limit 1..100
    B-->>H: SQL with $1 $2 $3 + args [42, the evil string, 20]
    H->>DB: Parse: the SQL text only
    H->>DB: Bind: the three values, as data
    Note over DB: the quote characters are part of a string value,<br/>never part of the statement
    DB-->>H: zero rows (no status equals that string)
```

The SQL it produces:

```sql
SELECT id, number, status, total_minor, due_date FROM invoices
WHERE workspace_id = $1 AND status = $2 ORDER BY due_date DESC, id DESC LIMIT $3
```

A sort key outside the whitelist (`"due_date; DROP TABLE invoices"`) is rejected before any SQL exists. Runnable Go version: [[SQL Essentials - Go]]

## 5. Variants and comparison 🟡

The same question can often be written several ways. They differ in NULL behaviour and in the plans they allow.

| Task                       | Option                                     | How it works                                        | Use when                                   | Cost or risk                                                      |
| -------------------------- | ------------------------------------------ | --------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| Rows with no match         | `NOT EXISTS`                               | anti-join; stops at the first match                 | the default                                | none                                                              |
|                            | `LEFT JOIN … WHERE b.id IS NULL`           | outer join, keep NULL-extended rows                 | you also need columns from a third table   | easy to break by adding a `WHERE` on `b`                          |
|                            | `NOT IN (subquery)`                        | `x <> every value`                                  | the subquery column is `NOT NULL`          | one NULL empties the result; cannot become an anti-join           |
| Latest row per group       | `row_number()` in a subquery               | rank inside each partition, filter `rn = 1`         | portable SQL; also top-N                   | ranks every row before filtering                                  |
|                            | `DISTINCT ON (client_id) … ORDER BY`       | keeps the first row per key                         | Postgres only, short to write              | not portable; sorts every row unless an index supplies the order  |
|                            | `LATERAL (… ORDER BY … LIMIT n)`           | a per-row subquery                                  | many rows per group, index on (key, sort column) | one index probe per outer row                              |
| Insert or update           | `INSERT … ON CONFLICT`                     | speculative insert on a unique index                | concurrent writers                         | needs a matching unique index                                     |
|                            | `MERGE`                                    | joins source to target, runs branches               | batch sync, deletes too                    | concurrent inserts can still raise unique violations              |
|                            | `SELECT` then `INSERT`                     | two statements                                      | never for uniqueness                       | two requests both see "absent" and both insert                    |
| Totals next to detail      | window function                            | aggregate over a window, rows kept                  | running totals, shares, ranks              | sorts per partition                                               |
|                            | join to a grouped subquery                 | aggregate once, join back                           | other engines lack the window you need     | an extra join                                                     |

## 6. Trade-offs and when not to use 🟡

- **Push work to the database when it shrinks data.** Filtering and aggregating 10 million rows into 3 belongs in SQL. Business rules with many branches belong in Go, where they can be unit tested; a 200-line query nobody can change is a liability.
- **CTEs are for readability, not speed.** Since PostgreSQL 12 they are usually inlined. `MATERIALIZED` makes the CTE an optimization fence: good for an expensive step used twice, bad when the outer filter could have pushed into it.
- **`OFFSET` pagination** reads and throws away every skipped row: page 1,000 at 20 rows per page first discards 19,980 rows. Use keyset pagination ([[Pagination, Filtering and Sorting]]).
- **`SELECT *` in application code** breaks when columns are added or reordered and fetches columns you do not need, including large ones.
- **Dialects differ.** MySQL 8.0 has `ON DUPLICATE KEY UPDATE` instead of `ON CONFLICT` and no `RETURNING`. Portable SQL is a goal only if you really plan to switch engines.

**OFFSET vs keyset paging, as a picture.** OFFSET is like reading a book from page 1 every time to reach page 1,000; keyset is like a bookmark.

```mermaid
flowchart LR
    O["OFFSET 19980 LIMIT 20"] --> O2["read 20,000 rows,<br/>throw away 19,980"]
    K["WHERE id > last_seen<br/>LIMIT 20"] --> K2["jump to bookmark,<br/>read 20 rows"]
```

## 7. In production 🔴

- **Real systems:**
	- PostgreSQL, MySQL, SQL Server, Oracle and SQLite all speak SQL, with different upsert, `RETURNING` and `LIMIT` syntax.
	- Analytics engines (BigQuery, Snowflake, ClickHouse, DuckDB) use SQL over columnar storage: [[Time-Series and Columnar Storage]].
	- Go services send SQL through `database/sql` or pgx, or generate typed code from SQL files with sqlc: [[Database Access (database-sql, pgx, sqlc)]].
- **Failure modes → fixes:**
	- `NOT IN` over a nullable column returns nothing → use `NOT EXISTS`.
	- `LEFT JOIN` silently became inner → move the right-table condition into `ON`.
	- **Fan-out double counting.** Joining invoices to both `invoice_items` and `payments` multiplies rows: INV-102 (2 items × 1 payment) yields 2 rows, so `sum(p.amount_minor)` reports 200000 instead of 100000 → aggregate each child in its own subquery or `LATERAL`, then join.
	- **Implicit cast on the column.** `WHERE id = 42.0` compares `bigint` with `numeric`, so Postgres casts the column (`id::numeric = 42.0`) and cannot use the `bigint` index → match the column type. In MySQL, comparing a string column with a number converts the column and disables its index.
	- **Function on the column.** `WHERE paid_at::date = '2026-11-01'` cannot use an index on `paid_at` → write a range, `paid_at >= … AND paid_at < …`.
	- **Time zone of literals.** `paid_at >= '2026-11-01'` means midnight in the *session's* `TimeZone`; a UTC session and an Asia/Kolkata session get rows 5.5 hours apart → write the zone: `timestamptz '2026-11-01 00:00 Asia/Kolkata'`.
	- **Integer division.** `paid_minor / total_minor` is 0 for 100000 / 250000 → `100.0 * paid_minor / total_minor`.
	- **Unstable pagination.** `ORDER BY due_date` alone lets ties swap between pages → add a unique tie-breaker (`, id`).
- **What to monitor:**
	- `pg_stat_statements`: `calls`, `mean_exec_time` and `rows` per call, to spot a query returning far more rows than the page shows.
	- Error rates by SQLSTATE class: class 23 (integrity) and 40 (rollbacks).
	- `log_min_duration_statement` for slow statements.

## 8. Deep dive 🔴

- **Why `NOT IN` is also slow.** Because of its NULL semantics, the planner cannot turn `NOT IN (subquery)` into an anti-join. It becomes a hashed SubPlan when the subquery result fits in `work_mem`, otherwise a plain SubPlan that rescans the subquery per outer row, which is quadratic. `NOT EXISTS` becomes a Hash or Merge Anti Join.
- **ON CONFLICT under concurrency.** Postgres inserts *speculatively*: it probes the arbiter index, and if another transaction is inserting the same key it waits for that transaction to finish, then re-checks. In Read Committed the docs guarantee one of the two outcomes, insert or update. If the conflicting row comes from a transaction your snapshot cannot see, the `UPDATE` still applies to it, although no version of that row is visible to your statement.
- **Upserts burn identity values.** The row to insert, including any `nextval`, is computed before the conflict is detected. A busy upsert path therefore leaves gaps in `id`. That is harmless for surrogate keys and a reason never to promise gapless numbers from a sequence.
- **Window frames.** `ROWS` counts physical rows, `RANGE` groups peers by value (and allows `RANGE INTERVAL '7 days' PRECEDING` on dates), and `GROUPS` (PostgreSQL 11+) counts peer groups. `EXCLUDE CURRENT ROW` removes the row itself, for example for "average of the other invoices".
- **Logical order vs plan.** Inner joins commute, so the planner chooses the join order itself. `join_collapse_limit` (default 8) caps how many explicit `JOIN`s it reorders freely, and from `geqo_threshold` (default 12) relations it switches to a genetic search. Outer joins restrict reordering, which is one reason an innocent `LEFT JOIN` can change a plan.
- **Three-valued logic in constraints.** Because `CHECK` passes on UNKNOWN, a constraint that must hold even when values are missing needs `NOT NULL` too, or an explicit `IS NOT NULL` inside the check.

## 9. Interview questions 🔴

> [!question]- Trap: `SELECT name FROM clients WHERE id NOT IN (SELECT parent_id FROM clients)` returns no rows, although most clients have no children. Why?
> `parent_id` contains NULLs. `x NOT IN (…, NULL)` expands to `x <> … AND x <> NULL`, and `x <> NULL` is UNKNOWN, so the whole condition is never TRUE. Use `NOT EXISTS (SELECT 1 FROM clients ch WHERE ch.parent_id = c.id)`, which is NULL-safe and planned as an anti-join.

> [!question]- What is the difference between WHERE and HAVING, and why can't WHERE use a SELECT alias?
> `WHERE` filters rows before grouping; `HAVING` filters groups after aggregates are computed. Logically the `SELECT` list is evaluated after both, so its aliases do not exist yet. Postgres lets you use an alias in `ORDER BY` and `GROUP BY`, but not in `WHERE` or `HAVING`.

> [!question]- Your LEFT JOIN returns the same rows as an INNER JOIN. What happened?
> A condition on the right-hand table sits in `WHERE`. For unmatched rows that column is NULL, the condition is UNKNOWN, and the row is dropped. Move the condition into the `ON` clause, or allow NULL explicitly.

> [!question]- Revenue doubled after you joined invoice_items to add an item count. Why?
> Joining one invoice to N items and M payments creates N × M rows, so every payment is counted N times. Aggregate each child table separately (a grouped subquery or `LATERAL`) and join the aggregates, or use `count(DISTINCT …)` only where the values really are distinct.

> [!question]- How do you get the latest invoice per client?
> `row_number() OVER (PARTITION BY client_id ORDER BY issue_date DESC NULLS LAST, id DESC)` in a subquery, then `WHERE rn = 1`. In Postgres, `DISTINCT ON (client_id)` is shorter, and `LATERAL (… LIMIT 1)` is fastest when each client has many invoices and the key is indexed. Mention `NULLS LAST`: `DESC` puts NULLs first.

> [!question]- Why not "SELECT, and INSERT if absent" for an upsert?
> Two concurrent requests both see "absent" and both insert: you get a duplicate or a unique-violation error. `INSERT … ON CONFLICT` checks and writes atomically against a unique index. Note that `DO NOTHING … RETURNING` returns no row on a conflict.

> [!question]- Why does `WHERE paid_at::date = '2026-11-01'` ignore the index on paid_at, and what else is wrong with it?
> The index stores `paid_at` values, not `paid_at::date`, so the planner cannot search it; use a half-open range on the raw column. The cast also uses the session's `TimeZone`, so the "day" moves with the connection's setting. Name the zone in the range bounds.

## 10. Cheat sheet 🟢

- Logical order: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT (windows) → DISTINCT → ORDER BY → LIMIT.
- NULL makes comparisons UNKNOWN: `WHERE` keeps only TRUE, `CHECK` rejects only FALSE. Use `IS NULL`, `IS DISTINCT FROM`, `coalesce`.
- Prefer `NOT EXISTS` to `NOT IN`; put right-table conditions of a `LEFT JOIN` in `ON`.
- `count(*)` counts rows, `count(col)` counts non-NULLs; `sum` of nothing is NULL.
- Windows keep rows; filter on them outside; use `ROWS` for per-row running totals.
- Upsert with `ON CONFLICT` on a matching unique index; `RETURNING` instead of `LastInsertId`.
- Parameters for values, a whitelist for identifiers; always end `ORDER BY` with a unique column.
- Keep the column bare in predicates: no casts or functions on it, no type mismatches.

## Links 🟢

- **Before this:** nothing required. This note opens [[07 Databases MOC]].
- **Next:** [[Relational Schema Design]], [[Transactions and ACID]], [[Indexing Fundamentals]]
- **Code:** [[SQL Essentials - Go]] (schema DDL, long queries, the safe query builder with tests)
- **Compare with:** [[SQL vs NoSQL]] (when not to use a relational store), [[Query Plans and EXPLAIN]] (how the planner executes what you declared), [[Pagination, Filtering and Sorting]] (keyset pagination)

### Watch on YouTube

- [Advanced SQL Tutorial 🔥 Learn JOIN, CTE, Window Functions & More in 15 Minutes](https://www.youtube.com/watch?v=Wu4ZNBlY5HY) · Hasu Tube · 15-min visual recap of joins, CTEs and window functions covered in the note
