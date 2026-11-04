---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^ezySfCt7

2. Core flow: lock -> pay -> confirm ^3giLpE9c

3. Seat state machine (per ShowSeat) ^5DgS15wK

4. Storage ^hNGbhJrm

Seat vs ShowSeat: A1 is one Seat,
but one ShowSeat per show. ^6qzhaih4

Lazy expiry: a LOCKED seat past expiry
counts as free on the next LockSeats.
Sweeper also frees it. ^kzE2y7fK

Theater
- ID, City ^KrITCd6u

Screen
- ID, TheaterID ^2BjRm3ql

Seat (physical)
- ID, Row, Category ^eMbUCXhE

Movie
- ID, Title ^k5VMrc1k

<<interface>>
PricingStrategy
+ Price(showID, seatID) int64 ^7eC33yQa

ShowSeat (state lives here)
- State, HoldID, ExpiresAt
- PricePaise ^Zj53JVmI

Show
- MovieID, ScreenID
- StartAt ^ANcZdb4X

BookingService (Facade)
+ LockSeats
+ ConfirmBooking
+ ReleaseHold
+ ReleaseExpiredLocks ^gSmLygAe

Hold (seat lock, TTL)
- UserID, SeatIDs
- AmountPaise, ExpiresAt ^MaIdmNyZ

Booking
- UserID, SeatIDs
- PaymentID UNIQUE ^9zR6JRJy

<<interface>>
PaymentGateway (Adapter)
+ CreateOrder, Refund ^nQILV0L8

User ^WEU5uKOD

LockSeats(show, seats)
all-or-nothing, TTL 10m ^l410Zd3W

PaymentGateway
user pays amount ^jgMkmDBX

ConfirmBooking(hold, paymentID)
idempotent on paymentID ^snCf82Cw

Booking confirmed
seats BOOKED
event -> ticket SMS ^xzPWg4qG

Any seat taken
409, nothing locked ^bTM96fNU

Payment failed or timeout
ReleaseHold -> AVAILABLE ^xxJjNYRs

Hold expired or re-locked
ErrHoldExpired -> refund ^s0NyYXwE

AVAILABLE ^hl7qfMdN

LOCKED
(hold_id, expiry) ^PgHL0vRu

BOOKED ^PvGJ4Oz4

show_seats
PK (show_id, seat_id)
state CHECK available|locked|booked
hold_id, hold_expiry
price_paise BIGINT
lock = conditional UPDATE,
rows affected must = seat count ^AGhDD3G7

bookings
id PK
payment_id UNIQUE (idempotent)
amount_paise BIGINT
status confirmed | cancelled ^HTAqGLSm

booking_seats
(booking_id, show_id, seat_id, active)
UNIQUE (show_id, seat_id) WHERE active
= final guard vs double booking ^lA8vAMtl

1 to many ^IpdGCht6

1 to many ^FztlN8CM

1 to many ^7w5yNIi5

1 to many ^XXiEvRbo

refers to ^OP8n1jDf

locks 1..10 ^gEyMwC3h

owns ^ttKCvinR

created from ^X66DAYcB

priced by ^O0WiOm5k

paid via ^GN33gVYW

creates ^iFOoYftA

hold_id, amount ^Ytuk6hhr

success ^weIEewXX

seats still ours ^1eSX2oP4

conflict ^EDIoxZ9N

failure ^9LRaj5Na

check fails ^tNwFXpzk

LockSeats ^boALMScf

expired / pay failed / cancel ^fo8tegJG

ConfirmBooking ^75em9GNG

booking cancelled + refund ^7PJ6MopF

many to 1 ^biU8bXmq

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "ezySfCt7",
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
   "seed": 412838073,
   "version": 1,
   "versionNonce": 1991094036,
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
   "id": "3giLpE9c",
   "type": "text",
   "x": 0,
   "y": 660,
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
   "seed": 455160404,
   "version": 1,
   "versionNonce": 131934,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: lock -> pay -> confirm",
   "originalText": "2. Core flow: lock -> pay -> confirm",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5DgS15wK",
   "type": "text",
   "x": 0,
   "y": 1080,
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
   "seed": 1682363899,
   "version": 1,
   "versionNonce": 1083004332,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Seat state machine (per ShowSeat)",
   "originalText": "3. Seat state machine (per ShowSeat)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hNGbhJrm",
   "type": "text",
   "x": 0,
   "y": 1500,
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
   "seed": 2099477946,
   "version": 1,
   "versionNonce": 313616865,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Storage",
   "originalText": "4. Storage",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6qzhaih4",
   "type": "text",
   "x": 1240,
   "y": 240,
   "width": 297.0,
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
   "seed": 1380393149,
   "version": 1,
   "versionNonce": 758359037,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Seat vs ShowSeat: A1 is one Seat,\nbut one ShowSeat per show.",
   "originalText": "Seat vs ShowSeat: A1 is one Seat,\nbut one ShowSeat per show.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kzE2y7fK",
   "type": "text",
   "x": 1240,
   "y": 1180,
   "width": 342.0,
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
   "seed": 380173659,
   "version": 1,
   "versionNonce": 2135616690,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Lazy expiry: a LOCKED seat past expiry\ncounts as free on the next LockSeats.\nSweeper also frees it.",
   "originalText": "Lazy expiry: a LOCKED seat past expiry\ncounts as free on the next LockSeats.\nSweeper also frees it.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jN5n4cA5",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 140,
   "height": 70.0,
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
   "seed": 251728571,
   "version": 1,
   "versionNonce": 2007491085,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KrITCd6u"
    },
    {
     "type": "arrow",
     "id": "xkiTRQNW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KrITCd6u",
   "type": "text",
   "x": 12,
   "y": 75.0,
   "width": 90.0,
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
   "seed": 579940693,
   "version": 1,
   "versionNonce": 1241152283,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Theater\n- ID, City",
   "originalText": "Theater\n- ID, City",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "jN5n4cA5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "v4b3zx9R",
   "type": "rectangle",
   "x": 280,
   "y": 60,
   "width": 175.0,
   "height": 70.0,
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
   "seed": 1208144636,
   "version": 1,
   "versionNonce": 477042606,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2BjRm3ql"
    },
    {
     "type": "arrow",
     "id": "xkiTRQNW"
    },
    {
     "type": "arrow",
     "id": "aJr1XKCK"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "2BjRm3ql",
   "type": "text",
   "x": 292,
   "y": 75.0,
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
   "seed": 1593654859,
   "version": 1,
   "versionNonce": 458455365,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Screen\n- ID, TheaterID",
   "originalText": "Screen\n- ID, TheaterID",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "v4b3zx9R",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rGl0Q9Cj",
   "type": "rectangle",
   "x": 560,
   "y": 60,
   "width": 211.0,
   "height": 70.0,
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
   "seed": 1927212619,
   "version": 1,
   "versionNonce": 583540382,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "eMbUCXhE"
    },
    {
     "type": "arrow",
     "id": "aJr1XKCK"
    },
    {
     "type": "arrow",
     "id": "MZt9N2LQ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "eMbUCXhE",
   "type": "text",
   "x": 572,
   "y": 75.0,
   "width": 171.0,
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
   "seed": 2104576097,
   "version": 1,
   "versionNonce": 1817115161,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Seat (physical)\n- ID, Row, Category",
   "originalText": "Seat (physical)\n- ID, Row, Category",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "rGl0Q9Cj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "56GLMJ7W",
   "type": "rectangle",
   "x": 900,
   "y": 60,
   "width": 140,
   "height": 70.0,
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
   "seed": 1943423275,
   "version": 1,
   "versionNonce": 271758247,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "k5VMrc1k"
    },
    {
     "type": "arrow",
     "id": "YWLHQTFT"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "k5VMrc1k",
   "type": "text",
   "x": 912,
   "y": 75.0,
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
   "seed": 991476125,
   "version": 1,
   "versionNonce": 1499505903,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Movie\n- ID, Title",
   "originalText": "Movie\n- ID, Title",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "56GLMJ7W",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NWEfMpjR",
   "type": "rectangle",
   "x": 0,
   "y": 240,
   "width": 301.0,
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
   "seed": 749551834,
   "version": 1,
   "versionNonce": 728113359,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7eC33yQa"
    },
    {
     "type": "arrow",
     "id": "jzpp1d3k"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7eC33yQa",
   "type": "text",
   "x": 12,
   "y": 255.0,
   "width": 261.0,
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
   "seed": 455963090,
   "version": 1,
   "versionNonce": 1901664188,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nPricingStrategy\n+ Price(showID, seatID) int64",
   "originalText": "<<interface>>\nPricingStrategy\n+ Price(showID, seatID) int64",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "NWEfMpjR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "95JOsrTk",
   "type": "rectangle",
   "x": 520,
   "y": 240,
   "width": 283.0,
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
   "seed": 975734231,
   "version": 1,
   "versionNonce": 1126075439,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Zj53JVmI"
    },
    {
     "type": "arrow",
     "id": "T57QJOKD"
    },
    {
     "type": "arrow",
     "id": "MZt9N2LQ"
    },
    {
     "type": "arrow",
     "id": "NDKcyg23"
    },
    {
     "type": "arrow",
     "id": "MREn16W3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Zj53JVmI",
   "type": "text",
   "x": 532,
   "y": 255.0,
   "width": 243.0,
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
   "seed": 2070359685,
   "version": 1,
   "versionNonce": 573392901,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ShowSeat (state lives here)\n- State, HoldID, ExpiresAt\n- PricePaise",
   "originalText": "ShowSeat (state lives here)\n- State, HoldID, ExpiresAt\n- PricePaise",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "95JOsrTk",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rNjyynd8",
   "type": "rectangle",
   "x": 900,
   "y": 240,
   "width": 211.0,
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
   "seed": 1131558675,
   "version": 1,
   "versionNonce": 460536360,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ANcZdb4X"
    },
    {
     "type": "arrow",
     "id": "YWLHQTFT"
    },
    {
     "type": "arrow",
     "id": "T57QJOKD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ANcZdb4X",
   "type": "text",
   "x": 912,
   "y": 255.0,
   "width": 171.0,
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
   "seed": 37465017,
   "version": 1,
   "versionNonce": 133603033,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Show\n- MovieID, ScreenID\n- StartAt",
   "originalText": "Show\n- MovieID, ScreenID\n- StartAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "rNjyynd8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "99mh84yo",
   "type": "rectangle",
   "x": 0,
   "y": 430,
   "width": 247.0,
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
   "seed": 2144274868,
   "version": 1,
   "versionNonce": 1681817037,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gSmLygAe"
    },
    {
     "type": "arrow",
     "id": "SWbjY5Ha"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gSmLygAe",
   "type": "text",
   "x": 12,
   "y": 445.0,
   "width": 207.0,
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
   "seed": 1789238494,
   "version": 1,
   "versionNonce": 627900344,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "BookingService (Facade)\n+ LockSeats\n+ ConfirmBooking\n+ ReleaseHold\n+ ReleaseExpiredLocks",
   "originalText": "BookingService (Facade)\n+ LockSeats\n+ ConfirmBooking\n+ ReleaseHold\n+ ReleaseExpiredLocks",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "99mh84yo",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FieN1Lz6",
   "type": "rectangle",
   "x": 520,
   "y": 440,
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
   "seed": 584053966,
   "version": 1,
   "versionNonce": 1117108740,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "MaIdmNyZ"
    },
    {
     "type": "arrow",
     "id": "NDKcyg23"
    },
    {
     "type": "arrow",
     "id": "uwYOHczo"
    },
    {
     "type": "arrow",
     "id": "jzpp1d3k"
    },
    {
     "type": "arrow",
     "id": "SWbjY5Ha"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "MaIdmNyZ",
   "type": "text",
   "x": 532,
   "y": 455.0,
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
   "seed": 763633070,
   "version": 1,
   "versionNonce": 1283314041,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Hold (seat lock, TTL)\n- UserID, SeatIDs\n- AmountPaise, ExpiresAt",
   "originalText": "Hold (seat lock, TTL)\n- UserID, SeatIDs\n- AmountPaise, ExpiresAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "FieN1Lz6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pLeF2aDZ",
   "type": "rectangle",
   "x": 900,
   "y": 440,
   "width": 202.0,
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
   "seed": 1889050299,
   "version": 1,
   "versionNonce": 1583606814,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9zR6JRJy"
    },
    {
     "type": "arrow",
     "id": "MREn16W3"
    },
    {
     "type": "arrow",
     "id": "uwYOHczo"
    },
    {
     "type": "arrow",
     "id": "dox2YnZi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "9zR6JRJy",
   "type": "text",
   "x": 912,
   "y": 455.0,
   "width": 162.0,
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
   "seed": 688257679,
   "version": 1,
   "versionNonce": 324167785,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Booking\n- UserID, SeatIDs\n- PaymentID UNIQUE",
   "originalText": "Booking\n- UserID, SeatIDs\n- PaymentID UNIQUE",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "pLeF2aDZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gWlL5EVa",
   "type": "rectangle",
   "x": 1240,
   "y": 440,
   "width": 256.0,
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
   "seed": 1016954199,
   "version": 1,
   "versionNonce": 1989233342,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nQILV0L8"
    },
    {
     "type": "arrow",
     "id": "dox2YnZi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nQILV0L8",
   "type": "text",
   "x": 1252,
   "y": 455.0,
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
   "seed": 1985754973,
   "version": 1,
   "versionNonce": 1914443503,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nPaymentGateway (Adapter)\n+ CreateOrder, Refund",
   "originalText": "<<interface>>\nPaymentGateway (Adapter)\n+ CreateOrder, Refund",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "gWlL5EVa",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OkaK3U90",
   "type": "rectangle",
   "x": 0,
   "y": 720,
   "width": 140,
   "height": 60,
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
    "type": 3
   },
   "seed": 235964317,
   "version": 1,
   "versionNonce": 141772395,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WEU5uKOD"
    },
    {
     "type": "arrow",
     "id": "KDqiRWPT"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "WEU5uKOD",
   "type": "text",
   "x": 52.0,
   "y": 740.0,
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
   "seed": 2079381502,
   "version": 1,
   "versionNonce": 1264531056,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "User",
   "originalText": "User",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "OkaK3U90",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JHYyqS3l",
   "type": "rectangle",
   "x": 220,
   "y": 720,
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
   "seed": 131538212,
   "version": 1,
   "versionNonce": 1850290159,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "l410Zd3W"
    },
    {
     "type": "arrow",
     "id": "KDqiRWPT"
    },
    {
     "type": "arrow",
     "id": "dYppW5am"
    },
    {
     "type": "arrow",
     "id": "TcveQGKL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "l410Zd3W",
   "type": "text",
   "x": 232,
   "y": 735.0,
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
   "seed": 243552540,
   "version": 1,
   "versionNonce": 187418335,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LockSeats(show, seats)\nall-or-nothing, TTL 10m",
   "originalText": "LockSeats(show, seats)\nall-or-nothing, TTL 10m",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "JHYyqS3l",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gTBYq41X",
   "type": "rectangle",
   "x": 560,
   "y": 720,
   "width": 184.0,
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
   "seed": 1452046793,
   "version": 1,
   "versionNonce": 1928931305,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jgMkmDBX"
    },
    {
     "type": "arrow",
     "id": "dYppW5am"
    },
    {
     "type": "arrow",
     "id": "YydqflnW"
    },
    {
     "type": "arrow",
     "id": "Aza5NX9d"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jgMkmDBX",
   "type": "text",
   "x": 572,
   "y": 735.0,
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
   "seed": 958688803,
   "version": 1,
   "versionNonce": 308194636,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PaymentGateway\nuser pays amount",
   "originalText": "PaymentGateway\nuser pays amount",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "gTBYq41X",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "oh1yxUND",
   "type": "rectangle",
   "x": 880,
   "y": 720,
   "width": 319.0,
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
   "seed": 330154968,
   "version": 1,
   "versionNonce": 1455988596,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "snCf82Cw"
    },
    {
     "type": "arrow",
     "id": "YydqflnW"
    },
    {
     "type": "arrow",
     "id": "zjOLHssY"
    },
    {
     "type": "arrow",
     "id": "TOxfVIVu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "snCf82Cw",
   "type": "text",
   "x": 892,
   "y": 735.0,
   "width": 279.0,
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
   "seed": 1318522710,
   "version": 1,
   "versionNonce": 703769333,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ConfirmBooking(hold, paymentID)\nidempotent on paymentID",
   "originalText": "ConfirmBooking(hold, paymentID)\nidempotent on paymentID",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "oh1yxUND",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Gwj9KFDs",
   "type": "rectangle",
   "x": 1280,
   "y": 720,
   "width": 211.0,
   "height": 90.0,
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
   "seed": 1792748834,
   "version": 1,
   "versionNonce": 1546973247,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xzPWg4qG"
    },
    {
     "type": "arrow",
     "id": "zjOLHssY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "xzPWg4qG",
   "type": "text",
   "x": 1292,
   "y": 735.0,
   "width": 171.0,
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
   "seed": 684819496,
   "version": 1,
   "versionNonce": 2076032085,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Booking confirmed\nseats BOOKED\nevent -> ticket SMS",
   "originalText": "Booking confirmed\nseats BOOKED\nevent -> ticket SMS",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Gwj9KFDs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Jpi80Od9",
   "type": "rectangle",
   "x": 220,
   "y": 900,
   "width": 211.0,
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
   "seed": 265404004,
   "version": 1,
   "versionNonce": 45393588,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "bTM96fNU"
    },
    {
     "type": "arrow",
     "id": "TcveQGKL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "bTM96fNU",
   "type": "text",
   "x": 232,
   "y": 915.0,
   "width": 171.0,
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
   "seed": 449991151,
   "version": 1,
   "versionNonce": 405639347,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Any seat taken\n409, nothing locked",
   "originalText": "Any seat taken\n409, nothing locked",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Jpi80Od9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "n7hHmDPh",
   "type": "rectangle",
   "x": 560,
   "y": 900,
   "width": 265.0,
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
   "seed": 969359965,
   "version": 1,
   "versionNonce": 358474075,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xxJjNYRs"
    },
    {
     "type": "arrow",
     "id": "Aza5NX9d"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "xxJjNYRs",
   "type": "text",
   "x": 572,
   "y": 915.0,
   "width": 225.0,
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
   "seed": 330395115,
   "version": 1,
   "versionNonce": 175907665,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Payment failed or timeout\nReleaseHold -> AVAILABLE",
   "originalText": "Payment failed or timeout\nReleaseHold -> AVAILABLE",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "n7hHmDPh",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8HQC0pf9",
   "type": "rectangle",
   "x": 900,
   "y": 900,
   "width": 265.0,
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
   "seed": 1863702099,
   "version": 1,
   "versionNonce": 1956373526,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "s0NyYXwE"
    },
    {
     "type": "arrow",
     "id": "TOxfVIVu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "s0NyYXwE",
   "type": "text",
   "x": 912,
   "y": 915.0,
   "width": 225.0,
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
   "seed": 2090989229,
   "version": 1,
   "versionNonce": 1724379916,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Hold expired or re-locked\nErrHoldExpired -> refund",
   "originalText": "Hold expired or re-locked\nErrHoldExpired -> refund",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "8HQC0pf9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XyUGoAq6",
   "type": "ellipse",
   "x": 0,
   "y": 1160,
   "width": 200,
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
   "seed": 1511030654,
   "version": 1,
   "versionNonce": 1424259912,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hl7qfMdN"
    },
    {
     "type": "arrow",
     "id": "GQ1bvzfp"
    },
    {
     "type": "arrow",
     "id": "nIKsnuuL"
    },
    {
     "type": "arrow",
     "id": "zSTH8Av1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hl7qfMdN",
   "type": "text",
   "x": 59.5,
   "y": 1190.0,
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
   "seed": 480158994,
   "version": 1,
   "versionNonce": 223756982,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "AVAILABLE",
   "originalText": "AVAILABLE",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XyUGoAq6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eyXXycC3",
   "type": "ellipse",
   "x": 480,
   "y": 1160,
   "width": 200,
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
   "seed": 146669635,
   "version": 1,
   "versionNonce": 479015087,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PgHL0vRu"
    },
    {
     "type": "arrow",
     "id": "GQ1bvzfp"
    },
    {
     "type": "arrow",
     "id": "nIKsnuuL"
    },
    {
     "type": "arrow",
     "id": "s3soD95i"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "PgHL0vRu",
   "type": "text",
   "x": 492,
   "y": 1180.0,
   "width": 153.0,
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
   "seed": 1807809135,
   "version": 1,
   "versionNonce": 1108965697,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LOCKED\n(hold_id, expiry)",
   "originalText": "LOCKED\n(hold_id, expiry)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "eyXXycC3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bKQNUlW6",
   "type": "ellipse",
   "x": 960,
   "y": 1340,
   "width": 200,
   "height": 80,
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
   "roundness": null,
   "seed": 253494912,
   "version": 1,
   "versionNonce": 703758031,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PvGJ4Oz4"
    },
    {
     "type": "arrow",
     "id": "s3soD95i"
    },
    {
     "type": "arrow",
     "id": "zSTH8Av1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "PvGJ4Oz4",
   "type": "text",
   "x": 1033.0,
   "y": 1370.0,
   "width": 54.0,
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
   "seed": 82483587,
   "version": 1,
   "versionNonce": 968187301,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "BOOKED",
   "originalText": "BOOKED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "bKQNUlW6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Owzamknm",
   "type": "rectangle",
   "x": 0,
   "y": 1560,
   "width": 355.0,
   "height": 170.0,
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
   "seed": 370305180,
   "version": 1,
   "versionNonce": 1276168526,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AGhDD3G7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "AGhDD3G7",
   "type": "text",
   "x": 12,
   "y": 1575.0,
   "width": 315.0,
   "height": 140.0,
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
   "seed": 1469532039,
   "version": 1,
   "versionNonce": 1349109735,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "show_seats\nPK (show_id, seat_id)\nstate CHECK available|locked|booked\nhold_id, hold_expiry\nprice_paise BIGINT\nlock = conditional UPDATE,\nrows affected must = seat count",
   "originalText": "show_seats\nPK (show_id, seat_id)\nstate CHECK available|locked|booked\nhold_id, hold_expiry\nprice_paise BIGINT\nlock = conditional UPDATE,\nrows affected must = seat count",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Owzamknm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "taf3bDxQ",
   "type": "rectangle",
   "x": 440,
   "y": 1560,
   "width": 310.0,
   "height": 130.0,
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
   "seed": 1258572907,
   "version": 1,
   "versionNonce": 1291855657,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HTAqGLSm"
    },
    {
     "type": "arrow",
     "id": "i8E5h4E3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "HTAqGLSm",
   "type": "text",
   "x": 452,
   "y": 1575.0,
   "width": 270.0,
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
   "seed": 1685731614,
   "version": 1,
   "versionNonce": 1084846365,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "bookings\nid PK\npayment_id UNIQUE (idempotent)\namount_paise BIGINT\nstatus confirmed | cancelled",
   "originalText": "bookings\nid PK\npayment_id UNIQUE (idempotent)\namount_paise BIGINT\nstatus confirmed | cancelled",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "taf3bDxQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bDnxlQ0W",
   "type": "rectangle",
   "x": 840,
   "y": 1560,
   "width": 382.0,
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
   "seed": 991598648,
   "version": 1,
   "versionNonce": 584198648,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lA8vAMtl"
    },
    {
     "type": "arrow",
     "id": "i8E5h4E3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "lA8vAMtl",
   "type": "text",
   "x": 852,
   "y": 1575.0,
   "width": 342.0,
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
   "seed": 380413729,
   "version": 1,
   "versionNonce": 771969309,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "booking_seats\n(booking_id, show_id, seat_id, active)\nUNIQUE (show_id, seat_id) WHERE active\n= final guard vs double booking",
   "originalText": "booking_seats\n(booking_id, show_id, seat_id, active)\nUNIQUE (show_id, seat_id) WHERE active\n= final guard vs double booking",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "bDnxlQ0W",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "xkiTRQNW",
   "type": "arrow",
   "x": 144.0,
   "y": 95.0,
   "width": 132.0,
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
   "seed": 259817292,
   "version": 1,
   "versionNonce": 354498289,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IpdGCht6"
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
     132.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jN5n4cA5",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "v4b3zx9R",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "IpdGCht6",
   "type": "text",
   "x": 174.5625,
   "y": 86.25,
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
   "seed": 1604033915,
   "version": 1,
   "versionNonce": 1012046559,
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
   "containerId": "xkiTRQNW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aJr1XKCK",
   "type": "arrow",
   "x": 459.0,
   "y": 95.0,
   "width": 97.0,
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
   "seed": 1871966137,
   "version": 1,
   "versionNonce": 1567826632,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FztlN8CM"
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
     97.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "v4b3zx9R",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "rGl0Q9Cj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "FztlN8CM",
   "type": "text",
   "x": 472.0625,
   "y": 86.25,
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
   "seed": 596363767,
   "version": 1,
   "versionNonce": 296924501,
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
   "containerId": "aJr1XKCK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YWLHQTFT",
   "type": "arrow",
   "x": 977.2868421052632,
   "y": 134.0,
   "width": 19.05789473684206,
   "height": 102.0,
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
   "seed": 491144471,
   "version": 1,
   "versionNonce": 1127086271,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7w5yNIi5"
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
     19.05789473684206,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "56GLMJ7W",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "rNjyynd8",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7w5yNIi5",
   "type": "text",
   "x": 951.3782894736842,
   "y": 176.25,
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
   "seed": 1741187447,
   "version": 1,
   "versionNonce": 357097357,
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
   "containerId": "YWLHQTFT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "T57QJOKD",
   "type": "arrow",
   "x": 896.0,
   "y": 285.0,
   "width": 89.0,
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
   "seed": 1573676367,
   "version": 1,
   "versionNonce": 64519835,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "XXiEvRbo"
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
     -89.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "rNjyynd8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "95JOsrTk",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "XXiEvRbo",
   "type": "text",
   "x": 816.0625,
   "y": 276.25,
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
   "seed": 298512077,
   "version": 1,
   "versionNonce": 2037427830,
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
   "containerId": "T57QJOKD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MZt9N2LQ",
   "type": "arrow",
   "x": 662.5315789473684,
   "y": 236.0,
   "width": 2.147368421052647,
   "height": 102.0,
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
   "seed": 1431856689,
   "version": 1,
   "versionNonce": 453950989,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "OP8n1jDf"
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
     2.147368421052647,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "95JOsrTk",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "rGl0Q9Cj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "OP8n1jDf",
   "type": "text",
   "x": 628.1677631578948,
   "y": 176.25,
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
   "seed": 1006268700,
   "version": 1,
   "versionNonce": 743838085,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "refers to",
   "originalText": "refers to",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "MZt9N2LQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NDKcyg23",
   "type": "arrow",
   "x": 651.3075,
   "y": 436.0,
   "width": 6.884999999999991,
   "height": 102.0,
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
   "seed": 1863851410,
   "version": 1,
   "versionNonce": 1506398778,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gEyMwC3h"
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
     6.884999999999991,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "FieN1Lz6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "95JOsrTk",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "gEyMwC3h",
   "type": "text",
   "x": 611.4375,
   "y": 376.25,
   "width": 86.625,
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
   "seed": 665450213,
   "version": 1,
   "versionNonce": 351122935,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "locks 1..10",
   "originalText": "locks 1..10",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NDKcyg23",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MREn16W3",
   "type": "arrow",
   "x": 917.8225,
   "y": 436.0,
   "width": 173.14499999999998,
   "height": 102.0,
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
   "seed": 1920084998,
   "version": 1,
   "versionNonce": 1863385985,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ttKCvinR"
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
     -173.14499999999998,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pLeF2aDZ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "95JOsrTk",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ttKCvinR",
   "type": "text",
   "x": 815.5,
   "y": 376.25,
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
   "seed": 963403594,
   "version": 1,
   "versionNonce": 31693942,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "owns",
   "originalText": "owns",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "MREn16W3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uwYOHczo",
   "type": "arrow",
   "x": 896.0,
   "y": 485.0,
   "width": 116.0,
   "height": 0.0,
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
   "seed": 621984376,
   "version": 1,
   "versionNonce": 479711023,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "X66DAYcB"
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
     -116.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pLeF2aDZ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "FieN1Lz6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "X66DAYcB",
   "type": "text",
   "x": 790.75,
   "y": 476.25,
   "width": 94.5,
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
   "seed": 1979492269,
   "version": 1,
   "versionNonce": 1179514233,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "created from",
   "originalText": "created from",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "uwYOHczo",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jzpp1d3k",
   "type": "arrow",
   "x": 526.1125,
   "y": 436.0,
   "width": 253.72499999999997,
   "height": 102.0,
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
   "seed": 1474339030,
   "version": 1,
   "versionNonce": 276918661,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "O0WiOm5k"
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
     -253.72499999999997,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "FieN1Lz6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "NWEfMpjR",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "O0WiOm5k",
   "type": "text",
   "x": 363.8125,
   "y": 376.25,
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
   "seed": 306081146,
   "version": 1,
   "versionNonce": 2035942148,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "priced by",
   "originalText": "priced by",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jzpp1d3k",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dox2YnZi",
   "type": "arrow",
   "x": 1106.0,
   "y": 485.0,
   "width": 130.0,
   "height": 0.0,
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
   "seed": 383748915,
   "version": 1,
   "versionNonce": 1283080222,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GN33gVYW"
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
     130.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pLeF2aDZ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "gWlL5EVa",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "GN33gVYW",
   "type": "text",
   "x": 1139.5,
   "y": 476.25,
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
   "seed": 97188277,
   "version": 1,
   "versionNonce": 2105088768,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "paid via",
   "originalText": "paid via",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "dox2YnZi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SWbjY5Ha",
   "type": "arrow",
   "x": 251.0,
   "y": 492.56911344137274,
   "width": 265.0,
   "height": 5.052430886558625,
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
   "seed": 1355642854,
   "version": 1,
   "versionNonce": 758019421,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iFOoYftA"
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
     265.0,
     -5.052430886558625
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "99mh84yo",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "FieN1Lz6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "iFOoYftA",
   "type": "text",
   "x": 355.9375,
   "y": 481.2928979980934,
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
   "seed": 1820921255,
   "version": 1,
   "versionNonce": 178305192,
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
   "containerId": "SWbjY5Ha",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KDqiRWPT",
   "type": "arrow",
   "x": 144.0,
   "y": 751.3528336380256,
   "width": 72.0,
   "height": 1.3162705667276668,
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
   "seed": 27707814,
   "version": 1,
   "versionNonce": 470218902,
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
     72.0,
     1.3162705667276668
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "OkaK3U90",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "JHYyqS3l",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "dYppW5am",
   "type": "arrow",
   "x": 471.0,
   "y": 755.0,
   "width": 85.0,
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
   "seed": 555459799,
   "version": 1,
   "versionNonce": 2022744765,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Ytuk6hhr"
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
     85.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "JHYyqS3l",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "gTBYq41X",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Ytuk6hhr",
   "type": "text",
   "x": 454.4375,
   "y": 746.25,
   "width": 118.125,
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
   "seed": 728295019,
   "version": 1,
   "versionNonce": 182337221,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "hold_id, amount",
   "originalText": "hold_id, amount",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "dYppW5am",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YydqflnW",
   "type": "arrow",
   "x": 748.0,
   "y": 755.0,
   "width": 128.0,
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
   "seed": 903179720,
   "version": 1,
   "versionNonce": 1251020424,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "weIEewXX"
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
     128.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gTBYq41X",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "oh1yxUND",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "weIEewXX",
   "type": "text",
   "x": 784.4375,
   "y": 746.25,
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
   "seed": 1603526170,
   "version": 1,
   "versionNonce": 1963171792,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "success",
   "originalText": "success",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "YydqflnW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zjOLHssY",
   "type": "arrow",
   "x": 1203.0,
   "y": 759.7254335260116,
   "width": 73.0,
   "height": 2.1098265895954,
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
   "seed": 505290018,
   "version": 1,
   "versionNonce": 1903223789,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1eSX2oP4"
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
     73.0,
     2.1098265895954
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "oh1yxUND",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Gwj9KFDs",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "1eSX2oP4",
   "type": "text",
   "x": 1176.5,
   "y": 752.0303468208092,
   "width": 126.0,
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
   "seed": 1997873642,
   "version": 1,
   "versionNonce": 1632152474,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "seats still ours",
   "originalText": "seats still ours",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "zjOLHssY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TcveQGKL",
   "type": "arrow",
   "x": 339.6,
   "y": 794.0,
   "width": 10.200000000000045,
   "height": 102.0,
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
   "seed": 1815311965,
   "version": 1,
   "versionNonce": 946119293,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EDIoxZ9N"
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
     -10.200000000000045,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "JHYyqS3l",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Jpi80Od9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "EDIoxZ9N",
   "type": "text",
   "x": 303.0,
   "y": 836.25,
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
   "seed": 42148671,
   "version": 1,
   "versionNonce": 1263866750,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "conflict",
   "originalText": "conflict",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "TcveQGKL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Aza5NX9d",
   "type": "arrow",
   "x": 660.775,
   "y": 794.0,
   "width": 22.950000000000045,
   "height": 102.0,
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
   "seed": 2139004950,
   "version": 1,
   "versionNonce": 1161628653,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9LRaj5Na"
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
     22.950000000000045,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gTBYq41X",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "n7hHmDPh",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "9LRaj5Na",
   "type": "text",
   "x": 644.6875,
   "y": 836.25,
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
   "seed": 1986835553,
   "version": 1,
   "versionNonce": 950347819,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "failure",
   "originalText": "failure",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Aza5NX9d",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TOxfVIVu",
   "type": "arrow",
   "x": 1037.9833333333333,
   "y": 794.0,
   "width": 3.966666666666697,
   "height": 102.0,
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
   "seed": 896934631,
   "version": 1,
   "versionNonce": 319278043,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tNwFXpzk"
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
     -3.966666666666697,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "oh1yxUND",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8HQC0pf9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "tNwFXpzk",
   "type": "text",
   "x": 992.6875,
   "y": 836.25,
   "width": 86.625,
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
   "seed": 1601634094,
   "version": 1,
   "versionNonce": 597541334,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "check fails",
   "originalText": "check fails",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "TOxfVIVu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GQ1bvzfp",
   "type": "arrow",
   "x": 204.0,
   "y": 1215.0,
   "width": 272.0,
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
   "seed": 440680307,
   "version": 1,
   "versionNonce": 87395713,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "boALMScf"
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
     272.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "XyUGoAq6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "eyXXycC3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "boALMScf",
   "type": "text",
   "x": 304.5625,
   "y": 1206.25,
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
   "seed": 298124478,
   "version": 1,
   "versionNonce": 2122669805,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LockSeats",
   "originalText": "LockSeats",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "GQ1bvzfp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nIKsnuuL",
   "type": "arrow",
   "x": 476.0,
   "y": 1185.0,
   "width": 272.0,
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
   "seed": 1190942151,
   "version": 1,
   "versionNonce": 1894251472,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "fo8tegJG"
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
     -272.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eyXXycC3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "XyUGoAq6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "fo8tegJG",
   "type": "text",
   "x": 225.8125,
   "y": 1176.25,
   "width": 228.375,
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
   "seed": 1876286934,
   "version": 1,
   "versionNonce": 561188059,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "expired / pay failed / cancel",
   "originalText": "expired / pay failed / cancel",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "nIKsnuuL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "s3soD95i",
   "type": "arrow",
   "x": 657.8280816797267,
   "y": 1229.1855306298976,
   "width": 324.34383664054667,
   "height": 121.62893874020483,
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
   "seed": 1798590406,
   "version": 1,
   "versionNonce": 355747280,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "75em9GNG"
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
     324.34383664054667,
     121.62893874020483
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eyXXycC3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "bKQNUlW6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "75em9GNG",
   "type": "text",
   "x": 764.875,
   "y": 1281.25,
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
   "seed": 673974249,
   "version": 1,
   "versionNonce": 616530701,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ConfirmBooking",
   "originalText": "ConfirmBooking",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "s3soD95i",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zSTH8Av1",
   "type": "arrow",
   "x": 964.9190965676202,
   "y": 1362.1723306064289,
   "width": 769.8381931352403,
   "height": 144.34466121285777,
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
   "seed": 110153953,
   "version": 1,
   "versionNonce": 986230639,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7PJ6MopF"
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
     -769.8381931352403,
     -144.34466121285777
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "bKQNUlW6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "XyUGoAq6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7PJ6MopF",
   "type": "text",
   "x": 477.625,
   "y": 1281.25,
   "width": 204.75,
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
   "seed": 447658325,
   "version": 1,
   "versionNonce": 358933831,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "booking cancelled + refund",
   "originalText": "booking cancelled + refund",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "zSTH8Av1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "i8E5h4E3",
   "type": "arrow",
   "x": 836.0,
   "y": 1619.4724770642201,
   "width": 82.0,
   "height": 1.8807339449542724,
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
   "seed": 1291065727,
   "version": 1,
   "versionNonce": 1068317896,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "biU8bXmq"
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
     -82.0,
     1.8807339449542724
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "bDnxlQ0W",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "taf3bDxQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "biU8bXmq",
   "type": "text",
   "x": 759.5625,
   "y": 1611.6628440366972,
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
   "seed": 601324113,
   "version": 1,
   "versionNonce": 1237630391,
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
   "containerId": "i8E5h4E3",
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