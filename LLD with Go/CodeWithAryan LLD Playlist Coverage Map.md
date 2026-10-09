# CodeWithAryan LLD Playlist Coverage Map

## Complete notes

This note maps the Java-based CodeWithAryan LLD material to the Go notes in this vault.

The course/page focuses on:

- what LLD is
- HLD vs LLD
- requirements and use cases
- UML diagrams
- entities and relationships
- core class methods
- implementation
- SOLID, DRY, KISS, YAGNI
- design patterns
- model problems like logging system

## Coverage status

| Course topic | Covered in vault? | Go note |
|---|---|---|
| What is LLD | yes | [[Go LLD Mental Model]] |
| HLD vs LLD | yes | [[LLD Interview Approach in Go]] |
| Requirement gathering | yes | [[LLD Interview Approach in Go]] |
| Use cases | yes | [[LLD Interview Approach in Go]] |
| Entities/classes | yes | [[LLD Interview Approach in Go]] |
| Relationships | yes | [[LLD Interview Approach in Go]] |
| Core methods | yes | [[LLD Interview Approach in Go]] |
| UML/class/sequence/activity thinking | partial | [[LLD Interview Approach in Go]] |
| SOLID | yes | [[SOLID Principles in Go LLD]] |
| DRY | yes | [[DRY Principle in Go LLD]] |
| KISS | yes | [[KISS Principle in Go LLD]] |
| YAGNI | yes | [[YAGNI Principle in Go LLD]] |
| Factory | yes | [[Factory Pattern in Go]] |
| Strategy | yes | [[Strategy Pattern in Go]] |
| Observer | yes | [[Observer Pattern in Go]] |
| Singleton | yes | [[Singleton Pattern in Go]] |
| Structural patterns | yes | [[Structural Patterns in Go]] |
| Logging system model problem | yes | [[Logging System LLD in Go]] |

## What was missing before this check

Before checking the course material, the notes had patterns and Go examples, but these parts needed stronger placement:

- KISS principle
- general LLD interview approach
- use cases/entities/relationships/core methods flow
- CodeWithAryan-specific coverage map
- logging system as a pattern-combination problem

These are now added.

## Java to Go translation

| Java course idea | Go translation |
|---|---|
| class | struct + methods |
| interface | interface |
| enum | typed constants |
| inheritance | composition |
| synchronized | mutex or DB atomic update |
| abstract class | interface + helper struct/function |
| static singleton | `sync.Once` or explicit dependency injection |

## Recommended study path with this playlist

1. Watch/skim the Java video for concept.
2. Read the matching Go note.
3. Code the Go example without looking.
4. Explain where it fits in backend.
5. Add one edge case.

## Sources

- CodeWithAryan Low Level Design page: https://codewitharyan.com/system-design/low-level-design
- What is Low Level System Design: https://codewitharyan.com/tech-blogs/what-is-low-level-system-design
- How to Approach LLD Problems: https://codewitharyan.com/tech-blogs/how-to-approach-lld-problems
- Structural Design Patterns: https://codewitharyan.com/tech-blogs/structural-design-patterns
- Design Logging System: https://codewitharyan.com/tech-blogs/design-logging-system
