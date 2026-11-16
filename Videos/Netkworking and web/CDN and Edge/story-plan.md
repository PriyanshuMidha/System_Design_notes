# CDN and Edge: story plan (characters, voices, animation)

> Draft for review. Words spoken = [[story-script]] (voice only). This file = what the viewer SEES. Screen never repeats the spoken sentences: only motion, props, speech-bubble icons and tiny labels.

## 1. Characters (look + voice)

Flat cartoon style, drawn in SVG, each with idle bob, blink, mouth flap while talking, and a speech bubble that lights up when they speak.

| Character | Plays | Look | Voice (edge-tts) | Delivery |
| --- | --- | --- | --- | --- |
| **Narrator** | explains terms | no body; a small glowing "term card" pops in at the corner each time a real word is named | Emma (current) | clear, friendly |
| **Maya** | user, browser | girl, orange kurta, phone in hand, Mumbai skyline behind her | Neerja (en-IN) | young, curious, bright |
| **Oscar** | origin server | big baker, white hat, flour on apron, sweaty, one huge oven, Virginia flag | Guy (en-US male) | tired, warm, slow |
| **Pia** | edge PoP | small quick baker, green apron, shop with shelf and a bell | Ava (en-US) | fast, cheerful |
| **Sam** | origin shield | grey suit, glasses, clipboard, desk between Mumbai and Virginia | Brian (en-US male) | calm, steady, low |

Voices are a first pick. Before the full build I render one test line per character and you approve or swap.

Props: **loaf** = file (little label chip: photo / page / video), **label tag** = Cache-Control, **shelf** = cache, **phone line** = connection, **ticket** = token.

## 2. Stage and motion

- One continuous map: Mumbai on the left, Sam's regional desk in the middle, Oscar's bakery in Virginia on the right. Camera pans and zooms between them, no slide changes.
- Real motion: characters walk, loaves slide along a dotted route, a clock hand spins for latency, phone line pulses, crowd of Mayas floods in, shelves fill.
- Delivery distance is shown as route length; the ms number appears only as a small tag on the route.
- Cues stay synced to voice: each beat starts at the exact phrase.

## 3. Scene-by-scene animation (what you see while the voice speaks)

1. **One kitchen, one planet.** Wide shot of the globe. Oscar's tiny bakery on the right edge, steam rising. Maya on the left taps her phone; a loaf-request bubble flies a long dotted route across the globe with a spinning clock. Route glows red. Then 50,000 Mayas flood in from the left, queue wraps round the world. Oscar's oven smokes, he wipes his brow. Tag: `180-250 ms` on the route.
2. **Pia opens a branch.** Camera zooms to Mumbai. A little shop builds itself (walls drop in, sign, bell). Pia walks in and stacks copies of loaves on a shelf. Maya walks over, bell rings, loaf handed back in one beat, clock barely moves. Oscar far away yawns, never notices. Term cards: `CDN`, `PoP`, `Cache hit` (green flash on the shelf).
3. **Loaf Pia lacks.** New customer asks for rye; shelf slot is empty (grey outline). Pia picks up phone, line runs to Sam's desk. Sam shakes head, phones Oscar. Oscar bakes, loaf travels back along the route, passes Sam, lands on Pia's shelf; slot fills. Term cards: `Cache miss`, `Origin shield`.
4. **How Maya finds Pia.** Map of many branches. Maya dials; one shared phone number rings the nearest branch (ripple spreads, nearest lights up). Second half: a directory book flips and gives each region its own number. Provider names appear as small logos-as-text chips, not read on screen. Term cards: `Anycast`, `GeoDNS`.
5. **Labels and freshness.** Oscar slaps a tag on a loaf. A one-hour timer ring starts on the tag and drains. Other tags swap in: branch-only tag, "ask me first" tag, "never shelve" tag crossed shelf. Timer hits zero, loaf turns slightly stale. Pia phones Oscar, a thumbs-up "same batch" icon returns, ring refills. Term cards: `max-age`, `s-maxage`, `no-cache`, `no-store`, `304`.
6. **Which loaf is which.** Pia's shelf has slots with key plates. Sliced and whole sourdough sit in different slots. Maya adds a blue ribbon: ribbon is peeled off and the same slot is used. Bad ending: shelf splits into hundreds of tiny one-person slots, mostly empty. Term cards: `Cache key`, `UTM ignored`, `Vary: Cookie`.
7. **Friday rush.** Clock shows 9:00, label ring hits zero, a hundred Mayas press the bell at once across several branches. All phone lines race toward Oscar, he is buried under ringing phones. Replay: Pia raises a hand, crowd freezes, ONE line goes out; Sam does the same one tier up. Counter: `100 requests -> 1 to origin`. Term cards: `Stampede`, `Request collapsing`.
8. **Never shelved.** Maya orders a cake with her name in icing. Pia stamps `PRIVATE`; the cake goes straight to Maya, never to shelf. Warning replay: cake on shelf, a stranger walks away with it, name mismatch flash. Prankster slips a fake label on a loaf, it is handed to everyone (red glow). Fix: key plate grows extra fields. Term cards: `Private`, `Poisoning`, `Deception`.
9. **Changing the recipe.** Oscar writes a new recipe. Hundreds of old loaves on shelves. Option A: sign changes `Sourdough` to `Sourdough 2`, old loaves fade away unused. Option B: tag purge, only tagged loaves vanish; soft purge, old loaves turn stale but stay. Warning: Oscar hits "everything" red button, all branches light up and phone him at once, oven overloads. Term cards: `Versioned URL`, `Tag purge`, `Soft purge`.
10. **Pia has a brain.** Thought bubble over Pia. At the door she checks tickets (expiry date glow), redirects a customer, shows two door signs for A/B test, bounces a troublemaker. Then a small "can they order?" question mark; Pia points to Oscar's member book: "real decisions there". Custom order (checkout) bypasses shelf, but Pia's always-open phone line to Oscar is already warm, so the handshake sparks happen on the short Mumbai hop. Term cards: `Edge compute`, `Auth at origin`, `Warm connection`.
11. **Trade-offs and recap.** Camera pulls back to globe. Cost coins drain, a stale loaf appears, Brazil branch outside Oscar's control, one viral loaf at a single shelf slot. A tiny office with only local staff: no branch needed. Then six quick icons light in order (copies close, labels, key, collapsing, rename, private) while Maya says thanks and Pia says "Next!". Term card: `Trade-offs`.

## 4. Build changes needed (not started)

- New scene engine in the skill: inline SVG characters, JS timeline with position tweens (walk, slide along path, scale, camera pan), speech bubble, term cards. Frames still captured by seeking the timeline in headless Chrome.
- Per-speaker voices: each line synthesized with its character voice and tone, then joined; mouths flap only during that speaker's audio.
- Pronunciation pass: I will render a test clip with all hard words (CDN, PoP, TTL, anycast, GeoDNS, Fastly, CloudFront, Akamai, UTM, 304) and you tell me which sound wrong.
- Cost: about 40-60k tokens, 3-5 min build, no money. Output `Videos/CDN and Edge/CDN Story.mp4`.

## 5. Decisions for you

1. Approve the cast and voices, or tell me which to swap (e.g. Maya as a boy, Sam as a woman).
2. Approve the 11 scenes, or add/cut.
3. Say "build it" and I build the video.
