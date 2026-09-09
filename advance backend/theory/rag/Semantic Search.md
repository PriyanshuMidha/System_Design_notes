# Semantic Search

## Complete notes

Semantic search finds results by meaning, not only exact words.

## Keyword search

Looks for exact words.

Example:

`car insurance` matches pages containing those exact words.

## Semantic search

Understands meaning.

Example:

`vehicle protection plan` can match `car insurance`.

## Diagram

```mermaid

flowchart LR
  Query[User question] --> Embed[Embedding]
  Embed --> Search[Similarity search]
  Search --> Results[Meaning-related results]
```

## Hybrid search

Hybrid search combines:

- keyword search
- semantic/vector search

This often gives better results.

## Quick revision

Semantic search = search by meaning using embeddings.

## Important additions

### Semantic vs keyword search

| Search type | How it works | Weakness |
|---|---|---|
| Keyword | exact words | misses same meaning |
| Semantic | embedding meaning | may miss exact required term |
| Hybrid | both keyword + semantic | more setup |

### Reranking

Reranker takes retrieved results and reorders them for better relevance.

Pipeline:

```mermaid

flowchart LR
  Query --> Retrieve[Retrieve top 20]
  Retrieve --> Rerank[Rerank]
  Rerank --> Top[Use top 5]
  Top --> LLM
```

### When semantic search is useful

- user asks in different words
- documents use different terms
- support/help-center search
- RAG retrieval
