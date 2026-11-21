---
tags: [frontend, css]
level: intermediate
type: implementation
prereqs: ["[[How Browsers Load and Render a Page]]"]
related: ["[[CSS Fundamentals - Cascade, Selectors, Box Model]]", "[[CSS Layout - Position, Flexbox, Grid]]", "[[React Fundamentals - Components, JSX, Props, State]]"]
sources:
  - "MDN, CSS Cascade and Inheritance"
  - "W3C Selectors Level 4, Calculating a selector's specificity"
status: draft
updated: 2026-11-13
---

# CSS Fundamentals - Cascade, Selectors, Box Model - Go

> [!summary] TL;DR
> This code is a small specificity calculator: it parses a CSS compound selector string (like `#nav .item a`) into the `(IDs, classes, types)` triple described in [[CSS Fundamentals - Cascade, Selectors, Box Model]], and compares two triples the same way a browser's cascade does — left-to-right, never summed.

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then "Before the code" and "What this code shows". Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add the "Code" walkthrough and the "Tests" section.
> - 🔴 **Interview / SDE-3 prep?** Add "Design decisions", "Pitfalls" and the "Exercises". Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[How Browsers Load and Render a Page]]: the browser reads CSS rules and decides which one styles each element. That is all you need from it.
> - [[CSS Fundamentals - Cascade, Selectors, Box Model]] (the theory twin): a selector's score is three counters (IDs, classes, tag names) compared left to right. Read its "From zero" part first if that is new.

**From zero, in 60 seconds** 🟢

This file is the hands-on twin of the CSS theory note. In plain words: when two CSS rules fight over the same element, the browser scores each selector with three counters (IDs, classes, tag names) and compares them left to right — it never adds them up. The Go code here builds that scorer: it reads a selector string like `#nav .item a`, counts what is in it, and compares two scores the same way a browser would. Read "Before the code" for the Go bits you need, skim the table of what maps to what, then walk the code top to bottom. All code stays runnable as-is.

## Before the code 🟢

- **Structs** (`type Triple struct{ A, B, C int }`): a named group of fields, here the three specificity counters.
- **Methods with a value receiver** (`func (t Triple) Less(...)`): a function attached to a type, called as `x.Less(y)`. The **receiver** is the `t` before the name: the value the method works on.
- **`switch` with no value** (`switch { case ...: }`): a tidy chain of `if / else if` checks, top to bottom.
- **`strings` package** (`Fields`, `HasPrefix`, `NewReplacer`): split on spaces, check how a string starts, and swap characters.
- **Table-driven tests**: one test loops over a list of input/expected pairs, the usual Go testing style.
- **What to run:** `go vet ./... && go test -race -v ./...` inside the **module** (a folder with a `go.mod` file, Go's unit of code). `go vet` checks for likely bugs; `-race` turns on the **race detector**, which catches two goroutines touching the same data at once. No goroutines, interfaces or generics are needed here.

## What this code shows 🟢

| Code piece | Theory concept it implements | Theory section |
| --- | --- | --- |
| `Triple` struct | the `(a, b, c)` specificity tuple | [[CSS Fundamentals - Cascade, Selectors, Box Model#How it works\|Specificity]] |
| `Triple.Less` | the left-to-right, never-summed comparison rule | [[CSS Fundamentals - Cascade, Selectors, Box Model#Deep dive\|Specificity is not a single number]] |
| `Of` | classifying each token of a selector into the right counter | [[CSS Fundamentals - Cascade, Selectors, Box Model#How it works\|Specificity table]] |
| `splitCompound` | breaking a compound selector like `div.card:hover::before` into its parts | same section |

## Setup 🟢

- Go 1.24, no external dependencies — the standard library's `strings` package only.
- Module layout: a single package, `specificity`, with `specificity.go` and `specificity_test.go` side by side.
- Run it: `go vet ./...` then `go test -race ./...` from the module root.

## Code 🟡

> 🟢 → 🟡 **You now know** what the code is for: score a selector with three counters and compare scores left to right. **Next we open the box** and read the three small pieces that do it: the score type, the parser, and the token splitter.

### The specificity type and its comparison rule

**In plain words:** this is the scoreboard. Three numbers, and a rule that says "compare the first number; only on a tie look at the second; only on another tie look at the third" — like comparing versions 2.1.9 vs 2.2.0.

**Concept.** The theory note's whole point is that specificity is three separate counters compared in order, never added together. `Triple` is that triple, and `Less` is the comparison rule, written exactly as the "compare `a`, then `b`, then `c`" rule reads in prose.

An alternative design would pack all three counts into one integer (e.g. `a*1000 + b*100 + c`), but that silently breaks the moment any counter reaches double digits — encoding each counter as its own field makes that bug impossible to write by accident.

**What this code does, in plain words:** it defines a score with three numbers, A (IDs), B (classes) and C (tag names), and a `Less` function that says "is my score lower than yours?" by checking A first, then B, then C.

```go
package specificity

import "strings"

// Triple is the (a, b, c) specificity tuple. Higher a wins first, then b, then c.
type Triple struct {
	A, B, C int
}

// Less reports whether t is lower specificity than other (loses the cascade fight).
func (t Triple) Less(other Triple) bool {
	if t.A != other.A {
		return t.A < other.A
	}
	if t.B != other.B {
		return t.B < other.B
	}
	return t.C < other.C
}
```

**How it works.**
1. `Triple` has three **exported** (name starts with a capital letter, so code outside the package can use it) `int` fields — exported so test code and callers outside the package can read `A`, `B`, `C` directly for assertions or display.
2. `Less` takes `other Triple` by value, not by pointer: a `Triple` is three small ints, cheap enough to copy, so a pointer would only add **indirection** (an extra hop to find the real value) for no benefit.
3. The three `if`/`return` pairs are the **lexicographic** comparison (compare position by position, like words in a dictionary): it only ever inspects `B` when `A` is exactly equal, and only inspects `C` when both `A` and `B` are equal — mirroring the cascade's own rule that a later round only runs after every earlier round tied.

### Parsing a selector into a triple

**In plain words:** this function reads a selector string character by character and sorts each piece into the right bucket — `#` things count as IDs, `.` things as classes, bare names as tags.

**Concept.** `Of` is the piece that turns a raw selector string into a `Triple`, by walking each compound (the part between **combinators**, the symbols `>`, `+`, `~` and space that join selectors) and classifying each **token** (one small piece, like `.item` or `#nav`) inside it.

The design choice here is a simple character-prefix classifier rather than a full CSS selector grammar parser — a real browser engine's selector parser is considerably more complete (handling escaped characters, nested functional pseudo-classes like `:not()`'s argument, and more), but a prefix classifier is enough to demonstrate the specificity rule itself, which is this note's only goal.

**What this code does, in plain words:** it turns combinators into spaces, splits the selector into compounds, cuts each compound into tokens, and adds 1 to the right counter for each token: `#` adds to IDs; `.`, `[` and `:` add to classes; `::` and bare tag names add to types.

```go
// Of parses one compound selector like "#nav .item a" or "div.card:hover::before"
// and returns its specificity triple. It splits on whitespace and combinators
// first, then classifies each token inside a compound.
func Of(selector string) Triple {
	var t Triple
	selector = strings.NewReplacer(">", " ", "+", " ", "~", " ").Replace(selector)
	for _, part := range strings.Fields(selector) {
		for _, tok := range splitCompound(part) {
			switch {
			case tok == "*":
				// universal selector contributes nothing
			case strings.HasPrefix(tok, "#"):
				t.A++
			case strings.HasPrefix(tok, "."):
				t.B++
			case strings.HasPrefix(tok, "["):
				t.B++
			case strings.HasPrefix(tok, "::"):
				t.C++
			case strings.HasPrefix(tok, ":"):
				t.B++ // pseudo-class, e.g. :hover, :nth-child()
			case tok != "":
				t.C++ // type selector, e.g. div, a, h1
			}
		}
	}
	return t
}
```

**How it works.**
1. `strings.NewReplacer(">", " ", "+", " ", "~", " ")` turns every combinator into a space, so `.card > p` and `.card p` are treated identically — combinators themselves never add to specificity, only the compounds on either side of them do.
2. `strings.Fields` then splits on any whitespace, giving one compound selector per loop iteration (e.g. `#nav`, `.item`, `a` from `#nav .item a`).
3. The `switch` with no condition and `case tok == "*":` etc. is Go's idiomatic stand-in for an if/else-if chain; each `case` is checked top to bottom and the first match wins, which is why `"::"` is checked before the single-colon `":"` case — otherwise every pseudo-element (two colons, a made-up part like `::before`) would be miscounted as a pseudo-class (one colon, a state like `:hover`).
4. The comment on the `case tok != "":` branch flags that this is the fallback: anything left over (a bare tag name) is a type selector.

### Splitting a compound selector into tokens

**In plain words:** before we can count the pieces, we have to cut a glued-together selector like `div.card:hover` into its separate pieces. This helper does the cutting.

**Concept.** `splitCompound` is the helper that turns `div.card:hover::before` into `["div", ".card", ":hover", "::before"]`, so `Of` can classify each piece on its own. It is a hand-rolled scanner rather than a regular expression, chosen so the one subtle rule — don't split `::before`'s two colons apart — is a single, readable `s[i-1] != ':'` check instead of a harder-to-read regex lookbehind (a regular-expression feature that checks what came just before a match).

**What this code does, in plain words:** it walks the string one character at a time and starts a new piece whenever it sees `#`, `.`, `[` or `:`, except when the character before is also `:`, so `::before` stays in one piece.

```go
// splitCompound breaks "div.card:hover::before" into ["div", ".card", ":hover", "::before"].
func splitCompound(s string) []string {
	var toks []string
	start := 0
	for i := 1; i < len(s); i++ {
		c := s[i]
		if (c == '#' || c == '.' || c == '[' || c == ':') && s[i-1] != ':' {
			toks = append(toks, s[start:i])
			start = i
		}
	}
	toks = append(toks, s[start:])
	return toks
}
```

**How it works.**
1. The loop starts at index `1`, not `0`, because the very first character can never be a valid split point — there's nothing before it to close off into a token.
2. A split happens only when the current character opens a new kind of token (`#`, `.`, `[`, `:`) **and** the previous character isn't itself a `:` — that second condition is what keeps `::before`'s two colons together as one token instead of splitting into `:` and `:before`.
3. After the loop, `toks = append(toks, s[start:])` appends whatever token was still being built when the string ended — without this line the last token in every selector would be silently dropped.

> [!example]- Full file
> ```go
> package specificity
>
> import "strings"
>
> // Triple is the (a, b, c) specificity tuple. Higher a wins first, then b, then c.
> type Triple struct {
> 	A, B, C int
> }
>
> // Less reports whether t is lower specificity than other (loses the cascade fight).
> func (t Triple) Less(other Triple) bool {
> 	if t.A != other.A {
> 		return t.A < other.A
> 	}
> 	if t.B != other.B {
> 		return t.B < other.B
> 	}
> 	return t.C < other.C
> }
>
> // Of parses one compound selector like "#nav .item a" or "div.card:hover::before"
> // and returns its specificity triple. It splits on whitespace and combinators
> // first, then classifies each token inside a compound.
> func Of(selector string) Triple {
> 	var t Triple
> 	selector = strings.NewReplacer(">", " ", "+", " ", "~", " ").Replace(selector)
> 	for _, part := range strings.Fields(selector) {
> 		for _, tok := range splitCompound(part) {
> 			switch {
> 			case tok == "*":
> 				// universal selector contributes nothing
> 			case strings.HasPrefix(tok, "#"):
> 				t.A++
> 			case strings.HasPrefix(tok, "."):
> 				t.B++
> 			case strings.HasPrefix(tok, "["):
> 				t.B++
> 			case strings.HasPrefix(tok, "::"):
> 				t.C++
> 			case strings.HasPrefix(tok, ":"):
> 				t.B++ // pseudo-class, e.g. :hover, :nth-child()
> 			case tok != "":
> 				t.C++ // type selector, e.g. div, a, h1
> 			}
> 		}
> 	}
> 	return t
> }
>
> // splitCompound breaks "div.card:hover::before" into ["div", ".card", ":hover", "::before"].
> func splitCompound(s string) []string {
> 	var toks []string
> 	start := 0
> 	for i := 1; i < len(s); i++ {
> 		c := s[i]
> 		if (c == '#' || c == '.' || c == '[' || c == ':') && s[i-1] != ':' {
> 			toks = append(toks, s[start:i])
> 			start = i
> 		}
> 	}
> 	toks = append(toks, s[start:])
> 	return toks
> }
> ```

## Design decisions 🔴

> 🟡 → 🔴 **You now know** how each function works and what the tests prove. **Next is the advanced part**: why the code was built this way instead of other ways, where it is knowingly wrong (`:not()`), and exercises to stretch it.

| Choice made | Alternative | Trade-off |
| --- | --- | --- |
| Three `int` fields on `Triple` | One packed integer (`a*1000+b*100+c`) | The packed form is faster to compare with a single `<`, but silently corrupts once a counter reaches double digits — three fields make that class of bug unrepresentable. |
| Hand-rolled character scanner (`splitCompound`) | `regexp` with a lookbehind-style pattern | Go's `regexp` package (RE2, a regex engine built to always run in linear time) does not support lookbehind at all, so the hand-rolled scanner is not just a style choice here — it is the only straightforward option for the "don't split `::`" rule. |
| Prefix classification (`#`, `.`, `[`, `:`, `::`) | A full CSS selector grammar parser | A real parser handles escaped characters and nested functional pseudo-classes like `:not(.a, .b)` correctly; the prefix classifier is far simpler and sufficient to teach the specificity rule, at the cost of the documented `:not()` inaccuracy below. |
| `Triple` compared with plain `if` statements | `cmp.Compare` / a generic ordering helper | Three explicit `if`s read clearly as "round 1, round 2, round 3" to a reader coming from the theory note's tournament analogy; a generic comparator would be more reusable but less obviously tied to the cascade's own round structure. |

## Tests 🟡

### `TestOf`

**What it proves and why it matters.** That six representative selector shapes — a bare type, a class, an ID-plus-class-plus-type compound, a class-plus-pseudo-class-plus-pseudo-element compound, the universal selector, and a `:not()` compound — each parse to the triple the specificity table in the theory note claims.

This is the test that would catch a classification bug (e.g. counting `::before` as a pseudo-class instead of a pseudo-element).

**What this code does, in plain words:** it keeps a list of (selector, expected score) pairs, runs `Of` on each selector, and fails if any score is different from the expected one.

| Input selector | Expected triple |
| --- | --- |
| `h1` | `(0, 0, 1)` |
| `.btn` | `(0, 1, 0)` |
| `#nav .item a` | `(1, 1, 1)` |
| `div.card:hover::before` | `(0, 2, 2)` |
| `*` | `(0, 0, 0)` |
| `a:not(.disabled)` | `(0, 2, 1)` — see the note on this row below |

```go
func TestOf(t *testing.T) {
	cases := []struct {
		selector string
		want     Triple
	}{
		{"h1", Triple{0, 0, 1}},
		{".btn", Triple{0, 1, 0}},
		{"#nav .item a", Triple{1, 1, 1}},
		{"div.card:hover::before", Triple{0, 2, 2}},
		{"*", Triple{0, 0, 0}},
		// simplified parser: it does not special-case :not(), so both the
		// pseudo-class token and its argument's class count (real engines
		// score only the argument, giving {0,1,1} for this selector).
		{"a:not(.disabled)", Triple{0, 2, 1}},
	}
	for _, c := range cases {
		got := Of(c.selector)
		if got != c.want {
			t.Errorf("Of(%q) = %+v, want %+v", c.selector, got, c.want)
		}
	}
}
```

The `a:not(.disabled)` case is deliberately documented as a known simplification: this parser counts both the `:not` token and its `.disabled` argument as separate class-weight tokens, giving `(0, 2, 1)`, while a real browser engine scores only `:not()`'s argument and ignores the pseudo-class wrapper itself, giving `(0, 1, 1)`.

A failure on this row with any *other* triple would mean the classifier regressed; the `(0, 2, 1)` it currently asserts is this package's known, intentional gap, not the spec-correct answer.

**What a failure would mean.** Any mismatch here means the token classifier (in `Of` or `splitCompound`) mis-sorted at least one token into the wrong counter — for example, if `::before` got classified as a pseudo-class, the `div.card:hover::before` case would report `(0, 3, 1)` instead of `(0, 2, 2)`.

### `TestLessOrdersByIDFirst`

**What it proves and why it matters.** The single most important intuition in the whole theory note: six chained classes still lose to one ID, because the comparison never reaches the class counter while the ID counters still differ.

This is the test that would catch a regression to "add all three counters together" — a summed comparison (`0+6+0=6` vs `1+0+0=1`) would wrongly rank the six classes as more specific.

| Input | IDs | Classes | `Less` result |
| --- | --- | --- | --- |
| `.a.b.c.d.e.f` | 0 | 6 | loses to `#x` |
| `#x` | 1 | 0 | wins |

```go
func TestLessOrdersByIDFirst(t *testing.T) {
	manyClasses := Of(".a.b.c.d.e.f") // 0 IDs, 6 classes
	oneID := Of("#x")                // 1 ID, 0 classes
	if !manyClasses.Less(oneID) {
		t.Fatalf("expected six classes to lose to a single ID, got manyClasses=%+v oneID=%+v", manyClasses, oneID)
	}
}
```

**What a failure would mean.** If this test failed, `Less` would be comparing the wrong field first (or summing the fields), and the whole premise of "one ID beats any number of classes" would no longer hold for this code — exactly the bug the theory note's common-mistake callout warns about.

## Running it 🟢

```sh
$ go vet ./...
$ go test -race ./... -v
```

Measured output (Go 1.24.4, darwin/arm64, 2026-11-09):

```text
=== RUN   TestOf
--- PASS: TestOf (0.00s)
=== RUN   TestLessOrdersByIDFirst
--- PASS: TestLessOrdersByIDFirst (0.00s)
PASS
ok  	csssplit/specificity	1.425s
```

Reading it line by line: `go vet` printed nothing, meaning it found no suspicious constructs (unreachable code, bad format verbs, and so on). Both `RUN`/`PASS` pairs confirm each test function executed and its assertions held.

The final `ok` line with a duration confirms the whole package built and ran clean under the race detector — meaningful here because, while this particular package does no concurrent work, running `-race` on every package is the project-wide habit that catches accidental concurrency bugs early rather than only when they first appear in production.

## Pitfalls in the code 🔴

- `Of` does not special-case `:not()`, so `a:not(.disabled)` over-counts by one class-weight token relative to a real browser's parser (see `TestOf` above) — fine for teaching the general rule, not a drop-in replacement for an actual CSS engine.
- `splitCompound`'s loop starts at index `1` and assumes the string is non-empty; calling `Of("")` returns a zero `Triple` safely because `strings.Fields("")` returns an empty slice, but `splitCompound("")` alone (if called directly) would still append one empty token — harmless here only because `Of` never calls it with an empty string.
- The classifier is case-sensitive only incidentally (it matches on punctuation prefixes, not letters), so it never needs to normalize selector case — but a real selector list with escaped characters (`\.`) or Unicode class names would not parse correctly with this simple scanner.

## Exercises 🔴

1. **Change this:** add a `case` to `Of` that gives `:not(...)` the specificity of only its argument (matching the real CSS spec), rather than counting both the pseudo-class and its argument. Predict which existing test needs its expected value updated before you run it.
2. **Change this:** add a new selector shape to `TestOf`'s table, `"a:is(#x, .y)"`, and predict its triple before running the test. (Hint: this simplified parser does not implement `:is()`'s "take the most specific argument" rule either — what does it actually compute instead?)
3. **Predict the result:** without running it, what does `Of("#a#b")` return? Then run it and check whether the parser handles two IDs in one compound the way you expected.

## Self-check 🟢🟡

> [!question]- Easy: what do the three fields A, B and C of `Triple` count?
> A counts IDs, B counts classes, attributes and pseudo-classes, C counts tag names and pseudo-elements.

> [!question]- Easy: what does `Of("#nav .item a")` return?
> `(1, 1, 1)`: one ID, one class, one tag.

> [!question]- Easy: why does `Of` turn `>`, `+` and `~` into spaces first?
> Combinators add nothing to specificity, so the code only needs the pieces on either side of them.

> [!question]- Medium: why is `"::"` checked before `":"` in the `switch`?
> The first matching case wins. If `":"` came first, `::before` would match it and be counted as a class instead of a type.

> [!question]- Medium: why not store the score as one number like `a*100 + b*10 + c`?
> Once a counter reaches 10 or more it spills into the next digit and gives wrong answers. Three separate fields can never do that.

> [!question]- Medium: this code says `a:not(.disabled)` is (0,2,1). What does a real browser say, and why the gap?
> (0,1,1). A browser counts only what is inside `:not()`, while this simple parser also counts `:not` itself as a class.

## Links 🟢
- **Theory:** [[CSS Fundamentals - Cascade, Selectors, Box Model]]
- **Related:** [[CSS Layout - Position, Flexbox, Grid]], [[React Fundamentals - Components, JSX, Props, State]]
