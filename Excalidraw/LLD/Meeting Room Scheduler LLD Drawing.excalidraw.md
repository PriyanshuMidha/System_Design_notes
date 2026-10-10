---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^8IobrUqv

2. Core flow: BookRoom (no double booking) ^EzLkBoSb

3. State machine: Booking ^z3wiC0Hp

4. Storage (Postgres) ^FdVPpN4I

Half-open [start, end): 10-11 and 11-12 do not clash.
Store UTC, convert at the edges. ^8PkePToK

DB lock instead of mutex:
EXCLUDE constraint, or SELECT ... FOR UPDATE on the room row ^LzgFi1Ji

SchedulerService (facade)
- rooms map[id]*RoomCalendar
- byID map[id]*Booking
+ FindAvailableRooms(start, end, cap)
+ BookRoom(req) (Booking, error)
+ CancelBooking(id, user) ^pS9PbEX7

RoomCalendar
- mu sync.Mutex (per room)
- bookings []*Booking sorted
+ conflictIndex(start, end) ^O3aCRFmp

Room
- ID, Name
- Capacity int ^K5SZBgTG

<<interface>>
RoomSelector
+ Order(rooms, n) []Room ^nB1N9fby

SmallestFit ^oqgf54gp

Booking
- RoomID, UserID
- Start, End  UTC, [start, end)
- Status BOOKED / CANCELLED ^rnb38C34

User
- ID, Email
- TimeZone (display only) ^ruktKjT4

Client
POST /bookings ^a3XFOh3r

BookRoom
start < end, not past
convert to UTC ^VwIRIGfB

lock room mutex ^SDXdk3AR

binary search start
check 2 neighbours:
s < e' && s' < e ^3dahDy0N

insert sorted
unlock, return Booking ^rOHRJl8J

overlap -> ErrConflict
auto-pick: try next room ^dLdbMejt

BOOKED ^8uI0Hcrx

CANCELLED ^eEjUy9QM

DONE (end passed) ^z5FrdgMm

rooms
 id PK
 name
 capacity INT ^vV08oz4X

bookings
 id PK, room_id FK, user_id
 during TSTZRANGE '[)'
 status, idempotency_key
 EXCLUDE USING gist
  (room_id WITH =, during WITH &&)
  WHERE status = 'BOOKED'
 UNIQUE (user_id, idempotency_key) ^PtRRIPZF

1 to many ^GLZjAuUn

for 1 ^ccRwHRyk

1 to many ^NFrO6cxM

uses ^8FOaHY4Y

implements ^HVWCSk9X

organizer ^Q2SWisTF

free ^ugpZ9FZ6

clash ^5m0NR6HR

Cancel, before start ^tQdHbvr2

time passes ^5BRwRbTe

1 to many ^50I6XnmA

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "8IobrUqv",
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
   "seed": 1901585862,
   "version": 1,
   "versionNonce": 180396527,
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
   "id": "EzLkBoSb",
   "type": "text",
   "x": 0,
   "y": 640,
   "width": 661.5,
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
   "seed": 1399034006,
   "version": 1,
   "versionNonce": 951938985,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: BookRoom (no double booking)",
   "originalText": "2. Core flow: BookRoom (no double booking)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "z3wiC0Hp",
   "type": "text",
   "x": 0,
   "y": 1060,
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
   "seed": 1273511908,
   "version": 1,
   "versionNonce": 2057551636,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machine: Booking",
   "originalText": "3. State machine: Booking",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FdVPpN4I",
   "type": "text",
   "x": 0,
   "y": 1420,
   "width": 330.75,
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
   "seed": 1200420581,
   "version": 1,
   "versionNonce": 1292828138,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Storage (Postgres)",
   "originalText": "4. Storage (Postgres)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8PkePToK",
   "type": "text",
   "x": 640,
   "y": 1150,
   "width": 477.0,
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
   "seed": 2023547892,
   "version": 1,
   "versionNonce": 1657366540,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Half-open [start, end): 10-11 and 11-12 do not clash.\nStore UTC, convert at the edges.",
   "originalText": "Half-open [start, end): 10-11 and 11-12 do not clash.\nStore UTC, convert at the edges.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LzgFi1Ji",
   "type": "text",
   "x": 880,
   "y": 1500,
   "width": 540.0,
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
   "seed": 12217796,
   "version": 1,
   "versionNonce": 1823813625,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "DB lock instead of mutex:\nEXCLUDE constraint, or SELECT ... FOR UPDATE on the room row",
   "originalText": "DB lock instead of mutex:\nEXCLUDE constraint, or SELECT ... FOR UPDATE on the room row",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KIFZ9SFa",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 373.0,
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
   "seed": 2068898219,
   "version": 1,
   "versionNonce": 288854796,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pS9PbEX7"
    },
    {
     "type": "arrow",
     "id": "2Hzj2haI"
    },
    {
     "type": "arrow",
     "id": "ZXsmMM05"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "pS9PbEX7",
   "type": "text",
   "x": 12,
   "y": 75.0,
   "width": 333.0,
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
   "seed": 1381815094,
   "version": 1,
   "versionNonce": 659739225,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SchedulerService (facade)\n- rooms map[id]*RoomCalendar\n- byID map[id]*Booking\n+ FindAvailableRooms(start, end, cap)\n+ BookRoom(req) (Booking, error)\n+ CancelBooking(id, user)",
   "originalText": "SchedulerService (facade)\n- rooms map[id]*RoomCalendar\n- byID map[id]*Booking\n+ FindAvailableRooms(start, end, cap)\n+ BookRoom(req) (Booking, error)\n+ CancelBooking(id, user)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KIFZ9SFa",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "xSWJyNc5",
   "type": "rectangle",
   "x": 480,
   "y": 60,
   "width": 292.0,
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
   "seed": 13559271,
   "version": 1,
   "versionNonce": 411172506,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "O3aCRFmp"
    },
    {
     "type": "arrow",
     "id": "2Hzj2haI"
    },
    {
     "type": "arrow",
     "id": "9tHErTkx"
    },
    {
     "type": "arrow",
     "id": "GEkOG99q"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "O3aCRFmp",
   "type": "text",
   "x": 492,
   "y": 75.0,
   "width": 252.0,
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
   "seed": 438737500,
   "version": 1,
   "versionNonce": 1938070638,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "RoomCalendar\n- mu sync.Mutex (per room)\n- bookings []*Booking sorted\n+ conflictIndex(start, end)",
   "originalText": "RoomCalendar\n- mu sync.Mutex (per room)\n- bookings []*Booking sorted\n+ conflictIndex(start, end)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "xSWJyNc5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "q0Mr2kAQ",
   "type": "rectangle",
   "x": 900,
   "y": 60,
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
   "seed": 92937838,
   "version": 1,
   "versionNonce": 2041469794,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "K5SZBgTG"
    },
    {
     "type": "arrow",
     "id": "9tHErTkx"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "K5SZBgTG",
   "type": "text",
   "x": 912,
   "y": 75.0,
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
   "seed": 1077426136,
   "version": 1,
   "versionNonce": 1531022278,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Room\n- ID, Name\n- Capacity int",
   "originalText": "Room\n- ID, Name\n- Capacity int",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "q0Mr2kAQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8uBrqvZg",
   "type": "rectangle",
   "x": 0,
   "y": 330,
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
   "seed": 694267268,
   "version": 1,
   "versionNonce": 1474388117,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nB1N9fby"
    },
    {
     "type": "arrow",
     "id": "ZXsmMM05"
    },
    {
     "type": "arrow",
     "id": "OnzBCmmS"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nB1N9fby",
   "type": "text",
   "x": 12,
   "y": 345.0,
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
   "seed": 450891698,
   "version": 1,
   "versionNonce": 398445224,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nRoomSelector\n+ Order(rooms, n) []Room",
   "originalText": "<<interface>>\nRoomSelector\n+ Order(rooms, n) []Room",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "8uBrqvZg",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "06CfPHwU",
   "type": "rectangle",
   "x": 0,
   "y": 500,
   "width": 140,
   "height": 60,
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
   "seed": 915398225,
   "version": 1,
   "versionNonce": 2118794927,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oqgf54gp"
    },
    {
     "type": "arrow",
     "id": "OnzBCmmS"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "oqgf54gp",
   "type": "text",
   "x": 20.5,
   "y": 520.0,
   "width": 99.0,
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
   "seed": 1232910709,
   "version": 1,
   "versionNonce": 1517278606,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SmallestFit",
   "originalText": "SmallestFit",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "06CfPHwU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QLS4nlI0",
   "type": "rectangle",
   "x": 480,
   "y": 330,
   "width": 319.0,
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
   "seed": 1707859185,
   "version": 1,
   "versionNonce": 460436659,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "rnb38C34"
    },
    {
     "type": "arrow",
     "id": "GEkOG99q"
    },
    {
     "type": "arrow",
     "id": "IFJ4RXUE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "rnb38C34",
   "type": "text",
   "x": 492,
   "y": 345.0,
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
   "seed": 94803741,
   "version": 1,
   "versionNonce": 993998798,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Booking\n- RoomID, UserID\n- Start, End  UTC, [start, end)\n- Status BOOKED / CANCELLED",
   "originalText": "Booking\n- RoomID, UserID\n- Start, End  UTC, [start, end)\n- Status BOOKED / CANCELLED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "QLS4nlI0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Emf9gG6s",
   "type": "rectangle",
   "x": 900,
   "y": 330,
   "width": 265.0,
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
   "seed": 808743321,
   "version": 1,
   "versionNonce": 1499110237,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ruktKjT4"
    },
    {
     "type": "arrow",
     "id": "IFJ4RXUE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ruktKjT4",
   "type": "text",
   "x": 912,
   "y": 345.0,
   "width": 225.0,
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
   "seed": 1580970524,
   "version": 1,
   "versionNonce": 745524590,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "User\n- ID, Email\n- TimeZone (display only)",
   "originalText": "User\n- ID, Email\n- TimeZone (display only)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Emf9gG6s",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gLhmg0yN",
   "type": "rectangle",
   "x": 0,
   "y": 700,
   "width": 166.0,
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
   "seed": 1639105903,
   "version": 1,
   "versionNonce": 2111276141,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "a3XFOh3r"
    },
    {
     "type": "arrow",
     "id": "RIqScrSI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "a3XFOh3r",
   "type": "text",
   "x": 12,
   "y": 715.0,
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
   "seed": 202408458,
   "version": 1,
   "versionNonce": 761452739,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Client\nPOST /bookings",
   "originalText": "Client\nPOST /bookings",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "gLhmg0yN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MuKFNXg3",
   "type": "rectangle",
   "x": 260,
   "y": 700,
   "width": 229.0,
   "height": 90.0,
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
   "seed": 720306141,
   "version": 1,
   "versionNonce": 1695266421,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VwIRIGfB"
    },
    {
     "type": "arrow",
     "id": "RIqScrSI"
    },
    {
     "type": "arrow",
     "id": "RXV02LqK"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VwIRIGfB",
   "type": "text",
   "x": 272,
   "y": 715.0,
   "width": 189.0,
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
   "seed": 763942182,
   "version": 1,
   "versionNonce": 974862216,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "BookRoom\nstart < end, not past\nconvert to UTC",
   "originalText": "BookRoom\nstart < end, not past\nconvert to UTC",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "MuKFNXg3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "46Qi2ZvO",
   "type": "rectangle",
   "x": 560,
   "y": 700,
   "width": 175.0,
   "height": 60,
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
   "seed": 1736769947,
   "version": 1,
   "versionNonce": 601542032,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "SDXdk3AR"
    },
    {
     "type": "arrow",
     "id": "RXV02LqK"
    },
    {
     "type": "arrow",
     "id": "BWtX5ylL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "SDXdk3AR",
   "type": "text",
   "x": 580.0,
   "y": 720.0,
   "width": 135.0,
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
   "seed": 112833379,
   "version": 1,
   "versionNonce": 1457311008,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock room mutex",
   "originalText": "lock room mutex",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "46Qi2ZvO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lJebrTPQ",
   "type": "rectangle",
   "x": 830,
   "y": 700,
   "width": 211.0,
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
   "seed": 1994962219,
   "version": 1,
   "versionNonce": 1179062604,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "3dahDy0N"
    },
    {
     "type": "arrow",
     "id": "BWtX5ylL"
    },
    {
     "type": "arrow",
     "id": "XAio3ZNQ"
    },
    {
     "type": "arrow",
     "id": "IQZfDwLp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "3dahDy0N",
   "type": "text",
   "x": 842,
   "y": 715.0,
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
   "seed": 824081057,
   "version": 1,
   "versionNonce": 1695046226,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "binary search start\ncheck 2 neighbours:\ns < e' && s' < e",
   "originalText": "binary search start\ncheck 2 neighbours:\ns < e' && s' < e",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lJebrTPQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dXqUCSYb",
   "type": "rectangle",
   "x": 1140,
   "y": 700,
   "width": 238.0,
   "height": 70.0,
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
   "seed": 314033649,
   "version": 1,
   "versionNonce": 1569355583,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "rOHRJl8J"
    },
    {
     "type": "arrow",
     "id": "XAio3ZNQ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "rOHRJl8J",
   "type": "text",
   "x": 1152,
   "y": 715.0,
   "width": 198.0,
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
   "seed": 897052430,
   "version": 1,
   "versionNonce": 1797217836,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "insert sorted\nunlock, return Booking",
   "originalText": "insert sorted\nunlock, return Booking",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "dXqUCSYb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OSEdeAUP",
   "type": "rectangle",
   "x": 830,
   "y": 900,
   "width": 256.0,
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
   "seed": 2088636671,
   "version": 1,
   "versionNonce": 1453338045,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dLdbMejt"
    },
    {
     "type": "arrow",
     "id": "IQZfDwLp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dLdbMejt",
   "type": "text",
   "x": 842,
   "y": 915.0,
   "width": 216.0,
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
   "seed": 1278490010,
   "version": 1,
   "versionNonce": 826550847,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "overlap -> ErrConflict\nauto-pick: try next room",
   "originalText": "overlap -> ErrConflict\nauto-pick: try next room",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "OSEdeAUP",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ybXnEYWr",
   "type": "ellipse",
   "x": 0,
   "y": 1130,
   "width": 140,
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
   "roundness": null,
   "seed": 1998502156,
   "version": 1,
   "versionNonce": 1420644360,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8uI0Hcrx"
    },
    {
     "type": "arrow",
     "id": "oDCx0bxq"
    },
    {
     "type": "arrow",
     "id": "0i1TKGOb"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "8uI0Hcrx",
   "type": "text",
   "x": 43.0,
   "y": 1150.0,
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
   "seed": 1403750395,
   "version": 1,
   "versionNonce": 1070384594,
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
   "containerId": "ybXnEYWr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XAooApIL",
   "type": "ellipse",
   "x": 360,
   "y": 1130,
   "width": 140,
   "height": 60,
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
   "seed": 792489013,
   "version": 1,
   "versionNonce": 1641295768,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "eEjUy9QM"
    },
    {
     "type": "arrow",
     "id": "oDCx0bxq"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "eEjUy9QM",
   "type": "text",
   "x": 389.5,
   "y": 1150.0,
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
   "seed": 1929428230,
   "version": 1,
   "versionNonce": 1207526092,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "CANCELLED",
   "originalText": "CANCELLED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XAooApIL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "k4fiwJIn",
   "type": "ellipse",
   "x": 360,
   "y": 1280,
   "width": 193.0,
   "height": 60,
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
   "seed": 1310917098,
   "version": 1,
   "versionNonce": 1783500553,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "z5FrdgMm"
    },
    {
     "type": "arrow",
     "id": "0i1TKGOb"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "z5FrdgMm",
   "type": "text",
   "x": 380.0,
   "y": 1300.0,
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
   "seed": 474158178,
   "version": 1,
   "versionNonce": 1927258822,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "DONE (end passed)",
   "originalText": "DONE (end passed)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "k4fiwJIn",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IAr34E98",
   "type": "rectangle",
   "x": 0,
   "y": 1480,
   "width": 157.0,
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
   "seed": 140752807,
   "version": 1,
   "versionNonce": 511736563,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vV08oz4X"
    },
    {
     "type": "arrow",
     "id": "hgXvWKty"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vV08oz4X",
   "type": "text",
   "x": 12,
   "y": 1495.0,
   "width": 117.0,
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
   "seed": 2001346227,
   "version": 1,
   "versionNonce": 762498565,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "rooms\n id PK\n name\n capacity INT",
   "originalText": "rooms\n id PK\n name\n capacity INT",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "IAr34E98",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "C7v0QhZv",
   "type": "rectangle",
   "x": 360,
   "y": 1480,
   "width": 346.0,
   "height": 190.0,
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
   "seed": 879562400,
   "version": 1,
   "versionNonce": 83605629,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PtRRIPZF"
    },
    {
     "type": "arrow",
     "id": "hgXvWKty"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "PtRRIPZF",
   "type": "text",
   "x": 372,
   "y": 1495.0,
   "width": 306.0,
   "height": 160.0,
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
   "seed": 574990474,
   "version": 1,
   "versionNonce": 1605421706,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "bookings\n id PK, room_id FK, user_id\n during TSTZRANGE '[)'\n status, idempotency_key\n EXCLUDE USING gist\n  (room_id WITH =, during WITH &&)\n  WHERE status = 'BOOKED'\n UNIQUE (user_id, idempotency_key)",
   "originalText": "bookings\n id PK, room_id FK, user_id\n during TSTZRANGE '[)'\n status, idempotency_key\n EXCLUDE USING gist\n  (room_id WITH =, during WITH &&)\n  WHERE status = 'BOOKED'\n UNIQUE (user_id, idempotency_key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "C7v0QhZv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2Hzj2haI",
   "type": "arrow",
   "x": 377.0,
   "y": 126.33105802047781,
   "width": 99.0,
   "height": 4.505119453924905,
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
   "seed": 1871820640,
   "version": 1,
   "versionNonce": 978072342,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GLZjAuUn"
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
     99.0,
     -4.505119453924905
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KIFZ9SFa",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "xSWJyNc5",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "GLZjAuUn",
   "type": "text",
   "x": 391.0625,
   "y": 115.32849829351537,
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
   "seed": 182004243,
   "version": 1,
   "versionNonce": 1780330561,
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
   "containerId": "2Hzj2haI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9tHErTkx",
   "type": "arrow",
   "x": 776.0,
   "y": 110.7983193277311,
   "width": 120.0,
   "height": 3.3613445378151283,
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
   "seed": 431841436,
   "version": 1,
   "versionNonce": 799364643,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ccRwHRyk"
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
     120.0,
     -3.3613445378151283
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "xSWJyNc5",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "q0Mr2kAQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ccRwHRyk",
   "type": "text",
   "x": 816.3125,
   "y": 100.36764705882354,
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
   "seed": 1003698747,
   "version": 1,
   "versionNonce": 1502740858,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "for 1",
   "originalText": "for 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9tHErTkx",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GEkOG99q",
   "type": "arrow",
   "x": 628.95,
   "y": 174.0,
   "width": 7.599999999999909,
   "height": 152.0,
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
   "seed": 477993853,
   "version": 1,
   "versionNonce": 552482834,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NFrO6cxM"
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
     7.599999999999909,
     152.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "xSWJyNc5",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "QLS4nlI0",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "NFrO6cxM",
   "type": "text",
   "x": 597.3125,
   "y": 241.25,
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
   "seed": 1060380386,
   "version": 1,
   "versionNonce": 7429972,
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
   "containerId": "GEkOG99q",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ZXsmMM05",
   "type": "arrow",
   "x": 167.24375,
   "y": 214.0,
   "width": 27.30000000000001,
   "height": 112.0,
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
   "seed": 1538479394,
   "version": 1,
   "versionNonce": 730282935,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8FOaHY4Y"
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
     -27.30000000000001,
     112.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KIFZ9SFa",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8uBrqvZg",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "8FOaHY4Y",
   "type": "text",
   "x": 137.84375,
   "y": 261.25,
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
   "seed": 85307386,
   "version": 1,
   "versionNonce": 1352891996,
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
   "containerId": "ZXsmMM05",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OnzBCmmS",
   "type": "arrow",
   "x": 82.72258064516129,
   "y": 496.0,
   "width": 26.941935483870978,
   "height": 72.0,
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
   "seed": 707657835,
   "version": 1,
   "versionNonce": 372951693,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HVWCSk9X"
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
     26.941935483870978,
     -72.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "06CfPHwU",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8uBrqvZg",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "HVWCSk9X",
   "type": "text",
   "x": 56.81854838709677,
   "y": 451.25,
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
   "seed": 1037460822,
   "version": 1,
   "versionNonce": 1462222004,
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
   "containerId": "OnzBCmmS",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IFJ4RXUE",
   "type": "arrow",
   "x": 803.0,
   "y": 380.8396946564886,
   "width": 93.0,
   "height": 2.366412213740489,
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
   "seed": 432143117,
   "version": 1,
   "versionNonce": 157084012,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Q2SWisTF"
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
     93.0,
     -2.366412213740489
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "QLS4nlI0",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Emf9gG6s",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Q2SWisTF",
   "type": "text",
   "x": 814.0625,
   "y": 370.9064885496183,
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
   "seed": 1048743602,
   "version": 1,
   "versionNonce": 1707596258,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "organizer",
   "originalText": "organizer",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "IFJ4RXUE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RIqScrSI",
   "type": "arrow",
   "x": 170.0,
   "y": 737.9845626072041,
   "width": 86.0,
   "height": 2.9502572898799144,
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
   "seed": 693409567,
   "version": 1,
   "versionNonce": 879803005,
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
     86.0,
     2.9502572898799144
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gLhmg0yN",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "MuKFNXg3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "RXV02LqK",
   "type": "arrow",
   "x": 493.0,
   "y": 738.489010989011,
   "width": 63.0,
   "height": 3.461538461538453,
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
   "seed": 1357923380,
   "version": 1,
   "versionNonce": 1782627393,
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
     63.0,
     -3.461538461538453
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "MuKFNXg3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "46Qi2ZvO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "BWtX5ylL",
   "type": "arrow",
   "x": 739.0,
   "y": 734.765625,
   "width": 87.0,
   "height": 4.53125,
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
   "seed": 2053796204,
   "version": 1,
   "versionNonce": 966740122,
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
     87.0,
     4.53125
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "46Qi2ZvO",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lJebrTPQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "XAio3ZNQ",
   "type": "arrow",
   "x": 1045.0,
   "y": 741.6151468315302,
   "width": 91.0,
   "height": 2.8129829984544585,
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
   "seed": 14232050,
   "version": 1,
   "versionNonce": 1676385637,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ugpZ9FZ6"
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
     91.0,
     -2.8129829984544585
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "lJebrTPQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "dXqUCSYb",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ugpZ9FZ6",
   "type": "text",
   "x": 1074.75,
   "y": 731.4586553323029,
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
   "seed": 758406418,
   "version": 1,
   "versionNonce": 2129236909,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "free",
   "originalText": "free",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XAio3ZNQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IQZfDwLp",
   "type": "arrow",
   "x": 941.3026315789474,
   "y": 794.0,
   "width": 12.07894736842104,
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
   "seed": 760489437,
   "version": 1,
   "versionNonce": 1861711755,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5m0NR6HR"
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
     12.07894736842104,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "lJebrTPQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "OSEdeAUP",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5m0NR6HR",
   "type": "text",
   "x": 927.6546052631579,
   "y": 836.25,
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
   "seed": 1819614723,
   "version": 1,
   "versionNonce": 1113178693,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "clash",
   "originalText": "clash",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "IQZfDwLp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "oDCx0bxq",
   "type": "arrow",
   "x": 144.0,
   "y": 1160.0,
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
   "seed": 202286826,
   "version": 1,
   "versionNonce": 1929094496,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tQdHbvr2"
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
    "elementId": "ybXnEYWr",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "XAooApIL",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "tQdHbvr2",
   "type": "text",
   "x": 171.25,
   "y": 1151.25,
   "width": 157.5,
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
   "seed": 676914769,
   "version": 1,
   "versionNonce": 86095461,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Cancel, before start",
   "originalText": "Cancel, before start",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "oDCx0bxq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "0i1TKGOb",
   "type": "arrow",
   "x": 126.53152161844821,
   "y": 1181.939788467703,
   "width": 263.9301246456835,
   "height": 102.43083750802725,
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
   "seed": 218262966,
   "version": 1,
   "versionNonce": 1115836138,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5BRwRbTe"
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
     263.9301246456835,
     102.43083750802725
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ybXnEYWr",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "k4fiwJIn",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5BRwRbTe",
   "type": "text",
   "x": 215.18408394128994,
   "y": 1224.4052072217166,
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
   "seed": 2016770005,
   "version": 1,
   "versionNonce": 1284263769,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "time passes",
   "originalText": "time passes",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "0i1TKGOb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hgXvWKty",
   "type": "arrow",
   "x": 161.0,
   "y": 1542.2607260726072,
   "width": 195.0,
   "height": 17.161716171617172,
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
   "seed": 1223453910,
   "version": 1,
   "versionNonce": 1848911241,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "50I6XnmA"
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
     195.0,
     17.161716171617172
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "IAr34E98",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "C7v0QhZv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "50I6XnmA",
   "type": "text",
   "x": 223.0625,
   "y": 1542.0915841584158,
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
   "seed": 1585942869,
   "version": 1,
   "versionNonce": 478057852,
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
   "containerId": "hgXvWKty",
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