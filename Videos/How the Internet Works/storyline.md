# How the Internet Works: storyline (draft for review)

Source: [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP]]. Order: easy to advanced.

## Idea: "Ana's letter crosses the Postal Kingdom"

Ana presses enter on a web address. Her message, Pip the packet, must reach Sam, a server in another country. No road runs straight there. The story follows Pip, and every character is one part of the internet.

| Character | Plays |
| --- | --- |
| Ana | the app and laptop (a host) |
| Pip | a packet, about 1500 bytes of her message |
| Ted | the TCP/UDP clerk: stamps the port, the innermost envelope |
| Ivy | the IP clerk: writes the end-to-end address, the middle envelope |
| Eli | the Ethernet clerk: writes the next-hop MAC address, the outer envelope |
| Rory | a router: opens only the IP envelope, knows only the next hop |
| Gus, Gwen | two ISPs whispering BGP gossip |
| Sam | the server: a building (IP) with apartments (ports) |
| Narrator | explains each real term as it appears |

## Scenes

**Level 1: the basics**
1. **One second, no straight road.** The page appears in under a second, yet no wire goes straight to Sam. The old phone operator reserved a whole wire for a call and wasted it in silences. The internet's bet: cut messages into packets, label each, route each on the best path right now.
2. **Words first.** Host, packet, IP address, port, router, header, protocol, ISP. Rule of the world: the IP address finds the machine, the port finds the program.
3. **Nested envelopes.** Ted writes the port, Ivy writes the IP address, Eli writes the MAC address. This is encapsulation. A router opens only the IP envelope. A switch opens only the Ethernet one. The Ethernet envelope is thrown away and replaced at every hop; the IP envelope survives the whole trip.

**Level 2: the core**

4. **Hop by hop.** No router knows the full path. A link breaks mid-trip and the next packet takes another road. Cost: packets can arrive out of order, duplicated or lost, and TCP exists to repair that.
5. **Seven layers or four?** OSI is a 1980s teaching map; no real stack runs seven separate protocols. The real model is TCP/IP's four: Link, Internet, Transport, Application. The layer numbers are shorthand ("L4 load balancer", "L7 proxy").
6. **Gossip between kingdoms: routing and BGP.** Inside one network, routers share routes. Between networks, they gossip: "I can reach this block, path [3]", passed on with each AS adding its name. Shortest AS-path wins. One cable cut reroutes traffic; a liar can hijack a prefix, and RPKI is the bolt-on fix.
7. **The envelope has a size limit.** MTU 1500 bytes. TCP agrees a segment size (MSS) up front; UDP and ICMP can fragment, and losing one fragment means resending the whole packet. Path MTU discovery, and the classic symptom: everything works except big responses (VPN header pushes packets over 1500).
8. **Building and apartments: ports and the 5-tuple.** Two browser tabs to the same site share every field except the source port. The kernel finds each connection by protocol, source IP, source port, destination IP, destination port. One listening port serves thousands of clients.

**Level 3: advanced**

9. **Loose ends that matter.** TCP vs UDP in one line each. TTL is a hop counter that stops loops, and traceroute abuses it. EtherType and the IP protocol field decide how each header is read. Anycast is the same IP announced from many places, so BGP sends you to the nearest.
10. **When it breaks.** MTU black hole, BGP leak or hijack, port exhaustion (about 28,000 ephemeral ports on Linux), and what to monitor.
11. **Summary.** Seven points, easy to advanced. Last line: the IP address finds the machine, the port finds the program, and routers pass each packet one hop at a time.

## Open choices

- One video (about 12 minutes) or two parts: levels 1 and 2, then level 3.
- Keep or rename the cast.
