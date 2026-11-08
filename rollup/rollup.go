// Package rollup keeps an app-maintained summary table (per-workspace
// invoice totals) up to date from change events, and checks it for drift.
package rollup

import "sync"

// Event is one change to an invoice, as delivered by an outbox or CDC
// consumer. Delivery is at-least-once, so the same ID can arrive twice.
type Event struct {
	ID          string // unique per change, e.g. "inv-7:v3"
	WorkspaceID int64
	InvoiceID   int64
	OldTotal    int64 // total_minor before the change (0 for a new invoice)
	NewTotal    int64 // total_minor after the change (0 for a deleted invoice)
}

// Totals is one row of the rollup: workspace_totals in SQL.
type Totals struct {
	InvoiceCount int64
	TotalMinor   int64
}

// Rollup applies events exactly once by remembering the IDs it has seen.
// In SQL the seen set is a processed_events table written in the same
// transaction as the rollup update.
type Rollup struct {
	mu   sync.Mutex
	seen map[string]bool
	rows map[int64]Totals
}

func New() *Rollup {
	return &Rollup{seen: map[string]bool{}, rows: map[int64]Totals{}}
}

// Apply adds the delta of one event. It reports false for a duplicate.
func (r *Rollup) Apply(e Event) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.seen[e.ID] {
		return false
	}
	r.seen[e.ID] = true
	t := r.rows[e.WorkspaceID]
	switch {
	case e.OldTotal == 0 && e.NewTotal != 0:
		t.InvoiceCount++ // created
	case e.OldTotal != 0 && e.NewTotal == 0:
		t.InvoiceCount-- // deleted
	}
	t.TotalMinor += e.NewTotal - e.OldTotal
	r.rows[e.WorkspaceID] = t
	return true
}

// Get returns the rollup row for one workspace.
func (r *Rollup) Get(ws int64) Totals {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.rows[ws]
}

// Drift compares the rollup with a full recomputation from the source
// rows (invoice id -> total_minor, per workspace) and returns the
// workspaces whose rows disagree, with the correct values.
func (r *Rollup) Drift(source map[int64]map[int64]int64) map[int64]Totals {
	truth := map[int64]Totals{}
	for ws, invoices := range source {
		var t Totals
		for _, total := range invoices {
			if total != 0 {
				t.InvoiceCount++
				t.TotalMinor += total
			}
		}
		truth[ws] = t
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	bad := map[int64]Totals{}
	for ws, want := range truth {
		if r.rows[ws] != want {
			bad[ws] = want
		}
	}
	for ws, got := range r.rows {
		if _, ok := truth[ws]; !ok && got != (Totals{}) {
			bad[ws] = Totals{}
		}
	}
	return bad
}
