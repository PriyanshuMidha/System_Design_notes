# Orbit Station: API series bible

World: Orbit Station, a busy spaceport. Ships (clients) dock, order cargo, talk to the station's services (APIs). Every API idea is a physical thing: a hatch, a manifest, a docking protocol. Shared across all videos so the series feels connected; each video has its OWN plot with stakes.

## Recurring cast (same voices every video)
| Character | Plays | Role |
| --- | --- | --- |
| Commander Vega | station mission controller | hero, solves each case, explains |
| Pip | new cadet | rookie, asks the interview questions |
| Dock Master Brix | API gateway | one door for every ship, checks papers |
| Customs Officer Lex | the contract / OpenAPI spec | stamps what is allowed |
| Tala | gRPC / protobuf translator droid | compact binary speech |
| Radio Operator Echo | WebSocket / SSE / webhooks | live channels |
| Narrator | explains real terms | as before |
Guest ships per video (a freighter, a medical ship, a tourist liner) are the clients with the problem.

## Episode order and plot seeds
1. API Contract Design and OpenAPI: two crews build against a spec nobody agreed on; Lex's contract stops a hatch mismatch before launch.
2. Choosing an API Style: three ways to brief a ship (REST, GraphQL, gRPC).
3. REST and HTTP API Design: the station's naming of hatches, verbs and status lights.
4. Pagination, Filtering and Sorting: the endless cargo manifest.
5. API Error Handling: a ship is turned away; clear reason codes save the day.
6. Idempotency and Idempotency Keys: a cargo order sent twice, paid twice.
7. API Versioning and Backward Compatibility: old ships still on the v1 docking protocol.
8. API Gateway and BFF: Brix, and a custom front desk per ship type.
9. GraphQL: one shopping list instead of five trips.
10. gRPC and 11. Protocol Buffers and Schema Evolution: Tala's compact speech; changing fields without breaking old ships.
12. Real-time APIs: WebSocket, SSE, long polling: live docking status.
13. Webhooks: a ship pings the station on arrival; retries, signatures.
14. File Upload Architecture: hauling oversize cargo in chunks.
15. SOAP and WSDL: the ancient legacy freighter.

## Style (same as networking series)
Plot with stakes, each part a character in a place, evidence cards instead of dim panels, case/progress board, Go code chapter, deep dive, trade-offs, failures, monitoring, rookie Pip asks / Vega answers interview, summary, read-next card, ending. Chapter cards between topics.

## Voices (fixed for every episode; reuse these in cast.json)
| Speaker key | Character | edge-tts voice | rate | pitch |
| --- | --- | --- | --- | --- |
| N | Narrator | en-US-EmmaMultilingualNeural | 4 | 0 |
| VEGA | Commander Vega (hero) | en-US-AriaNeural | 4 | 0 |
| PIP | Pip (rookie) | en-US-ChristopherNeural | 6 | 3 |
| BRIX | Dock Master Brix (gateway) | en-GB-RyanNeural | -2 | -2 |
| LEX | Customs Officer Lex (contract) | en-US-EricNeural | -3 | -4 |
| TALA | Tala (gRPC / protobuf droid) | en-AU-NatashaNeural | 4 | 4 |
| ECHO | Radio Operator Echo (live channels) | en-US-AndrewMultilingualNeural | 2 | 0 |
Guest voices are per episode. Episode 1: ODE (Captain Ode of the medical ship Mercy) en-US-AvaNeural 2/2; KOV (Kov, Bay 7 yard engineer) en-US-RogerNeural 0/-2.
Setting: spaceport backdrop (stars, planet, deck plates, round docking hatches), helpers `space()` and `bay()` defined inside each episode's scenes.js.
