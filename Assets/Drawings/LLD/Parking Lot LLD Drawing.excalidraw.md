---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^HvlhWKsM

2. Core flow: Park, and lost-ticket exit ^1DMwftA9

3. State machines: Spot and Ticket ^QdRt33j5

4. Storage ^4DDuyT5U

Key line: pick + claim inside ONE lock.
Draw this yourself first, then compare. ^aiYZaTPM

Vehicle
- Plate string
- Type VehicleType ^ocYHd2jJ

Ticket (one visit)
- ID, Plate, SpotID
- EntryAt time ^MrxYnDaA

Spot
- ID, Floor, Type
- Occupied bool ^70Oi2HPp

ParkingLot (facade)
- floors, active, byPlate, mu
+ Park(ctx, v) Ticket
+ Exit(ctx, ticketID) Receipt
+ ExitLostTicket(ctx, plate) Receipt
+ FreeCount(type) int ^VzZKuKq4

Receipt
- TicketID, Fee int64 paise
- EntryAt, ExitAt
- LostTicket bool ^AJX5PYgR

<<interface>>
AllocationStrategy
+ Pick(floors, type) Spot ^mQRfqUJs

<<interface>>
PricingStrategy
+ Fee(type, d) int64 ^ytEdvGxa

LowestFloorFirst ^hCOlSL1w

HourlyPricing
per started hour, paise ^d5fHREYu

Entry gate
Park(ctx, vehicle) ^zvr2tWir

lock l.mu
plate already parked? ^FbsqNKHm

AllocationStrategy
Pick(floors, type) ^KvtHVWS4

spot.Occupied = true
create Ticket, index
unlock, return ticket ^QKTnoTWw

ErrAlreadyParked ^Y3zXS8LA

ErrNoSpot (lot full) ^Dm6rJ4Xg

Attendant
checks RC, no ticket ^t5MfD8oO

ExitLostTicket(plate)
lock, byPlate lookup ^L57OA0Sg

fee = Pricing.Fee
+ lostPenalty ^GPKfDGr4

free spot, close ticket
Receipt LostTicket=true ^N5balenT

ErrNotParked ^8RXMxUUz

Free ^jgZuizyN

Occupied ^wTmfjCDB

Ticket Open ^FPT1epPH

Closed ^BleLYfP9

Closed (lost) ^hPmZSnI2

spots
id PK
lot_id, floor, type
occupied bool
idx free (lot_id, type, floor)
  WHERE occupied = false ^VSAygZgF

tickets
id PK, plate, spot_id FK
entry_at, exit_at, fee_paise
lost_ticket bool
idempotency_key UNIQUE
UNIQUE open per spot (exit_at NULL)
UNIQUE open per plate (exit_at NULL) ^n3EErCi5

owns 1 to many ^Z6JTgZU8

tracks 0..many open ^MhS6zPQK

for 1 vehicle ^sXBVCd2A

holds 1 spot ^u4w4s6gx

creates on exit ^sOwOYn7y

uses ^ovJP9vb1

uses ^r9oEO8Yc

implements ^TQP9xcrC

implements ^GwGkxeat

new plate ^WLMyKkdk

spot found ^Oljonmph

plate exists ^p7GIirDY

none free ^Gur9X4Mv

open ticket found ^R8EjmNQG

plate not parked ^oJknxWEg

Park ^nuVYZqSg

Exit ^30EHtVJK

Exit(ticketID) ^0hUZbTpu

ExitLostTicket ^34EAPT2y

spot_id FK ^Jrh8jkMn

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "HvlhWKsM",
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
   "seed": 406209705,
   "version": 1,
   "versionNonce": 2143289968,
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
   "id": "1DMwftA9",
   "type": "text",
   "x": 0,
   "y": 860,
   "width": 630.0,
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
   "seed": 630827632,
   "version": 1,
   "versionNonce": 638091285,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: Park, and lost-ticket exit",
   "originalText": "2. Core flow: Park, and lost-ticket exit",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QdRt33j5",
   "type": "text",
   "x": 0,
   "y": 1560,
   "width": 535.5,
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
   "seed": 1391823943,
   "version": 1,
   "versionNonce": 978299943,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machines: Spot and Ticket",
   "originalText": "3. State machines: Spot and Ticket",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4DDuyT5U",
   "type": "text",
   "x": 0,
   "y": 1880,
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
   "seed": 1049439454,
   "version": 1,
   "versionNonce": 466321264,
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
   "id": "aiYZaTPM",
   "type": "text",
   "x": 1100,
   "y": 500,
   "width": 351.0,
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
   "seed": 1873218503,
   "version": 1,
   "versionNonce": 1648076545,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Key line: pick + claim inside ONE lock.\nDraw this yourself first, then compare.",
   "originalText": "Key line: pick + claim inside ONE lock.\nDraw this yourself first, then compare.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "woEb5Kfe",
   "type": "rectangle",
   "x": 0,
   "y": 60,
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
   "seed": 250523313,
   "version": 1,
   "versionNonce": 1197441920,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ocYHd2jJ"
    },
    {
     "type": "arrow",
     "id": "8hCkn9Xw"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ocYHd2jJ",
   "type": "text",
   "x": 12,
   "y": 75.0,
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
   "seed": 254641963,
   "version": 1,
   "versionNonce": 227975507,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Vehicle\n- Plate string\n- Type VehicleType",
   "originalText": "Vehicle\n- Plate string\n- Type VehicleType",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "woEb5Kfe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gW1THdWF",
   "type": "rectangle",
   "x": 320,
   "y": 60,
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
   "seed": 727977287,
   "version": 1,
   "versionNonce": 890105845,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "MrxYnDaA"
    },
    {
     "type": "arrow",
     "id": "4ezXMfNt"
    },
    {
     "type": "arrow",
     "id": "8hCkn9Xw"
    },
    {
     "type": "arrow",
     "id": "r0JLaO24"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "MrxYnDaA",
   "type": "text",
   "x": 332,
   "y": 75.0,
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
   "seed": 1609910938,
   "version": 1,
   "versionNonce": 1110038704,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Ticket (one visit)\n- ID, Plate, SpotID\n- EntryAt time",
   "originalText": "Ticket (one visit)\n- ID, Plate, SpotID\n- EntryAt time",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "gW1THdWF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ayYqzEpk",
   "type": "rectangle",
   "x": 680,
   "y": 60,
   "width": 193.0,
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
   "seed": 1754012074,
   "version": 1,
   "versionNonce": 1743047428,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "70Oi2HPp"
    },
    {
     "type": "arrow",
     "id": "9sGjZd73"
    },
    {
     "type": "arrow",
     "id": "r0JLaO24"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "70Oi2HPp",
   "type": "text",
   "x": 692,
   "y": 75.0,
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
   "seed": 1081114989,
   "version": 1,
   "versionNonce": 1018356048,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Spot\n- ID, Floor, Type\n- Occupied bool",
   "originalText": "Spot\n- ID, Floor, Type\n- Occupied bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ayYqzEpk",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eNur9ko8",
   "type": "rectangle",
   "x": 320,
   "y": 260,
   "width": 364.0,
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
   "seed": 1140875299,
   "version": 1,
   "versionNonce": 714994568,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VzZKuKq4"
    },
    {
     "type": "arrow",
     "id": "9sGjZd73"
    },
    {
     "type": "arrow",
     "id": "4ezXMfNt"
    },
    {
     "type": "arrow",
     "id": "cOHRwb0W"
    },
    {
     "type": "arrow",
     "id": "9tfps28Z"
    },
    {
     "type": "arrow",
     "id": "CeaQh70f"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VzZKuKq4",
   "type": "text",
   "x": 332,
   "y": 275.0,
   "width": 324.0,
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
   "seed": 665339397,
   "version": 1,
   "versionNonce": 24861883,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ParkingLot (facade)\n- floors, active, byPlate, mu\n+ Park(ctx, v) Ticket\n+ Exit(ctx, ticketID) Receipt\n+ ExitLostTicket(ctx, plate) Receipt\n+ FreeCount(type) int",
   "originalText": "ParkingLot (facade)\n- floors, active, byPlate, mu\n+ Park(ctx, v) Ticket\n+ Exit(ctx, ticketID) Receipt\n+ ExitLostTicket(ctx, plate) Receipt\n+ FreeCount(type) int",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "eNur9ko8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Uo1MMmQN",
   "type": "rectangle",
   "x": 800,
   "y": 260,
   "width": 283.0,
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
   "seed": 1051557402,
   "version": 1,
   "versionNonce": 636879072,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AJX5PYgR"
    },
    {
     "type": "arrow",
     "id": "cOHRwb0W"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "AJX5PYgR",
   "type": "text",
   "x": 812,
   "y": 275.0,
   "width": 243.0,
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
   "seed": 73807587,
   "version": 1,
   "versionNonce": 1876234252,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Receipt\n- TicketID, Fee int64 paise\n- EntryAt, ExitAt\n- LostTicket bool",
   "originalText": "Receipt\n- TicketID, Fee int64 paise\n- EntryAt, ExitAt\n- LostTicket bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Uo1MMmQN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Ovc7OS3j",
   "type": "rectangle",
   "x": 120,
   "y": 500,
   "width": 265.0,
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
   "seed": 277507454,
   "version": 1,
   "versionNonce": 1049092981,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "mQRfqUJs"
    },
    {
     "type": "arrow",
     "id": "9tfps28Z"
    },
    {
     "type": "arrow",
     "id": "H4NUq1Fl"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "mQRfqUJs",
   "type": "text",
   "x": 132,
   "y": 515.0,
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
   "seed": 1653710481,
   "version": 1,
   "versionNonce": 1470460675,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nAllocationStrategy\n+ Pick(floors, type) Spot",
   "originalText": "<<interface>>\nAllocationStrategy\n+ Pick(floors, type) Spot",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Ovc7OS3j",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "L4CzNlgs",
   "type": "rectangle",
   "x": 560,
   "y": 500,
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
   "seed": 1878135739,
   "version": 1,
   "versionNonce": 1862890140,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ytEdvGxa"
    },
    {
     "type": "arrow",
     "id": "CeaQh70f"
    },
    {
     "type": "arrow",
     "id": "Kt21gQ7a"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ytEdvGxa",
   "type": "text",
   "x": 572,
   "y": 515.0,
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
   "seed": 575685311,
   "version": 1,
   "versionNonce": 1952488943,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nPricingStrategy\n+ Fee(type, d) int64",
   "originalText": "<<interface>>\nPricingStrategy\n+ Fee(type, d) int64",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "L4CzNlgs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WbzfjekC",
   "type": "rectangle",
   "x": 120,
   "y": 700,
   "width": 184.0,
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
   "seed": 1878714618,
   "version": 1,
   "versionNonce": 1206949661,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hCOlSL1w"
    },
    {
     "type": "arrow",
     "id": "H4NUq1Fl"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hCOlSL1w",
   "type": "text",
   "x": 140.0,
   "y": 720.0,
   "width": 144.0,
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
   "seed": 1405474215,
   "version": 1,
   "versionNonce": 2043189164,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LowestFloorFirst",
   "originalText": "LowestFloorFirst",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "WbzfjekC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "0tc1k2ix",
   "type": "rectangle",
   "x": 560,
   "y": 700,
   "width": 247.0,
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
   "seed": 978174606,
   "version": 1,
   "versionNonce": 1686486511,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "d5fHREYu"
    },
    {
     "type": "arrow",
     "id": "Kt21gQ7a"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "d5fHREYu",
   "type": "text",
   "x": 572,
   "y": 715.0,
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
   "seed": 622084626,
   "version": 1,
   "versionNonce": 1769982058,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "HourlyPricing\nper started hour, paise",
   "originalText": "HourlyPricing\nper started hour, paise",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "0tc1k2ix",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "n8ZcdpVu",
   "type": "rectangle",
   "x": 0,
   "y": 920,
   "width": 202.0,
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
   "seed": 2076770294,
   "version": 1,
   "versionNonce": 1477618559,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zvr2tWir"
    },
    {
     "type": "arrow",
     "id": "VE1tP4XZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "zvr2tWir",
   "type": "text",
   "x": 12,
   "y": 935.0,
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
   "seed": 916845388,
   "version": 1,
   "versionNonce": 156872231,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Entry gate\nPark(ctx, vehicle)",
   "originalText": "Entry gate\nPark(ctx, vehicle)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "n8ZcdpVu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7OhHPYPL",
   "type": "rectangle",
   "x": 300,
   "y": 920,
   "width": 229.0,
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
   "seed": 138929235,
   "version": 1,
   "versionNonce": 1225628479,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FbsqNKHm"
    },
    {
     "type": "arrow",
     "id": "VE1tP4XZ"
    },
    {
     "type": "arrow",
     "id": "VNHWzx4D"
    },
    {
     "type": "arrow",
     "id": "tCgQptqr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "FbsqNKHm",
   "type": "text",
   "x": 312,
   "y": 935.0,
   "width": 189.0,
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
   "seed": 983408317,
   "version": 1,
   "versionNonce": 1451730782,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock l.mu\nplate already parked?",
   "originalText": "lock l.mu\nplate already parked?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "7OhHPYPL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eXZBky05",
   "type": "rectangle",
   "x": 600,
   "y": 920,
   "width": 202.0,
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
   "seed": 2145860518,
   "version": 1,
   "versionNonce": 1929121940,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KvtHVWS4"
    },
    {
     "type": "arrow",
     "id": "VNHWzx4D"
    },
    {
     "type": "arrow",
     "id": "X2QYELw6"
    },
    {
     "type": "arrow",
     "id": "WmqYvR9R"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KvtHVWS4",
   "type": "text",
   "x": 612,
   "y": 935.0,
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
   "seed": 1103253196,
   "version": 1,
   "versionNonce": 852323647,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "AllocationStrategy\nPick(floors, type)",
   "originalText": "AllocationStrategy\nPick(floors, type)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "eXZBky05",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lzoM3DsU",
   "type": "rectangle",
   "x": 900,
   "y": 920,
   "width": 229.0,
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
   "seed": 1052014556,
   "version": 1,
   "versionNonce": 803558365,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "QKTnoTWw"
    },
    {
     "type": "arrow",
     "id": "X2QYELw6"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "QKTnoTWw",
   "type": "text",
   "x": 912,
   "y": 935.0,
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
   "seed": 190424492,
   "version": 1,
   "versionNonce": 197572783,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "spot.Occupied = true\ncreate Ticket, index\nunlock, return ticket",
   "originalText": "spot.Occupied = true\ncreate Ticket, index\nunlock, return ticket",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lzoM3DsU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8mM71ThZ",
   "type": "rectangle",
   "x": 300,
   "y": 1110,
   "width": 184.0,
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
   "roundness": {
    "type": 3
   },
   "seed": 968933270,
   "version": 1,
   "versionNonce": 238509686,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Y3zXS8LA"
    },
    {
     "type": "arrow",
     "id": "tCgQptqr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Y3zXS8LA",
   "type": "text",
   "x": 320.0,
   "y": 1130.0,
   "width": 144.0,
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
   "seed": 484126889,
   "version": 1,
   "versionNonce": 1468149578,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrAlreadyParked",
   "originalText": "ErrAlreadyParked",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "8mM71ThZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eks2x241",
   "type": "rectangle",
   "x": 600,
   "y": 1110,
   "width": 220.0,
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
   "roundness": {
    "type": 3
   },
   "seed": 1193536638,
   "version": 1,
   "versionNonce": 824156445,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Dm6rJ4Xg"
    },
    {
     "type": "arrow",
     "id": "WmqYvR9R"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Dm6rJ4Xg",
   "type": "text",
   "x": 620.0,
   "y": 1130.0,
   "width": 180.0,
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
   "seed": 1055279860,
   "version": 1,
   "versionNonce": 360009615,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrNoSpot (lot full)",
   "originalText": "ErrNoSpot (lot full)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "eks2x241",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mzVk4Rt4",
   "type": "rectangle",
   "x": 0,
   "y": 1270,
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
   "seed": 1321975421,
   "version": 1,
   "versionNonce": 1041707648,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "t5MfD8oO"
    },
    {
     "type": "arrow",
     "id": "lXu5xyev"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "t5MfD8oO",
   "type": "text",
   "x": 12,
   "y": 1285.0,
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
   "seed": 1615005332,
   "version": 1,
   "versionNonce": 1687671847,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Attendant\nchecks RC, no ticket",
   "originalText": "Attendant\nchecks RC, no ticket",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "mzVk4Rt4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uiHr1lEE",
   "type": "rectangle",
   "x": 300,
   "y": 1270,
   "width": 229.0,
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
   "seed": 1625128275,
   "version": 1,
   "versionNonce": 1639927345,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "L57OA0Sg"
    },
    {
     "type": "arrow",
     "id": "lXu5xyev"
    },
    {
     "type": "arrow",
     "id": "H8QHUoYs"
    },
    {
     "type": "arrow",
     "id": "ZwDiT6W1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "L57OA0Sg",
   "type": "text",
   "x": 312,
   "y": 1285.0,
   "width": 189.0,
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
   "seed": 2136245417,
   "version": 1,
   "versionNonce": 1506847121,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ExitLostTicket(plate)\nlock, byPlate lookup",
   "originalText": "ExitLostTicket(plate)\nlock, byPlate lookup",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "uiHr1lEE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nqr8vodT",
   "type": "rectangle",
   "x": 600,
   "y": 1270,
   "width": 193.0,
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
   "seed": 1767029294,
   "version": 1,
   "versionNonce": 136280598,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GPKfDGr4"
    },
    {
     "type": "arrow",
     "id": "H8QHUoYs"
    },
    {
     "type": "arrow",
     "id": "YJO4AfY2"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "GPKfDGr4",
   "type": "text",
   "x": 612,
   "y": 1285.0,
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
   "seed": 2099938940,
   "version": 1,
   "versionNonce": 1555967782,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "fee = Pricing.Fee\n+ lostPenalty",
   "originalText": "fee = Pricing.Fee\n+ lostPenalty",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "nqr8vodT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Gzo6Rw0D",
   "type": "rectangle",
   "x": 900,
   "y": 1270,
   "width": 247.0,
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
   "seed": 1476423245,
   "version": 1,
   "versionNonce": 146053661,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "N5balenT"
    },
    {
     "type": "arrow",
     "id": "YJO4AfY2"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "N5balenT",
   "type": "text",
   "x": 912,
   "y": 1285.0,
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
   "seed": 883863285,
   "version": 1,
   "versionNonce": 594050293,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "free spot, close ticket\nReceipt LostTicket=true",
   "originalText": "free spot, close ticket\nReceipt LostTicket=true",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Gzo6Rw0D",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "N86eVFZt",
   "type": "rectangle",
   "x": 300,
   "y": 1430,
   "width": 148.0,
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
   "roundness": {
    "type": 3
   },
   "seed": 285426629,
   "version": 1,
   "versionNonce": 164080693,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8RXMxUUz"
    },
    {
     "type": "arrow",
     "id": "ZwDiT6W1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "8RXMxUUz",
   "type": "text",
   "x": 320.0,
   "y": 1450.0,
   "width": 108.0,
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
   "seed": 1534436489,
   "version": 1,
   "versionNonce": 2004822082,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrNotParked",
   "originalText": "ErrNotParked",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "N86eVFZt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ABamoXmB",
   "type": "ellipse",
   "x": 0,
   "y": 1640,
   "width": 126,
   "height": 70,
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
   "seed": 2132162756,
   "version": 1,
   "versionNonce": 826699678,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jgZuizyN"
    },
    {
     "type": "arrow",
     "id": "U8Kj4hu1"
    },
    {
     "type": "arrow",
     "id": "pBJM5U47"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jgZuizyN",
   "type": "text",
   "x": 45.0,
   "y": 1665.0,
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
   "seed": 716131709,
   "version": 1,
   "versionNonce": 1030572481,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Free",
   "originalText": "Free",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ABamoXmB",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1T0wrHyp",
   "type": "ellipse",
   "x": 360,
   "y": 1640,
   "width": 162,
   "height": 70,
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
   "seed": 1726919226,
   "version": 1,
   "versionNonce": 2005695057,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "wTmfjCDB"
    },
    {
     "type": "arrow",
     "id": "U8Kj4hu1"
    },
    {
     "type": "arrow",
     "id": "pBJM5U47"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "wTmfjCDB",
   "type": "text",
   "x": 405.0,
   "y": 1665.0,
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
   "seed": 2070553367,
   "version": 1,
   "versionNonce": 50308296,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Occupied",
   "originalText": "Occupied",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "1T0wrHyp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iBUecGl9",
   "type": "ellipse",
   "x": 720,
   "y": 1640,
   "width": 189,
   "height": 70,
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
   "seed": 1832811095,
   "version": 1,
   "versionNonce": 226329137,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FPT1epPH"
    },
    {
     "type": "arrow",
     "id": "8fKy4XFM"
    },
    {
     "type": "arrow",
     "id": "rsUibhWz"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "FPT1epPH",
   "type": "text",
   "x": 765.0,
   "y": 1665.0,
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
   "seed": 1151164284,
   "version": 1,
   "versionNonce": 1347933257,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Ticket Open",
   "originalText": "Ticket Open",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "iBUecGl9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3f9zPoLJ",
   "type": "ellipse",
   "x": 1080,
   "y": 1600,
   "width": 144,
   "height": 70,
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
   "seed": 248878866,
   "version": 1,
   "versionNonce": 1106639980,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BleLYfP9"
    },
    {
     "type": "arrow",
     "id": "8fKy4XFM"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "BleLYfP9",
   "type": "text",
   "x": 1125.0,
   "y": 1625.0,
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
   "seed": 1138535276,
   "version": 1,
   "versionNonce": 6898181,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Closed",
   "originalText": "Closed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "3f9zPoLJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "p9drqGhe",
   "type": "ellipse",
   "x": 1080,
   "y": 1740,
   "width": 207,
   "height": 70,
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
   "seed": 1161194296,
   "version": 1,
   "versionNonce": 1192917621,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hPmZSnI2"
    },
    {
     "type": "arrow",
     "id": "rsUibhWz"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hPmZSnI2",
   "type": "text",
   "x": 1125.0,
   "y": 1765.0,
   "width": 117.0,
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
   "seed": 1007498519,
   "version": 1,
   "versionNonce": 902274927,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Closed (lost)",
   "originalText": "Closed (lost)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "p9drqGhe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zsAwUf8l",
   "type": "rectangle",
   "x": 0,
   "y": 1940,
   "width": 310.0,
   "height": 150.0,
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
   "seed": 96480221,
   "version": 1,
   "versionNonce": 1655733835,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VSAygZgF"
    },
    {
     "type": "arrow",
     "id": "5KpHrkhQ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VSAygZgF",
   "type": "text",
   "x": 12,
   "y": 1955.0,
   "width": 270.0,
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
   "seed": 209200528,
   "version": 1,
   "versionNonce": 46710080,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "spots\nid PK\nlot_id, floor, type\noccupied bool\nidx free (lot_id, type, floor)\n  WHERE occupied = false",
   "originalText": "spots\nid PK\nlot_id, floor, type\noccupied bool\nidx free (lot_id, type, floor)\n  WHERE occupied = false",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zsAwUf8l",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6zIKjYHo",
   "type": "rectangle",
   "x": 480,
   "y": 1940,
   "width": 364.0,
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
   "seed": 757612397,
   "version": 1,
   "versionNonce": 1712052487,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "n3EErCi5"
    },
    {
     "type": "arrow",
     "id": "5KpHrkhQ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "n3EErCi5",
   "type": "text",
   "x": 492,
   "y": 1955.0,
   "width": 324.0,
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
   "seed": 1835285428,
   "version": 1,
   "versionNonce": 229293013,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "tickets\nid PK, plate, spot_id FK\nentry_at, exit_at, fee_paise\nlost_ticket bool\nidempotency_key UNIQUE\nUNIQUE open per spot (exit_at NULL)\nUNIQUE open per plate (exit_at NULL)",
   "originalText": "tickets\nid PK, plate, spot_id FK\nentry_at, exit_at, fee_paise\nlost_ticket bool\nidempotency_key UNIQUE\nUNIQUE open per spot (exit_at NULL)\nUNIQUE open per plate (exit_at NULL)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "6zIKjYHo",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9sGjZd73",
   "type": "arrow",
   "x": 596.2847826086957,
   "y": 256.0,
   "width": 121.7347826086957,
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
   "seed": 446535252,
   "version": 1,
   "versionNonce": 1225167857,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Z6JTgZU8"
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
     121.7347826086957,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eNur9ko8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ayYqzEpk",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "Z6JTgZU8",
   "type": "text",
   "x": 602.0271739130435,
   "y": 196.25,
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
   "seed": 162304510,
   "version": 1,
   "versionNonce": 1195124220,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "owns 1 to many",
   "originalText": "owns 1 to many",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9sGjZd73",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4ezXMfNt",
   "type": "arrow",
   "x": 475.72391304347826,
   "y": 256.0,
   "width": 33.926086956521715,
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
   "seed": 352966064,
   "version": 1,
   "versionNonce": 1842279295,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "MhS6zPQK"
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
     -33.926086956521715,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eNur9ko8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "gW1THdWF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "MhS6zPQK",
   "type": "text",
   "x": 383.9483695652174,
   "y": 196.25,
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
   "seed": 801343712,
   "version": 1,
   "versionNonce": 629000777,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "tracks 0..many open",
   "originalText": "tracks 0..many open",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "4ezXMfNt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8hCkn9Xw",
   "type": "arrow",
   "x": 316.0,
   "y": 105.0,
   "width": 110.0,
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
   "seed": 1639254363,
   "version": 1,
   "versionNonce": 926054645,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sXBVCd2A"
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
     -110.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gW1THdWF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "woEb5Kfe",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "sXBVCd2A",
   "type": "text",
   "x": 209.8125,
   "y": 96.25,
   "width": 102.375,
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
   "seed": 472866421,
   "version": 1,
   "versionNonce": 1690499714,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "for 1 vehicle",
   "originalText": "for 1 vehicle",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "8hCkn9Xw",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "r0JLaO24",
   "type": "arrow",
   "x": 535.0,
   "y": 105.0,
   "width": 141.0,
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
   "seed": 1020275947,
   "version": 1,
   "versionNonce": 1964873995,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "u4w4s6gx"
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
     141.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gW1THdWF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ayYqzEpk",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "u4w4s6gx",
   "type": "text",
   "x": 558.25,
   "y": 96.25,
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
   "seed": 1841411303,
   "version": 1,
   "versionNonce": 582366405,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "holds 1 spot",
   "originalText": "holds 1 spot",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "r0JLaO24",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cOHRwb0W",
   "type": "arrow",
   "x": 688.0,
   "y": 326.5358361774744,
   "width": 108.0,
   "height": 4.914675767918084,
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
   "seed": 620346760,
   "version": 1,
   "versionNonce": 1473270067,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sOwOYn7y"
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
     108.0,
     -4.914675767918084
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eNur9ko8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Uo1MMmQN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "sOwOYn7y",
   "type": "text",
   "x": 682.9375,
   "y": 315.32849829351534,
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
   "seed": 1867091500,
   "version": 1,
   "versionNonce": 1389673661,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "creates on exit",
   "originalText": "creates on exit",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "cOHRwb0W",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9tfps28Z",
   "type": "arrow",
   "x": 408.1404761904762,
   "y": 414.0,
   "width": 97.4238095238095,
   "height": 82.0,
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
   "seed": 1606503812,
   "version": 1,
   "versionNonce": 1005459044,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ovJP9vb1"
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
     -97.4238095238095,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eNur9ko8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Ovc7OS3j",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ovJP9vb1",
   "type": "text",
   "x": 343.67857142857144,
   "y": 446.25,
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
   "seed": 239766034,
   "version": 1,
   "versionNonce": 89200215,
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
   "containerId": "9tfps28Z",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "CeaQh70f",
   "type": "arrow",
   "x": 565.2,
   "y": 414.0,
   "width": 65.59999999999991,
   "height": 82.0,
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
   "seed": 2115992565,
   "version": 1,
   "versionNonce": 685575752,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "r9oEO8Yc"
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
     65.59999999999991,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eNur9ko8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "L4CzNlgs",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "r9oEO8Yc",
   "type": "text",
   "x": 582.25,
   "y": 446.25,
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
   "seed": 1660469781,
   "version": 1,
   "versionNonce": 719867419,
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
   "containerId": "CeaQh70f",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "H4NUq1Fl",
   "type": "arrow",
   "x": 219.44324324324324,
   "y": 696.0,
   "width": 22.329729729729735,
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
   "seed": 1600256176,
   "version": 1,
   "versionNonce": 2005989432,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "TQP9xcrC"
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
     22.329729729729735,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WbzfjekC",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Ovc7OS3j",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "TQP9xcrC",
   "type": "text",
   "x": 191.23310810810813,
   "y": 636.25,
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
   "seed": 805330487,
   "version": 1,
   "versionNonce": 2033231858,
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
   "containerId": "H4NUq1Fl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kt21gQ7a",
   "type": "arrow",
   "x": 680.728947368421,
   "y": 696.0,
   "width": 7.247368421052556,
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
   "seed": 860461713,
   "version": 1,
   "versionNonce": 1466392822,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GwGkxeat"
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
     -7.247368421052556,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "0tc1k2ix",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "L4CzNlgs",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "GwGkxeat",
   "type": "text",
   "x": 637.7302631578948,
   "y": 636.25,
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
   "seed": 552332417,
   "version": 1,
   "versionNonce": 1566198667,
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
   "containerId": "Kt21gQ7a",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "VE1tP4XZ",
   "type": "arrow",
   "x": 206.0,
   "y": 955.0,
   "width": 90.0,
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
   "seed": 134235049,
   "version": 1,
   "versionNonce": 728840041,
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
     90.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "n8ZcdpVu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7OhHPYPL",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "VNHWzx4D",
   "type": "arrow",
   "x": 533.0,
   "y": 955.0,
   "width": 63.0,
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
   "seed": 340275716,
   "version": 1,
   "versionNonce": 1459469917,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WLMyKkdk"
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
     63.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "7OhHPYPL",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "eXZBky05",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "WLMyKkdk",
   "type": "text",
   "x": 529.0625,
   "y": 946.25,
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
   "seed": 1769985551,
   "version": 1,
   "versionNonce": 1948797019,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "new plate",
   "originalText": "new plate",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "VNHWzx4D",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "X2QYELw6",
   "type": "arrow",
   "x": 806.0,
   "y": 958.3492822966507,
   "width": 90.0,
   "height": 2.8708133971291545,
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
   "seed": 1551653467,
   "version": 1,
   "versionNonce": 1143441739,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Oljonmph"
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
     90.0,
     2.8708133971291545
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eXZBky05",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lzoM3DsU",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Oljonmph",
   "type": "text",
   "x": 811.625,
   "y": 951.0346889952152,
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
   "seed": 1524223814,
   "version": 1,
   "versionNonce": 800677168,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "spot found",
   "originalText": "spot found",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "X2QYELw6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tCgQptqr",
   "type": "arrow",
   "x": 409.7567567567568,
   "y": 994.0,
   "width": 13.621621621621614,
   "height": 112.0,
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
   "seed": 1395007132,
   "version": 1,
   "versionNonce": 180776458,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "p7GIirDY"
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
     -13.621621621621614,
     112.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "7OhHPYPL",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8mM71ThZ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "p7GIirDY",
   "type": "text",
   "x": 355.69594594594594,
   "y": 1041.25,
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
   "seed": 114470715,
   "version": 1,
   "versionNonce": 249003088,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "plate exists",
   "originalText": "plate exists",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "tCgQptqr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WmqYvR9R",
   "type": "arrow",
   "x": 702.8972972972973,
   "y": 994.0,
   "width": 5.4486486486486,
   "height": 112.0,
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
   "seed": 1540951216,
   "version": 1,
   "versionNonce": 1938729407,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Gur9X4Mv"
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
     5.4486486486486,
     112.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eXZBky05",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "eks2x241",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Gur9X4Mv",
   "type": "text",
   "x": 670.1841216216217,
   "y": 1041.25,
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
   "seed": 422290109,
   "version": 1,
   "versionNonce": 1416709709,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "none free",
   "originalText": "none free",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "WmqYvR9R",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lXu5xyev",
   "type": "arrow",
   "x": 224.0,
   "y": 1305.0,
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
   "seed": 341722765,
   "version": 1,
   "versionNonce": 230860609,
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "mzVk4Rt4",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "uiHr1lEE",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "H8QHUoYs",
   "type": "arrow",
   "x": 533.0,
   "y": 1305.0,
   "width": 63.0,
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
   "seed": 486032777,
   "version": 1,
   "versionNonce": 1965986300,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "R8EjmNQG"
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
     63.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "uiHr1lEE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "nqr8vodT",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "R8EjmNQG",
   "type": "text",
   "x": 497.5625,
   "y": 1296.25,
   "width": 133.875,
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
   "seed": 490935954,
   "version": 1,
   "versionNonce": 774969217,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "open ticket found",
   "originalText": "open ticket found",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "H8QHUoYs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YJO4AfY2",
   "type": "arrow",
   "x": 797.0,
   "y": 1305.0,
   "width": 99.0,
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
   "seed": 378717057,
   "version": 1,
   "versionNonce": 599028699,
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
     99.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "nqr8vodT",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Gzo6Rw0D",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ZwDiT6W1",
   "type": "arrow",
   "x": 404.30967741935484,
   "y": 1344.0,
   "width": 21.425806451612914,
   "height": 82.0,
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
   "seed": 140138563,
   "version": 1,
   "versionNonce": 1923024086,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oJknxWEg"
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
     -21.425806451612914,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "uiHr1lEE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "N86eVFZt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "oJknxWEg",
   "type": "text",
   "x": 330.5967741935484,
   "y": 1376.25,
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
   "seed": 1117364884,
   "version": 1,
   "versionNonce": 1044164163,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "plate not parked",
   "originalText": "plate not parked",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ZwDiT6W1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "U8Kj4hu1",
   "type": "arrow",
   "x": 130.0,
   "y": 1690.0,
   "width": 226.0,
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
   "seed": 2064818251,
   "version": 1,
   "versionNonce": 2008575211,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nuVYZqSg"
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
     226.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ABamoXmB",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1T0wrHyp",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "nuVYZqSg",
   "type": "text",
   "x": 227.25,
   "y": 1681.25,
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
   "seed": 595596817,
   "version": 1,
   "versionNonce": 258384236,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Park",
   "originalText": "Park",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "U8Kj4hu1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pBJM5U47",
   "type": "arrow",
   "x": 356.0,
   "y": 1660.0,
   "width": 226.0,
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
   "seed": 719231952,
   "version": 1,
   "versionNonce": 917093140,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "30EHtVJK"
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
     -226.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "1T0wrHyp",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ABamoXmB",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "30EHtVJK",
   "type": "text",
   "x": 227.25,
   "y": 1651.25,
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
   "seed": 1328128511,
   "version": 1,
   "versionNonce": 816495530,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Exit",
   "originalText": "Exit",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "pBJM5U47",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8fKy4XFM",
   "type": "arrow",
   "x": 908.8631365502036,
   "y": 1663.8162208533092,
   "width": 169.08621537266038,
   "height": 20.03984774787091,
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
   "seed": 1762576855,
   "version": 1,
   "versionNonce": 1065138214,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0hUZbTpu"
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
     169.08621537266038,
     -20.03984774787091
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "iBUecGl9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "3f9zPoLJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0hUZbTpu",
   "type": "text",
   "x": 938.2812442365339,
   "y": 1645.046296979374,
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
   "seed": 1698716662,
   "version": 1,
   "versionNonce": 805757528,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Exit(ticketID)",
   "originalText": "Exit(ticketID)",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "8fKy4XFM",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rsUibhWz",
   "type": "arrow",
   "x": 895.7834818436344,
   "y": 1697.0280438600635,
   "width": 201.59243783130444,
   "height": 54.63209697325328,
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
   "seed": 865101468,
   "version": 1,
   "versionNonce": 1349322713,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "34EAPT2y"
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
     201.59243783130444,
     54.63209697325328
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "iBUecGl9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "p9drqGhe",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "34EAPT2y",
   "type": "text",
   "x": 941.4547007592867,
   "y": 1715.59409234669,
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
   "seed": 1892528999,
   "version": 1,
   "versionNonce": 1722373256,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ExitLostTicket",
   "originalText": "ExitLostTicket",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "rsUibhWz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5KpHrkhQ",
   "type": "arrow",
   "x": 476.0,
   "y": 2021.3313609467455,
   "width": 162.0,
   "height": 3.195266272189201,
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
   "seed": 1924966672,
   "version": 1,
   "versionNonce": 1506710237,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Jrh8jkMn"
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
     -162.0,
     -3.195266272189201
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "6zIKjYHo",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "zsAwUf8l",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Jrh8jkMn",
   "type": "text",
   "x": 355.625,
   "y": 2010.9837278106509,
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
   "seed": 1317322666,
   "version": 1,
   "versionNonce": 2115504544,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "spot_id FK",
   "originalText": "spot_id FK",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "5KpHrkhQ",
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