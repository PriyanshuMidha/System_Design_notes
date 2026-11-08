// Package dynkeys builds DynamoDB single-table keys for InvoiceOps and
// simulates the one read a Query can do: one partition key, a sort-key
// condition, results in sort-key order, one page at a time.
package dynkeys

import (
	"fmt"
	"hash/fnv"
	"sort"
	"strings"
)

// Item is one row of the single table. Attrs holds everything else.
type Item struct {
	PK, SK string
	GSI1PK string // overloaded GSI: meaning depends on the entity type
	GSI1SK string
	Attrs  map[string]string
}

func WorkspacePK(ws string) string { return "WS#" + ws }

// InvoiceSK sorts invoices by issue month, then id: "INV#2026-11#inv_812".
func InvoiceSK(month, invoiceID string) string {
	return fmt.Sprintf("INV#%s#%s", month, invoiceID)
}

func InvoicePK(invoiceID string) string { return "INVOICE#" + invoiceID }

func PaymentSK(paidAt, paymentID string) string {
	return fmt.Sprintf("PAY#%s#%s", paidAt, paymentID)
}

// ShardedPK spreads one hot logical key over n partition keys
// ("EVENTS#2026-11-03#0" .. "#n-1"). Readers must query all n.
func ShardedPK(base, writeKey string, n int) string {
	h := fnv.New32a()
	h.Write([]byte(writeKey))
	return fmt.Sprintf("%s#%d", base, h.Sum32()%uint32(n))
}

// Table is an in-memory stand-in for one DynamoDB table.
type Table struct{ items []Item }

func (t *Table) Put(it Item) {
	for i := range t.items {
		if t.items[i].PK == it.PK && t.items[i].SK == it.SK {
			t.items[i] = it // same primary key: replace
			return
		}
	}
	t.items = append(t.items, it)
}

// Query returns up to limit items with this PK whose SK starts with
// prefix, after the exclusive start key. The returned cursor is the last
// SK on the page ("LastEvaluatedKey"), or "" when there are no more.
func (t *Table) Query(pk, prefix, startAfter string, limit int) ([]Item, string) {
	var hits []Item
	for _, it := range t.items {
		if it.PK == pk && strings.HasPrefix(it.SK, prefix) && it.SK > startAfter {
			hits = append(hits, it)
		}
	}
	sort.Slice(hits, func(i, j int) bool { return hits[i].SK < hits[j].SK })
	if len(hits) <= limit {
		return hits, ""
	}
	page := hits[:limit]
	return page, page[len(page)-1].SK
}

// QueryGSI1 is the same read against the overloaded index.
func (t *Table) QueryGSI1(pk, prefix string) []Item {
	var hits []Item
	for _, it := range t.items {
		if it.GSI1PK == pk && strings.HasPrefix(it.GSI1SK, prefix) {
			hits = append(hits, it)
		}
	}
	sort.Slice(hits, func(i, j int) bool { return hits[i].GSI1SK < hits[j].GSI1SK })
	return hits
}
