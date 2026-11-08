---
tags: [cs-fundamentals, computer-architecture, compilers]
level: intermediate
status: reviewed
prereqs: []
related: ["[[Memory Hierarchy and CPU Caches]]", "[[Processes, Threads and Context Switching]]", "[[System Calls and User vs Kernel Mode]]", "[[Process Memory Layout - Stack vs Heap]]", "[[How a Computer Runs a Program - Go]]"]
sources:
  - "System V Application Binary Interface, AMD64 Architecture Processor Supplement (ELF)"
  - "Go documentation, cmd/link and cmd/cgo"
  - "Patterson & Hennessy, Computer Organization and Design, RISC-V Edition, ch. 4"
updated: 2026-11-09
---

# How a Computer Runs a Program

> [!summary] TL;DR
> A CPU runs a program by repeating one loop forever: fetch the next instruction from memory, decode what it means, and execute it using a handful of on-chip **registers**. Getting from your source file to that loop takes four separate steps — compile, assemble, link, load — and the file that comes out of linking (an **ELF** binary on Linux) is what the operating system loads and the CPU's fetch-decode-execute loop runs.

> [!abstract] Core idea
> - A CPU is a loop: fetch an instruction, decode it, execute it, repeat — forever, millions to billions of times a second.
> - **Registers** are the CPU's only directly-addressable storage; every instruction reads and writes them, never RAM directly except via explicit load/store.
> - Your source code becomes a running process through four stages: **compile** (source → assembly), **assemble** (assembly → machine code in an object file), **link** (object files + libraries → one executable), **load** (executable → process in memory).
> - **Static linking** copies library code into the executable; **dynamic linking** leaves a reference for the OS loader to resolve at run time. Go defaults to static binaries; linking C code via `cgo` forces dynamic linking against `libc`.

## 1. Why it exists

Say you write a Go program with one line, `fmt.Println("hi")`, and run `go build`. Nothing about that sentence is something silicon understands.

### 1.1 The CPU understands only one thing

**In plain words:** a CPU is a fixed circuit, not a flexible interpreter of ideas. It has no notion of a string, a function call, or what `Println` means. It understands exactly one thing: read a fixed-width number from a fixed address, treat it as an **instruction**, and change some fixed-size registers and memory locations accordingly.

**Picture it:**

```mermaid
flowchart LR
    S["fmt.Println(&quot;hi&quot;)\n(an idea: print this text)"] -.->|"a CPU cannot\nread this directly"| X["not understood"]
    I["0x48 0x89 0xE5 ...\n(fixed-width binary instructions)"] -->|"a CPU can\nread this"| CPU["Fetch → Decode → Execute"]
```

**Example:** the single word `Println` compiles down to dozens of individual machine instructions — loading register values, computing a memory address, triggering a system call — none of which look anything like a function name.

**Why it matters:** every step from here (compile, assemble, link, load) exists purely to close the gap between "an idea in source code" and "a sequence of fixed-width binary instructions at known addresses."

> [!tip] Remember
> A CPU never "understands" your program. It mechanically executes whatever binary instruction sits at the address its program counter currently holds.

### 1.2 Two gaps that must close before anything runs

Two separate gaps need closing before "print hi" becomes electricity moving through transistors:

1. **The language gap.** `fmt.Println("hi")` has to become a sequence of instructions the CPU's instruction set (on a typical cloud server, x86-64 or ARM64) actually defines — load an address into a register, write bytes to a buffer, trigger a system call to hand the bytes to the kernel.
2. **The loading gap.** Those instructions have to end up at known addresses in memory, with the CPU's **program counter** pointed at the first one, before the fetch-decode-execute loop can start running them at all.

The compile/assemble/link pipeline closes the first gap; the operating system's loader closes the second. Skip either step and there is no program to run — only text in a file.

> [!warning] Common mistake
> Thinking "compiling" alone is enough to produce a runnable program. A compiler alone only produces assembly or an incomplete object file — a program isn't runnable until a linker has resolved every address and an OS loader has mapped it into memory with the program counter pointed at the entry point.

## 2. Mental model

**The desk-with-sticky-notes analogy:** think of the CPU as a reader at a desk with eight sticky notes (registers) and a pointer finger (the **program counter**, PC) that always points at the next instruction. The reader can only do five things: read a sticky note, write a sticky note, do arithmetic on two sticky notes, look at a memory address and copy it onto a sticky note (or back), and move the pointer finger.

**Where the analogy breaks down:** a real CPU reads and executes many instructions in an overlapping pipeline at once (covered briefly in the deep dive), not strictly one-at-a-time the way a human reader would — but for understanding correctness (not raw speed), the one-at-a-time mental model is exactly right.

```mermaid
flowchart LR
    PC["Pointer finger (PC)\npoints at instruction 5"] --> R["Read instruction 5"]
    R --> D["Figure out what it says:\n'add sticky note A to sticky note B'"]
    D --> E["Do it: write result to a sticky note"]
    E --> M["Move pointer finger\nto instruction 6, or wherever a jump says"]
```

**Why it matters:** the reader never "understands" the program — it just keeps doing whatever the instruction under its finger says, then moves the finger to the next one (or wherever a jump instruction says to). Turning your source file into a stack of instructions for that reader, in the right order, at the right addresses, is the whole job of compiling, assembling, linking and loading.

> [!tip] Remember
> The CPU's "intelligence" is entirely in what the instructions say to do — the reader itself is mechanical and understands nothing.

## 3. How it works

### 3.1 The fetch-decode-execute cycle

**In plain words:** every single instruction a CPU ever runs goes through the same three (sometimes described as four, splitting out "writeback") stages: **fetch** it from memory, **decode** what it means, **execute** it.

```mermaid
flowchart LR
    PC["Program Counter\n(register)"] -->|"address"| F["Fetch\ninstruction from memory"]
    F -->|"raw bits"| D["Decode\nwhich opcode, which registers"]
    D -->|"control signals"| E["Execute\nALU op, memory load/store, or branch"]
    E -->|"result written to a register\nor memory"| W["Writeback"]
    W -->|"PC+1, or the branch target"| PC
```

**Step by step:**
1. **Fetch.** Read the fixed-width binary instruction at the address the program counter currently holds.
2. **Decode.** Work out which operation this is (add? load? jump?) and which registers or memory addresses it touches.
3. **Execute.** Perform the operation — an arithmetic-logic-unit (ALU) computation, a memory load/store, or a branch.
4. **Writeback.** Store the result in a register (or memory), and update the program counter: usually to the very next instruction, or to a jump/branch target if the instruction was a jump.

**Example:** on a simple CPU this takes several clock cycles per instruction; a real superscalar CPU pipelines and reorders this across many instructions in flight at once (covered in [[CPU Scheduling]] for the OS-level analogue, and left as hardware-internals detail here).

**Why it matters:** the architectural registers — general-purpose ones, the PC, and a stack pointer — are the only state the CPU can read or write directly; everything else is one load or store instruction away in the memory hierarchy (see [[Memory Hierarchy and CPU Caches]]).

> [!tip] Remember
> Fetch-decode-execute never stops while the CPU is powered and running: there is no "idle" instruction, only a loop that keeps consuming whatever is at the program counter.

### 3.2 Compile, assemble, link, load

**In plain words:** turning readable source code into a runnable process is four distinct, separately-named stages, each producing a different kind of file as output.

```mermaid
flowchart LR
    SRC["main.go\n(source)"] -->|"compiler\n(gc)"| ASM["assembly\n(symbolic instructions)"]
    ASM -->|"assembler"| OBJ["object file\n(.o — machine code,\nunresolved symbols)"]
    LIB["package objects +\nstatic libraries"] --> LINK
    OBJ --> LINK["linker"]
    LINK -->|"resolves symbol\naddresses, merges\nsections"| EXE["ELF executable\n(code, data, symbol table)"]
    EXE -->|"OS loader:\nexecve(2)"| PROC["process in memory\n(.text mapped read+exec,\n.data/.bss mapped read+write)"]
    PROC -->|"jump to entry point"| CPU["fetch-decode-execute\nbegins"]
```

**Step by step:**
1. **Compile.** The compiler (Go's `gc`, or `gcc`/`clang` for C) parses source text, checks types, and emits assembly: human-readable instruction mnemonics (`MOVQ`, `CALL`, `RET`) that still use symbolic names for functions and variables rather than final addresses.
2. **Assemble.** The assembler turns each mnemonic into its binary encoding and writes an **object file** — machine code plus a **symbol table** (names the file defines, like `main.sayHi`, and names it still needs, like `runtime.printstring`) and **relocation entries** (placeholders saying "patch this address once you know where symbol X ends up"). Nothing is runnable yet: addresses are still relative to an unknown base.
3. **Link.** The linker takes every object file the build produces, plus any libraries, and does two jobs: it picks final addresses for every symbol and lays out the file's **sections** (`.text` for code, `.data` for initialized globals, `.bss` for zeroed globals, `.rodata` for constants), then it walks every relocation entry and patches in the real address. The output is one **executable**: on Linux, an **ELF** (Executable and Linkable Format) file.
4. **Load.** When you run the binary, the kernel's loader (triggered by the `execve(2)` system call — see [[System Calls and User vs Kernel Mode]]) reads the ELF headers, maps `.text` into the new process's address space as read-and-execute, maps `.data`/`.bss` as read-and-write, sets up the initial stack, and points the CPU's program counter at the ELF header's entry-point address.

**Why it matters:** from that instant, the fetch-decode-execute loop is reading real instructions, and the "program" is now a running **process** (see [[Processes, Threads and Context Switching]] for what a process is once it exists, and [[Process Memory Layout - Stack vs Heap]] for the rest of that address space).

> [!warning] Common mistake
> Confusing "compiled" with "linked" with "loaded." A `.o` object file is compiled *and* assembled but not linked — it still has unresolved symbols and no fixed addresses. A linked executable is not yet a running process — nothing is mapped into memory and the program counter isn't pointed anywhere until the loader runs.

### 3.3 Inside an ELF file

**In plain words:** an ELF file isn't one undifferentiated blob of bytes — it's a header plus a list of named **sections**, each holding a different kind of data and mapped into memory with different permissions.

| Part | Holds | Loaded as |
|---|---|---|
| ELF header | entry-point address, architecture, section table location | read by the loader, not mapped |
| `.text` | machine code | read + execute |
| `.rodata` | string literals, constants | read-only |
| `.data` | initialized global variables | read + write |
| `.bss` | zeroed global variables (no bytes stored on disk) | read + write, zero-filled |
| `.symtab` / `.dynsym` | symbol names and addresses | not mapped (static) / read at load time (dynamic) |

**Picture it:**

```mermaid
flowchart TB
    subgraph file["ELF file on disk"]
        direction TB
        H["ELF header"] --> T[".text: machine code"]
        T --> RO[".rodata: constants"]
        RO --> D[".data: initialized globals"]
        D --> B[".bss: zeroed globals (no bytes on disk)"]
    end
    subgraph mem["Process address space after loading"]
        direction TB
        MT[".text mapped\nread + execute"]
        MRO[".rodata mapped\nread-only"]
        MD[".data mapped\nread + write"]
        MB[".bss mapped\nread + write, zero-filled by the kernel"]
    end
    T -. execve maps .-> MT
    RO -. execve maps .-> MRO
    D -. execve maps .-> MD
    B -. execve zero-fills .-> MB
```

**Example:** `.bss` stores no actual bytes on disk at all — just a size — because a zeroed global variable doesn't need its zeros written to the executable file; the kernel zero-fills that memory region at load time, which is why a program with a 1 GB global zeroed buffer doesn't produce a 1 GB executable file.

**Why it matters:** this is why `readelf -S ./a.out` (section headers) or `objdump -d ./a.out` (disassembly back to assembly mnemonics) can tell you so much about a binary without running it — the structure is fully described by the header, before a single instruction executes.

> [!tip] Remember
> Different sections get different memory permissions for a reason: `.text` is executable but not writable (so running code can't be overwritten by a bug), and `.data`/`.bss` are writable but not executable (so injected data can't be run as code).

## 4. Worked example

### Whiteboard version

A CPU's loop, stripped to its bones, is: `instr := fetch(pc); decode-and-execute(instr); pc = next(pc, instr)`. The runnable version below makes that literal in Go — five instructions, eight registers, one loop — so "fetch-decode-execute" stops being an abstract phrase.

### Tracing `fmt.Println("hi")` through the pipeline

1. `go build` hands `main.go` to the compiler. It sees the call to `fmt.Println` and emits assembly with a symbolic `CALL fmt.Println` — the compiler doesn't yet know where `fmt.Println`'s code will live in memory.
2. The assembler turns that assembly into an object file: real machine-code bytes for everything it *can* resolve, plus a relocation entry that says "patch this call instruction once you know `fmt.Println`'s final address."
3. The linker pulls in the object files for `main`, the `fmt` package, and the Go runtime, assigns every symbol (including `fmt.Println`) a final address inside one unified address space, and patches every relocation entry — including the one from step 2.
4. The output is one ELF executable, usually statically linked for a pure-Go program (see §5), containing `.text` (all the machine code, from `main` and from `fmt` and the runtime alike), `.rodata` (the string literal `"hi"` lives here), and more.
5. Running `./main` triggers `execve(2)`. The kernel maps `.text` as read+execute, `.rodata`/`.data`/`.bss` as appropriate, and sets the program counter to the ELF entry point — which is Go runtime startup code, not `main` directly.
6. The runtime initializes itself (starts the scheduler, sets up the first goroutine) and eventually calls `main.main`, which calls `fmt.Println`, which — several function calls deeper — issues a `write` system call to actually print `"hi"` to standard output.

```mermaid
sequenceDiagram
    participant Dev as go build
    participant Comp as Compiler (gc)
    participant Asm as Assembler
    participant Lnk as Linker
    participant OS as Kernel (execve)
    participant CPU as CPU

    Dev->>Comp: main.go, calls fmt.Println
    Comp->>Asm: assembly, CALL fmt.Println, symbolic
    Asm->>Lnk: object file, machine code plus an unresolved symbol for fmt.Println
    Note over Lnk: Also pulls in fmt and runtime package objects
    Lnk->>Lnk: assign addresses, patch relocations
    Lnk->>OS: single static ELF executable
    Dev->>OS: ./main (execve syscall)
    OS->>CPU: map .text/.data, set PC = entry point
    CPU->>CPU: fetch-decode-execute until the program exits
```

**Measured** (Go 1.24.4, `go vet` and `go test -race` on a 5-instruction toy register machine): running a program that loops `counter := 5; while counter != 0 { accumulator += counter; counter -= 1 }` executes 13 fetch-decode-execute cycles and leaves the accumulator at 15 (`5+4+3+2+1`), confirmed by the test below.

Runnable Go version: [[How a Computer Runs a Program - Go]]

> [!tip] Remember
> Even a one-line `Println` call passes through every stage of the pipeline — there is no shortcut, only varying amounts of work done at each stage depending on language and build mode.

## 5. Variants and comparison

| Linking strategy | How it works | Use when | Cost |
|---|---|---|---|
| Static linking | Linker copies the library's machine code into the executable at build time | You want one self-contained file to deploy — the default for Go | Bigger binary; a security fix in a library needs a rebuild |
| Dynamic linking | Executable stores only the library's name; the OS loader (or `ld.so`) maps the shared library (`.so`) into the process and patches calls at load/run time | Many processes share one library in RAM (e.g. `libc` on a Linux desktop); you want to patch a library without rebuilding every binary | Small binary, but needs the right `.so` versions present at run time ("DLL hell") |
| Static + dynamic mix (Go with `cgo`) | Go code and the Go runtime are statically linked; any C code pulled in via `cgo` (e.g. `net` package's DNS resolver on some configurations, or `database/sql` drivers using C libraries) is linked dynamically against `libc` | You must call a C library with no pure-Go equivalent | Loses the "copy one binary anywhere" property; the target machine needs a compatible `libc` |

```mermaid
flowchart TD
    Q{"Does the build need\nany C code (cgo)?"}
    Q -- no --> S["Fully static Go binary\none self-contained file"]
    Q -- yes --> Q2{"Can CGO_ENABLED=0\nreplace the C dependency\nwith a pure-Go path?"}
    Q2 -- yes --> S
    Q2 -- no --> D["Static Go runtime +\ndynamic link against libc"]
```

## 6. Trade-offs and when not to use

- Static binaries are simple to deploy (`scp` one file into a `FROM scratch` container) but every security patch to a dependency means rebuilding and redeploying every binary that linked it.
- Dynamic linking saves disk and RAM when many processes share one library, but introduces a run-time dependency: the right shared library must exist on the target machine, which is exactly the class of bug ("works on my machine") static linking avoids.
- None of this applies to interpreted or JIT-compiled languages in the same way: Python source is parsed into bytecode and interpreted by the CPython VM at run time, and the JVM both interprets bytecode and JIT-compiles hot methods to native code while running — there is no single ahead-of-time link step producing one native executable.

> [!warning] Common mistake
> Assuming "interpreted language" means "no compile step at all." Python and the JVM both still compile source into bytecode (a lower-level, uniform instruction format) before running it — they just skip the "produce one native-machine-code executable, ahead of time" step that compile/assemble/link does for Go or C.

## 7. In production

- **Real systems:** Go's own toolchain (`go build`) runs exactly this pipeline (`compile` → `go tool asm` → `go tool link`), and its default output is a statically linked, single-file ELF (or Mach-O/PE) binary — the reason a `FROM scratch` Docker image containing nothing but a Go binary can run at all. C and C++ build systems (`make`, `cmake`) expose the same four stages explicitly, often as separate `cc -c` (compile+assemble) and `cc` (link) invocations.
- **Failure modes → fixes:**
  - `undefined reference to 'foo'` at link time → a symbol was declared but never defined, or its object file was never passed to the linker; fix the build graph.
  - `cgo` silently turning a static build into a dynamic one → set `CGO_ENABLED=0` to force a pure static build, or `go build -ldflags '-linkmode external -extldflags "-static"'` if `cgo` is required but a static binary is still wanted.
  - A binary runs on the build machine but fails with "version `GLIBC_2.34' not found" on an older server → a dynamically linked binary was built against a newer `libc` than the target has; rebuild statically or match OS versions.
- **What to monitor:** build reproducibility (pinned toolchain and dependency versions), binary size (static binaries grow with every statically linked dependency), and, for dynamically linked services, which shared library versions are actually installed on each host.

## 8. Deep dive

### Why Go defaults to static binaries

The Go linker statically links the entire Go runtime (the scheduler, garbage collector, and standard library) into every binary by default, because the runtime needs tight control over stacks, goroutine scheduling (see [[Runtime - Goroutine Scheduler (GMP)]]) and memory management (see [[Runtime - Memory Allocator and Garbage Collector]]) that a dynamically-loaded, independently-versioned runtime could not guarantee. `cgo` breaks this: once C code is linked in, the C runtime's own startup and threading expectations force at least `libc` to be linked dynamically (on Linux; `CGO_ENABLED=0` avoids this entirely by disabling `cgo` and using Go's pure-Go standard-library implementations, e.g. for DNS resolution, instead of calling into `libc`).

### Relocations, concretely

When the assembler emits an object file for a call to a function defined elsewhere, it cannot know that function's final address yet, so it emits a relocation entry: "at byte offset N in `.text`, write the address of symbol `fmt.Println`, interpreted as a PC-relative 32-bit offset." The linker's job is mechanical: assign every symbol an address, then process every relocation entry and write the real bytes.

```mermaid
flowchart LR
    OBJ["Object file:\nCALL ??? at offset 0x40\n+ relocation entry:\n'patch 0x40 with fmt.Println'"] --> LNK["Linker: fmt.Println\nassigned address 0x5A200"]
    LNK --> PATCH["Patched instruction:\nCALL 0x5A200 at offset 0x40"]
```

### Position-independent executables (PIE)

Most modern Linux distributions build executables as PIE by default so the kernel can load them at a randomized base address each run (ASLR), which means even a statically-resolved relocation is expressed relative to a base the loader only picks at `execve` time, not at link time.

### What the loader actually does, step by step

1. `execve(2)` is called (directly, or via a shell running your binary).
2. The kernel validates the ELF header and architecture — a 32-bit ARM binary can't `execve` on a pure 64-bit x86 kernel, for instance.
3. The kernel maps `PT_LOAD` segments (roughly, `.text` and `.data`/`.bss`) into a fresh address space, at a randomized base if the binary is PIE.
4. The kernel maps the stack and, if present, the dynamic linker (`ld-linux.so`).
5. Control transfers either straight to the entry point (static binary) or to the dynamic linker, which resolves remaining symbols against shared libraries before jumping to the entry point.

### The instruction-cycle detail elided above

Real CPUs do not execute one instruction fully before starting the next; they pipeline fetch/decode/execute for many instructions simultaneously and predict branches ahead of the fetch stage. That hardware-scheduling layer, and the OS-level scheduling layer that decides which process's instructions the CPU fetches next, are both covered in [[CPU Scheduling]].

## 9. Interview questions

> [!question]- What are the four steps between source code and a running process?
> Compile (source → assembly), assemble (assembly → object file with machine code and unresolved symbols), link (object files + libraries → one executable with every address resolved), load (OS maps the executable into a new process's memory and sets the program counter to its entry point).

> [!question]- What does "fetch-decode-execute" actually mean, mechanically?
> Fetch: read the instruction at the address the program counter holds. Decode: work out which operation and which registers/memory it touches. Execute: perform the operation (arithmetic, a memory load/store, or a jump) and update the program counter to the next instruction or the branch target. Repeat.

> [!question]- Why does a Go binary not need a `.so` file for its own runtime, but sometimes does need `libc`?
> Go statically links its compiler-generated code and its entire runtime (scheduler, GC, standard library) into the executable by default. `libc` only enters the picture through `cgo`: if any imported code calls into C (directly, or via a database driver, or via certain OS-specific standard-library paths), that C code is linked dynamically against the system's `libc`, because `CGO_ENABLED=1` is the default when a C toolchain is present.

> [!question]- Trap: if an object file already contains machine code, why isn't it runnable yet?
> Its addresses are symbolic and relative: calls to functions defined in other object files or libraries are left as relocation entries ("patch this location with the address of symbol X"), and the file has no fixed load address or entry point. The linker has to resolve every symbol to a real address and merge all the object files' sections before anything is executable.

> [!question]- What is an ELF file, concretely?
> The standard executable and shared-library format on Linux: a header naming the architecture and the entry-point address, followed by sections such as `.text` (code), `.rodata` (constants), `.data` (initialized globals) and `.bss` (zeroed globals), plus a symbol table. The OS loader reads the header and section table to decide what to map into memory and where to start executing.

> [!question]- What happens if the linker can't find a symbol a function calls?
> A link-time error, `undefined reference to 'symbol'`: the object file that is supposed to define that symbol was never produced or never passed to the linker. This is different from a run-time "symbol not found" error from a dynamic loader, which means a shared library the executable depends on is missing or the wrong version at load time.

> [!question]- Why can't the CPU just read and execute your Go source file directly?
> The CPU's instruction set only understands fixed-width binary opcodes operating on registers and memory addresses — it has no notion of functions, types, or strings. Every step of compiling, assembling and linking exists purely to turn source text into that fixed binary encoding, with every address resolved, before the CPU's fetch-decode-execute loop can run any of it.

## 10. Cheat sheet

- CPU loop: fetch instruction at PC → decode → execute (ALU op, load/store, or branch) → repeat.
- Registers are the CPU's only directly-addressable storage; everything else needs an explicit load or store.
- Pipeline: compile (→ assembly) → assemble (→ object file, unresolved symbols) → link (→ one executable, every address resolved) → load (OS maps it into a process and sets PC to the entry point).
- An object file is not runnable: its symbols are unresolved relocation entries.
- ELF = Linux's executable format: header (entry point) + sections (`.text`, `.rodata`, `.data`, `.bss`) + symbol table.
- Static linking copies library code in (one deployable file); dynamic linking defers it to load time (`.so`, shared across processes, but a run-time dependency).
- Go defaults to fully static binaries; `cgo` forces dynamic linking against `libc` unless `CGO_ENABLED=0`.

## Links

- **Go implementation:** [[How a Computer Runs a Program - Go]]
- **Before this:** none — this is the entry point for 01 CS Fundamentals.
- **Next:** [[Memory Hierarchy and CPU Caches]], [[Processes, Threads and Context Switching]], [[System Calls and User vs Kernel Mode]]
- **Compare with:** [[Process Memory Layout - Stack vs Heap]] (the address space the loader builds), [[Runtime - Goroutine Scheduler (GMP)]] (how Go schedules work once a process is running)
