package lww

import "testing"

const (
	day     = 24 * 3600
	gcGrace = 10 * day // Cassandra's default gc_grace_seconds: 864000
	key     = "audit:ws-7:evt-42"
)

// Three replicas hold a row. The delete reaches A and B while C is down
// longer than the hint window.
func setup() (a, b, c Replica) {
	a, b, c = Replica{}, Replica{}, Replica{}
	for _, r := range []Replica{a, b, c} {
		r.Apply(key, Cell{Value: "invoice.sent", WriteTS: 1_000})
	}
	del := Cell{WriteTS: 2_000, Tombstone: true, DeletedAt: 0}
	a.Apply(key, del)
	b.Apply(key, del)
	return a, b, c
}

func TestDeleteResurrectsWithoutRepair(t *testing.T) {
	a, b, c := setup()
	if _, ok := Read(key, a, b, c); ok {
		t.Fatal("while the tombstone exists the row must read as deleted")
	}
	a.Compact(11*day, gcGrace) // day 11: no repair ran, tombstones purged
	b.Compact(11*day, gcGrace)
	if v, ok := Read(key, a, b, c); !ok || v != "invoice.sent" {
		t.Fatalf("want the zombie row back, got %q %v", v, ok)
	}
}

func TestRepairWithinGCGraceKeepsDelete(t *testing.T) {
	a, b, c := setup()
	Repair(key, a, b, c) // day 5: C receives the tombstone
	for _, r := range []Replica{a, b, c} {
		r.Compact(11*day, gcGrace)
	}
	if v, ok := Read(key, a, b, c); ok {
		t.Fatalf("deleted row came back: %q", v)
	}
}

func TestLastWriteWins(t *testing.T) {
	live := Cell{Value: "x", WriteTS: 5_000}
	tomb := Cell{WriteTS: 5_000, Tombstone: true}
	if got := Reconcile(live, tomb); !got.Tombstone {
		t.Fatal("a tombstone must win a timestamp tie")
	}
	if got := Reconcile(tomb, live); !got.Tombstone {
		t.Fatal("tie-break must not depend on argument order")
	}

	// Node A wrote at real time T and stamped 10_000. Node B wrote 2 ms
	// later in real time, but its clock is behind, so it stamped 8_000.
	r := Replica{}
	r.Apply("k", Cell{Value: "from-A", WriteTS: 10_000})
	r.Apply("k", Cell{Value: "from-B-later", WriteTS: 8_000})
	if v, _ := Read("k", r); v != "from-A" {
		t.Fatalf("got %q: the later write with the lower timestamp must be discarded", v)
	}
}
