---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^3zIyHq3o

2. Core flow: assign with offer and timeout ^iy65VlXL

3. State machines: Partner and Offer ^cplbj6vt

4. Live location tracking ^t1sEAPC0

5. Storage ^PYD9x0Qq

OfferService
- ttl 20 s, now func()
- offers, tried per order
+ Start(ctx, order) Offer
+ Accept / Reject(ctx, offerID)
+ ExpireDue(ctx) ^kReZrGT2

Assigner (Facade)
- radiiM [1000 2000 3000]
+ Assign(ctx, order)
- claimNearest(order, skip)
- bookThirdParty(order) ^NAe3uRxV

Assignment
- PartnerID or
  Provider + TrackingID ^B4hbNwyB

Offer
- ID, OrderID, PartnerID
- Status, ExpiresAt ^awjf36aX

Fleet
- partners, staleAfter
+ Nearby(center, radius)
+ TryClaim(partner, order)
+ Release(partner) ^Vgsw5EGS

<<interface>>
RankingStrategy
+ Rank(order, cands) ^gyMZPEJL

<<interface>>
ThirdPartyProvider
+ CreateDelivery(ctx, order) ^kKobY2WB

Order
- ID
- Pickup, Drop ^ETiW9WF2

Partner
- ID, Status
- Loc, LocatedAt
- ActiveOrder ^SGjH11Xx

NearestFirst
sort by distance ^auCJIj6h

PorterAdapter
wraps vendor SDK
BookTrip(ref = orderID) ^1WukGGwJ

Order packed
at dark store ^HbC0z7Cr

Fleet.Nearby
1 km, fresh GPS,
ranked nearest ^MUTouhPM

TryClaim
available -> busy
(atomic) ^Tm9fKbPx

Offer to rider
expires in 20 s ^WTFtK9Kz

Accept in time ^nS7pCBeM

Assigned in-house ^5PiCeY6Y

None in radius:
expand to 2 km, 3 km ^XkMiqgR5

Lost race:
try next candidate ^UPaVFkhq

Reject, timeout or late accept:
release rider, mark tried,
offer next rider ^ULzkeOmT

Nobody untried left:
3PL via adapter,
idempotency key = order ID ^V2PwufDw

3PL fails:
ErrNoPartner,
retry queue + ops alert ^Ll3Oae16

Offline ^PrN2fazC

Available ^GtsCbd9U

Busy ^8JmYMYKD

Pending ^JPXjTika

Accepted ^99TKhNt9

Rejected ^jQhPezDz

Expired ^5HhKsLT9

Rider app
GPS every 3-5 s ^bQkZ2k3P

Location Service
drop out-of-order pings ^AFTc0vSX

Redis GEO
latest point only
GEOSEARCH 1 km ^ZghgjYUz

Customer app
WebSocket ^U9PxCmw5

3PL webhook
signed ^bgIno5Qs

Kafka
location topic ^ZdLBftwr

Tracking Service
push every few s ^hIcFTMDx

History store
partitioned by day ^IM3dsUvj

delivery_partners
id PK, status
active_delivery_id
claim: WHERE status='available' ^dYWnPmwO

deliveries
id PK, order_id UNIQUE
provider, partner_id
status, radius_m ^B426DkAc

assignment_attempts
delivery_id, partner_id
result, expires_at
UNIQUE (delivery_id, partner_id) ^uRzDE0jW

third_party_requests
delivery_id, provider
idempotency_key UNIQUE ^tM4sF7Pd

uses ^3VFQMBSN

1 to many ^tMrtjEZv

uses ^xig0xU5z

uses ^qBfgsfr1

fallback ^0JnpSmEW

1 to many ^4rAVdsKB

implements ^in2DY48K

implements ^LHJSzZDY

many to 1 ^NLpWvtRT

creates ^iZOuciSb

none ^DAH1wYa9

0 rows ^PnCmGNvz

no ^kxSQt3MW

skip tried ^8MjbN4L0

still none ^6DeLbKCW

error ^8Qi9Tn9C

go online ^99GKovXN

go offline ^Bzqg3mXv

claimed ^39T8c4qR

reject, expire, delivered ^K0PU7NId

Accept before ExpiresAt ^ga2hegq4

Reject ^NRVdvU2N

20 s or late Accept ^K7tNIdDW

stream ^0fuiRnvH

GEOADD ^fhFGF78D

append ^DPZ5TLtA

consume ^jtnFEB1R

WebSocket push ^iRSEZjAZ

archive ^UtmAwbqh

3PL rider location ^7HLkbJ3B

partner_id ^NRlOGWci

many to 1 ^kO1DgZrj

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "3zIyHq3o",
   "type": "text",
   "x": 0,
   "y": 0,
   "width": 456.75,
   "height": 35.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 865284055,
   "version": 1,
   "versionNonce": 1355908776,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1. Entities and relationships",
   "originalText": "1. Entities and relationships",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iy65VlXL",
   "type": "text",
   "x": 0,
   "y": 1030.0,
   "width": 677.25,
   "height": 35.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1894562565,
   "version": 1,
   "versionNonce": 1743828043,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: assign with offer and timeout",
   "originalText": "2. Core flow: assign with offer and timeout",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cplbj6vt",
   "type": "text",
   "x": 0,
   "y": 1940.0,
   "width": 567.0,
   "height": 35.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1720043577,
   "version": 1,
   "versionNonce": 322406308,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machines: Partner and Offer",
   "originalText": "3. State machines: Partner and Offer",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "t1sEAPC0",
   "type": "text",
   "x": 0,
   "y": 2820.0,
   "width": 393.75,
   "height": 35.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1650214788,
   "version": 1,
   "versionNonce": 527038659,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Live location tracking",
   "originalText": "4. Live location tracking",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "PYD9x0Qq",
   "type": "text",
   "x": 0,
   "y": 3690.0,
   "width": 157.5,
   "height": 35.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 119229233,
   "version": 1,
   "versionNonce": 1211935128,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "5. Storage",
   "originalText": "5. Storage",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "X9SLjOTs",
   "type": "rectangle",
   "x": 150,
   "y": 70,
   "width": 319.0,
   "height": 150.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1406807878,
   "version": 1,
   "versionNonce": 2106254955,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kReZrGT2"
    },
    {
     "type": "arrow",
     "id": "S2g6V0Yl"
    },
    {
     "type": "arrow",
     "id": "IzO9FORX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "kReZrGT2",
   "type": "text",
   "x": 162,
   "y": 85.0,
   "width": 279.0,
   "height": 120.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1083383556,
   "version": 1,
   "versionNonce": 491416857,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OfferService\n- ttl 20 s, now func()\n- offers, tried per order\n+ Start(ctx, order) Offer\n+ Accept / Reject(ctx, offerID)\n+ ExpireDue(ctx)",
   "originalText": "OfferService\n- ttl 20 s, now func()\n- offers, tried per order\n+ Start(ctx, order) Offer\n+ Accept / Reject(ctx, offerID)\n+ ExpireDue(ctx)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "X9SLjOTs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Man1TcI7",
   "type": "rectangle",
   "x": 619.0,
   "y": 70,
   "width": 283.0,
   "height": 130.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1436208922,
   "version": 1,
   "versionNonce": 1016237159,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NAe3uRxV"
    },
    {
     "type": "arrow",
     "id": "S2g6V0Yl"
    },
    {
     "type": "arrow",
     "id": "3mf20KQb"
    },
    {
     "type": "arrow",
     "id": "vRtTkKkq"
    },
    {
     "type": "arrow",
     "id": "uKBoVYRF"
    },
    {
     "type": "arrow",
     "id": "Kbf3LwIR"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NAe3uRxV",
   "type": "text",
   "x": 631.0,
   "y": 85.0,
   "width": 243.0,
   "height": 100.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1591378679,
   "version": 1,
   "versionNonce": 1608314505,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Assigner (Facade)\n- radiiM [1000 2000 3000]\n+ Assign(ctx, order)\n- claimNearest(order, skip)\n- bookThirdParty(order)",
   "originalText": "Assigner (Facade)\n- radiiM [1000 2000 3000]\n+ Assign(ctx, order)\n- claimNearest(order, skip)\n- bookThirdParty(order)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Man1TcI7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "W13wcE7J",
   "type": "rectangle",
   "x": 1052.0,
   "y": 70,
   "width": 247.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#a5d8ff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1922402495,
   "version": 1,
   "versionNonce": 461227356,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "B4hbNwyB"
    },
    {
     "type": "arrow",
     "id": "Kbf3LwIR"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "B4hbNwyB",
   "type": "text",
   "x": 1064.0,
   "y": 85.0,
   "width": 207.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1709494469,
   "version": 1,
   "versionNonce": 1099058218,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Assignment\n- PartnerID or\n  Provider + TrackingID",
   "originalText": "Assignment\n- PartnerID or\n  Provider + TrackingID",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "W13wcE7J",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3lwroUM9",
   "type": "rectangle",
   "x": 0,
   "y": 370.0,
   "width": 256.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#a5d8ff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1982228545,
   "version": 1,
   "versionNonce": 291522071,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "awjf36aX"
    },
    {
     "type": "arrow",
     "id": "IzO9FORX"
    },
    {
     "type": "arrow",
     "id": "uZjhoSNH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "awjf36aX",
   "type": "text",
   "x": 12,
   "y": 385.0,
   "width": 216.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1686387563,
   "version": 1,
   "versionNonce": 41916750,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Offer\n- ID, OrderID, PartnerID\n- Status, ExpiresAt",
   "originalText": "Offer\n- ID, OrderID, PartnerID\n- Status, ExpiresAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "3lwroUM9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "oJuUpH5x",
   "type": "rectangle",
   "x": 336.0,
   "y": 370.0,
   "width": 274.0,
   "height": 130.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#a5d8ff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 733227166,
   "version": 1,
   "versionNonce": 1061632421,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Vgsw5EGS"
    },
    {
     "type": "arrow",
     "id": "3mf20KQb"
    },
    {
     "type": "arrow",
     "id": "dKmx7KHV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Vgsw5EGS",
   "type": "text",
   "x": 348.0,
   "y": 385.0,
   "width": 234.0,
   "height": 100.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 203789045,
   "version": 1,
   "versionNonce": 641721930,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Fleet\n- partners, staleAfter\n+ Nearby(center, radius)\n+ TryClaim(partner, order)\n+ Release(partner)",
   "originalText": "Fleet\n- partners, staleAfter\n+ Nearby(center, radius)\n+ TryClaim(partner, order)\n+ Release(partner)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "oJuUpH5x",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lHfjfBt4",
   "type": "rectangle",
   "x": 690.0,
   "y": 370.0,
   "width": 220.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#d0bfff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1139350875,
   "version": 1,
   "versionNonce": 459571384,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gyMZPEJL"
    },
    {
     "type": "arrow",
     "id": "vRtTkKkq"
    },
    {
     "type": "arrow",
     "id": "hLewAWC4"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gyMZPEJL",
   "type": "text",
   "x": 702.0,
   "y": 385.0,
   "width": 180.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1992717522,
   "version": 1,
   "versionNonce": 48170959,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nRankingStrategy\n+ Rank(order, cands)",
   "originalText": "<<interface>>\nRankingStrategy\n+ Rank(order, cands)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lHfjfBt4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Bcdh5kv2",
   "type": "rectangle",
   "x": 990.0,
   "y": 370.0,
   "width": 292.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#d0bfff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 181927862,
   "version": 1,
   "versionNonce": 978217633,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kKobY2WB"
    },
    {
     "type": "arrow",
     "id": "uKBoVYRF"
    },
    {
     "type": "arrow",
     "id": "ayA1MpD3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "kKobY2WB",
   "type": "text",
   "x": 1002.0,
   "y": 385.0,
   "width": 252.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 382941639,
   "version": 1,
   "versionNonce": 1349787797,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nThirdPartyProvider\n+ CreateDelivery(ctx, order)",
   "originalText": "<<interface>>\nThirdPartyProvider\n+ CreateDelivery(ctx, order)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Bcdh5kv2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JI4FRQEB",
   "type": "rectangle",
   "x": 0,
   "y": 650.0,
   "width": 166.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#a5d8ff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 948399832,
   "version": 1,
   "versionNonce": 1880132255,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ETiW9WF2"
    },
    {
     "type": "arrow",
     "id": "uZjhoSNH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ETiW9WF2",
   "type": "text",
   "x": 12,
   "y": 665.0,
   "width": 126.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1506909598,
   "version": 1,
   "versionNonce": 1642144954,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order\n- ID\n- Pickup, Drop",
   "originalText": "Order\n- ID\n- Pickup, Drop",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "JI4FRQEB",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tC52Kc79",
   "type": "rectangle",
   "x": 246.0,
   "y": 650.0,
   "width": 184.0,
   "height": 110.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#a5d8ff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1105645225,
   "version": 1,
   "versionNonce": 1200791835,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "SGjH11Xx"
    },
    {
     "type": "arrow",
     "id": "dKmx7KHV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "SGjH11Xx",
   "type": "text",
   "x": 258.0,
   "y": 665.0,
   "width": 144.0,
   "height": 80.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 989307752,
   "version": 1,
   "versionNonce": 1421081902,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Partner\n- ID, Status\n- Loc, LocatedAt\n- ActiveOrder",
   "originalText": "Partner\n- ID, Status\n- Loc, LocatedAt\n- ActiveOrder",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "tC52Kc79",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kvea7KJd",
   "type": "rectangle",
   "x": 510.0,
   "y": 650.0,
   "width": 184.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#d0bfff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 218834977,
   "version": 1,
   "versionNonce": 1506645625,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "auCJIj6h"
    },
    {
     "type": "arrow",
     "id": "hLewAWC4"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "auCJIj6h",
   "type": "text",
   "x": 522.0,
   "y": 665.0,
   "width": 144.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 943588083,
   "version": 1,
   "versionNonce": 1796030130,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "NearestFirst\nsort by distance",
   "originalText": "NearestFirst\nsort by distance",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Kvea7KJd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "UouGXvQ6",
   "type": "rectangle",
   "x": 774.0,
   "y": 650.0,
   "width": 247.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1741536927,
   "version": 1,
   "versionNonce": 1097172025,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1WukGGwJ"
    },
    {
     "type": "arrow",
     "id": "ayA1MpD3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "1WukGGwJ",
   "type": "text",
   "x": 786.0,
   "y": 665.0,
   "width": 207.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1560510882,
   "version": 1,
   "versionNonce": 57160410,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PorterAdapter\nwraps vendor SDK\nBookTrip(ref = orderID)",
   "originalText": "PorterAdapter\nwraps vendor SDK\nBookTrip(ref = orderID)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "UouGXvQ6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fqpz686y",
   "type": "rectangle",
   "x": 0,
   "y": 1100.0,
   "width": 157.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 2109736246,
   "version": 1,
   "versionNonce": 583173866,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HbC0z7Cr"
    },
    {
     "type": "arrow",
     "id": "V5SIMvUL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "HbC0z7Cr",
   "type": "text",
   "x": 12,
   "y": 1115.0,
   "width": 117.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1735637228,
   "version": 1,
   "versionNonce": 885514280,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order packed\nat dark store",
   "originalText": "Order packed\nat dark store",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "fqpz686y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "73Jc4saf",
   "type": "rectangle",
   "x": 257.0,
   "y": 1100.0,
   "width": 184.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#d0bfff",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 401756416,
   "version": 1,
   "versionNonce": 1417556180,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "MUTouhPM"
    },
    {
     "type": "arrow",
     "id": "V5SIMvUL"
    },
    {
     "type": "arrow",
     "id": "o31qFDOm"
    },
    {
     "type": "arrow",
     "id": "NwpfWRY7"
    },
    {
     "type": "arrow",
     "id": "0xtJ0iPu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "MUTouhPM",
   "type": "text",
   "x": 269.0,
   "y": 1115.0,
   "width": 144.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 753460657,
   "version": 1,
   "versionNonce": 891452447,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Fleet.Nearby\n1 km, fresh GPS,\nranked nearest",
   "originalText": "Fleet.Nearby\n1 km, fresh GPS,\nranked nearest",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "73Jc4saf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2YzSOOuU",
   "type": "rectangle",
   "x": 541.0,
   "y": 1100.0,
   "width": 193.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 576319410,
   "version": 1,
   "versionNonce": 1656385999,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Tm9fKbPx"
    },
    {
     "type": "arrow",
     "id": "o31qFDOm"
    },
    {
     "type": "arrow",
     "id": "FydV1L3I"
    },
    {
     "type": "arrow",
     "id": "iSgmWdXg"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Tm9fKbPx",
   "type": "text",
   "x": 553.0,
   "y": 1115.0,
   "width": 153.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 257027982,
   "version": 1,
   "versionNonce": 107075279,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "TryClaim\navailable -> busy\n(atomic)",
   "originalText": "TryClaim\navailable -> busy\n(atomic)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2YzSOOuU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KKixvnbm",
   "type": "rectangle",
   "x": 834.0,
   "y": 1100.0,
   "width": 175.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 798178148,
   "version": 1,
   "versionNonce": 196880778,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WTFtK9Kz"
    },
    {
     "type": "arrow",
     "id": "FydV1L3I"
    },
    {
     "type": "arrow",
     "id": "v7NoASMB"
    },
    {
     "type": "arrow",
     "id": "V59sbBsM"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "WTFtK9Kz",
   "type": "text",
   "x": 846.0,
   "y": 1115.0,
   "width": 135.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 857107903,
   "version": 1,
   "versionNonce": 678639343,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Offer to rider\nexpires in 20 s",
   "originalText": "Offer to rider\nexpires in 20 s",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KKixvnbm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MjecBUl7",
   "type": "rectangle",
   "x": 1109.0,
   "y": 1100.0,
   "width": 166.0,
   "height": 60,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#b2f2bb",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1981313213,
   "version": 1,
   "versionNonce": 1196201223,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nS7pCBeM"
    },
    {
     "type": "arrow",
     "id": "v7NoASMB"
    },
    {
     "type": "arrow",
     "id": "FfiyMe4Y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nS7pCBeM",
   "type": "text",
   "x": 1129.0,
   "y": 1120.0,
   "width": 126.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1193989536,
   "version": 1,
   "versionNonce": 747413144,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Accept in time",
   "originalText": "Accept in time",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "MjecBUl7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RlKWYCiF",
   "type": "rectangle",
   "x": 1375.0,
   "y": 1100.0,
   "width": 193.0,
   "height": 60,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#b2f2bb",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 885430309,
   "version": 1,
   "versionNonce": 1826688314,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5PiCeY6Y"
    },
    {
     "type": "arrow",
     "id": "FfiyMe4Y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5PiCeY6Y",
   "type": "text",
   "x": 1395.0,
   "y": 1120.0,
   "width": 153.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 2144713920,
   "version": 1,
   "versionNonce": 2028610390,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Assigned in-house",
   "originalText": "Assigned in-house",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "RlKWYCiF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YBFPdnGK",
   "type": "rectangle",
   "x": 120,
   "y": 1340.0,
   "width": 220.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1493109346,
   "version": 1,
   "versionNonce": 21840327,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "XkMiqgR5"
    },
    {
     "type": "arrow",
     "id": "NwpfWRY7"
    },
    {
     "type": "arrow",
     "id": "O669lbfE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "XkMiqgR5",
   "type": "text",
   "x": 132,
   "y": 1355.0,
   "width": 180.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1342401451,
   "version": 1,
   "versionNonce": 974774444,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "None in radius:\nexpand to 2 km, 3 km",
   "originalText": "None in radius:\nexpand to 2 km, 3 km",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "YBFPdnGK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Hq2qzjBC",
   "type": "rectangle",
   "x": 490.0,
   "y": 1340.0,
   "width": 202.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffc9c9",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 2007583626,
   "version": 1,
   "versionNonce": 2122876148,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UPaVFkhq"
    },
    {
     "type": "arrow",
     "id": "iSgmWdXg"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "UPaVFkhq",
   "type": "text",
   "x": 502.0,
   "y": 1355.0,
   "width": 162.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 814078735,
   "version": 1,
   "versionNonce": 1695974413,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Lost race:\ntry next candidate",
   "originalText": "Lost race:\ntry next candidate",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Hq2qzjBC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "idwlOxom",
   "type": "rectangle",
   "x": 842.0,
   "y": 1340.0,
   "width": 319.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffc9c9",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1310851507,
   "version": 1,
   "versionNonce": 733493493,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ULzkeOmT"
    },
    {
     "type": "arrow",
     "id": "V59sbBsM"
    },
    {
     "type": "arrow",
     "id": "0xtJ0iPu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ULzkeOmT",
   "type": "text",
   "x": 854.0,
   "y": 1355.0,
   "width": 279.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 171209764,
   "version": 1,
   "versionNonce": 1780752532,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Reject, timeout or late accept:\nrelease rider, mark tried,\noffer next rider",
   "originalText": "Reject, timeout or late accept:\nrelease rider, mark tried,\noffer next rider",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "idwlOxom",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "80bWMrDp",
   "type": "rectangle",
   "x": 120,
   "y": 1580.0,
   "width": 274.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1428607838,
   "version": 1,
   "versionNonce": 1262574644,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "V2PwufDw"
    },
    {
     "type": "arrow",
     "id": "O669lbfE"
    },
    {
     "type": "arrow",
     "id": "7VVrL36H"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "V2PwufDw",
   "type": "text",
   "x": 132,
   "y": 1595.0,
   "width": 234.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 8056345,
   "version": 1,
   "versionNonce": 1986879044,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Nobody untried left:\n3PL via adapter,\nidempotency key = order ID",
   "originalText": "Nobody untried left:\n3PL via adapter,\nidempotency key = order ID",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "80bWMrDp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iE6ZNxfC",
   "type": "rectangle",
   "x": 594.0,
   "y": 1580.0,
   "width": 247.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffc9c9",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1290403152,
   "version": 1,
   "versionNonce": 457315910,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Ll3Oae16"
    },
    {
     "type": "arrow",
     "id": "7VVrL36H"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Ll3Oae16",
   "type": "text",
   "x": 606.0,
   "y": 1595.0,
   "width": 207.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 848719631,
   "version": 1,
   "versionNonce": 321604261,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3PL fails:\nErrNoPartner,\nretry queue + ops alert",
   "originalText": "3PL fails:\nErrNoPartner,\nretry queue + ops alert",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "iE6ZNxfC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "COtvySvI",
   "type": "ellipse",
   "x": 60,
   "y": 2010.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1163675929,
   "version": 1,
   "versionNonce": 472051859,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PrN2fazC"
    },
    {
     "type": "arrow",
     "id": "LRO4yNoz"
    },
    {
     "type": "arrow",
     "id": "zewsbzXG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "PrN2fazC",
   "type": "text",
   "x": 118.5,
   "y": 2040.0,
   "width": 63.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 984048194,
   "version": 1,
   "versionNonce": 427048377,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Offline",
   "originalText": "Offline",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "COtvySvI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LFI9O9lJ",
   "type": "ellipse",
   "x": 460,
   "y": 2010.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#b2f2bb",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 583314126,
   "version": 1,
   "versionNonce": 581104675,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GtsCbd9U"
    },
    {
     "type": "arrow",
     "id": "LRO4yNoz"
    },
    {
     "type": "arrow",
     "id": "zewsbzXG"
    },
    {
     "type": "arrow",
     "id": "JtEwgxxZ"
    },
    {
     "type": "arrow",
     "id": "DJJKUx95"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "GtsCbd9U",
   "type": "text",
   "x": 509.5,
   "y": 2040.0,
   "width": 81.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 260011011,
   "version": 1,
   "versionNonce": 1428899369,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Available",
   "originalText": "Available",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "LFI9O9lJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "27wF19Ul",
   "type": "ellipse",
   "x": 860,
   "y": 2010.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1412759438,
   "version": 1,
   "versionNonce": 1030276740,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8JmYMYKD"
    },
    {
     "type": "arrow",
     "id": "JtEwgxxZ"
    },
    {
     "type": "arrow",
     "id": "DJJKUx95"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "8JmYMYKD",
   "type": "text",
   "x": 932.0,
   "y": 2040.0,
   "width": 36.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 542308428,
   "version": 1,
   "versionNonce": 64731698,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Busy",
   "originalText": "Busy",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "27wF19Ul",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "orvLRXA9",
   "type": "ellipse",
   "x": 400,
   "y": 2240.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 480974750,
   "version": 1,
   "versionNonce": 586319132,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JPXjTika"
    },
    {
     "type": "arrow",
     "id": "AlXaSS3y"
    },
    {
     "type": "arrow",
     "id": "XyFqAwvG"
    },
    {
     "type": "arrow",
     "id": "zeb6CsAZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "JPXjTika",
   "type": "text",
   "x": 458.5,
   "y": 2270.0,
   "width": 63.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 769566013,
   "version": 1,
   "versionNonce": 285829589,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Pending",
   "originalText": "Pending",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "orvLRXA9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "A9hY52FO",
   "type": "ellipse",
   "x": 60,
   "y": 2470.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#b2f2bb",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1919797931,
   "version": 1,
   "versionNonce": 1071582118,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "99TKhNt9"
    },
    {
     "type": "arrow",
     "id": "AlXaSS3y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "99TKhNt9",
   "type": "text",
   "x": 114.0,
   "y": 2500.0,
   "width": 72.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1233198298,
   "version": 1,
   "versionNonce": 1404025653,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Accepted",
   "originalText": "Accepted",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "A9hY52FO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gXVDmWaO",
   "type": "ellipse",
   "x": 440,
   "y": 2470.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffc9c9",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 509041253,
   "version": 1,
   "versionNonce": 572598238,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jQhPezDz"
    },
    {
     "type": "arrow",
     "id": "XyFqAwvG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jQhPezDz",
   "type": "text",
   "x": 494.0,
   "y": 2500.0,
   "width": 72.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1436359587,
   "version": 1,
   "versionNonce": 1918416302,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Rejected",
   "originalText": "Rejected",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "gXVDmWaO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "D7kLRY0W",
   "type": "ellipse",
   "x": 820,
   "y": 2470.0,
   "width": 180,
   "height": 80,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffc9c9",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1277369368,
   "version": 1,
   "versionNonce": 1124893767,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5HhKsLT9"
    },
    {
     "type": "arrow",
     "id": "zeb6CsAZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5HhKsLT9",
   "type": "text",
   "x": 878.5,
   "y": 2500.0,
   "width": 63.0,
   "height": 20.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 360718832,
   "version": 1,
   "versionNonce": 200468702,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Expired",
   "originalText": "Expired",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "D7kLRY0W",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vbtnLqtQ",
   "type": "rectangle",
   "x": 0,
   "y": 2890.0,
   "width": 175.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 527816642,
   "version": 1,
   "versionNonce": 1792335185,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "bQkZ2k3P"
    },
    {
     "type": "arrow",
     "id": "chj3EVda"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "bQkZ2k3P",
   "type": "text",
   "x": 12,
   "y": 2905.0,
   "width": 135.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 338328006,
   "version": 1,
   "versionNonce": 1499438254,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Rider app\nGPS every 3-5 s",
   "originalText": "Rider app\nGPS every 3-5 s",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "vbtnLqtQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "31oWgaRv",
   "type": "rectangle",
   "x": 325.0,
   "y": 2890.0,
   "width": 247.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 63890500,
   "version": 1,
   "versionNonce": 1307968258,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AFTc0vSX"
    },
    {
     "type": "arrow",
     "id": "chj3EVda"
    },
    {
     "type": "arrow",
     "id": "ajZgjJKZ"
    },
    {
     "type": "arrow",
     "id": "FFMboUWR"
    },
    {
     "type": "arrow",
     "id": "JCj3BYmO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "AFTc0vSX",
   "type": "text",
   "x": 337.0,
   "y": 2905.0,
   "width": 207.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1583627597,
   "version": 1,
   "versionNonce": 1804021614,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Location Service\ndrop out-of-order pings",
   "originalText": "Location Service\ndrop out-of-order pings",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "31oWgaRv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wwy9Dint",
   "type": "rectangle",
   "x": 722.0,
   "y": 2890.0,
   "width": 193.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1989176399,
   "version": 1,
   "versionNonce": 722005017,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZghgjYUz"
    },
    {
     "type": "arrow",
     "id": "ajZgjJKZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ZghgjYUz",
   "type": "text",
   "x": 734.0,
   "y": 2905.0,
   "width": 153.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 783738812,
   "version": 1,
   "versionNonce": 1721656830,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Redis GEO\nlatest point only\nGEOSEARCH 1 km",
   "originalText": "Redis GEO\nlatest point only\nGEOSEARCH 1 km",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "wwy9Dint",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "sZmnnJnA",
   "type": "rectangle",
   "x": 1065.0,
   "y": 2890.0,
   "width": 148.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1482828254,
   "version": 1,
   "versionNonce": 728105075,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "U9PxCmw5"
    },
    {
     "type": "arrow",
     "id": "A1nOGtWh"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "U9PxCmw5",
   "type": "text",
   "x": 1077.0,
   "y": 2905.0,
   "width": 108.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 650334648,
   "version": 1,
   "versionNonce": 1008904522,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Customer app\nWebSocket",
   "originalText": "Customer app\nWebSocket",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "sZmnnJnA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qTOKuiU9",
   "type": "rectangle",
   "x": 0,
   "y": 3130.0,
   "width": 140,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffd8a8",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1674455701,
   "version": 1,
   "versionNonce": 433619056,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "bgIno5Qs"
    },
    {
     "type": "arrow",
     "id": "JCj3BYmO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "bgIno5Qs",
   "type": "text",
   "x": 12,
   "y": 3145.0,
   "width": 99.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1993158217,
   "version": 1,
   "versionNonce": 1764434245,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3PL webhook\nsigned",
   "originalText": "3PL webhook\nsigned",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "qTOKuiU9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SxVUtrFt",
   "type": "rectangle",
   "x": 290,
   "y": 3130.0,
   "width": 166.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1695329895,
   "version": 1,
   "versionNonce": 1677854545,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZdLBftwr"
    },
    {
     "type": "arrow",
     "id": "FFMboUWR"
    },
    {
     "type": "arrow",
     "id": "zL6InbA6"
    },
    {
     "type": "arrow",
     "id": "qRn6XAU9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ZdLBftwr",
   "type": "text",
   "x": 302,
   "y": 3145.0,
   "width": 126.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 12573756,
   "version": 1,
   "versionNonce": 1261917669,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Kafka\nlocation topic",
   "originalText": "Kafka\nlocation topic",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "SxVUtrFt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AJK6FEDd",
   "type": "rectangle",
   "x": 606.0,
   "y": 3130.0,
   "width": 184.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#ffec99",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1374961981,
   "version": 1,
   "versionNonce": 1853196580,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hIcFTMDx"
    },
    {
     "type": "arrow",
     "id": "zL6InbA6"
    },
    {
     "type": "arrow",
     "id": "A1nOGtWh"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hIcFTMDx",
   "type": "text",
   "x": 618.0,
   "y": 3145.0,
   "width": 144.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1885860680,
   "version": 1,
   "versionNonce": 1276727043,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Tracking Service\npush every few s",
   "originalText": "Tracking Service\npush every few s",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "AJK6FEDd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ExktffKm",
   "type": "rectangle",
   "x": 290,
   "y": 3350.0,
   "width": 202.0,
   "height": 70.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 1754668452,
   "version": 1,
   "versionNonce": 1089582196,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IM3dsUvj"
    },
    {
     "type": "arrow",
     "id": "qRn6XAU9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "IM3dsUvj",
   "type": "text",
   "x": 302,
   "y": 3365.0,
   "width": 162.0,
   "height": 40.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1977161999,
   "version": 1,
   "versionNonce": 317093160,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "History store\npartitioned by day",
   "originalText": "History store\npartitioned by day",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ExktffKm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RVz82YLp",
   "type": "rectangle",
   "x": 0,
   "y": 3760.0,
   "width": 319.0,
   "height": 110.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 3663492,
   "version": 1,
   "versionNonce": 614892562,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dYWnPmwO"
    },
    {
     "type": "arrow",
     "id": "GI1gnRxi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dYWnPmwO",
   "type": "text",
   "x": 12,
   "y": 3775.0,
   "width": 279.0,
   "height": 80.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 966899804,
   "version": 1,
   "versionNonce": 1926159273,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "delivery_partners\nid PK, status\nactive_delivery_id\nclaim: WHERE status='available'",
   "originalText": "delivery_partners\nid PK, status\nactive_delivery_id\nclaim: WHERE status='available'",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "RVz82YLp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5XYemj87",
   "type": "rectangle",
   "x": 399.0,
   "y": 3760.0,
   "width": 238.0,
   "height": 110.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 967299408,
   "version": 1,
   "versionNonce": 720170295,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "B426DkAc"
    },
    {
     "type": "arrow",
     "id": "GI1gnRxi"
    },
    {
     "type": "arrow",
     "id": "XcykejkQ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "B426DkAc",
   "type": "text",
   "x": 411.0,
   "y": 3775.0,
   "width": 198.0,
   "height": 80.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 2036895693,
   "version": 1,
   "versionNonce": 1415034645,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "deliveries\nid PK, order_id UNIQUE\nprovider, partner_id\nstatus, radius_m",
   "originalText": "deliveries\nid PK, order_id UNIQUE\nprovider, partner_id\nstatus, radius_m",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5XYemj87",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WgYdgB1o",
   "type": "rectangle",
   "x": 717.0,
   "y": 3760.0,
   "width": 328.0,
   "height": 110.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 4039938,
   "version": 1,
   "versionNonce": 1357411687,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uRzDE0jW"
    },
    {
     "type": "arrow",
     "id": "XcykejkQ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "uRzDE0jW",
   "type": "text",
   "x": 729.0,
   "y": 3775.0,
   "width": 288.0,
   "height": 80.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1931955409,
   "version": 1,
   "versionNonce": 1853270284,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "assignment_attempts\ndelivery_id, partner_id\nresult, expires_at\nUNIQUE (delivery_id, partner_id)",
   "originalText": "assignment_attempts\ndelivery_id, partner_id\nresult, expires_at\nUNIQUE (delivery_id, partner_id)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "WgYdgB1o",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JLLaZZB2",
   "type": "rectangle",
   "x": 1125.0,
   "y": 3760.0,
   "width": 238.0,
   "height": 90.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "#e9ecef",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 3
   },
   "seed": 2012359479,
   "version": 1,
   "versionNonce": 1585827647,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tM4sF7Pd"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "tM4sF7Pd",
   "type": "text",
   "x": 1137.0,
   "y": 3775.0,
   "width": 198.0,
   "height": 60.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 8878394,
   "version": 1,
   "versionNonce": 1643139397,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "third_party_requests\ndelivery_id, provider\nidempotency_key UNIQUE",
   "originalText": "third_party_requests\ndelivery_id, provider\nidempotency_key UNIQUE",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "JLLaZZB2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "S2g6V0Yl",
   "type": "arrow",
   "x": 473.0,
   "y": 141.37472283813747,
   "width": 142.0,
   "height": 3.148558758314863,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1904431067,
   "version": 1,
   "versionNonce": 1332805660,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "3VFQMBSN"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     142.0,
     -3.148558758314863
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "X9SLjOTs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Man1TcI7",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "3VFQMBSN",
   "type": "text",
   "x": 528.25,
   "y": 131.05044345898006,
   "width": 31.5,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1665230402,
   "version": 1,
   "versionNonce": 178175564,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "uses",
   "originalText": "uses",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "S2g6V0Yl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IzO9FORX",
   "type": "arrow",
   "x": 256.39444444444445,
   "y": 224.0,
   "width": 95.45555555555555,
   "height": 142.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1467358006,
   "version": 1,
   "versionNonce": 1213366508,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tMrtjEZv"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -95.45555555555555,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "X9SLjOTs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "3lwroUM9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "tMrtjEZv",
   "type": "text",
   "x": 173.22916666666669,
   "y": 286.25,
   "width": 70.875,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1883777742,
   "version": 1,
   "versionNonce": 1111842914,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1 to many",
   "originalText": "1 to many",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "IzO9FORX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3mf20KQb",
   "type": "arrow",
   "x": 694.375,
   "y": 204.0,
   "width": 155.25,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 541739782,
   "version": 1,
   "versionNonce": 554193133,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xig0xU5z"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -155.25,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Man1TcI7",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "oJuUpH5x",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "xig0xU5z",
   "type": "text",
   "x": 601.0,
   "y": 276.25,
   "width": 31.5,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 799159632,
   "version": 1,
   "versionNonce": 1464744096,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "uses",
   "originalText": "uses",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "3mf20KQb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vRtTkKkq",
   "type": "arrow",
   "x": 770.2339285714286,
   "y": 204.0,
   "width": 22.8535714285714,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 682329753,
   "version": 1,
   "versionNonce": 1237762156,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qBfgsfr1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     22.8535714285714,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Man1TcI7",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lHfjfBt4",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "qBfgsfr1",
   "type": "text",
   "x": 765.9107142857142,
   "y": 276.25,
   "width": 31.5,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 727719307,
   "version": 1,
   "versionNonce": 1075585064,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "uses",
   "originalText": "uses",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "vRtTkKkq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uKBoVYRF",
   "type": "arrow",
   "x": 853.0339285714285,
   "y": 204.0,
   "width": 217.25357142857138,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 353829189,
   "version": 1,
   "versionNonce": 921769476,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0JnpSmEW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     217.25357142857138,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Man1TcI7",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Bcdh5kv2",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0JnpSmEW",
   "type": "text",
   "x": 930.1607142857142,
   "y": 276.25,
   "width": 63.0,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1579336650,
   "version": 1,
   "versionNonce": 1768433032,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "fallback",
   "originalText": "fallback",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "uKBoVYRF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dKmx7KHV",
   "type": "arrow",
   "x": 438.5,
   "y": 504.0,
   "width": 71.0,
   "height": 142.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 425613993,
   "version": 1,
   "versionNonce": 2079916245,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4rAVdsKB"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -71.0,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "oJuUpH5x",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "tC52Kc79",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "4rAVdsKB",
   "type": "text",
   "x": 367.5625,
   "y": 566.25,
   "width": 70.875,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1904503943,
   "version": 1,
   "versionNonce": 550459772,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1 to many",
   "originalText": "1 to many",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "dKmx7KHV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hLewAWC4",
   "type": "arrow",
   "x": 630.6,
   "y": 646.0,
   "width": 133.46666666666658,
   "height": 182.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1361933484,
   "version": 1,
   "versionNonce": 1155875423,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "in2DY48K"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     133.46666666666658,
     -182.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Kvea7KJd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lHfjfBt4",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "in2DY48K",
   "type": "text",
   "x": 657.9583333333333,
   "y": 546.25,
   "width": 78.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 26775880,
   "version": 1,
   "versionNonce": 578990963,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "implements",
   "originalText": "implements",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "hLewAWC4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ayA1MpD3",
   "type": "arrow",
   "x": 939.2375,
   "y": 646.0,
   "width": 155.0250000000001,
   "height": 182.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 908656422,
   "version": 1,
   "versionNonce": 273277219,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LHJSzZDY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     155.0250000000001,
     -182.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "UouGXvQ6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Bcdh5kv2",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "LHJSzZDY",
   "type": "text",
   "x": 977.375,
   "y": 546.25,
   "width": 78.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 891267137,
   "version": 1,
   "versionNonce": 45338898,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "implements",
   "originalText": "implements",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ayA1MpD3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uZjhoSNH",
   "type": "arrow",
   "x": 120.125,
   "y": 464.0,
   "width": 29.25,
   "height": 182.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1253627596,
   "version": 1,
   "versionNonce": 980283369,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NLpWvtRT"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -29.25,
     182.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "3lwroUM9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "JI4FRQEB",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NLpWvtRT",
   "type": "text",
   "x": 70.0625,
   "y": 546.25,
   "width": 70.875,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 920480507,
   "version": 1,
   "versionNonce": 1700777049,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "many to 1",
   "originalText": "many to 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "uZjhoSNH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kbf3LwIR",
   "type": "arrow",
   "x": 906.0,
   "y": 127.98795180722891,
   "width": 142.0,
   "height": 6.843373493975903,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 199645538,
   "version": 1,
   "versionNonce": 931729418,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iZOuciSb"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     142.0,
     -6.843373493975903
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Man1TcI7",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "W13wcE7J",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "iZOuciSb",
   "type": "text",
   "x": 949.4375,
   "y": 115.81626506024097,
   "width": 55.125,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1069995641,
   "version": 1,
   "versionNonce": 1331313304,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "creates",
   "originalText": "creates",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Kbf3LwIR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "V5SIMvUL",
   "type": "arrow",
   "x": 161.0,
   "y": 1138.0499075785583,
   "width": 92.0,
   "height": 3.4011090573012552,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1480845880,
   "version": 1,
   "versionNonce": 1328546093,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     92.0,
     3.4011090573012552
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "fqpz686y",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "73Jc4saf",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "o31qFDOm",
   "type": "arrow",
   "x": 445.0,
   "y": 1145.0,
   "width": 92.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1824344645,
   "version": 1,
   "versionNonce": 1334676570,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     92.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "73Jc4saf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "2YzSOOuU",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "FydV1L3I",
   "type": "arrow",
   "x": 738.0,
   "y": 1141.4612676056338,
   "width": 92.0,
   "height": 3.23943661971839,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1126476860,
   "version": 1,
   "versionNonce": 1131860388,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     92.0,
     -3.23943661971839
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2YzSOOuU",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "KKixvnbm",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "v7NoASMB",
   "type": "arrow",
   "x": 1013.0,
   "y": 1133.3086876155269,
   "width": 92.0,
   "height": 1.7005545286506276,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1345481367,
   "version": 1,
   "versionNonce": 686797293,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     92.0,
     -1.7005545286506276
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KKixvnbm",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "MjecBUl7",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "FfiyMe4Y",
   "type": "arrow",
   "x": 1279.0,
   "y": 1130.0,
   "width": 92.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 940667131,
   "version": 1,
   "versionNonce": 1744804987,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     92.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "MjecBUl7",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "RlKWYCiF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NwpfWRY7",
   "type": "arrow",
   "x": 323.6478260869565,
   "y": 1194.0,
   "width": 73.4695652173913,
   "height": 142.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 154146309,
   "version": 1,
   "versionNonce": 266490830,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DAH1wYa9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -73.4695652173913,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "73Jc4saf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "YBFPdnGK",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DAH1wYa9",
   "type": "text",
   "x": 271.1630434782609,
   "y": 1256.25,
   "width": 31.5,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 667391547,
   "version": 1,
   "versionNonce": 1955819053,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "none",
   "originalText": "none",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NwpfWRY7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iSgmWdXg",
   "type": "arrow",
   "x": 627.5934782608696,
   "y": 1194.0,
   "width": 28.7086956521739,
   "height": 142.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1183069654,
   "version": 1,
   "versionNonce": 337399806,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PnCmGNvz"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -28.7086956521739,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2YzSOOuU",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Hq2qzjBC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "PnCmGNvz",
   "type": "text",
   "x": 589.6141304347826,
   "y": 1256.25,
   "width": 47.25,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1433977043,
   "version": 1,
   "versionNonce": 1917932092,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "0 rows",
   "originalText": "0 rows",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "iSgmWdXg",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "V59sbBsM",
   "type": "arrow",
   "x": 933.98,
   "y": 1174.0,
   "width": 51.84000000000003,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1523444020,
   "version": 1,
   "versionNonce": 2065801463,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kxSQt3MW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     51.84000000000003,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KKixvnbm",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "idwlOxom",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "kxSQt3MW",
   "type": "text",
   "x": 952.0250000000001,
   "y": 1246.25,
   "width": 15.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 221788191,
   "version": 1,
   "versionNonce": 806010815,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "no",
   "originalText": "no",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "V59sbBsM",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "0xtJ0iPu",
   "type": "arrow",
   "x": 868.28125,
   "y": 1336.0,
   "width": 423.28125,
   "height": 155.68965517241372,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 131449021,
   "version": 1,
   "versionNonce": 221846911,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8MjbN4L0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -423.28125,
     -155.68965517241372
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "idwlOxom",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "73Jc4saf",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "8MjbN4L0",
   "type": "text",
   "x": 617.265625,
   "y": 1249.405172413793,
   "width": 78.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 190455247,
   "version": 1,
   "versionNonce": 1484724147,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "skip tried",
   "originalText": "skip tried",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "0xtJ0iPu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "O669lbfE",
   "type": "arrow",
   "x": 234.212,
   "y": 1414.0,
   "width": 17.49600000000001,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1381227489,
   "version": 1,
   "versionNonce": 391690657,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "6DeLbKCW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     17.49600000000001,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YBFPdnGK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "80bWMrDp",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "6DeLbKCW",
   "type": "text",
   "x": 203.58499999999998,
   "y": 1486.25,
   "width": 78.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1851178515,
   "version": 1,
   "versionNonce": 595476326,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "still none",
   "originalText": "still none",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "O669lbfE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7VVrL36H",
   "type": "arrow",
   "x": 398.0,
   "y": 1625.0,
   "width": 192.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1006596348,
   "version": 1,
   "versionNonce": 2048421771,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8Qi9Tn9C"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     192.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "80bWMrDp",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "iE6ZNxfC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "8Qi9Tn9C",
   "type": "text",
   "x": 474.3125,
   "y": 1616.25,
   "width": 39.375,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 2104174095,
   "version": 1,
   "versionNonce": 1110343188,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "error",
   "originalText": "error",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "7VVrL36H",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LRO4yNoz",
   "type": "arrow",
   "x": 244.0,
   "y": 2065.0,
   "width": 212.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1206151054,
   "version": 1,
   "versionNonce": 1661384033,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "99GKovXN"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     212.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "COtvySvI",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "LFI9O9lJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "99GKovXN",
   "type": "text",
   "x": 314.5625,
   "y": 2056.25,
   "width": 70.875,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 782678277,
   "version": 1,
   "versionNonce": 1156423450,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "go online",
   "originalText": "go online",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "LRO4yNoz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zewsbzXG",
   "type": "arrow",
   "x": 456.0,
   "y": 2035.0,
   "width": 212.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 2126585713,
   "version": 1,
   "versionNonce": 1932434942,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Bzqg3mXv"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -212.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "LFI9O9lJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "COtvySvI",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Bzqg3mXv",
   "type": "text",
   "x": 310.625,
   "y": 2026.25,
   "width": 78.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 752459973,
   "version": 1,
   "versionNonce": 1531760331,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "go offline",
   "originalText": "go offline",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "zewsbzXG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JtEwgxxZ",
   "type": "arrow",
   "x": 644.0,
   "y": 2065.0,
   "width": 212.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1852850737,
   "version": 1,
   "versionNonce": 1639450758,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "39T8c4qR"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     212.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "LFI9O9lJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "27wF19Ul",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "39T8c4qR",
   "type": "text",
   "x": 722.4375,
   "y": 2056.25,
   "width": 55.125,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1091115851,
   "version": 1,
   "versionNonce": 416289033,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "claimed",
   "originalText": "claimed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "JtEwgxxZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DJJKUx95",
   "type": "arrow",
   "x": 856.0,
   "y": 2035.0,
   "width": 212.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 805292868,
   "version": 1,
   "versionNonce": 1696236207,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "K0PU7NId"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -212.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "27wF19Ul",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "LFI9O9lJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "K0PU7NId",
   "type": "text",
   "x": 651.5625,
   "y": 2026.25,
   "width": 196.875,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 565355858,
   "version": 1,
   "versionNonce": 49775860,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "reject, expire, delivered",
   "originalText": "reject, expire, delivered",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "DJJKUx95",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AlXaSS3y",
   "type": "arrow",
   "x": 436.51285532634677,
   "y": 2316.1824802204123,
   "width": 233.02571065269356,
   "height": 157.6350395591753,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1113323530,
   "version": 1,
   "versionNonce": 1549975761,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ga2hegq4"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -233.02571065269356,
     157.6350395591753
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "orvLRXA9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "A9hY52FO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ga2hegq4",
   "type": "text",
   "x": 229.4375,
   "y": 2386.25,
   "width": 181.125,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 896702928,
   "version": 1,
   "versionNonce": 1042162250,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Accept before ExpiresAt",
   "originalText": "Accept before ExpiresAt",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "AlXaSS3y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XyFqAwvG",
   "type": "arrow",
   "x": 497.62694394014056,
   "y": 2323.8549276558083,
   "width": 24.746112119718873,
   "height": 142.2901446883834,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1799636106,
   "version": 1,
   "versionNonce": 1188163110,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NRVdvU2N"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     24.746112119718873,
     142.2901446883834
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "orvLRXA9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "gXVDmWaO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NRVdvU2N",
   "type": "text",
   "x": 486.375,
   "y": 2386.25,
   "width": 47.25,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1620577796,
   "version": 1,
   "versionNonce": 1849930600,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Reject",
   "originalText": "Reject",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XyFqAwvG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zeb6CsAZ",
   "type": "arrow",
   "x": 551.076348007122,
   "y": 2313.4465715277097,
   "width": 297.84730398575607,
   "height": 163.1068569445806,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 230129702,
   "version": 1,
   "versionNonce": 164586512,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "K7tNIdDW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     297.84730398575607,
     163.1068569445806
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "orvLRXA9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "D7kLRY0W",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "K7tNIdDW",
   "type": "text",
   "x": 625.1875,
   "y": 2386.25,
   "width": 149.625,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1779243403,
   "version": 1,
   "versionNonce": 1292965234,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "20 s or late Accept",
   "originalText": "20 s or late Accept",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "zeb6CsAZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "chj3EVda",
   "type": "arrow",
   "x": 179.0,
   "y": 2925.0,
   "width": 142.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 435258149,
   "version": 1,
   "versionNonce": 376453015,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0fuiRnvH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     142.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "vbtnLqtQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "31oWgaRv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0fuiRnvH",
   "type": "text",
   "x": 226.375,
   "y": 2916.25,
   "width": 47.25,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1424357156,
   "version": 1,
   "versionNonce": 956143661,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "stream",
   "originalText": "stream",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "chj3EVda",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ajZgjJKZ",
   "type": "arrow",
   "x": 576.0,
   "y": 2928.445945945946,
   "width": 142.0,
   "height": 3.837837837837924,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1376445325,
   "version": 1,
   "versionNonce": 789818465,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "fhFGF78D"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     142.0,
     3.837837837837924
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "31oWgaRv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wwy9Dint",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "fhFGF78D",
   "type": "text",
   "x": 623.375,
   "y": 2921.614864864865,
   "width": 47.25,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 471892460,
   "version": 1,
   "versionNonce": 425085658,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "GEOADD",
   "originalText": "GEOADD",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ajZgjJKZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FFMboUWR",
   "type": "arrow",
   "x": 436.23125,
   "y": 2964.0,
   "width": 50.96249999999998,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 633413268,
   "version": 1,
   "versionNonce": 979595727,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DPZ5TLtA"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -50.96249999999998,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "31oWgaRv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "SxVUtrFt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DPZ5TLtA",
   "type": "text",
   "x": 387.125,
   "y": 3036.25,
   "width": 47.25,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1881268611,
   "version": 1,
   "versionNonce": 830783545,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "append",
   "originalText": "append",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "FFMboUWR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zL6InbA6",
   "type": "arrow",
   "x": 460.0,
   "y": 3165.0,
   "width": 142.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 851010030,
   "version": 1,
   "versionNonce": 843413984,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jtnFEB1R"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     142.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SxVUtrFt",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "AJK6FEDd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jtnFEB1R",
   "type": "text",
   "x": 503.4375,
   "y": 3156.25,
   "width": 55.125,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1409386991,
   "version": 1,
   "versionNonce": 293858901,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "consume",
   "originalText": "consume",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "zL6InbA6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "A1nOGtWh",
   "type": "arrow",
   "x": 769.6625,
   "y": 3126.0,
   "width": 297.67500000000007,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 828841653,
   "version": 1,
   "versionNonce": 1833751948,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iRSEZjAZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     297.67500000000007,
     -162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "AJK6FEDd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "sZmnnJnA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "iRSEZjAZ",
   "type": "text",
   "x": 863.375,
   "y": 3036.25,
   "width": 110.25,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 457913847,
   "version": 1,
   "versionNonce": 1842527658,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "WebSocket push",
   "originalText": "WebSocket push",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "A1nOGtWh",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qRn6XAU9",
   "type": "arrow",
   "x": 376.1909090909091,
   "y": 3204.0,
   "width": 11.618181818181824,
   "height": 142.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "dashed",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 509501415,
   "version": 1,
   "versionNonce": 466575042,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UtmAwbqh"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     11.618181818181824,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SxVUtrFt",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ExktffKm",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "UtmAwbqh",
   "type": "text",
   "x": 354.4375,
   "y": 3266.25,
   "width": 55.125,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1548606253,
   "version": 1,
   "versionNonce": 1283074416,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "archive",
   "originalText": "archive",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "qRn6XAU9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JCj3BYmO",
   "type": "arrow",
   "x": 131.50625,
   "y": 3126.0,
   "width": 255.48749999999998,
   "height": 162.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1588316309,
   "version": 1,
   "versionNonce": 231626426,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7HLkbJ3B"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     255.48749999999998,
     -162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qTOKuiU9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "31oWgaRv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7HLkbJ3B",
   "type": "text",
   "x": 188.375,
   "y": 3036.25,
   "width": 141.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 3097293,
   "version": 1,
   "versionNonce": 1494078243,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3PL rider location",
   "originalText": "3PL rider location",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "JCj3BYmO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GI1gnRxi",
   "type": "arrow",
   "x": 395.0,
   "y": 3815.0,
   "width": 72.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 712109082,
   "version": 1,
   "versionNonce": 1118294180,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NRlOGWci"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -72.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5XYemj87",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "RVz82YLp",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NRlOGWci",
   "type": "text",
   "x": 319.625,
   "y": 3806.25,
   "width": 78.75,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 393323553,
   "version": 1,
   "versionNonce": 2140916550,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "partner_id",
   "originalText": "partner_id",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "GI1gnRxi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XcykejkQ",
   "type": "arrow",
   "x": 713.0,
   "y": 3815.0,
   "width": 72.0,
   "height": 0.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": {
    "type": 2
   },
   "seed": 1339925880,
   "version": 1,
   "versionNonce": 1243522871,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kO1DgZrj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false,
   "points": [
    [
     0,
     0
    ],
    [
     -72.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WgYdgB1o",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5XYemj87",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "kO1DgZrj",
   "type": "text",
   "x": 641.5625,
   "y": 3806.25,
   "width": 70.875,
   "height": 17.5,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 828987992,
   "version": 1,
   "versionNonce": 9618272,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "many to 1",
   "originalText": "many to 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XcykejkQ",
   "autoResize": true,
   "lineHeight": 1.25
  }
 ],
 "appState": {
  "gridSize": null,
  "viewBackgroundColor": "#ffffff"
 },
 "files": {}
}
```
%%