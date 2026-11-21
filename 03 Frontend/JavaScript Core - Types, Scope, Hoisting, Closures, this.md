---
tags: [frontend, javascript, language-fundamentals]
level: intermediate
prereqs: []
related: ["[[JavaScript Core - Types, Scope, Hoisting, Closures, this - Go]]", "[[JavaScript Objects, Arrays and Iteration]]", "[[DOM, Events and Timers]]", "[[Syntax, Types and Control Flow]]"]
sources:
  - "ECMA-262 (ECMAScript Language Specification), sections on Let and Const Declarations, Lexical Environments"
  - "MDN Web Docs: Closures, this, Hoisting"
status: reviewed
updated: 2026-11-13
---

# JavaScript Core - Types, Scope, Hoisting, Closures, this

> [!summary] TL;DR
> JavaScript has two kinds of values — **primitives** (copied) and **references** (shared) — and three ways to declare a variable (`var`, `let`, `const`), each with different scope and hoisting rules.
>
> A **closure** is a function that keeps access to the variables of the scope it was created in, even after that scope has returned. `this` is not fixed by where a function is written; it depends on how the function is *called*.

> [!abstract] Core idea
> - Assigning a primitive copies a value; assigning an object, array or function copies a reference to the same thing.
> - `let` and `const` are block-scoped and sit in a **temporal dead zone** until their line runs; `var` is function-scoped and initialized to `undefined` early.
> - Every function remembers the scope chain of where it was *defined*, not where it is called — that's what makes a closure work.
> - `this` is decided at call time by one of five rules: default, implicit (method call), explicit (`call`/`apply`/`bind`), `new`, or lexical (arrow functions borrow `this` from where they were written).

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works) and 4 (worked example, closures and `this`).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - Nothing. This note starts from zero. It helps if you have seen any programming language before, but every idea is explained here.

**From zero, in 60 seconds** 🟢

JavaScript stores values in named boxes called **variables**. Simple values like numbers and text are copied when you assign them to a new box. Objects and arrays are not copied. Both boxes just point at the same thing.

```mermaid
flowchart LR
    A["let b = a (a number)"] --> B["b gets its OWN copy"]
    C["const y = x (an array)"] --> D["y points at the SAME array"]
```

A variable also has a home: the part of code where it can be seen. That home is called its **scope**. A function never forgets the scope it was born in, even after that scope finishes. A function that still remembers those outside variables is a **closure**.

```mermaid
flowchart LR
    M["makeCounter() runs and returns"] --> F["the returned function"]
    F -- "still remembers" --> V["count = 0, 1, 2..."]
```

Last piece: inside a function, the word `this` means "the object I was called on". It is decided when the function is called, not when it is written.

The rest of this note is just these 4 questions:
1. When does assigning copy, and when does it share?
2. Where can each variable be seen, and why does `var` behave oddly?
3. How do closures remember things?
4. What does `this` point to in each kind of call?


**The problem in one story.**
You copy an array into a new variable, change the copy, and the original changes too.
A button's click handler prints the wrong loop number.
A method loses its `this` when you pass it as a callback.
All three surprises come from a few core rules about values, scope and `this`.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Variable | A name that points to a value | `let n = 5` |
| Primitive | A simple value that is copied when assigned | `5`, `"hi"`, `true` |
| Reference (object) | A value stored once; variables hold a pointer to it | `const a = [1]; const b = a` |
| Scope | Where in the code a name can be seen | A `let` inside `{}` is invisible outside |
| Hoisting | Declarations being set up before the code runs | Calling a `function` above its definition works |
| Closure | A function that remembers the variables around where it was written | A counter function keeping its own `count` |
| `this` | The object a function is called on, decided at call time | In `user.greet()`, `this` is `user` |
| Block | Any code between `{` and `}` | the body of an `if` or a `for` |
| Temporal dead zone (TDZ) | The lines before a `let`/`const` line, where reading that name throws an error | `log(y); let y = 1;` throws |
| Heap | The memory area where objects, arrays and functions live | `[1,2,3]` sits in the heap |
| Binding | The link between a name and what it points to | `const a = [1]` binds `a` to that array |
| Immutable | Cannot be changed after it is made | strings: `"hi".toUpperCase()` makes a new string |
| Strict mode | A safer JS mode that turns silent mistakes into errors | `"use strict";` or any ES module |

**Picture it**

```mermaid
flowchart LR
    N["Code uses name x"] --> L{"In current<br/>scope?"}
    L -- "yes" --> F["Use it"]
    L -- "no" --> P{"In outer scope<br/>(where function<br/>was defined)?"}
    P -- "yes" --> F
    P -- "no, reached global" --> X["ReferenceError"]
```

**Analogy.** Scope is like nested rooms: from inside a small room you can see things in the bigger rooms around it, but not into smaller rooms next door. A closure is a room you carry with you, furniture included.
Where it breaks: real rooms are copied when you move; a closure shares the live variables, so later changes are visible.

**How the rest of this note builds up**

- First, why JavaScript works this way and a mental model (sections 1-2).
- Then primitives vs references, `var`/`let`/`const` with hoisting and the temporal dead zone, the scope chain and strings (section 3).
- Then closures (counter, memoize, the loop-capture bug) and the five rules for `this` (section 4).
- Finally variants, trade-offs, production practice and the deep dive, then interview questions (sections 5-9).

> [!tip] Remember
> Primitives copy, objects share; names resolve where code is written; `this` is decided where code is called.

## 1. Why it exists 🟢

JavaScript runs inside a browser tab (or Node) with no separate **compile step** (a check-and-translate pass before the program runs, like Go has) for most of its life: a script loads, and the **engine** (the program that runs JS, like Chrome's V8) has to decide, line by line, what a name refers to and what each value is. That requirement shapes three design choices that still surprise people today:

- **Dynamic, weak typing.** A variable isn't tied to one type, so `let x = 5` can later hold a string. This gives flexibility for quick scripts but means type mistakes are allowed to run instead of surfacing at compile time — unlike Go, where `var x int` can never hold a string.
- **Three variable keywords instead of one.** `var` existed from 1995. `let` and `const` arrived in ES2015 (the 2015 edition of the JavaScript standard) specifically to fix two problems with `var`: it ignores block boundaries, and it provides no way to say "this name must not be reassigned."
- **`this` decided per call, not per function.** JavaScript functions are reusable as both plain functions and object methods. The same function body needs a different notion of "the current object" depending on how it is invoked — that is what the `this` binding rules exist to resolve.

Example: a shopping cart's `applyDiscount` function is a plain function in one file and a method on a `Cart` object in another. If `this` were fixed at definition time, one of those two uses would always be broken.

### Real-life example: a food cart that changes by itself 🟢

Say a food app keeps your cart as an array: `const cart = ["Dosa"]`.
A "suggested combo" feature does `const combo = cart;` and then `combo.push("Coffee")`.
Now your real cart also has Coffee in it, because both names point at the same array.
The fix is to copy first: `const combo = [...cart]`.
The app's "items left" counter is a closure: one function that remembers its own private `count` between taps.

## Common beginner mistakes 🟢

- **Thinking `const` makes an array read-only** → `const arr = []; arr.push(1)` works fine → `const` only stops you pointing the name at something else; use `Object.freeze` if you need read-only.
- **Copying an object with `=`** → both names share one object, so a change through one shows in the other → copy with `{ ...obj }` or `structuredClone(obj)`.
- **Using `var` in a loop with callbacks** → every callback sees the last value (3, 3, 3) → use `let`, which gives each loop turn its own variable.
- **Passing `obj.method` as a callback** → `this` is lost and you get `undefined` errors → pass `() => obj.method()` or `obj.method.bind(obj)`.
- **Using `==`** → `[] == false` is `true` and other surprises → always use `===`.

## Often confused 🟡

| These two | First one | Second one |
| --- | --- | --- |
| `==` vs `===` | Converts types first, then compares | Never converts; types must match |
| Shallow vs deep copy | Copies the top level; nested objects are still shared | Copies everything, all the way down |
| Normal vs arrow function | `this` decided by how it is called | `this` borrowed from where it was written |
| `undefined` vs `null` | "No value yet", set by JS itself | "No value on purpose", set by you |

## 2. Mental model 🟢

Think of the JavaScript engine as one **call stack** (who is running what, right now) plus a **heap** (where objects, arrays and functions live). A variable is either:

- a **box holding a value directly** (primitive: number, string, boolean, `null`, `undefined`, `symbol`, `bigint`), or
- a **box holding an address**, pointing at something in the heap (reference: object, array, function).

Copying a primitive box copies the value inside it. Copying a reference box copies the address — both boxes now point at the same heap object.

Scope is a set of nested boxes-within-boxes: the global scope contains every top-level function's scope, which contains every block inside it. Looking up a variable walks outward through these boxes until it finds a match — that walk is the **scope chain**.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that simple values copy and objects share, that every name has a scope, and that `this` depends on the call. **Next we open the box**: the exact list of types, how each keyword is set up before code runs, how a name is looked up, and why strings never change in place.

### Primitive vs reference types

**Step by step:**
1. `let a = 5; let b = a;` gives `b` its own 5. Then `b = 6;` leaves `a` at 5.
2. `const arr1 = [1, 2, 3];` puts the array in the heap and stores its address in `arr1`.
3. `const arr2 = arr1;` copies the address, not the array.
4. `arr2.push(4);` changes the one array, so `arr1` now shows `[1, 2, 3, 4]` too.
5. To get a separate array, write `const arr3 = [...arr1];`.

JavaScript has exactly 7 primitive types plus `object` (which covers arrays and functions too):

| Primitive | Example | Notes |
| --- | --- | --- |
| `number` | `42`, `3.14` | One IEEE-754 double (the standard 64-bit decimal-point number format) for every number; see "Deep dive" |
| `string` | `"hi"` | Immutable; every "mutating" method returns a new string |
| `boolean` | `true` | |
| `undefined` | `let x;` | The default value of an unassigned variable |
| `null` | `null` | An explicit "no value"; `typeof null === "object"` is a 1995 bug kept for compatibility |
| `symbol` | `Symbol("id")` | Every call to `Symbol()` produces a unique value, even with the same description |
| `bigint` | `10n` | Arbitrary-precision integers (whole numbers of any size, with no rounding), suffixed with `n` |

There is no separate "default values" heading to memorize — `undefined` is simply what an uninitialized `let`/`var` holds, and the other types have no implicit default; you must assign them.

**In plain words:** a primitive variable is a box that holds its value directly; a reference variable (object, array, function) is a box that holds an address pointing somewhere else in memory. Copying the first box copies the value inside it; copying the second box copies the address, so both boxes now point at the same thing.

**Picture it:**

```mermaid
flowchart LR
    subgraph Primitive["Primitive: let b = a"]
        A1["a: 5"]
        B1["b: 5 (own copy)"]
    end
    subgraph Reference["Reference: const arr2 = arr1"]
        A2["arr1 (box holding an address)"] --> H["heap: [1,2,3,4]"]
        B2["arr2 (box holding the SAME address)"] --> H
    end
```

**Analogy:** a primitive is like writing a number on your own sticky note — changing your note doesn't touch anyone else's. A reference is like two people holding the same locker key — whoever opens the locker and rearranges what's inside, both people see the new arrangement, because there's only ever one locker.

Assignment and function arguments **copy the value** for primitives and **copy the reference** for objects/arrays/functions:

```js
let a = 5;
let b = a;      // b gets a copy of 5
b = 10;
console.log(a); // 5 — untouched

const arr1 = [1, 2, 3];
const arr2 = arr1;  // arr2 gets the SAME reference
arr2.push(4);
console.log(arr1);  // [1, 2, 3, 4] — arr1 sees the mutation too
```

`const` freezes the **binding**, not the value: `const arr1 = [...]` means `arr1` can never point at a different array, but the array's contents can still change. Equality (`===`) on objects compares **identity** (is it the very same object in memory?), not contents:

```js
console.log({ a: 1 } === { a: 1 }); // false — two different objects
console.log(Symbol("id") === Symbol("id")); // false — every symbol is unique
```

To copy an object instead of sharing it: `{ ...obj }` or `Object.assign({}, obj)` for a **shallow** copy (nested objects are still shared), or `structuredClone(obj)` for a **deep** copy. `Object.freeze(obj)` is also shallow — it stops reassigning the top-level keys, not mutating a nested object inside one of them.

One more size of primitive matters for correctness: `number` is a 64-bit float, so integers are only exact up to `Number.MAX_SAFE_INTEGER` (`2^53 − 1`). Past that, `9007199254740993 === 9007199254740992` is true because both round to the same float. Use `BigInt` (`123n`) when you need an exact integer larger than that.

### var vs let vs const, hoisting and the temporal dead zone

**In plain words:** `var`, `let` and `const` are three ways to create a variable, and the engine sets each one up differently before your code runs. Think of it as the engine reading the whole room before the party starts: `var` guests get a name tag that says "undefined", `let`/`const` guests are on the list but not allowed in until their line runs.

**Step by step:**
1. Before a function runs, the engine scans it and finds `var x`, `let y` and `const z`.
2. It creates `x` and sets it to `undefined` right away.
3. It creates `y` and `z` but leaves them empty (in the TDZ).
4. Line 1 does `console.log(x)`: prints `undefined`. Line 2 does `console.log(y)`: throws a `ReferenceError`.
5. When the `let y = 5;` line runs, `y` leaves the TDZ and can be used.

**Hoisting** means the engine scans a scope before running it and sets up its variables in advance. What "set up" means differs sharply by keyword:

| | Hoisted? | Initial value | Scope | Reassign | Redeclare |
| --- | --- | --- | --- | --- | --- |
| `var` | Yes | `undefined` | function | Yes | Yes |
| `let` | Yes (but see TDZ) | *none* — throws if read | block | Yes | No |
| `const` | Yes (but see TDZ) | *none* — throws if read | block | No | No |
| `function decl.` | Yes, whole body | the function itself | block (function-scoped in **sloppy mode**, the old non-strict default) | Yes | Yes |

```js
console.log(x); // undefined — var is hoisted and pre-initialized
var x = 5;

console.log(addOne(1)); // 2 — function declarations hoist their entire body
function addOne(n) { return n + 1; }
```

`let` and `const` are also hoisted — the engine knows they exist — but they are **not initialized**. The gap between the top of the scope and the line that declares them is the **temporal dead zone (TDZ)**. Reading the name anywhere in the TDZ throws, it does not silently return `undefined` and it does not silently work:

```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

addTwo(5);                       // ReferenceError — addTwo is in its TDZ here
const addTwo = (n) => n + 2;
```

This is the single most common misreading of hoisting: people say "`let`/`const` are not hoisted", but they are — they just aren't initialized, so touching them early is a hard error instead of an `undefined`.

`var`'s function scope is also a common bug source: a `var` declared inside an `if` block leaks into the whole function, while `let`/`const` stay confined to the block.

**Picture it — the same scope, read top to bottom, for each keyword:**

```mermaid
flowchart TD
    subgraph varFlow["var x"]
        direction TB
        v1["top of scope: x exists, = undefined"] --> v2["console.log(x): undefined"] --> v3["var x = 5 runs"] --> v4["console.log(x): 5"]
    end
    subgraph letFlow["let y (temporal dead zone)"]
        direction TB
        l1["top of scope: y exists, UNINITIALIZED"] --> l2["console.log(y): ReferenceError (TDZ)"] --> l3["let y = 5 runs: TDZ ends"] --> l4["console.log(y): 5"]
    end
```

**Example:** a function with 20 lines before a `let total = 0;` declaration has a TDZ spanning all 20 lines — any accidental read of `total` in those lines throws immediately at that line, during development, instead of silently computing with `undefined` and producing a wrong number much later.

> [!tip] Remember
> Hoisted ≠ initialized. `var` is hoisted *and* pre-filled with `undefined`. `let`/`const` are hoisted but left empty (the TDZ) until their line actually runs.

Assigning to a name with no declaration at all (`accountCity = "Jaipur"`) silently creates an **implicit global** in sloppy mode — it becomes a property of the **global object** (`window` in a browser, `globalThis` everywhere), reachable from anywhere, and is a frequent source of bugs that only show up once two unrelated files happen to use the same name.

**Strict mode** (`"use strict"`, automatic inside **ES modules**, meaning files that use `import`/`export`, and `class` bodies) turns that same line into a `ReferenceError` instead, which is why "declare before you assign" is enforced rather than just recommended in modern code.

### Scope chain

**In plain words:** when code uses a name, the engine looks in the nearest set of braces first, then walks outward room by room until it finds it. The rooms are fixed by where the code was written, not by who called it.

**Step by step:**
1. `function one() { const h = "user"; function two() { const w = "abc"; log(h, w); } two(); }`
2. Inside `two`, the engine needs `w`. It is in `two`'s own scope: found.
3. It needs `h`. Not in `two`, so it walks out to `one`, where `two` was written: found.
4. Code inside `one` asks for `w`. `one` cannot look inward into `two`, so it is not found.
5. If a name is not found even at the global level, you get a `ReferenceError`.

Every function remembers the scope it was **defined** in, not the scope it is called from — this is called **lexical scoping**. A name lookup walks outward: block → enclosing function(s) → module/global, stopping at the first match.

Scope nests in four layers: **global** (the whole script or, in a module, nothing automatically shared), **module** (each ES module file has its own top-level scope — nothing is global unless explicitly attached to `window`/`globalThis`), **function**, and **block** (`{ }`, including `if`/`for` bodies, for `let`/`const` only).

```mermaid
flowchart TD
    G["Global scope: h is not visible here"] --> O["one() scope: const h = 'user'"]
    O --> T["two() scope: const w = 'abc'<br/>can read h (outer) and w (own)"]
    O -. "one() cannot read w: it only exists inside two()" .-> O
```

```js
function one() {
  const h = "user";
  function two() {
    const w = "abc";
    console.log(h); // "user" — found by walking out to one()'s scope
  }
  two();
  console.log(w); // ReferenceError: w is not defined — w never existed out here
}
one();
```

### Strings

**In plain words:** a string is a piece of text you can never edit in place; every "change" quietly hands you a brand-new string, like getting a reprinted ticket instead of a corrected one.

**Step by step:**
1. `const s = "delhi";`
2. `s.toUpperCase()` returns a new string `"DELHI"`. `s` is still `"delhi"`.
3. To keep the change you must store it: `const big = s.toUpperCase();`.
4. `s.length` is 5, because each letter is one unit here. An emoji like 😀 counts as 2.

Strings are an immutable primitive: every "mutating-looking" method (`slice`, `toUpperCase`, `replaceAll`, `trim`) returns a **new** string and leaves the original untouched.

```js
const name = "Priyanshu";
const city = "Delhi";
const message = `Hello ${name}, ${city} has ${message?.length ?? 0} chars`; // template literal
```

A gotcha worth knowing before you hit it: JavaScript strings are UTF-16 (a text encoding that stores most characters in 16 bits), and `.length` counts 16-bit **code units**, not characters. An emoji outside the Basic Multilingual Plane (the first 65,536 characters, which covers most languages) is 2 code units:

```js
console.log("😀".length);        // 2, not 1
console.log([..."😀"].length);   // 1 — spread iterates by code point
```

Useful methods: `slice(start, end)` (negative indices count from the end; prefer it over `substring`, which swaps backwards args instead of erroring), `split`/`join`, `includes`, `padStart`, `trim`. For ordering strings for a user, use `localeCompare`, not `<`, which compares by raw code unit.

Converting to/from numbers: `Number("42")` (strict; `Number("42px")` is `NaN`) vs `parseInt("42px", 10)` (parses a leading number; always pass the **radix**, the number base, 10 for normal decimal).

This contrasts with Go, where a string is an immutable sequence of bytes, `len(s)` counts bytes (not **runes**, Go's word for one character), and you range over it to get one rune at a time.

## 4. Worked example 🟡

### Whiteboard version

A closure is just a function plus the variables it still remembers:

```js
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2 — same captured `count`, not a fresh one
```

`counter` keeps a live reference to `count` even though `makeCounter` already returned. That's the whole mechanism: nothing special happens at call time, the returned function simply never lost its scope chain.

### Closures: counter, memoize, and the loop-capture bug

**In plain words:** a closure is a function carrying a backpack of the variables around it. `memoize` below uses that backpack to keep a private answer cache nobody else can touch.

```js
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const slowSquare = (n) => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(5); // computes, caches
fastSquare(5); // returns the cached 25 instantly
```

The classic closure bug — and why `let` fixed it:

```js
// With var: all three callbacks share ONE i, which is 3 by the time they run.
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // prints 3, 3, 3
}

// With let: each iteration gets its OWN i, captured independently.
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // prints 0, 1, 2
}
```

Go's `for` loop had the identical bug until **Go 1.22**, which changed loop variables to be per-iteration by default — the same fix `let` gives JavaScript.

> [!tip] Remember
> `var` in a loop shares one variable across every closure created in that loop; `let` (and, since Go 1.22, Go's own `for`) gives each iteration its own copy.

**Picture it:**

```mermaid
flowchart LR
    subgraph Var["var i (shared)"]
        direction TB
        V1["iteration 1: writes i=1"] --> V2["iteration 2: writes i=2"] --> V3["iteration 3: writes i=3"]
        V3 --> VC["all 3 closures read the SAME i: 3, 3, 3"]
    end
    subgraph Let["let j (per-iteration)"]
        direction TB
        L1["iteration 1: own j=0"]
        L2["iteration 2: own j=1"]
        L3["iteration 3: own j=2"]
        L1 --> C1["closure 1 reads its own j: 0"]
        L2 --> C2["closure 2 reads its own j: 1"]
        L3 --> C3["closure 3 reads its own j: 2"]
    end
```

### Functions and `this`

**In plain words:** JavaScript gives you three ways to write a function, and `this` inside one is like the word "home" — it means a different place depending on who says it and how they were called.

JavaScript has three ways to write a function, and they hoist differently:

```js
function addTwoNumbers(a, b) { return a + b; }          // declaration: hoisted whole
const multiply = function (a, b) { return a * b; };     // expression: name hoisted, value is not (TDZ with let/const)
const add = (a, b) => a + b;                             // arrow: implicit return for a single expression; needs `return` and braces otherwise

(function dbConnect() {        // IIFE: runs immediately, keeps its locals private
  console.log("connected");
})();
```

Parameters take **defaults** and a trailing **rest** parameter; arrow functions have no `arguments` object of their own (use rest instead):

```js
function charge(amount, currency = "INR", ...extraFees) { /* currency defaults if omitted; extraFees collects the rest */ }
const sum = (...nums) => nums.reduce((a, n) => a + n, 0); // arrows must use rest; `arguments` is not defined inside them
```

Functions are **first-class values** in JavaScript: they can be stored in a variable, passed as an argument (a **callback**) or returned from another function (making it a **higher-order function**, like `memoize` above).

That's also why IIFEs (Immediately Invoked Function Expressions: a function defined and called in one go, `(function(){ ... })()`) mattered before ES modules (2015): a module gives every file its own private scope and exported names natively, so wrapping code in an IIFE "just to avoid leaking globals" is now mostly a legacy pattern.

A **pure function** — same input always gives the same output, no mutation of anything outside itself — is easier to test and memoize than one with side effects (an API call, a DOM write, mutating an argument); most of the examples above (`add`, `Map`/`Filter`/`Reduce` below) are pure on purpose.

Every function call pushes a frame onto the call stack; a function that calls itself (**recursion**) needs a base case or it overflows the stack — JavaScript has no built-in **tail-call elimination** (reusing the stack frame when the last thing a function does is call itself) in practice, so a deep recursive scan over a huge tree is usually rewritten as a loop.

`this` is resolved by **how a function is called**, using the first rule that matches:

```mermaid
flowchart TD
    Call["How was the function called?"] --> New{"with `new`?"}
    New -- yes --> NewR["this = the newly created object"]
    New -- no --> Bind{"called via call/apply/bind?"}
    Bind -- yes --> BindR["this = the object you passed"]
    Bind -- no --> Method{"called as obj.method()?"}
    Method -- yes --> MethodR["this = obj (implicit binding)"]
    Method -- no --> Arrow{"is it an arrow function?"}
    Arrow -- yes --> ArrowR["this = whatever `this` was in the enclosing scope (lexical, fixed at definition)"]
    Arrow -- no --> DefaultR["this = undefined in strict mode / the global object in sloppy mode (default binding)"]
```

```js
const jsUser = {
  name: "Hitesh",
  greet() { console.log(this.name); },       // implicit: this = jsUser
  greetArrow: () => console.log(this?.name), // lexical: this is NOT jsUser here
};
jsUser.greet();      // "Hitesh"
jsUser.greetArrow(); // undefined — the arrow captured `this` from the module scope, not jsUser

const loose = jsUser.greet;
loose();             // TypeError-ish: this is undefined in strict mode, so this.name throws

const bound = jsUser.greet.bind(jsUser);
bound();             // "Hitesh" — explicit binding wins
```

The owner's original mistake to avoid: `console.log(jsUser.greet())` logs `undefined` directly after printing `"Hitesh"` — not because `greet` failed, but because `greet` has no `return` statement, so it implicitly returns `undefined`, and `console.log` then prints that `undefined`.

Runnable Go version: [[JavaScript Core - Types, Scope, Hoisting, Closures, this - Go]].

## 5. Variants and comparison 🟡

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| `const` | Block-scoped, TDZ, binding cannot be reassigned | Your default choice for every declaration | None — prevents a class of bugs |
| `let` | Block-scoped, TDZ, reassignable | The variable's value genuinely changes (loop counters, accumulators) | None |
| `var` | Function-scoped, hoisted and pre-initialized to `undefined` | Legacy code only | Leaks across blocks; the loop-capture bug; redeclare hides mistakes |
| Function declaration | Hoisted with its whole body | A named function usable before its definition appears | None |
| Function expression / arrow | Hoisted as `undefined`/TDZ, not callable before the line runs | Callbacks, class fields, anything needing lexical `this` | Must be defined before use |

## 6. Trade-offs and when not to use 🟡

- `var` is never a feature you reach for anymore; it costs you block scoping and the TDZ safety net for no benefit.
- Lexical `this` in arrow functions is a problem, not a feature, when you *want* dynamic `this` — don't use an arrow for an object method you intend to call as `obj.method()`.
- Closures retain their whole enclosing scope, not just the variable they use; holding a large object in an outer scope that a long-lived closure captures can keep it from being garbage collected (see "Deep dive").
- Dynamic typing means a typo'd property name (`usr.naem`) is `undefined` at runtime instead of a compile error; TypeScript exists largely to put that check back.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** the core rules for values, scope, hoisting, closures and `this`. **Next is the advanced part**: the tools and lint rules teams use to enforce them, the production bugs they cause, and the engine-level details (prototypes, number precision, garbage collection, coercion) that interviews dig into.

- **Real systems:** ESLint's (a **linter**: a tool that flags risky code patterns) `no-var` and `prefer-const` rules are standard in almost every production JS codebase; bundlers (esbuild, Vite, webpack) and **transpilers** (tools that rewrite modern JS into older JS, like Babel and SWC) all assume `let`/`const` scoping when they rewrite code.
- **Failure modes → fixes:**
  - "Works in testing, breaks under load" closures holding references to large cached objects → scope the closure to only what it needs, or null out references when done.
  - A `TypeError: Cannot read properties of undefined` after passing a method as a callback (`setTimeout(obj.method, 0)`) → the implicit binding was lost; use `obj.method.bind(obj)` or an arrow wrapper `() => obj.method()`.
  - "`ReferenceError` only in production, not locally" from TDZ → usually a module load-order issue; check circular imports.
- **What to monitor:** linter CI (the automatic checks that run on every code change) failures on `no-var`/`eqeqeq`; bundle size growth from accidentally retained closures (profile with Chrome DevTools' **heap snapshot**, a picture of every object in memory, looking for detached scope chains).

## 8. Deep dive 🔴

- **Prototype chain.** Every object has an internal link (`[[Prototype]]`, exposed as `Object.getPrototypeOf(obj)`) to another object, forming a chain that ends at `Object.prototype` and then `null`. Property lookup walks this chain just like scope lookup walks the scope chain. `class` syntax is sugar over this: `class Dog {}` creates a constructor function whose `.prototype` instances delegate to.

  **Picture it:**

  ```mermaid
  flowchart LR
      D["instance: a Dog, has own property 'name'"] -- "internal Prototype link" --> DP["Dog.prototype: has 'bark()'"]
      DP -- "internal Prototype link" --> OP["Object.prototype: has 'toString()', 'hasOwnProperty()'"]
      OP -- "internal Prototype link" --> N["null: chain ends here"]
  ```

  **Example:** reading `myDog.name` finds it immediately on the instance (no walk needed). Reading `myDog.bark()` doesn't find `bark` on the instance, so the engine walks up to `Dog.prototype` and finds it there. Reading `myDog.toString()` walks two links up, past `Dog.prototype`, to `Object.prototype` — exactly the same kind of outward walk a scope-chain lookup does for a variable name, just over objects instead of scopes.
- **Autoboxing.** `"a".toUpperCase()` works even though strings are primitives, because the engine temporarily wraps the primitive in a `String` object, calls the method, and discards the wrapper.
- **Number precision.** `number` is IEEE-754 double precision. Integers are exact up to `2^53 − 1` (`Number.MAX_SAFE_INTEGER`); beyond that, distinct integers can compare equal. `0.1 + 0.2 !== 0.3` for the same reason — neither value has an exact binary float representation.
- **GC and closures.** (GC, garbage collection: the engine freeing memory nobody can reach any more.) A closure keeps its entire enclosing lexical environment alive as long as the closure itself is reachable, not just the variables it references — V8 does scope-analysis optimizations to shrink this in common cases, but a closure captured inside a long-lived event listener is a classic memory-leak source.
- **Equality coercion.** (Coercion: JS quietly converting a value to another type.) `==` converts operands to a common type before comparing; `===` never converts. Memorize the two true surprises: `null == undefined` is `true` (but `null === undefined` is `false`), and `[] == false` is `true` (`[]` coerces to `""`, then to `0`). A sharper trap: relational operators (`<`, `>`, `>=`) coerce `null` straight to `0`, so `null >= 0` is `true`, while `==` special-cases `null` to compare equal only to `undefined`, so `null == 0` is `false` — two different coercion rules applied to the same value. Prefer `===` always and let `== null` be the one deliberate exception for "null or undefined".
- **Currying.** Splitting a multi-argument function into a chain of single-argument functions — `const add = (a) => (b) => a + b; add(2)(3)` — lets you fix some arguments early (`const add5 = add(5)`) and supply the rest later; useful for building specialized callbacks, but reach for it only when it actually simplifies the call site.

## 9. Interview questions 🔴

> [!question]- Why does `const x = 1; console.log(x);` on the next line throw if `x` was declared earlier in the same block with `let`?
> It's the temporal dead zone: `let`/`const` are hoisted (the engine knows the name exists) but not initialized until their declaration line runs. Reading the name before that line throws a `ReferenceError` — it never silently returns `undefined` and never silently "just works" the way `var` would.

> [!question]- What is the difference between a primitive and a reference type in an assignment?
> Assigning a primitive (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) copies the value — the two variables are independent afterward. Assigning an object, array or function copies a reference — both variables point at the same heap object, so mutating through one is visible through the other.

> [!question]- Trap: does `const arr = [1,2,3]; arr.push(4);` throw, since `arr` is `const`?
> No. `const` only freezes the *binding* — `arr` can never be reassigned to point at a different array — but the array's contents are still mutable. `arr.push(4)` mutates the same array `arr` already points to, which is allowed.

> [!question]- What does a closure capture: the value of a variable, or the variable itself?
> The variable itself (by reference), not a snapshot of its value at the time the closure was created. That's why `makeCounter()`'s returned function sees `count` grow across calls, and why the classic `var` loop-capture bug happens — all iterations shared one variable.

> [!question]- How does `this` get decided inside an arrow function versus a normal function?
> A normal function's `this` is set by how it's called (default, implicit via `obj.method()`, explicit via `call`/`apply`/`bind`, or the new object with `new`). An arrow function has no `this` of its own — it looks up `this` lexically, the same way it looks up any other variable, fixed to whatever `this` was where the arrow was written.

> [!question]- Why does `var` inside an `if` block leak outside the block, but `let` doesn't?
> `var` is function-scoped: it only respects function boundaries, so any `var` inside an `if`, `for`, or other block is hoisted to the top of the enclosing function. `let`/`const` are block-scoped: they stay confined to the nearest `{ }`.

> [!question]- What is `typeof null`, and why?
> `"object"`. It's a bug from the first JavaScript implementation in 1995 (values were tagged, and the tag for objects happened to be all zero bits, which is also how `null` was represented) that shipped too widely to ever fix without breaking the web.

## 10. Cheat sheet 🟢

- Primitive assignment copies the value; object/array/function assignment copies the reference.
- `const` by default, `let` when reassigned, never `var` in new code.
- `let`/`const` are hoisted but uninitialized (TDZ): reading them early throws, it doesn't silently work.
- `var` is function-scoped and pre-initialized to `undefined`; `let`/`const` are block-scoped.
- A closure keeps a live reference to its enclosing scope's variables, not a copy of their values.
- `this`: `new` > explicit (`call`/`apply`/`bind`) > implicit (`obj.method()`) > default; arrows ignore all of this and use lexical `this`.
- `===`/`==`: always prefer `===`; the only common safe use of `==` is `x == null` to catch both `null` and `undefined`.

## Self-check 🟢🟡

> [!question]- Easy: `let a = 5; let b = a; b = 9;` What is `a`?
> 5. Numbers are primitives, so `b` got its own copy.

> [!question]- Easy: which keyword should be your default for new variables?
> `const`. Use `let` only when the value must change; avoid `var`.

> [!question]- Easy: in `user.greet()`, what is `this` inside `greet`?
> `user`, the object before the dot.

> [!question]- Medium: what does `console.log(y); let y = 1;` do, and why?
> It throws a `ReferenceError`. `y` is hoisted but not set up yet (TDZ) until its line runs.

> [!question]- Medium: a loop with `var i` sets three `setTimeout`s that print `i`. Output, and fix?
> 3, 3, 3. All callbacks share one `i`. Use `let i` so each turn has its own.

> [!question]- Medium: why does `setTimeout(obj.show, 0)` lose `this`?
> The function is called on its own, not as `obj.show()`, so the default rule applies. Wrap it: `() => obj.show()`.

## Links

- **Before this:** [[How Browsers Load and Render a Page]]
- **Next:** [[JavaScript Objects, Arrays and Iteration]], [[JavaScript Async - Event Loop, Promises, async-await]]
- **Compare with:** [[Syntax, Types and Control Flow]] (Go's static typing and fixed zero values vs JS's dynamic typing and `undefined`)
- **Go code:** [[JavaScript Core - Types, Scope, Hoisting, Closures, this - Go]]

### Watch on YouTube

- [Closures in JS 🔥 / Namaste JavaScript Episode 10](https://www.youtube.com/watch?v=qikxEIxsXco) · Akshay Saini · widely-used deep dive on closures and lexical scope for interviews
- [Javascript Hoisting Explained](https://www.youtube.com/watch?v=aT1WFBmHstw) · DevSage · focused explanation of var/let/const hoisting and the TDZ
- [Javascript this keyword explained / in Gloable Scope, Object, Function, Prototype, Method, Class](https://www.youtube.com/watch?v=NV9sHLX-jZU) · techsith · covers all five binding rules for `this` with examples
