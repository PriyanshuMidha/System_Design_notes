# AI Engineering Content Table

## Course topics from Part 2

- [[Introduction to AI Engineering]]
- [[LLM Fundamentals]]
- [[LangChain Fundamentals]]
- [[LangGraph]]
- [[AI Agents]]
- [[Prompt Engineering]]
- [[Production AI Best Practices]]

## Revision dashboard

AI engineering means building real applications around LLMs, tools, memory, retrieval, workflows, and deployment.

## Study order

1. [[Introduction to AI Engineering]]
2. [[LLM Fundamentals]]
3. [[Prompt Engineering]]
4. [[LangChain Fundamentals]]
5. [[LangGraph]]
6. [[AI Agents]]
7. [[Production AI Best Practices]]

## Big picture diagram

```mermaid

flowchart LR
  User[User request] --> Backend[Backend API]
  Backend --> Prompt[Prompt/template]
  Prompt --> LLM[LLM]
  LLM --> Tool[Tools/APIs]
  LLM --> Memory[Memory]
  LLM --> Response[Final response]
```

## Quick revision

- LLM gives reasoning/text generation.
- Prompt controls instruction and context.
- Tools let AI call real functions/APIs.
- Memory keeps useful information.
- LangChain provides building blocks.
- LangGraph controls multi-step agent flow.

## Visual topic map

Use this map like the Excalidraw roadmap: follow the arrows first, then open the linked notes.

```mermaid
flowchart LR
  N1["Introduction to AI Engineering"]
  N2["LLM Fundamentals"]
  N3["Prompt Engineering"]
  N4["LangChain Fundamentals"]
  N5["LangGraph"]
  N6["AI Agents"]
  N7["Production AI Best Practices"]
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
  N6 --> N7
```

## Color legend

- <span class="sd-key">Blue</span> = core concept
- <span class="sd-good">Green</span> = recommended pattern
- <span class="sd-risk">Red</span> = risk or failure mode
- <span class="sd-tradeoff">Purple</span> = tradeoff
- <span class="sd-2026">Orange</span> = current 2026 update

## Linked notes in this map

- [[Introduction to AI Engineering]]
- [[LLM Fundamentals]]
- [[Prompt Engineering]]
- [[LangChain Fundamentals]]
- [[LangGraph]]
- [[AI Agents]]
- [[Production AI Best Practices]]
