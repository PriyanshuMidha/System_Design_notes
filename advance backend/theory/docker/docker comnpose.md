# docker comnpose

to run multiple  container al at once we need docker compose

![[Pasted image 20260908135328.png]]

so if we have

![[Pasted image 20260908141236.png]]

so we keep both the here in the

![[Pasted image 20260908142055.png]]

to run the compose file we use

- docker compose up

to remove the container

- docker compose down

-

## Revision notes

### What it is

Docker Compose runs multiple containers using one YAML file.

Good when app needs backend, database, Redis, worker, and frontend together.

### Example

```yaml

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      REDIS_URL: redis://redis:6379
    depends_on:
      - redis

  redis:
    image: redis:7
```

### Diagram

```mermaid

flowchart LR
  Compose[docker compose up] --> API[api service]
  Compose --> Redis[redis service]
  API --> Redis
```

### Commands

```bash

docker compose up
docker compose up -d
docker compose down
docker compose logs
docker compose ps
```

### Quick revision

Compose = one file to run many containers together.
