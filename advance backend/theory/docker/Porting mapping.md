so it is mapping of the container port to the port of the container

# Porting mapping

## Complete notes

Port mapping means connecting a port on your computer to a port inside the container.

Container is isolated, so the browser cannot access its internal port directly.

## Example

```bash

docker run -p 8080:80 nginx
```

Meaning:

- `8080` is host machine port.
- `80` is container port.
- Open `http://localhost:8080`.
- Docker forwards traffic to container port `80`.

## Diagram

```mermaid

flowchart LR
  Browser[Browser localhost:8080] --> Host[Host port 8080]
  Host --> Docker[Docker forwarding]
  Docker --> Container[Container port 80]
```

## Common formats

```bash

docker run -p 3000:3000 app
docker run -p 127.0.0.1:3000:3000 app
docker run -P app
```

## Important point

Publishing to `0.0.0.0` can expose the app on all network interfaces.
For local-only development, bind to `127.0.0.1`.

## Common mistakes

- Reversing host port and container port.
- Forgetting the app inside container must listen on correct port.
- Using a port already used by another process.
- Publishing database ports publicly by mistake.
