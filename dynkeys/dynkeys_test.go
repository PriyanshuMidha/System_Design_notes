package dynkeys

import (
	"fmt"
	"testing"
)

func seed() *Table {
	t := &Table{}
	ws := WorkspacePK("acme")
	t.Put(Item{PK: ws, SK: "META", Attrs: map[string]string{"name": "Acme"}})
	t.Put(Item{PK: ws, SK: "CLIENT#c_1", GSI1PK: "CLIENT#c_1", GSI1SK: "META"})
	for i, m := range []string{"2026-09", "2026-10", "2026-11", "2026-11"} {
		id := fmt.Sprintf("inv_%d", i)
		t.Put(Item{PK: ws, SK: InvoiceSK(m, id), GSI1PK: "CLIENT#c_1", GSI1SK: InvoiceSK(m, id)})
	}
	t.Put(Item{PK: InvoicePK("inv_3"), SK: PaymentSK("2026-11-02T10:00Z", "p_1")})
	return t
}

func TestQueryByMonthPrefix(t *testing.T) {
	got, cursor := seed().Query(WorkspacePK("acme"), "INV#2026-11", "", 10)
	if len(got) != 2 || cursor != "" {
		t.Fatalf("got %d items, cursor %q; want 2 items, no cursor", len(got), cursor)
	}
	if got[0].SK != "INV#2026-11#inv_2" {
		t.Fatalf("first SK = %s, want sort-key order", got[0].SK)
	}
}

func TestPaginationWithCursor(t *testing.T) {
	tbl := seed()
	var all []string
	cursor := ""
	for {
		page, next := tbl.Query(WorkspacePK("acme"), "INV#", cursor, 3)
		for _, it := range page {
			all = append(all, it.SK)
		}
		if next == "" {
			break
		}
		cursor = next
	}
	if len(all) != 4 {
		t.Fatalf("paged %d invoices, want 4: %v", len(all), all)
	}
}

func TestGSIOverloadingServesClientView(t *testing.T) {
	got := seed().QueryGSI1("CLIENT#c_1", "")
	if len(got) != 5 { // the client row + 4 invoices, in one query
		t.Fatalf("got %d items, want 5", len(got))
	}
	if got[0].GSI1SK != "INV#2026-09#inv_0" {
		t.Fatalf("first = %s, want oldest invoice first", got[0].GSI1SK)
	}
}

func TestShardedPKIsStableAndSpread(t *testing.T) {
	a := ShardedPK("EVENTS#2026-11-03", "evt_42", 10)
	if a != ShardedPK("EVENTS#2026-11-03", "evt_42", 10) {
		t.Fatal("same write key must map to the same shard")
	}
	seen := map[string]bool{}
	for i := 0; i < 1000; i++ {
		seen[ShardedPK("EVENTS#2026-11-03", fmt.Sprint("evt_", i), 10)] = true
	}
	if len(seen) != 10 {
		t.Fatalf("1,000 writes used %d shards, want all 10", len(seen))
	}
}
