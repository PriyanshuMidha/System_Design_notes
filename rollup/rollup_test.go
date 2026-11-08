package rollup

import (
	"fmt"
	"sync"
	"testing"
)

func TestApplyIsIdempotent(t *testing.T) {
	r := New()
	create := Event{ID: "inv-1:v1", WorkspaceID: 7, InvoiceID: 1, OldTotal: 0, NewTotal: 250_000}
	edit := Event{ID: "inv-1:v2", WorkspaceID: 7, InvoiceID: 1, OldTotal: 250_000, NewTotal: 300_000}

	if !r.Apply(create) || !r.Apply(edit) {
		t.Fatal("first delivery must apply")
	}
	if r.Apply(edit) {
		t.Fatal("redelivered event must be ignored")
	}
	got := r.Get(7)
	want := Totals{InvoiceCount: 1, TotalMinor: 300_000}
	if got != want {
		t.Fatalf("got %+v, want %+v", got, want)
	}
}

func TestDeleteDecrementsCount(t *testing.T) {
	r := New()
	r.Apply(Event{ID: "a", WorkspaceID: 1, InvoiceID: 1, NewTotal: 100})
	r.Apply(Event{ID: "b", WorkspaceID: 1, InvoiceID: 1, OldTotal: 100})
	if got := r.Get(1); got != (Totals{}) {
		t.Fatalf("got %+v, want zero row", got)
	}
}

func TestDriftFindsMissedUpdate(t *testing.T) {
	r := New()
	r.Apply(Event{ID: "a", WorkspaceID: 1, InvoiceID: 1, NewTotal: 100})
	r.Apply(Event{ID: "b", WorkspaceID: 2, InvoiceID: 2, NewTotal: 500})
	// The event that changed invoice 2 from 500 to 800 was lost.
	source := map[int64]map[int64]int64{
		1: {1: 100},
		2: {2: 800},
	}
	bad := r.Drift(source)
	if len(bad) != 1 || bad[2] != (Totals{InvoiceCount: 1, TotalMinor: 800}) {
		t.Fatalf("drift = %+v, want only workspace 2 with 1 invoice / 800", bad)
	}
}

func TestConcurrentApplyWithDuplicates(t *testing.T) {
	r := New()
	var wg sync.WaitGroup
	for w := 0; w < 4; w++ { // four consumers receive the same 1,000 events
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := 0; i < 1000; i++ {
				r.Apply(Event{ID: fmt.Sprint(i), WorkspaceID: 1, InvoiceID: int64(i), NewTotal: 10})
			}
		}()
	}
	wg.Wait()
	want := Totals{InvoiceCount: 1000, TotalMinor: 10_000}
	if got := r.Get(1); got != want {
		t.Fatalf("got %+v, want %+v", got, want)
	}
}
