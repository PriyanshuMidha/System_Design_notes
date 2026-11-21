# Networking & Web: Reel Scripts (draft for approval)

Format for every reel: 9:16 (1080x1920), 45 to 60 s, real 3D (Three.js + cannon physics), moving camera the whole time, ONE continuous narration take (Andrew, en-US-AndrewMultilingualNeural, about +8% for a fast feel), sound effects on every hit, soft music bed. About 140 to 150 spoken words = 48 to 55 s.

**Owner rules (2026-11-21):**
- **Narrator voice only.** No character voices. No people, robots or mascots acting on screen.
- **Graphics explain everything.** 3D objects (cubes, pipes, locks, lockers, roads) move, snap, break and light up. The picture alone tells the idea.
- **Fast.** A new visual every 2 to 3 seconds, quick camera moves, no slow pauses.
- **Everyday words.** Everyday things as the picture (fridge, vending machine, lockers, roads). A technical name is said once, after the idea is clear.
- **Not like the long videos.** No story with a cast, no chapter cards, no dialogue.

Each reel uses a NEW setting, different from its long video (listed per reel), so the reel never feels like a cut-down of the long one.

## What makes these more eye-catching (applies to all 14)

1. **Scroll-stopping first 2 seconds.** Open on the most dramatic frame (a smash, a crash, a countdown), not on a title. The first line is a surprising claim or a question.
2. **A visual change every 3 to 4 seconds.** New object, camera cut or physics event every beat. Nothing sits still.
3. **Cause and effect you can see.** Things shatter, snap, jam, light up. The viewer understands the idea even with the sound off.
4. **Big words only (max 3 on screen).** Burned-in word captions that pop in time with the voice (karaoke style), plus one big keyword per beat (SYN, 304, HIT).
5. **A counter or timer on screen** where it helps (milliseconds, packets, connections). Numbers moving = tension.
6. **Loop ending.** The last shot matches the first, so the reel replays smoothly (better watch time).
7. **Series look.** Same 1-second opener sting "NET IN 60" + episode number, same closing card: one interview question ("Interview Q: why is POST not idempotent?") so people save it.

---

## 1. How the Internet Works

- **Long video setting (avoid):** nested envelopes, kingdoms gossiping.
- **Reel setting:** a giant pinball and marble-run machine. A photo shatters into glowing cubes that race through it.
- **On-screen hook:** "Your photo got smashed into 1,000 pieces"

**Narration (one take, ~140 words)**
> This photo just got smashed into a thousand pieces. That's how it reached you. The internet never sends anything whole. It chops it into packets, small blocks, each stamped with two numbers: an I P address, which machine, and a port, which app on that machine. Then every packet drops into a maze of routers. Each router knows only one thing: the next hop. No one sees the full road. Packets take different paths, arrive out of order, and some get lost. Inside, each packet is a box inside a box inside a box: your data, then T C P, then I P, then the cable's own wrapper. That's the layer stack. Between the big networks, B G P is the gossip that says who can reach whom. At the end, your phone snaps the pieces back together. Smashed, scattered, rebuilt. In under a second.

| Time | 3D shot (camera + interaction) | Big word | SFX |
|---|---|---|---|
| 0-4 s | Photo frame on a table, camera pushes in, it SHATTERS into glowing cubes | 1,000 PIECES | glass smash |
| 4-12 s | Close on one cube: two stamps press onto it (IP, port) | IP + PORT | stamp thuds |
| 12-22 s | Cubes drop into a huge pinball maze; flippers (routers) bat each one to the next hop; camera rides along with one cube | NEXT HOP | pinball clacks |
| 22-28 s | Cubes split across paths; one falls off the edge and vanishes | LOST | fall whoosh |
| 28-38 s | X-ray view: a cube opens like nesting dolls, 4 layers lift off one by one | LAYERS | click per layer |
| 38-44 s | Wide shot: maze towers flash signals to each other | BGP | radio blips |
| 44-55 s | Cubes fly into a phone and snap together into the photo; same frame as the opening (loop) | REBUILT | snap chord |

---

## 2. IP Addressing, Subnets, NAT and VPC

- **Long video setting (avoid):** a building with apartments.
- **Reel setting:** a private floating island seen from a drone. A laser cuts the land into plots; one dock ferries everything to the outside world.
- **On-screen hook:** "Your laptop has no real address"

**Narration (~150 words)**
> Your laptop has no public address. Neither does your phone. Here's the trick. Picture a private island. That's a V P C, your own walled network in the cloud. You claim land with a number like ten dot zero, slash sixteen. The slash says how many bits are locked. Bigger slash, smaller plot. Slash sixteen gives about sixty-five thousand addresses. Slash twenty-four, about two hundred fifty. Now slice the island into subnets. Public ones touch the shore, with a gateway to the internet. Private ones sit inland. Your databases live there, unreachable from outside. But inland machines still need updates. So they go out through one dock, the NAT gateway. It swaps their private address for its own public one, keeps a list of who asked, and sends each reply back to the right machine. Thousands of machines, one public face. That's how the world hasn't run out of addresses. Yet.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Laptop on a desk, a red "NO ADDRESS" tag swings off it; camera pulls up and out through the window to an island | NO ADDRESS | tag clink |
| 4-12 s | Drone shot of island; a glowing wall rises around it | VPC | wall rumble |
| 12-22 s | A slider "/16 to /24": as it moves, laser grid lines shrink the plot; address counter drops 65K to 256 | /16 → /24 | laser hum |
| 22-30 s | Laser cuts the island into plots; shore plots glow green (public), inland red (private) | SUBNETS | cut zaps |
| 30-42 s | Inland cube slides to the dock; a robotic arm peels off its label, sticks a new one, a ledger screen adds a line, ferry leaves | NAT | label rip, horn |
| 42-50 s | Reply ferry returns; ledger line glows, box lands back at the right cube | | bell |
| 50-56 s | Pull back: hundreds of glowing cubes, one dock light; back to the laptop (loop) | ONE PUBLIC FACE | music swell |

---

## 3. DNS

- **Long video setting (avoid):** a town, a orb walking door to door.
- **Reel setting:** a glass elevator dropping through a tower of floors (root, .com, google.com), with an hourglass on every answer.
- **On-screen hook:** "Your computer has no idea where google.com is"

**Narration (~150 words)**
> Your computer has no idea where google dot com lives. Computers only speak numbers. So it asks. First, its own memory. Then the resolver, usually run by your internet provider. Still nothing? The resolver rides down a tower. Top floor: the root. Root says, I don't know Google, but ask the dot com floor. Dot com says, ask Google's own name servers. Google's server finally answers: here's the I P address. Three floors, a few milliseconds. Now the clever part. Every answer comes with a timer, the T T L. Until it hits zero, everyone reuses the saved answer. No trip at all. That's why D N S is fast, and why changes take time to spread. Set the timer too long, and your fix is stuck for hours. Too short, and the tower never rests. That's D N S. A phone book with a stopwatch.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Phone screen shows "google.com" then a big "?" pops out of it in 3D | ? | pop |
| 4-10 s | A small drawer (own memory) opens: empty. A drone (the resolver) grabs the question | RESOLVER | drawer slam |
| 10-26 s | Glass elevator plunges; stops at ROOT, then .COM, then GOOGLE floors; each floor's sign flips and points down | ROOT → .COM → GOOGLE | elevator dings |
| 26-32 s | A glowing number plate (IP) flies up to the phone | IP FOUND | chime |
| 32-44 s | Every answer gets an hourglass; second request: hourglass still full, answer comes instantly | TTL | sand trickle |
| 44-52 s | Split screen: huge hourglass (fix stuck), tiny hourglass (elevator going crazy) | TOO LONG / TOO SHORT | |
| 52-56 s | Back to phone, page loads (loop) | | |

---

## 4. TCP

- **Long video setting (avoid):** postcards, midnight deadline.
- **Reel setting:** two rooftops with a zipline. Numbered crates fly across; a receiver throws back "thank-you" flags.
- **On-screen hook:** "3 high-fives before a single byte moves"

**Narration (~145 words)**
> Before a single byte moves, two computers high-five three times. Sin. Sin ack. Ack. Now both sides agree on their starting numbers. That's the T C P handshake. Then the data rides across in numbered boxes. The receiver sends back a thank-you for every box it gets. A box goes missing? No thank-you, so the sender sends it again. Nothing lost, nothing out of order. Two brakes keep it safe. Flow control: the receiver shouts how much room its bucket has left, and the sender never overfills it. Congestion control: the sender starts slow, doubles its speed every round, and the moment a box drops, it backs off. Gentle on a crowded road. The catch? One lost box holds up every box behind it. That's head of line blocking. Reliable, ordered, polite. That's T C P.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-8 s | Two rooftop launch towers fire three glowing balls back and forth, each lights a letter | SYN / SYN-ACK / ACK | three slaps |
| 8-16 s | Numbered crates zip across; a green flag flies back for each | ACK | zip, flag flap |
| 16-22 s | Crate 4 falls into the street (physics); no flag; sender re-sends crate 4 | RESEND | crash, re-zip |
| 22-30 s | Receiver tower has a bucket with a fill gauge; launches slow as it fills | FLOW CONTROL | water slosh |
| 30-40 s | Crates speed up 1, 2, 4, 8 at a time; one drops, rate halves | CONGESTION | speed whoosh, brake |
| 40-50 s | Crate 5 lost; crates 6 to 10 pile up waiting midair on the line | HEAD OF LINE | pile-up clunks |
| 50-56 s | Wide shot, all crates delivered, both towers flash green (loop to opening) | TCP | |

---

## 5. UDP and QUIC

- **Long video setting (avoid):** night of the final match, train journey.
- **Reel setting:** a summer water-balloon fight (UDP), then a bundle of clear pipes carrying coloured water (QUIC).
- **On-screen hook:** "This protocol doesn't care if you get the message"

**Narration (~150 words)**
> This protocol doesn't care if you get the message. Meet U D P. It just throws. No handshake, no receipt, no resend. Sounds bad? It's perfect for live games and video calls, where an old packet is a useless packet. Just throw the next one. But the web needs things to arrive. So engineers built Quick, Q U I C, on top of U D P. Picture many separate pipes in one bundle. A drop goes missing in one pipe, and only that pipe waits. The others keep flowing. That kills T C P's traffic jam. Quick also builds the lock in, so it connects in one quick back-and-forth, and on a repeat visit, sometimes none. And when your phone jumps from wifi to mobile data, the connection keeps its ID. No restart. U D P: fast and careless. Quick: fast and careful. That's H T T P three.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-6 s | Slow-mo water balloon flies at camera and bursts; one misses and splats on the ground | UDP | splash |
| 6-16 s | Rapid balloons for a live game scoreboard; misses ignored, next one already flying | NO RESEND | rapid pops |
| 16-26 s | Camera turns: a bundle of 4 clear pipes, coloured water flowing | QUIC | water flow |
| 26-34 s | One pipe's drop stops, only that pipe pauses; others keep flowing | NO JAM | drip |
| 34-42 s | A lock clicks onto the bundle in one motion | 1 RTT | lock click |
| 42-50 s | Phone slides from a wifi zone to a mobile tower zone; pipe stays connected, ID tag glows | SAME ID | transfer whoosh |
| 50-56 s | Split: balloon vs pipe bundle; back to balloon (loop) | HTTP/3 | |

---

## 6. HTTP Fundamentals (methods, status codes, headers, cookies)

- **Long video setting (avoid):** a letter and a receipt.
- **Reel setting:** a giant futuristic vending machine. Buttons are methods, coloured lights are status codes, a cookie token drops out.
- **On-screen hook:** "Every app is a vending machine"

**Narration (~150 words)**
> Every app on your phone is talking to a vending machine. Press a button: that's the method. GET: show me. POST: make something new. PUT: replace it. DELETE: remove it. GET is safe, it changes nothing. PUT and DELETE are safe to repeat: press twice, same result. POST twice? Two orders. That's how double charges happen. The machine answers with a three-digit light. Two hundreds: success. Three hundreds: go look somewhere else. Four hundreds: your mistake, like four oh four, not found, or four oh one, who are you? Five hundreds: the machine broke. Little labels ride along, the headers: what format, what language, how long to keep it. And the machine forgets you instantly. It's stateless. So it hands you a token, a cookie, and you show it every time. Button, light, label, cookie. That's H T T P.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Camera swoops from phone screen into a giant glowing vending machine | | whoosh |
| 4-12 s | Four big buttons press in, each does its thing (show item, new item drops, item swaps, item vanishes) | GET POST PUT DELETE | button clunks |
| 12-20 s | POST pressed twice, TWO items drop and a "charged x2" receipt prints | x2 | double clunk |
| 20-34 s | Light tower flashes green 200, blue 301, orange 404, red 500 (machine sparks) | 200 / 3xx / 4xx / 5xx | dings, buzzer, spark |
| 34-40 s | Small tags clip onto the item as it slides out | HEADERS | clip sounds |
| 40-50 s | Machine "blinks" and forgets; drops a cookie token; next visit, token is shown and machine says hi | COOKIE | coin drop |
| 50-56 s | Back out to the phone (loop) | | |

---

## 7. HTTP/1.1 vs HTTP/2 vs HTTP/3

- **Long video setting (avoid):** noon rush, single window, shared lobby, hub of doors.
- **Reel setting:** a three-stage race on roads seen from above, like a racing game.
- **On-screen hook:** "Same page. 3 speeds."

**Narration (~150 words)**
> Same page. Three speeds. Watch. H T T P one point one: one road, one car at a time. The next request waits for the last reply. Browsers cheat by opening six roads at once. Still slow. H T T P two: one road, but every request is chopped into small pieces that share it, side by side. That's multiplexing. Headers get squeezed smaller too. Huge win. Until one packet is lost. T C P freezes the whole road until it's resent, and every car stops. H T T P three leaves T C P and moves onto Quick. Each request gets its own lane. A crash in one lane, and the others keep driving. It connects faster, and it survives switching networks. One road. Shared road. Separate lanes. That's the whole story of H T T P versions.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Top-down race HUD, three lanes labelled 1.1, 2, 3, countdown 3-2-1 | 3 SPEEDS | countdown beeps |
| 4-16 s | 1.1: cars go one at a time; then 6 parallel roads appear, still a queue | ONE AT A TIME | engine idle, horn |
| 16-26 s | 2: tiny cars weave together on one road, fast | MULTIPLEX | speed whoosh |
| 26-34 s | A pothole hits one car; every car on the road brakes (physics pile-up) | FROZEN | screech, crunch |
| 34-46 s | 3: separate lanes; crash in one, others zoom past | HTTP/3 | engine roar |
| 46-56 s | Finish line, timer shows 3 times; back to the start grid (loop) | | finish horn |

---

## 8. TLS and HTTPS

- **Long video setting (avoid):** password at the café, ID office.
- **Reel setting:** a crowded glass tunnel. A phone and a server send glowing boxes through it while floating camera-eyes watch every box.
- **On-screen hook:** "Everyone can see your packets. No one can read them."

**Narration (~145 words)**
> Everyone on this wifi can see your packets. Not one of them can read them. Here's the trick. Your browser says hello. The server shows an ID card, its certificate, signed by an authority your phone already trusts. Fake ID? The browser slams the door. Next, both sides do some open math in public, and each ends up with the same secret key, without ever sending it. The watcher saw every step and still can't work it out. From now on, every message is locked with that key. That's T L S. The newest version does all this in one quick back-and-forth. Coming back? Sometimes none at all. Two jobs, never forget them: prove who you're talking to, and keep it secret. The lock in your address bar means both happened. That's H T T P S.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-6 s | Dozens of floating camera-eyes scan packets drifting through a tunnel; packets show only scrambled glyphs | CAN'T READ | static hiss |
| 6-16 s | Phone sends a hello pulse; server projects a glowing ID badge; a trust seal stamps onto it | CERTIFICATE | stamp |
| 16-20 s | Fake ID version: door slams shut | FAKE = BLOCKED | slam |
| 20-32 s | Two paint streams mix in the open; both ends turn the same colour; camera-eyes flash ??? | SHARED KEY | mixing swirl |
| 32-40 s | Every box now gets a padlock that snaps shut | ENCRYPTED | lock clicks |
| 40-48 s | Stopwatch: 1 round trip; repeat visit 0 | 1-RTT / 0-RTT | tick |
| 48-56 s | Camera pushes into a browser address bar padlock; back to the tunnel (loop) | HTTPS | chord |

---

## 9. HTTP Caching (Cache-Control, ETag, 304)

- **Long video setting (avoid):** detective case, two gates, warehouse.
- **Reel setting:** a kitchen fridge full of leftovers with expiry stickers and fingerprints.
- **On-screen hook:** "The fastest request is the one you never send"

**Narration (~145 words)**
> The fastest request is the one you never send. Your browser keeps a fridge. Every saved response gets an expiry sticker: Cache-Control, max age. Still fresh? Eat it. No network at all. Expired? Don't throw it out yet. Call the server and read it the fingerprint printed on the box, the E Tag. Same version? The server says three oh four, not modified. Tiny reply, nothing to download. Keep eating. Changed? You get the new one. Two gates: fresh first, then check. A few labels matter. No-store: never put it in the fridge, like bank details. Private: only your own fridge, never a shared one. And Vary says one address can hold different versions, like English and Hindi. Get the stickers wrong, and users eat stale food for hours. Get them right, and your servers barely notice the traffic.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Fridge door swings open toward camera, light spills out | 0 REQUESTS | fridge hum |
| 4-12 s | Close-up: box with a sticker, a ring timer draining; still green, grabbed instantly | MAX-AGE | grab |
| 12-26 s | Timer red; phone calls server, a scanner reads fingerprint on the box, green "304" stamp | ETAG → 304 | scanner beep, stamp |
| 26-30 s | Other version: fingerprint mismatch, new box slides in | 200 NEW | slide |
| 30-42 s | Three labels slap on boxes: NO-STORE (box bounces away from fridge), PRIVATE (lock), VARY (box splits into two languages) | NO-STORE / PRIVATE / VARY | slaps |
| 42-50 s | Stale moldy box served, red complaint counter climbs; then correct stickers, server fans go quiet | STALE | squelch, snore |
| 50-56 s | Fridge door closes (loop) | | thud |

---

## 10. CDN and Edge (v2 reel)

- **Long video setting (avoid):** bakery branches. **Old reel (avoid):** globe with glass pods.
- **Reel setting:** a city full of smart pickup lockers on every corner, with one giant warehouse across the ocean.
- **On-screen hook:** "The site is in America. You're in Mumbai. Why is it instant?"

**Narration (~140 words)**
> The website lives in America. You're in Mumbai. So why does it load instantly? Because you're not talking to America. Companies put copies of their files in lockers in hundreds of cities. That's a C D N, and each locker is an edge. You ask, the nearest locker pops open. A hit. A few milliseconds. Locker empty? That's a miss. It fetches from the origin once, keeps a copy, and the next thousand people get it instantly. Each copy has a timer, the cache-control header, telling the locker how long it stays fresh. Changed the file? Purge it, or give it a new name. And when a million people hit an empty locker at once, the edge sends just one request back home. That's request collapsing. Copies close. Origin safe. That's a C D N.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-5 s | Map flies from America to Mumbai, phone taps, page appears instantly | INSTANT? | tap |
| 5-14 s | Camera dives into Mumbai streets: lockers glowing on every corner | EDGE | city ambience |
| 14-20 s | Locker pops open, parcel shoots onto the phone, timer 8 ms | HIT | spring pop |
| 20-30 s | Empty locker: drone flies across the ocean to the warehouse, returns, locker fills, a queue of phones light up one by one | MISS | drone buzz |
| 30-38 s | Timer ring on a parcel drains | CACHE-CONTROL | tick |
| 38-44 s | Red purge wave across every locker, old parcels dissolve | PURGE | sweep |
| 44-52 s | A swarm of phone pings hits one locker; gate drops, only one drone leaves | 1M → 1 | swarm buzz, gate |
| 52-56 s | Back to the phone (loop) | | |

---

## 11. Forward and Reverse Proxies (L4 vs L7)

- **Long video setting (avoid):** a go-between with sealed envelopes.
- **Reel setting:** a city of glass tubes. A mirror booth sits on the user's side (forward proxy); a shield gate sits in front of the servers (reverse proxy).
- **On-screen hook:** "Two middlemen. Same job. Opposite sides."

**Narration (~150 words)**
> Two middlemen. Same job. Opposite sides. The first works for you. A forward proxy. You hand it your request, and it goes out in your place. The website sees the proxy, not you. Companies use it to filter traffic or hide who's browsing. The second works for the server. A reverse proxy. Everyone thinks they're talking to the website. They're really talking to its front gate. It checks tickets, handles the encryption, spreads the crowd across many servers, and hands out saved copies. Now the levels. A layer four proxy only sees the envelope: address and port. Super fast, but it can't read the letter. A layer seven proxy opens it, reads the path and headers, and routes by them. Smarter, a bit slower. One catch: the server only sees the proxy's address, so the real client rides in a header, X Forwarded For. Trust it only from your own proxy.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-6 s | Split-frame: mirror booth on the left, shield gate on the right, camera spins between | SAME JOB? | shutter |
| 6-18 s | User's glowing letter enters the mirror booth and exits with the booth's colour; website's scanner sees only the booth | FORWARD | footsteps |
| 18-32 s | Flood of letters hits the shield gate; it scans each, splits them to 3 server doors, fires back pre-made copies | REVERSE | ticket scan beeps |
| 32-40 s | L4 scanner reads only the outside of the envelope, flips it through fast | L4 | swoosh |
| 40-46 s | L7 scanner opens the letter, highlights the path, a track switches to one door | L7 | paper rustle |
| 46-56 s | Server sees only the gate; a tag "real sender = X" is pinned to the letter; back to split frame (loop) | X-FORWARDED-FOR | pin click |

---

## 12. Nginx

- **Long video setting (avoid):** hotel opening night, receptionists.
- **Reel setting:** a busy train junction at night. One signal tower switches tracks for thousands of trains.
- **On-screen hook:** "10,000 connections. A few workers. No sweat."

**Narration (~145 words)**
> Ten thousand connections. A few workers. No sweat. That's Engine X. Old servers hired one worker per visitor, and ran out of workers fast. Engine X workers never wait. Each one juggles thousands of connections, jumping to whichever is ready. That's the event loop. Now the job. A request arrives. The switch reads the address and the path, and matches a rule, a location block. A static image? Served straight from disk. An API call? Sent to a group of backend servers, the upstream, shared out in turns. One backend dies? It's skipped. Too many requests from one person? The rate limiter makes them wait. It also handles the H T T P S lock so your app doesn't have to. One fast switch in front of everything. That's why so many sites put Engine X at the front door.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-5 s | Aerial night shot: thousands of train lights converging on one tower | 10,000 | train horns |
| 5-16 s | Old way: one track per train, tracks run out, trains stack up. New way: a few robotic switch arms flipping super fast | EVENT LOOP | levers |
| 16-24 s | Close-up: train's destination board read, track switches with a clang | LOCATION | clang |
| 24-30 s | Image train goes to a local shed and back instantly | STATIC | quick whoosh |
| 30-40 s | API trains fan out to 3 stations in turn; one station goes dark, trains skip it | UPSTREAM | switch clunks |
| 40-48 s | One spam train gets a red signal and waits | RATE LIMIT | buzzer |
| 48-56 s | Tower puts a lock on every outgoing train; pull back to the aerial (loop) | HTTPS | lock click |

---

## 13. Network Debugging (dig, curl, ss, tcpdump)

- **Long video setting (avoid):** detective investigation.
- **Reel setting:** a scanner bay. The website is a glowing machine on a bed with a heart monitor; four scanners sweep it layer by layer against a countdown.
- **On-screen hook:** "Site's down. 60 seconds. Find it."

**Narration (~150 words)**
> Site's down. You've got sixty seconds. Go layer by layer. One: is the name right? Run dig. If the address is wrong or missing, it's D N S. Two: can you reach the door? Curl with timing shows every stage: the name lookup, the connect, the T L S handshake, the first byte. The slow stage is your suspect. Connect hangs? A firewall, or the server's down. T L S fails? Expired certificate. Fast connect but slow first byte? The app itself is slow. Three: on the server, S S lists every connection. Thousands stuck waiting? Something's leaking. Four: still lost? T C P dump records the raw packets. Resets, retries, silence. The truth is in there. Name, door, sockets, packets. Never guess. Measure. That's network debugging.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Heart monitor flatlines, a 60 s countdown starts | 60 s | flatline beep |
| 4-12 s | Scan 1: a ring scanner sweeps the machine's name tag | DIG | scan beep |
| 12-28 s | Scan 2: a bar-chart timeline grows 4 bars (lookup, connect, TLS, first byte); one bar glows red; three quick variants flash | CURL | bars growing |
| 28-38 s | Scan 3: x-ray shows hundreds of tangled tubes (connections) stuck | SS | tension sting |
| 38-46 s | Scan 4: microscope on raw packets, red RST sparks visible | TCPDUMP | crackle |
| 46-52 s | Fix applied, heart monitor back to a steady beep, countdown stops | | steady beep |
| 52-56 s | Four icons in a row, then back to the monitor (loop) | NEVER GUESS | |

---

## 14. What Happens When You Type a URL

- **Long video setting (avoid):** sixty-second sale, notebook, vault, head office.
- **Reel setting:** a video-game speedrun with on-screen split timers. The request is a glowing orb racing through six levels.
- **On-screen hook:** "You pressed Enter. Here's the next half second."

**Narration (~150 words)**
> You hit enter. Here's the next half second, in slow motion. First, the browser checks its notes. Seen this site lately? Skip ahead. If not, D N S turns the name into an I P address. Next, T C P: three quick handshakes to open a line. Then T L S: the server shows its ID, and both sides agree on a secret key. Now the request finally flies. It often lands at a C D N edge near you. Cached? Straight back. If not, it travels to a load balancer, then a server, maybe a database. The H T M L comes back. The browser reads it, finds more files, fetches them side by side, builds the page, and paints the pixels. Name, connect, lock, ask, answer, draw. Six steps. Every single click. Under a second.

| Time | 3D shot | Big word | SFX |
|---|---|---|---|
| 0-4 s | Finger hits Enter, time freezes (slow-mo ripple), speedrun timer appears | 0.000 s | bass drop |
| 4-12 s | Level 1: orb passes a notebook (cache) and a giant phonebook tower (DNS) | DNS | split chime |
| 12-20 s | Level 2: three handshake gates swing open | TCP | three clacks |
| 20-26 s | Level 3: ID scanner, then a vault door locks behind the orb | TLS | lock |
| 26-38 s | Level 4: orb hits a nearby edge kiosk; if missed, rides a rail to load balancer, server, database | CDN → SERVER | rail whoosh |
| 38-48 s | Level 5: orb returns with a scroll (HTML), it bursts into many small orbs fetching images and styles | HTML | burst |
| 48-54 s | Level 6: pixels rain down and assemble the page | PAINT | sparkle |
| 54-58 s | Split timer list, back to the Enter key (loop) | < 1 s | finish chime |

---

## Pronunciation spellings used (check after voices)

T C P, U D P, Quick (QUIC), Engine X (Nginx), Sin / Sin ack / Ack (SYN, SYN-ACK, ACK), E Tag, T T L, S S (ss), T C P dump, X Forwarded For, V P C, NAT (said "nat").

## Build order suggestion

Start with **What Happens When You Type a URL** (series trailer, touches every other topic), then follow the vault order: Internet, IP/VPC, DNS, TCP, UDP/QUIC, HTTP, HTTP Versions, TLS, Caching, CDN, Proxies, Nginx, Debugging.
