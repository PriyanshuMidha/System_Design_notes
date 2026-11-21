---
tags: [cs-fundamentals, data-structures, trees]
level: intermediate
status: draft
type: implementation
prereqs: ["[[Arrays and Dynamic Arrays (Go Slices)]]", "[[Stacks, Queues and Deques]]"]
related: ["[[Trees, BSTs and Balanced Trees]]", "[[Storage Engines - B-tree vs LSM and WAL]]", "[[Heaps and Priority Queues]]", "[[Tries, Suffix Trees and Suffix Arrays]]", "[[Indexing Fundamentals]]"]
sources:
  - "Cormen, Leiserson, Rivest, Stein, Introduction to Algorithms (3rd ed.), ch. 12–13, 18"
  - "PostgreSQL 17 docs, Index Types (B-tree)"
  - "Linux kernel documentation, rbtree.rst"
updated: 2026-11-13
---

# Trees, BSTs and Balanced Trees - Go

> [!summary] TL;DR
> This code implements a plain binary search tree in Go — insert, search, delete (all three cases), height, four traversals, and the single/double rotations balanced trees build on — and tests that delete and rotation both preserve the BST property. See [[Trees, BSTs and Balanced Trees]] for the theory.

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read the theory note first ([[Trees, BSTs and Balanced Trees]]). Here, read "From zero" below, "Before the code" and "What this code shows", then skim the code steps.
> - 🟡 **Know the basics?** Read the Code, Design decisions and Tests sections, then run it yourself.
> - 🔴 **Interview / SDE-3 prep?** Add the Pitfalls and Exercises sections. Headings are tagged 🟢🟡🔴.

> [!note] Before this note
> - [[Trees, BSTs and Balanced Trees]]: the theory twin. Know the BST rule (smaller left, bigger right), the three delete cases, the four traversals, and what a rotation does.
> - [[Arrays and Dynamic Arrays (Go Slices)]] and [[Stacks, Queues and Deques]]: `LevelOrder` uses a slice as a queue.

**From zero** 🟢: this file is the hands-on side of [[Trees, BSTs and Balanced Trees]]. It builds a plain binary search tree in Go — insert, search, delete, traversals — plus the rotations that balanced trees are made of, with tests proving the BST rule survives every operation. Read each step's notes before the code.

## Before the code 🟢

- **Pointer-linked structs** (`type Node struct { Left, Right *Node }`): each node points to its children; `nil` means "no child".
- **Recursion** (`Insert`, `Delete`, `Height`, `InOrder`): each function handles one node and calls itself on a subtree (a node plus everything below it).
- **In-order successor**: the smallest key in a node's right subtree; used to replace a deleted node that has two children.
- **Rotation**: lifting a child into its parent's place while keeping the BST order; the building block of balanced trees.
- **Returning the new root** (`root = Insert(root, k)`): insert, delete and rotations may change which node is on top, so callers reassign.
- **Function arguments** (`visit func(int)`): traversals call back into your code for each key instead of building a list.
- **A slice as a queue** (`LevelOrder`): breadth-first traversal appends children to the back and reads from the front.
- **What to run:** `go vet ./... && go test -race ./...` inside the module; add `-v -run TestDeleteLeafOneChildTwoChildren` for one test.

## What this code shows 🟢

| Code piece | Theory concept | Link |
| --- | --- | --- |
| `Node`, `Insert`, `Search` | The BST property and `O(h)` operations | [[Trees, BSTs and Balanced Trees#The BST property and its three operations]] |
| `Delete` | The three delete cases, successor replacement | [[Trees, BSTs and Balanced Trees#The BST property and its three operations]] |
| `Height` | Proving the degenerate case is real, not theoretical | [[Trees, BSTs and Balanced Trees#The degenerate case when a tree is secretly a linked list]] |
| `InOrder`, `PreOrder`, `PostOrder`, `LevelOrder` | The four traversal orders and their uses | [[Trees, BSTs and Balanced Trees#Traversals four ways to walk the same tree]] |
| `rotateLeft`, `rotateRight` | The rotation primitive every balanced tree builds on | [[Trees, BSTs and Balanced Trees#AVL vs red-black side by side]] |

## Setup 🟢

- Module: `bst`, Go 1.24.4, no external dependencies.
- Layout:
  ```text
  bst/
    go.mod
    bst.go       # Node, Insert, Search, Delete, Height, traversals, rotations
    bst_test.go  # delete-cases, height, search, and rotation tests
  ```
- Run it:
  ```bash
  go vet ./...
  go test -race ./...
  go test -race -v ./... -run TestDeleteLeafOneChildTwoChildren
  ```

## Code 🟡

> 🟢 → 🟡 **You now know** what the BST code covers. **Next we read it:** six steps, from the node type to rotations.

### Step 1: the node and the BST invariant

**What this code does, in plain words:** it defines a tree node (a key and two child pointers) and an `Insert` that walks left or right until it finds an empty spot for the new key.

**Concept.** `Node` is the whole data structure: a key plus two child pointers. `Insert` is the simplest possible expression of the BST property from the theory note — recurse left if the new key is smaller, right if larger, and attach a new leaf the first time you hit a nil child. There is no balancing here at all; that is deliberate, since this step is meant to match the theory note's whiteboard version exactly before any complexity is added.

```go
package bst

type Node struct {
	Key         int
	Left, Right *Node
}

// Insert adds key and returns the (possibly new) root. O(h).
func Insert(n *Node, key int) *Node {
	if n == nil {
		return &Node{Key: key}
	}
	if key < n.Key {
		n.Left = Insert(n.Left, key)
	} else if key > n.Key {
		n.Right = Insert(n.Right, key)
	}
	return n
}
```

**How it works.**
1. `Insert` takes the current subtree root `n` and returns the (possibly new) root — the standard Go pattern for recursive tree mutation, since Go has no notion of "modify the caller's pointer variable" without either a pointer-to-pointer or this return-and-reassign style.
2. The base case `if n == nil` is where a leaf actually gets created; every recursive call below it is just finding where that leaf belongs.
3. Duplicate keys (`key == n.Key`) are silently ignored — neither branch fires, and the unmodified node is returned — a deliberate choice documented here: a multiset variant would need an explicit count field or a tie-breaking rule instead.

### Step 2: searching without recursion

**What this code does, in plain words:** it walks down from the root, going left or right by comparing keys, and reports whether the key was found.

**Concept.** `Search` implements the same left/right decision as `Insert`, but as an iterative loop rather than recursion, since a search never needs to build anything on the way back up — a direct illustration that recursion and iteration are interchangeable here, and iteration avoids any call-stack growth for a search-only traversal.

```go
// Search reports whether key exists. O(h).
func Search(n *Node, key int) bool {
	for n != nil {
		switch {
		case key == n.Key:
			return true
		case key < n.Key:
			n = n.Left
		default:
			n = n.Right
		}
	}
	return false
}
```

**How it works.**
1. The `for n != nil` loop re-binds the local variable `n` to whichever child to descend into next — no recursion, no stack frames beyond this one function call, regardless of tree height.
2. The tag-less `switch` with three cases is Go's idiomatic replacement for an if/else-if/else chain when there are several mutually exclusive conditions to check in sequence.
3. Falling off the loop (`n` became `nil`) means the key was never found, so the function returns `false` only in that one place, after the loop.

### Step 3: the three delete cases

**What this code does, in plain words:** it finds the key, then removes a leaf, splices up a single child, or (with two children) copies in the successor's key and deletes the successor instead.

**Concept.** `Delete` is the direct implementation of the theory note's three-case walkthrough: leaf (just remove), one child (splice it up), two children (replace with the in-order successor, then delete that successor). The helper `min` finds that successor by walking left from the right subtree until there's no more left — exactly the "smallest key in the right subtree" the theory note describes.

```go
func min(n *Node) *Node {
	for n.Left != nil {
		n = n.Left
	}
	return n
}

// Delete removes key and returns the (possibly new) root. O(h).
func Delete(n *Node, key int) *Node {
	if n == nil {
		return nil
	}
	switch {
	case key < n.Key:
		n.Left = Delete(n.Left, key)
	case key > n.Key:
		n.Right = Delete(n.Right, key)
	default:
		if n.Left == nil {
			return n.Right
		}
		if n.Right == nil {
			return n.Left
		}
		succ := min(n.Right)
		n.Key = succ.Key
		n.Right = Delete(n.Right, succ.Key)
	}
	return n
}
```

**How it works.**
1. The first two `switch` cases recurse to find the node to delete, reassigning `n.Left`/`n.Right` to whatever that recursive call returns — the same return-and-reassign pattern as `Insert`.
2. Inside the `default` case (key found), `if n.Left == nil { return n.Right }` and the mirror check handle both the leaf case (both nil, so this returns `nil`, correctly removing the node) and the one-child case in a single pair of checks — a leaf is really just a degenerate one-child case where the "child" happens to be nil.
3. The two-children branch copies `succ.Key` into the current node, then recursively deletes `succ.Key` from the right subtree — note this is a second, separate call into `Delete`, not a special in-place removal, which keeps the deletion logic in exactly one place instead of duplicating leaf/one-child handling for the successor too.

### Step 4: height, and why it proves the degenerate case

**What this code does, in plain words:** it returns the number of levels below a node, so we can compare a balanced tree (height 2) with a chain (height 4).

**Concept.** `Height` is a small, pure recursive function, but it is the measuring instrument the theory note's degenerate-case claim depends on: running it on a balanced 7-node tree versus a 5-node sorted-insert chain is what turns "an unbalanced BST can be as bad as a linked list" from an assertion into a number you can check.

```go
// Height: -1 for an empty tree, 0 for a single node.
func Height(n *Node) int {
	if n == nil {
		return -1
	}
	lh, rh := Height(n.Left), Height(n.Right)
	if lh > rh {
		return lh + 1
	}
	return rh + 1
}
```

**How it works.**
1. The `-1` convention for an empty tree (rather than `0`) makes the recursion's `+1` arithmetic work out so a single node correctly reports height `0` — `Height(nil) = -1`, and a leaf's single call computes `max(-1, -1) + 1 = 0`.
2. Both subtrees' heights are always computed (`lh, rh := Height(n.Left), Height(n.Right)`) even though only the larger one is used — there's no shortcut here, since both children's full heights are needed to know which is larger.
3. This function makes no attempt to be efficient for repeated calls (it's `O(n)` per call, re-walking the whole subtree every time) — fine for a one-off measurement, but a production balanced tree instead caches height in each node and updates it incrementally on every rotation.

### Step 5: four traversals

**What this code does, in plain words:** four ways to visit every node: in-order, pre-order, post-order (recursive) and level-order (row by row with a queue).

**Concept.** These four functions are the direct Go translation of the theory note's traversal table: the same `visit` callback pattern, varied only in *when* it's called relative to the recursive descent into children.

```go
func InOrder(n *Node, visit func(int)) {
	if n == nil {
		return
	}
	InOrder(n.Left, visit)
	visit(n.Key)
	InOrder(n.Right, visit)
}

func PreOrder(n *Node, visit func(int)) {
	if n == nil {
		return
	}
	visit(n.Key)
	PreOrder(n.Left, visit)
	PreOrder(n.Right, visit)
}

func PostOrder(n *Node, visit func(int)) {
	if n == nil {
		return
	}
	PostOrder(n.Left, visit)
	PostOrder(n.Right, visit)
	visit(n.Key)
}
```

**How it works.**
1. All three take a `func(int)` callback (`visit`) instead of returning a slice directly — an idiomatic Go pattern that lets the caller decide what to do with each key (append to a slice, print it, sum it) without this package needing to know or care.
2. The only difference between the three functions is the *position* of the `visit(n.Key)` line relative to the two recursive calls — before both (pre-order), between them (in-order), or after both (post-order) — a detail easy to miss by skimming but which is the entire semantic difference the theory note's table describes.
3. `LevelOrder`, shown next, cannot be written this same recursive way, because breadth-first traversal needs an explicit queue, not the call stack's implicit one.

```go
func LevelOrder(root *Node, visit func(int)) {
	if root == nil {
		return
	}
	queue := []*Node{root}
	for len(queue) > 0 {
		n := queue[0]
		queue = queue[1:]
		visit(n.Key)
		if n.Left != nil {
			queue = append(queue, n.Left)
		}
		if n.Right != nil {
			queue = append(queue, n.Right)
		}
	}
}
```

**How it works.**
1. A Go slice (`queue := []*Node{root}`) stands in for the queue; `queue[0]` reads the front and `queue = queue[1:]` dequeues it — simple but not the most efficient possible queue (re-slicing like this keeps the backing array's start index moving forward without reclaiming space until the slice is garbage collected), fine for a teaching example at small scale.
2. Each dequeued node's children are *enqueued*, not recursed into — this is what makes the traversal breadth-first (level by level) instead of depth-first: the queue always holds "everything at or past the current level," never diving ahead into one branch.

### Step 6: rotations — the primitive balanced trees are built from

**What this code does, in plain words:** it lifts a child up into its parent's place and moves the parent down, without breaking the smaller-left / bigger-right order.

**Concept.** `rotateLeft` and `rotateRight` are the single mechanical operation every self-balancing tree in the theory note (AVL, red-black) repeats to fix an imbalance. Neither function knows anything about balance factors or colors — rotation is purely a local pointer rearrangement that is guaranteed to preserve the BST property, which is exactly why it's safe for a balancing algorithm to call it without re-checking the whole tree afterward.

```go
// rotateLeft: the single rotation AVL and red-black trees use to fix a
// right-heavy subtree. Preserves the BST property.
func rotateLeft(n *Node) *Node {
	r := n.Right
	n.Right = r.Left
	r.Left = n
	return r
}

func rotateRight(n *Node) *Node {
	l := n.Left
	n.Left = l.Right
	l.Right = n
	return l
}
```

**How it works.**
1. `rotateLeft` promotes `n`'s right child `r` to take `n`'s place; `n` becomes `r`'s new left child; and whatever used to be `r`'s left subtree (values between `n` and `r`) becomes `n`'s new right subtree — the only subtree that has to move, because it's the only one whose ordering relative to both `n` and `r` stays valid in its new position.
2. Both functions return the *new* subtree root (`r` or `l`), following the same return-and-reassign convention as `Insert` and `Delete` — the caller must assign the result somewhere, typically back into a parent's child pointer.
3. `rotateRight` is the exact mirror image of `rotateLeft` with left/right swapped throughout — writing one correctly and then mechanically swapping every `Left`/`Right` is the standard way to derive the second without re-deriving the logic from scratch.

> [!example]- Full file (`bst.go`)
> ```go
> package bst
>
> type Node struct {
> 	Key         int
> 	Left, Right *Node
> }
>
> func Insert(n *Node, key int) *Node {
> 	if n == nil {
> 		return &Node{Key: key}
> 	}
> 	if key < n.Key {
> 		n.Left = Insert(n.Left, key)
> 	} else if key > n.Key {
> 		n.Right = Insert(n.Right, key)
> 	}
> 	return n
> }
>
> func Search(n *Node, key int) bool {
> 	for n != nil {
> 		switch {
> 		case key == n.Key:
> 			return true
> 		case key < n.Key:
> 			n = n.Left
> 		default:
> 			n = n.Right
> 		}
> 	}
> 	return false
> }
>
> func min(n *Node) *Node {
> 	for n.Left != nil {
> 		n = n.Left
> 	}
> 	return n
> }
>
> func Delete(n *Node, key int) *Node {
> 	if n == nil {
> 		return nil
> 	}
> 	switch {
> 	case key < n.Key:
> 		n.Left = Delete(n.Left, key)
> 	case key > n.Key:
> 		n.Right = Delete(n.Right, key)
> 	default:
> 		if n.Left == nil {
> 			return n.Right
> 		}
> 		if n.Right == nil {
> 			return n.Left
> 		}
> 		succ := min(n.Right)
> 		n.Key = succ.Key
> 		n.Right = Delete(n.Right, succ.Key)
> 	}
> 	return n
> }
>
> func Height(n *Node) int {
> 	if n == nil {
> 		return -1
> 	}
> 	lh, rh := Height(n.Left), Height(n.Right)
> 	if lh > rh {
> 		return lh + 1
> 	}
> 	return rh + 1
> }
>
> func InOrder(n *Node, visit func(int)) {
> 	if n == nil {
> 		return
> 	}
> 	InOrder(n.Left, visit)
> 	visit(n.Key)
> 	InOrder(n.Right, visit)
> }
>
> func PreOrder(n *Node, visit func(int)) {
> 	if n == nil {
> 		return
> 	}
> 	visit(n.Key)
> 	PreOrder(n.Left, visit)
> 	PreOrder(n.Right, visit)
> }
>
> func PostOrder(n *Node, visit func(int)) {
> 	if n == nil {
> 		return
> 	}
> 	PostOrder(n.Left, visit)
> 	PostOrder(n.Right, visit)
> 	visit(n.Key)
> }
>
> func LevelOrder(root *Node, visit func(int)) {
> 	if root == nil {
> 		return
> 	}
> 	queue := []*Node{root}
> 	for len(queue) > 0 {
> 		n := queue[0]
> 		queue = queue[1:]
> 		visit(n.Key)
> 		if n.Left != nil {
> 			queue = append(queue, n.Left)
> 		}
> 		if n.Right != nil {
> 			queue = append(queue, n.Right)
> 		}
> 	}
> }
>
> func rotateLeft(n *Node) *Node {
> 	r := n.Right
> 	n.Right = r.Left
> 	r.Left = n
> 	return r
> }
>
> func rotateRight(n *Node) *Node {
> 	l := n.Left
> 	n.Left = l.Right
> 	l.Right = n
> 	return l
> }
>
> // buildTree is a test helper: insert keys in the given order into a fresh
> // tree and return the root.
> func buildTree(keys []int) *Node {
> 	var root *Node
> 	for _, k := range keys {
> 		root = Insert(root, k)
> 	}
> 	return root
> }
> ```

## Tests 🟡

### `TestDeleteLeafOneChildTwoChildren`

**What it proves and why it matters.** This is the direct test of the theory note's three-case delete walkthrough, run as one sequence of deletes on the same 7-node tree: leaf, then one-child, then two-children, checked by reading the tree back out in sorted (in-order) form afterward.

| Input | Expected output |
| --- | --- |
| Tree from `{50, 30, 70, 20, 40, 60, 80}`, then `Delete(20)`, `Delete(30)`, `Delete(50)` | In-order traversal = `[40, 60, 70, 80]` |

```go
func TestDeleteLeafOneChildTwoChildren(t *testing.T) {
	root := buildTree([]int{50, 30, 70, 20, 40, 60, 80})

	root = Delete(root, 20) // leaf
	root = Delete(root, 30) // one child (40 is spliced up)
	root = Delete(root, 50) // two children: replaced by successor 60

	var got []int
	InOrder(root, func(k int) { got = append(got, k) })
	want := []int{40, 60, 70, 80}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("InOrder after deletes = %v; want %v", got, want)
	}
}
```

A failure here would point directly at one of the three delete cases being wrong — most likely the two-children successor logic, since that's the only case doing more than reattaching a single pointer.

### `TestHeightDegenerateVsBalanced`

**What it proves and why it matters.** This is the theory note's degenerate-case claim turned into a number: the same `Height` function applied to a balanced 7-node tree and a 5-node sorted-insert chain must report very different heights relative to their sizes.

| Input | Expected output |
| --- | --- |
| Balanced tree from `{50, 30, 70, 20, 40, 60, 80}` (7 nodes) | `Height == 2` |
| Chain from `{1, 2, 3, 4, 5}` inserted in sorted order (5 nodes) | `Height == 4` |

```go
func TestHeightDegenerateVsBalanced(t *testing.T) {
	balanced := buildTree([]int{50, 30, 70, 20, 40, 60, 80})
	if h := Height(balanced); h != 2 {
		t.Fatalf("Height(balanced 7-node tree) = %d; want 2", h)
	}
	degenerate := buildTree([]int{1, 2, 3, 4, 5}) // sorted input, no rebalancing
	if h := Height(degenerate); h != 4 {
		t.Fatalf("Height(degenerate 5-node chain) = %d; want 4", h)
	}
}
```

A failure where the degenerate case's height came out lower than expected would mean `Insert` is accidentally doing some kind of balancing — which this plain BST is explicitly not meant to do, by design, until a balanced variant adds it on top.

### `TestSearchFindsAndMisses`

**What it proves and why it matters.** The simplest possible correctness check for `Search`: it must say yes for a key that's there, and no for one that isn't — both branches of its loop need coverage, not just the happy path.

| Input | Expected output |
| --- | --- |
| Tree from `{50, 30, 70, 20, 40, 60, 80}`, `Search(40)` | `true` |
| Same tree, `Search(999)` | `false` |

```go
func TestSearchFindsAndMisses(t *testing.T) {
	root := buildTree([]int{50, 30, 70, 20, 40, 60, 80})
	if !Search(root, 40) {
		t.Fatalf("Search(40) = false; want true")
	}
	if Search(root, 999) {
		t.Fatalf("Search(999) = true; want false")
	}
}
```

A failure on the "miss" case specifically would point at a bug in the loop's termination condition — for example, treating `n == nil` as "found" instead of "not found."

### `TestRotationsPreserveBSTOrder`

**What it proves and why it matters.** This is the property the Deep dive relies on without proving it: a rotation must never change what an in-order traversal produces, because an in-order traversal is exactly the BST's sorted contents, and no balancing algorithm could trust rotations otherwise.

| Input | Expected output |
| --- | --- |
| Tree from `{30, 20, 10, 40, 50}`, then `rotateLeft`, then `rotateRight` (undoing it) | In-order traversal = `[10, 20, 30, 40, 50]` after each rotation |

```go
func TestRotationsPreserveBSTOrder(t *testing.T) {
	root := buildTree([]int{30, 20, 10, 40, 50}) // right-right heavy on delete path
	root = rotateLeft(root)
	var got []int
	InOrder(root, func(k int) { got = append(got, k) })
	want := []int{10, 20, 30, 40, 50}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("InOrder after rotateLeft = %v; want %v (rotation must preserve sorted order)", got, want)
	}
	root = rotateRight(root)
	got = nil
	InOrder(root, func(k int) { got = append(got, k) })
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("InOrder after rotateRight undo = %v; want %v", got, want)
	}
}
```

A failure here is the most serious possible bug for this code: it would mean the rotation primitive itself corrupts tree ordering, which would silently break every balanced tree built on top of it, not just this test.

## Design decisions 🟡

| Decision | Alternative | Trade-off |
| --- | --- | --- |
| Return-and-reassign recursion (`n.Left = Insert(n.Left, key)`) | Pointer-to-pointer (`**Node`) mutation | Return-and-reassign reads more like ordinary Go and avoids double-indirection, at the cost of reassigning a pointer that sometimes hasn't changed; `**Node` avoids that reassignment but is less idiomatic and harder to read for newcomers |
| Iterative `Search`, recursive `Insert`/`Delete` | Fully recursive or fully iterative throughout | Search never needs to do anything on the way back up the tree, so iteration avoids stack growth for free; insert and delete both need to reattach a (possibly new) subtree root on the way back up, which recursion expresses naturally |
| `visit func(int)` callback for traversals | Returning a `[]int` directly from each traversal function | A callback lets callers avoid allocating a slice when they only need to, say, sum the keys or stop early; returning a slice is more convenient for the common case but forces an allocation even when unneeded |
| Separate `rotateLeft`/`rotateRight`, unexported | A single parameterized `rotate(n *Node, dir int) *Node` | Two small, mirror-image functions are easier to read and reason about independently; a single parameterized version would be more compact but requires an extra conditional inside the hot path of every rotation |

## Running it 🟡

```bash
$ go test -race -v ./...
=== RUN   TestDeleteLeafOneChildTwoChildren
--- PASS: TestDeleteLeafOneChildTwoChildren (0.00s)
=== RUN   TestHeightDegenerateVsBalanced
--- PASS: TestHeightDegenerateVsBalanced (0.00s)
=== RUN   TestSearchFindsAndMisses
--- PASS: TestSearchFindsAndMisses (0.00s)
=== RUN   TestRotationsPreserveBSTOrder
--- PASS: TestRotationsPreserveBSTOrder (0.00s)
PASS
ok  	bst	1.461s
```

Reading this output line by line: all four tests pass silently, meaning (in order) the three delete cases produce the correct sorted contents, `Height` reports `2` for the balanced tree and `4` for the degenerate chain exactly as the theory note's worked example claims, `Search` correctly distinguishes present from absent keys, and both rotation directions leave the tree's sorted order unchanged. `-race` reports no data races, as expected for single-goroutine, non-concurrent code — included here for consistency with this vault's other Go notes.

> 🟡 → 🔴 **You now know** how each function works and what the tests prove. **Next comes the advanced part:** the extra walk in two-child delete, rotations that panic on a missing child, and the `queue[1:]` memory leak.

## Pitfalls in the code 🔴

- `Delete`'s two-children case calls `min(n.Right)` and then recursively calls `Delete(n.Right, succ.Key)` — a second full traversal down to the successor. This is simple and correct but not maximally efficient; a version that returned the successor's node directly from the same walk that found it would save one traversal, at the cost of more complex code.
- `rotateLeft` and `rotateRight` assume the node being rotated actually has the required child (`n.Right` for `rotateLeft`, `n.Left` for `rotateRight`) — calling `rotateLeft` on a node with no right child panics on nil-pointer dereference. A production balancing algorithm must check this before rotating; this toy relies on its tests only calling rotations where the required child is known to exist.
- `LevelOrder`'s `queue = queue[1:]` re-slicing never reclaims the dropped front elements' backing array space until the whole slice is garbage collected — harmless at this note's scale, but a long-running breadth-first traversal over a very large tree would do better with a proper ring buffer or a slice that's periodically compacted.

## Exercises 🔴

1. **Change this, predict the result:** call `Delete` on a key that doesn't exist in the tree. Predict what `Delete` returns and whether it panics, then verify against the code — does the "not found" case need special handling, or does the existing logic already cover it correctly?
2. **Change this, predict the result:** in `TestHeightDegenerateVsBalanced`, change the degenerate chain to insert `{5, 4, 3, 2, 1}` (descending instead of ascending) instead of `{1, 2, 3, 4, 5}`. Predict the resulting height before running it, and explain which child pointer (`Left` or `Right`) chains this time.
3. **Extend it:** write a `IsValidBST(n *Node) bool` function using the inherited `(min, max)` range technique from the theory note's Deep dive, and a test that constructs a binary tree (not built via `Insert`) that looks locally sorted at every parent-child pair but is *not* a valid BST globally — proving why the naive "check immediate children only" approach is wrong.

## Self-check 🟢🟡

🟢 Easy

> [!question]- Why does `Insert` return a `*Node`?
> The root may change (for example, inserting into an empty tree), so the caller reassigns it.

> [!question]- What does `Height(nil)` return, and why?
> -1, so a single leaf comes out as height 0.

> [!question]- What happens when you insert a duplicate key?
> Nothing; the tree is returned unchanged.

🟡 Medium

> [!question]- After deleting 20, 30 and 50 from the 7-node tree, what does in-order give?
> `[40, 60, 70, 80]`.

> [!question]- Why can't `LevelOrder` be written with the same recursion as the others?
> Row-by-row order needs a queue; recursion naturally follows one branch deep, like a stack.

> [!question]- How does the rotation test prove rotations are safe?
> In-order output stays `[10, 20, 30, 40, 50]` after rotating left and back right.

## Links

- **Theory:** [[Trees, BSTs and Balanced Trees]]
- **Compare with:** [[Storage Engines - B-tree vs LSM and WAL]] (B+trees, the disk-oriented balancing strategy)
