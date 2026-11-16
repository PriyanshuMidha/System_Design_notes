# CDN and Edge: 30-second 3D reel (draft script)

Format: vertical 1080x1920, 30 s, 3D scene (Three.js, real camera moves, lighting, depth), one voice + short on-screen words. Interaction = camera flies between objects, packets physically travel, cache shelves light up on hit, things react when touched by the packet.

Hook line (0-3 s) must stop the scroll. Every beat = one CDN topic from the note, one 3D action, one spoken line (about 12 words max).

| Time | Topic | What you SEE (3D) | Voice (draft) |
| --- | --- | --- | --- |
| 0-3 s | Why it exists | Glowing Earth, camera top-down. A tiny server in Virginia. A phone in Mumbai fires a red beam that takes forever across the globe, clock ticking 250 ms | "Mumbai to Virginia: a quarter second, every click." |
| 3-8 s | Edge / PoP + cache hit | Little glass server pods (PoPs) pop up around the globe like city lights. Camera dives to Mumbai: beam hits the pod, green flash, 8 ms | "Put copies close to users. That's a CDN edge. A hit: instant." |
| 8-13 s | Cache miss + origin shield | Beam hits an empty pod shelf (grey), continues to a shield node, then Virginia; the file flies back, lands on the shelf, shelf glows | "A miss goes to origin once, through a shield. Then it's cached." |
| 13-18 s | Cache key + Cache-Control (TTL) | Close on a shelf: file cubes with key plates; a tag with a draining ring (max-age) hangs on each cube; ?utm junk ribbon peels off the key | "Cache key says which copy. Cache-Control says how long it stays fresh." |
| 18-23 s | Purge / invalidation | A red "purge" pulse ripples across all pods; old cubes shatter into particles, new version cubes slide in | "Change the file? Purge, or rename it. Old copies vanish worldwide." |
| 23-27 s | Stampede + request collapsing | 100 beams rush one empty shelf; a gate drops, 99 freeze mid-air, ONE beam goes to origin | "A thousand misses at once? Collapse them into one origin request." |
| 27-30 s | Recap + CTA | Camera pulls out, all pods glow in a ring around Earth; title text fades in: CDN AND EDGE | "CDN: copies close, rules clear, origin safe." |

Words on screen (tiny, big type, max 3 per beat): 250 ms → 8 ms · HIT / MISS · max-age · PURGE · 100 → 1 · CDN AND EDGE.

Build notes (not for the viewer):
- Engine: Three.js in headless Chrome, frames captured by seeking a timeline (same seek approach as the story pipeline), 24 or 30 fps, ffmpeg + one TTS voice, music-free or light bed.
- Render size 1080x1920, expect about 5-10 min total render for 30 s.
- Same recipe then repeats for the other networking notes (DNS, TCP, TLS ...) once this look is approved.
