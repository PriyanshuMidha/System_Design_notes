# RAG Content Table

## Course topics from Part 2

- [[RAG]]
- [[Embedding Models]]
- [[Vector Databases]]
- [[Semantic Search]]
- [[Document Processing]]
- [[AI Chat with PDFs and Websites]]

## Revision dashboard

RAG means Retrieval-Augmented Generation. It lets an AI answer using your documents/data instead of only model memory.

## Study order

1. [[Embedding Models]]
2. [[Vector Databases]]
3. [[Document Processing]]
4. [[Semantic Search]]
5. [[RAG]]
6. [[AI Chat with PDFs and Websites]]

## Big picture diagram

```mermaid

flowchart LR
  Docs[Documents] --> Chunks[Chunks]
  Chunks --> Embed[Embeddings]
  Embed --> VectorDB[(Vector DB)]
  User[User question] --> QEmbed[Question embedding]
  QEmbed --> VectorDB
  VectorDB --> Context[Relevant chunks]
  Context --> LLM[LLM]
  LLM --> Answer[Grounded answer]
```

## Quick revision

- Embeddings convert text to vectors.
- Vector DB stores/searches vectors.
- Retriever finds relevant chunks.
- LLM answers using retrieved context.

## Visual topic map

Use this map like the Excalidraw roadmap: follow the arrows first, then open the linked notes.

```mermaid
flowchart LR
  N1["RAG"]
  N2["Document Processing"]
  N3["Embedding Models"]
  N4["Vector Databases"]
  N5["Semantic Search"]
  N6["AI Chat with PDFs and Websites"]
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
```

## Color legend

- <span class="sd-key">Blue</span> = core concept
- <span class="sd-good">Green</span> = recommended pattern
- <span class="sd-risk">Red</span> = risk or failure mode
- <span class="sd-tradeoff">Purple</span> = tradeoff
- <span class="sd-2026">Orange</span> = current 2026 update

## Linked notes in this map

- [[RAG]]
- [[Document Processing]]
- [[Embedding Models]]
- [[Vector Databases]]
- [[Semantic Search]]
- [[AI Chat with PDFs and Websites]]
