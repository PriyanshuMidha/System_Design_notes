# CDN and Edge: video script

> Spoken script for the video. About 6.5 minutes. Source: [[CDN and Edge]]. Tone cues and animation steps are in `storyboard.html`.
Total about 1070 spoken words.


## Scene 1: CDN and Edge

**On screen:** title card.

**Say:** Quick question. Your server is in Virginia. Your shopper is in Mumbai. How long does one product photo take to reach her? Longer than you think. So let's fix that, with a CDN.

## Scene 2: The problem: distance

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Here is the problem. A message between Mumbai and Virginia takes somewhere between a hundred eighty and two hundred fifty milliseconds, each way. Add the TCP and TLS handshakes, and the first byte of a cold connection can take four to six hundred. And your one server has to hold every connection, and send every byte itself. That is too slow, and too much work for one machine!

## Scene 3: The idea: a chain of warehouses

**On screen:** 5 things appear one by one, each as it is mentioned.

**Say:** So here is the idea. Think of a chain of warehouses. The factory is your origin server. Do not ship everything from there. Put a regional warehouse in the middle. That is the origin shield. And a local one right in Mumbai. That is a pop, a point of presence. Now the shopper orders from the local shelf. The factory only ships when every warehouse is empty.

## Scene 4: Four words to know

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Four words, and you can follow everything else. A hit: the pop has a fresh copy, and answers instantly. A miss: no copy, so it asks the next warehouse up. TTL: how long a copy counts as fresh. Max age equals thirty six hundred means one hour. And a pop is simply one CDN data center, in one city.

## Scene 5: Getting to the nearest PoP

**On screen:** 2 things appear one by one, each as it is mentioned.

**Say:** How does she reach the nearest pop? There are two ways. Anycast. Every pop announces the same IP address, and internet routing simply sends her to the closest one. Cloudflare and Fastly work this way. GeoDNS. The CDN's name servers hand out a different IP address for each region, based on where the resolver is. CloudFront and classic Akamai setups use this.

## Scene 6: Hit, miss and revalidation

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Now she asks for the product photo. If the copy is fresh, that is a hit. Served in milliseconds. If it is stale but has an ETag, the pop asks the origin one cheap question: has this changed? A three oh four reply means no. Reuse what you have. And if there is no copy at all? That is a miss. Fetch it, store it, serve it.

## Scene 7: Real headers from a real CDN

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Let us look at real headers from MDN, served by Fastly. Cache control says: keep this for an hour. Now look at age. Two thousand two hundred five. That response had been sitting in a cache for over half an hour. The origin never even saw this request! And x cache lists one result per tier it passed through: miss, hit, miss.

## Scene 8: Cache-Control: who may keep it, and for how long

**On screen:** 5 things appear one by one, each as it is mentioned.

**Say:** Headers decide what a CDN may keep. Max age: fresh for this many seconds, in every cache. S max age: the same, but for shared caches only, like the CDN. No cache. It sounds like don't cache, but it is not! It means: cache it, but check with the origin before serving. No store is the real never store. And private means only the user's own browser may keep it.

## Scene 9: The cache key, and why Vary matters

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Next, the cache key. By default it is the scheme, host, path and query string. Same key, same copy. Varying on Accept Encoding is fine. Gzip and brotli just get their own copies. But vary on Cookie? Almost every request has a different cookie, so almost every request becomes its own key, and your hit ratio collapses. And strip tracking parameters like u t m source, or one page turns into many misses.

## Scene 10: Request collapsing and the origin shield

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Picture a popular photo whose copy has just expired. A hundred requests arrive within five milliseconds, from pops all over. Every one of them misses, at the same instant. Without protection, all hundred go to your origin. That is a stampede, and you caused it yourself. Request collapsing fixes it. The first request goes. The others wait for it. The origin shield does the same, one tier up. A hundred requests. Exactly one origin request.

## Scene 11: Invalidation: removing an old copy

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** How do you get rid of an old copy? The best answer is: do not purge at all. Use versioned URLs. A new deploy means a new URL, and the old one is simply abandoned. Tag purge removes only the pages tagged with one object. Soft purge marks copies stale, but keeps serving them while a fresh one is fetched. And purge everything? Instant, but every pop hits your origin at once. That is how a routine deploy becomes an outage.

## Scene 12: Never cache what should not be shared

**On screen:** 5 things appear one by one, each as it is mentioned.

**Say:** Now, what must never be cached? Anything with Set Cookie. Mark authenticated responses private or no store. For paid downloads or video, use signed URLs, checked at the edge. Then two attacks to know. Cache poisoning: an unkeyed header lets one attacker response reach every user. Cache deception: add slash nonexistent dot CSS to a private page, and the CDN may cache it. The fix for both: the cache key must include everything the response varies on.

## Scene 13: Even uncacheable requests get faster

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** Not everything can be cached. Checkout, or a logged in dashboard, must reach the origin. But the CDN still helps. TLS and TCP end at the nearby pop, so the slow handshakes happen over a short hop. The pop keeps warm connections open to your origin, and reuses them. HTTP 3 avoids head of line blocking, and survives a switch from Wi-Fi to cellular. Some providers even carry the long leg over their own private backbone.

## Scene 14: Edge compute: your code at the PoP

**On screen:** 5 things appear one by one, each as it is mentioned.

**Say:** Then there is edge compute: your own code, running at the pop. A request first passes the WAF and bot checks. Then the cache. And if needed, your edge function. Good jobs for the edge: a JWT signature and expiry check, A B buckets, redirects, header rewrites. But the real authorization decision stays at the origin, because the edge only has an eventually consistent view of the world.

## Scene 15: Trade-offs: when a CDN is not the answer

**On screen:** 4 things appear one by one, each as it is mentioned.

**Say:** So, is a CDN always the answer? No. It adds a layer that can fail, or serve stale data. And a bug in Brazil means checking a pop you do not control. It fixes aggregate traffic, not one hot key. Highly personalized responses get little from caching. And for an internal service with no spread out users, a plain load balancer is simpler.

## Scene 16: Recap

**On screen:** 6 things appear one by one, each as it is mentioned.

**Say:** Let us recap. A CDN keeps copies in pops close to your users. Headers say what it may keep. The cache key says what is shared. Collapsing turns a hundred misses into one. Prefer versioned URLs over purges, and never cache private data. Cheap checks at the edge. Real decisions at the origin.
