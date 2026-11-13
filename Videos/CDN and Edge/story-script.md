# CDN and Edge: story script (voice only)

> Draft for review. Only the lines after each speaker name are spoken. `[tone]` marks and `(covers: ...)` notes are for you and are never spoken or shown. Source: [[CDN and Edge]].

## Cast

| Character | Plays | Voice |
| --- | --- | --- |
| **Maya** | The user in Mumbai, her browser | young, curious |
| **Oscar** | The origin server, one bakery in Virginia | tired, warm |
| **Pia** | The edge branch in Mumbai (a PoP) | quick, cheerful |
| **Sam** | The regional manager (origin shield) | calm, steady |
| **Narrator** | Explains each real term the moment it appears | clear, friendly |

In this story a loaf is a file on a website: a photo, a page, a video.

---

## Scene 1: One kitchen, one planet (covers: the problem, latency)

NARRATOR [hook]: This is Oscar. Oscar runs the only bakery in the world, in Virginia. His website is his shop, and every loaf is a file. A photo, a page, a video.

NARRATOR: And this is Maya. She lives in Mumbai. She clicks to open his shop.

MAYA: One loaf, please!

NARRATOR: Her request has to cross half the planet. Typically one hundred eighty to two hundred fifty milliseconds, each way. Add the handshakes, and the first byte of a cold connection can take four to six hundred.

NARRATOR [punch]: Now imagine fifty thousand Mayas, every single day. Every one of them held open by Oscar, and every loaf baked and carried by Oscar.

OSCAR [tired]: I cannot keep doing this.

## Scene 2: Pia opens a branch (covers: what a CDN is, PoP, cache hit)

NARRATOR: So Oscar has an idea. He opens a small branch right inside Mumbai, and puts Pia in charge. A chain of branches, placed close to the customers. That is a CDN, a content delivery network. Pia's branch is called a PoP, a point of presence.

PIA: Welcome! I keep copies of Oscar's loaves on my shelf.

MAYA: One loaf, please.

PIA [cheerful]: Right here!

NARRATOR [punch]: That is a cache hit. Milliseconds, not hundreds. And Oscar never even heard about it.

## Scene 3: A loaf Pia does not have (covers: miss, origin shield)

NARRATOR: Next, a customer asks for a loaf Pia has never stocked. That is a cache miss. Pia does not run to Virginia. She calls Sam, the regional manager.

PIA: Sam, do you have the rye?

SAM: Not today. I will ask Oscar.

NARRATOR: Sam is the origin shield, one regional tier between the branches and the bakery. Oscar bakes it once. It travels back through Sam to Pia. Pia keeps a copy.

PIA: And the next customer gets it from the shelf.

## Scene 4: How Maya finds Pia (covers: anycast, GeoDNS)

MAYA: But how do I reach the Mumbai branch and not the Virginia one?

NARRATOR: Two ways. With anycast, every branch shares one phone number, and the phone network rings the nearest. Cloudflare and Fastly work like this. With GeoDNS, the directory gives out a different number per region. CloudFront and classic Akamai do that.

## Scene 5: Labels and freshness (covers: Cache-Control, TTL, revalidation, 304)

NARRATOR: Oscar sticks a label on every loaf.

OSCAR: Fresh for one hour.

NARRATOR: That is max age, the T T L, how long a copy counts as fresh. Some labels are only for branches, that is S max age. A label that says "check with me first" is no cache. And one that says "never shelve this" is no store.

NARRATOR [question]: What happens when the hour is up?

PIA: I do not throw it away. I phone Oscar. Is the sourdough still the same batch?

OSCAR: Same recipe. Keep it.

NARRATOR: That is a three oh four. No new loaf is sent, only a cheap yes. The copy is fresh again.

## Scene 6: Which loaf is which (covers: cache key, Vary, tracking parameters)

NARRATOR: Pia needs to know which orders share one loaf. That is the cache key: the order itself. Sourdough sliced is one loaf. Sourdough whole is another.

MAYA: The gift wrap is blue!

PIA: Gift wrap does not change the bread. Same loaf.

NARRATOR [warn]: Those are tracking parameters, like u t m source. Ignore them. But if Pia kept a separate loaf for every customer's name tag, that is Vary on Cookie, no two customers would ever share one, and her shelf would be useless.

## Scene 7: Friday morning rush (covers: stampede, request collapsing, shield)

NARRATOR: Friday, nine a m. The sourdough's label runs out, and a hundred customers ask within five milliseconds, at branches all over the city.

NARRATOR [warn]: If every branch phoned Oscar, he would be buried. A stampede, and one the shop caused itself.

PIA: Everyone wait. I will phone once, for all of you.

NARRATOR: That is request collapsing. Sam does the same one tier up.

SAM: One call to Oscar. Not a hundred.

NARRATOR [punch]: A hundred requests. Exactly one for Oscar.

## Scene 8: What must never be shelved (covers: private, signed URLs, poisoning, deception)

NARRATOR: Then Maya orders a birthday cake with her own name on it.

PIA: This one is private. It never goes on a shared shelf.

NARRATOR [warn]: Private and no store exist for exactly this. A cake with one person's details, shelved publicly, goes home with a stranger. And a prankster who slips a fake label onto a loaf can have it handed to everyone. The fix: the shelf code must include everything that makes a loaf different.

## Scene 9: Changing the recipe (covers: invalidation, versioned URLs, purges)

NARRATOR: Oscar improves his sourdough. How do old loaves leave a hundred shelves?

OSCAR [punch]: I do not recall anything. I rename it. Sourdough Two.

NARRATOR: That is a versioned U R L. The old name is simply abandoned. Or Oscar can recall only the loaves with one tag, a tag purge, or mark old loaves stale while fresh ones arrive, a soft purge.

NARRATOR [warn]: But never shout "throw away everything". All the branches phone Oscar at the same second, and a routine change becomes an outage.

## Scene 10: Pia has a brain (covers: edge compute, dynamic acceleration)

NARRATOR: Pia is more than a shelf. At the door she checks tickets, an expiry check on a token. She redirects people, runs taste tests, and turns troublemakers away. That is edge compute, your own code at the branch.

PIA: But I never decide what a member may order. Oscar keeps the real member list. My copy is only eventually up to date.

NARRATOR: And custom orders, like checkout, cannot be shelved. Still, Pia keeps a phone line to Oscar always open, so the slow handshakes happen in Mumbai, in a short hop.

## Scene 11: When you do not need branches, and the recap (covers: trade-offs, recap)

NARRATOR [calm]: Branches are not free. Pia may serve a stale loaf. A problem in Brazil means checking a branch Oscar does not own. One viral loaf still funnels through one shelf slot. And a cafeteria with only local staff does not need branches at all.

NARRATOR: So, in short. Copies sit close to the customers. Labels say how long they are fresh. The key says what is shared. Collapsing protects Oscar. Rename instead of recall. Private stays private. Quick checks at the edge, real decisions at the origin.

MAYA [happy]: Thank you, Pia!

PIA: Next!

---

## Left out of this cut (can be added)

Signed cookies and HLS video segments, push versus pull CDNs, HTTP/3 and the private backbone, the provider comparison table, and the monitoring metrics.
