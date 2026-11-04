---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^fbkgCl6e

2. Core flow: SelectProduct in has-money state ^idsxOhqp

3. State machine ^oCd3wXHB

4. Storage (fleet backend only) ^h5qsKPWg

HasMoney stays HasMoney on:
sold out, insufficient, no exact change,
more coins inserted. ^SKYBwpGd

Escrow is refunded on cancel/jam;
only a successful dispense commits it to coinBox. ^fDk5qhEa

Slot
- Code, Product
- Price int64 paise
- Qty int ^THIADx8Z

Machine (context)
- state State, balance int64
- inserted escrow, coinBox
+ InsertMoney / SelectProduct
+ Cancel / Buy
+ Restock / Repair ^uwXEIO4U

<<interface>>
Dispenser
+ Dispense(ctx, code) error ^g0XqvA05

DispenserFunc
motor driver / test fake ^IuLX9mzZ

<<interface>>
State
+ Insert(m, coin)
+ Select(ctx, m, code)
+ Cancel(m) ^Wpx7DEiO

Purchase
- Product, Change
- Coins map
- Refunded ^Cv6DhI2p

idleState ^LykN169d

hasMoneyState ^c4KZgx9k

dispensingState ^BafpSI70

outOfStockState ^FQ5bdnJS

outOfServiceState ^Dg9JGy3D

Customer
inserts coins, picks A1 ^IohsX9Id

SelectProduct
lock, delegate to state ^nMk54Jtn

hasMoneyState.Select
slot? stock? balance? ^jZCNDejN

makeChange
from coinBox + escrow ^dOVaTd2x

Dispenser.Dispense
state = dispensing ^2l5aP0Nd

commit coins, Qty--
return Purchase + change
state idle or out_of_stock ^kwyZwrMO

ErrInvalidSlot
ErrSoldOut
ErrInsufficientFunds
balance kept ^5NpN2iYp

ErrExactChange
balance kept, can cancel ^gwBR8dvE

jam: refund all, Qty kept
ErrDispenseFailed
state out_of_service ^gfKWRTec

OutOfStock ^pCl4LKTy

Idle ^uTu51MTg

OutOfService ^ooFR2i1d

HasMoney ^sNcFSM8W

Dispensing ^D2H6x3SR

slots
PK (machine_id, code)
product_id, price_paise
qty CHECK (qty >= 0)
UPDATE ... WHERE qty > 0 ^ILUYf8em

coin_box
PK (machine_id, denomination)
count CHECK (count >= 0) ^NN4VpKHO

sales
id PK, machine_id, slot_code
paid_paise, change_paise, status
idempotency_key UNIQUE ^UvQKkpjD

owns 1 to many ^1CGJe9A8

current state 1 ^ZAGqhnwV

uses ^uyRoHmQT

implements ^sZDmhQoU

returns ^10Z2EFPG

implements ^32EAdSMy

implements ^LKmhXnXl

all ok ^si958rxE

change possible ^2mtBUxBh

dispensed ^Omsj3uk6

fail ^X5Lm3isG

cannot make change ^05wmHEHX

motor error ^g52oFIWH

insert coin ^dEagYvnt

cancel, refund ^0KIodh0A

select ok + change ok ^hssoWxSd

dispensed, stock left ^mm7scsna

last item sold ^2q0KEIcE

jam, refund all ^QueUsjMj

restock ^SfaOuI6G

repair ^LCN8g1lI

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "fbkgCl6e",
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
   "seed": 1420335302,
   "version": 1,
   "versionNonce": 1733354722,
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
   "id": "idsxOhqp",
   "type": "text",
   "x": 0,
   "y": 720,
   "width": 724.5,
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
   "seed": 43348940,
   "version": 1,
   "versionNonce": 319943735,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: SelectProduct in has-money state",
   "originalText": "2. Core flow: SelectProduct in has-money state",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "oCd3wXHB",
   "type": "text",
   "x": 0,
   "y": 1190,
   "width": 252.0,
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
   "seed": 529330652,
   "version": 1,
   "versionNonce": 1326048877,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machine",
   "originalText": "3. State machine",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "h5qsKPWg",
   "type": "text",
   "x": 0,
   "y": 1730,
   "width": 488.25,
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
   "seed": 88460241,
   "version": 1,
   "versionNonce": 1871317989,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Storage (fleet backend only)",
   "originalText": "4. Storage (fleet backend only)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SKYBwpGd",
   "type": "text",
   "x": 1200,
   "y": 1330,
   "width": 360.0,
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
   "seed": 1164993764,
   "version": 1,
   "versionNonce": 205962574,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "HasMoney stays HasMoney on:\nsold out, insufficient, no exact change,\nmore coins inserted.",
   "originalText": "HasMoney stays HasMoney on:\nsold out, insufficient, no exact change,\nmore coins inserted.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fDk5qhEa",
   "type": "text",
   "x": 1200,
   "y": 300,
   "width": 441.0,
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
   "seed": 1141028937,
   "version": 1,
   "versionNonce": 1465902481,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Escrow is refunded on cancel/jam;\nonly a successful dispense commits it to coinBox.",
   "originalText": "Escrow is refunded on cancel/jam;\nonly a successful dispense commits it to coinBox.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OTthD3K9",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 211.0,
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
   "seed": 1567374401,
   "version": 1,
   "versionNonce": 1027405223,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "THIADx8Z"
    },
    {
     "type": "arrow",
     "id": "IszCw0GM"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "THIADx8Z",
   "type": "text",
   "x": 12,
   "y": 75.0,
   "width": 171.0,
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
   "seed": 141643242,
   "version": 1,
   "versionNonce": 64571555,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Slot\n- Code, Product\n- Price int64 paise\n- Qty int",
   "originalText": "Slot\n- Code, Product\n- Price int64 paise\n- Qty int",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "OTthD3K9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "J81uDMtK",
   "type": "rectangle",
   "x": 340,
   "y": 60,
   "width": 301.0,
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
   "seed": 1131647542,
   "version": 1,
   "versionNonce": 1951555133,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uwXEIO4U"
    },
    {
     "type": "arrow",
     "id": "IszCw0GM"
    },
    {
     "type": "arrow",
     "id": "LTEc8XO8"
    },
    {
     "type": "arrow",
     "id": "w86kKBj3"
    },
    {
     "type": "arrow",
     "id": "DrHEbqPm"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "uwXEIO4U",
   "type": "text",
   "x": 352,
   "y": 75.0,
   "width": 261.0,
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
   "seed": 1259905247,
   "version": 1,
   "versionNonce": 1999206103,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Machine (context)\n- state State, balance int64\n- inserted escrow, coinBox\n+ InsertMoney / SelectProduct\n+ Cancel / Buy\n+ Restock / Repair",
   "originalText": "Machine (context)\n- state State, balance int64\n- inserted escrow, coinBox\n+ InsertMoney / SelectProduct\n+ Cancel / Buy\n+ Restock / Repair",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "J81uDMtK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lEV26Slc",
   "type": "rectangle",
   "x": 900,
   "y": 60,
   "width": 283.0,
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
   "seed": 1746801498,
   "version": 1,
   "versionNonce": 1206525546,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "g0XqvA05"
    },
    {
     "type": "arrow",
     "id": "w86kKBj3"
    },
    {
     "type": "arrow",
     "id": "mdx9c6yu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "g0XqvA05",
   "type": "text",
   "x": 912,
   "y": 75.0,
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
   "seed": 310304052,
   "version": 1,
   "versionNonce": 1812926597,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nDispenser\n+ Dispense(ctx, code) error",
   "originalText": "<<interface>>\nDispenser\n+ Dispense(ctx, code) error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lEV26Slc",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Ycbg1O9a",
   "type": "rectangle",
   "x": 1300,
   "y": 60,
   "width": 256.0,
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
   "seed": 1987340753,
   "version": 1,
   "versionNonce": 2011344311,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IuLX9mzZ"
    },
    {
     "type": "arrow",
     "id": "mdx9c6yu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "IuLX9mzZ",
   "type": "text",
   "x": 1312,
   "y": 75.0,
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
   "seed": 1222934249,
   "version": 1,
   "versionNonce": 1590206715,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "DispenserFunc\nmotor driver / test fake",
   "originalText": "DispenserFunc\nmotor driver / test fake",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Ycbg1O9a",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "a8AI9JHd",
   "type": "rectangle",
   "x": 340,
   "y": 300,
   "width": 238.0,
   "height": 130.0,
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
   "seed": 1139076758,
   "version": 1,
   "versionNonce": 1429294167,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Wpx7DEiO"
    },
    {
     "type": "arrow",
     "id": "LTEc8XO8"
    },
    {
     "type": "arrow",
     "id": "L4OFxNb4"
    },
    {
     "type": "arrow",
     "id": "YtFjfdRI"
    },
    {
     "type": "arrow",
     "id": "Tc2nfxtu"
    },
    {
     "type": "arrow",
     "id": "Os0w3k5b"
    },
    {
     "type": "arrow",
     "id": "UdI92ubE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Wpx7DEiO",
   "type": "text",
   "x": 352,
   "y": 315.0,
   "width": 198.0,
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
   "seed": 425880174,
   "version": 1,
   "versionNonce": 418311793,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nState\n+ Insert(m, coin)\n+ Select(ctx, m, code)\n+ Cancel(m)",
   "originalText": "<<interface>>\nState\n+ Insert(m, coin)\n+ Select(ctx, m, code)\n+ Cancel(m)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "a8AI9JHd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eqClLnIs",
   "type": "rectangle",
   "x": 900,
   "y": 300,
   "width": 193.0,
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
   "seed": 101967801,
   "version": 1,
   "versionNonce": 1866988225,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Cv6DhI2p"
    },
    {
     "type": "arrow",
     "id": "DrHEbqPm"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Cv6DhI2p",
   "type": "text",
   "x": 912,
   "y": 315.0,
   "width": 153.0,
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
   "seed": 106818509,
   "version": 1,
   "versionNonce": 606270910,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Purchase\n- Product, Change\n- Coins map\n- Refunded",
   "originalText": "Purchase\n- Product, Change\n- Coins map\n- Refunded",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "eqClLnIs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "S20vJopZ",
   "type": "rectangle",
   "x": 0,
   "y": 520,
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
   "seed": 923164053,
   "version": 1,
   "versionNonce": 56667339,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LykN169d"
    },
    {
     "type": "arrow",
     "id": "L4OFxNb4"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "LykN169d",
   "type": "text",
   "x": 29.5,
   "y": 540.0,
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
   "seed": 1954684566,
   "version": 1,
   "versionNonce": 1562687122,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "idleState",
   "originalText": "idleState",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "S20vJopZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iTo2OUdl",
   "type": "rectangle",
   "x": 260,
   "y": 520,
   "width": 157.0,
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
   "seed": 1610922426,
   "version": 1,
   "versionNonce": 2061492690,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "c4KZgx9k"
    },
    {
     "type": "arrow",
     "id": "YtFjfdRI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "c4KZgx9k",
   "type": "text",
   "x": 280.0,
   "y": 540.0,
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
   "seed": 1234250403,
   "version": 1,
   "versionNonce": 1400372249,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "hasMoneyState",
   "originalText": "hasMoneyState",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "iTo2OUdl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "drLulU41",
   "type": "rectangle",
   "x": 520,
   "y": 520,
   "width": 175.0,
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
   "seed": 2009868702,
   "version": 1,
   "versionNonce": 2076635255,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BafpSI70"
    },
    {
     "type": "arrow",
     "id": "Tc2nfxtu"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "BafpSI70",
   "type": "text",
   "x": 540.0,
   "y": 540.0,
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
   "seed": 2061868075,
   "version": 1,
   "versionNonce": 1608505827,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "dispensingState",
   "originalText": "dispensingState",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "drLulU41",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "d7tbBGvs",
   "type": "rectangle",
   "x": 780,
   "y": 520,
   "width": 175.0,
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
   "seed": 1666598973,
   "version": 1,
   "versionNonce": 1204008654,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FQ5bdnJS"
    },
    {
     "type": "arrow",
     "id": "Os0w3k5b"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "FQ5bdnJS",
   "type": "text",
   "x": 800.0,
   "y": 540.0,
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
   "seed": 111106393,
   "version": 1,
   "versionNonce": 1503358974,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "outOfStockState",
   "originalText": "outOfStockState",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "d7tbBGvs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "glVAB7d3",
   "type": "rectangle",
   "x": 1040,
   "y": 520,
   "width": 193.0,
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
   "seed": 982796447,
   "version": 1,
   "versionNonce": 889967986,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Dg9JGy3D"
    },
    {
     "type": "arrow",
     "id": "UdI92ubE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Dg9JGy3D",
   "type": "text",
   "x": 1060.0,
   "y": 540.0,
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
   "seed": 1574101454,
   "version": 1,
   "versionNonce": 540918747,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "outOfServiceState",
   "originalText": "outOfServiceState",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "glVAB7d3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "g4ZKrTlK",
   "type": "rectangle",
   "x": 0,
   "y": 780,
   "width": 247.0,
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
   "seed": 686872532,
   "version": 1,
   "versionNonce": 169187838,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IohsX9Id"
    },
    {
     "type": "arrow",
     "id": "VoLqeDOm"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "IohsX9Id",
   "type": "text",
   "x": 12,
   "y": 795.0,
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
   "seed": 1816965303,
   "version": 1,
   "versionNonce": 65201377,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Customer\ninserts coins, picks A1",
   "originalText": "Customer\ninserts coins, picks A1",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "g4ZKrTlK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "M8VdQjAv",
   "type": "rectangle",
   "x": 320,
   "y": 780,
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
   "seed": 2096265697,
   "version": 1,
   "versionNonce": 510242803,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nMk54Jtn"
    },
    {
     "type": "arrow",
     "id": "VoLqeDOm"
    },
    {
     "type": "arrow",
     "id": "DWPQ2dhE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nMk54Jtn",
   "type": "text",
   "x": 332,
   "y": 795.0,
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
   "seed": 2090534687,
   "version": 1,
   "versionNonce": 90266557,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SelectProduct\nlock, delegate to state",
   "originalText": "SelectProduct\nlock, delegate to state",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "M8VdQjAv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kNskVlKi",
   "type": "rectangle",
   "x": 640,
   "y": 780,
   "width": 229.0,
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
   "seed": 2134717028,
   "version": 1,
   "versionNonce": 868832263,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jZCNDejN"
    },
    {
     "type": "arrow",
     "id": "DWPQ2dhE"
    },
    {
     "type": "arrow",
     "id": "wJ3fBpE9"
    },
    {
     "type": "arrow",
     "id": "AKxL5eqi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jZCNDejN",
   "type": "text",
   "x": 652,
   "y": 795.0,
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
   "seed": 1385537992,
   "version": 1,
   "versionNonce": 1548201767,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "hasMoneyState.Select\nslot? stock? balance?",
   "originalText": "hasMoneyState.Select\nslot? stock? balance?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "kNskVlKi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qFlxTcc6",
   "type": "rectangle",
   "x": 960,
   "y": 780,
   "width": 229.0,
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
   "seed": 1963950453,
   "version": 1,
   "versionNonce": 869538249,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dOVaTd2x"
    },
    {
     "type": "arrow",
     "id": "wJ3fBpE9"
    },
    {
     "type": "arrow",
     "id": "tKXEhwdJ"
    },
    {
     "type": "arrow",
     "id": "SNqLxcTy"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dOVaTd2x",
   "type": "text",
   "x": 972,
   "y": 795.0,
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
   "seed": 1344540364,
   "version": 1,
   "versionNonce": 549231033,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "makeChange\nfrom coinBox + escrow",
   "originalText": "makeChange\nfrom coinBox + escrow",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "qFlxTcc6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "f6MEU252",
   "type": "rectangle",
   "x": 1280,
   "y": 780,
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
   "seed": 646260814,
   "version": 1,
   "versionNonce": 1002312412,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2l5aP0Nd"
    },
    {
     "type": "arrow",
     "id": "tKXEhwdJ"
    },
    {
     "type": "arrow",
     "id": "Kf702QvD"
    },
    {
     "type": "arrow",
     "id": "AFor4TqD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "2l5aP0Nd",
   "type": "text",
   "x": 1292,
   "y": 795.0,
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
   "seed": 487708375,
   "version": 1,
   "versionNonce": 229939837,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Dispenser.Dispense\nstate = dispensing",
   "originalText": "Dispenser.Dispense\nstate = dispensing",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "f6MEU252",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5DElixta",
   "type": "rectangle",
   "x": 1600,
   "y": 780,
   "width": 274.0,
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
   "seed": 234721935,
   "version": 1,
   "versionNonce": 854523132,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kwyZwrMO"
    },
    {
     "type": "arrow",
     "id": "Kf702QvD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "kwyZwrMO",
   "type": "text",
   "x": 1612,
   "y": 795.0,
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
   "seed": 2071521771,
   "version": 1,
   "versionNonce": 354722062,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "commit coins, Qty--\nreturn Purchase + change\nstate idle or out_of_stock",
   "originalText": "commit coins, Qty--\nreturn Purchase + change\nstate idle or out_of_stock",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5DElixta",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JVg6DHGq",
   "type": "rectangle",
   "x": 640,
   "y": 980,
   "width": 220.0,
   "height": 110.0,
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
   "seed": 982323373,
   "version": 1,
   "versionNonce": 2063646708,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5NpN2iYp"
    },
    {
     "type": "arrow",
     "id": "AKxL5eqi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5NpN2iYp",
   "type": "text",
   "x": 652,
   "y": 995.0,
   "width": 180.0,
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
   "seed": 812890818,
   "version": 1,
   "versionNonce": 850156577,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrInvalidSlot\nErrSoldOut\nErrInsufficientFunds\nbalance kept",
   "originalText": "ErrInvalidSlot\nErrSoldOut\nErrInsufficientFunds\nbalance kept",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "JVg6DHGq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hYDmdEUm",
   "type": "rectangle",
   "x": 960,
   "y": 980,
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
   "seed": 230325698,
   "version": 1,
   "versionNonce": 583123412,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gwBR8dvE"
    },
    {
     "type": "arrow",
     "id": "SNqLxcTy"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gwBR8dvE",
   "type": "text",
   "x": 972,
   "y": 995.0,
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
   "seed": 1264713636,
   "version": 1,
   "versionNonce": 1918901436,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrExactChange\nbalance kept, can cancel",
   "originalText": "ErrExactChange\nbalance kept, can cancel",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "hYDmdEUm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "y1BvmHSH",
   "type": "rectangle",
   "x": 1280,
   "y": 980,
   "width": 265.0,
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
   "seed": 2039298796,
   "version": 1,
   "versionNonce": 263664990,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gfKWRTec"
    },
    {
     "type": "arrow",
     "id": "AFor4TqD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gfKWRTec",
   "type": "text",
   "x": 1292,
   "y": 995.0,
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
   "seed": 1510504047,
   "version": 1,
   "versionNonce": 987665276,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "jam: refund all, Qty kept\nErrDispenseFailed\nstate out_of_service",
   "originalText": "jam: refund all, Qty kept\nErrDispenseFailed\nstate out_of_service",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "y1BvmHSH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OaWxxj7W",
   "type": "ellipse",
   "x": 840,
   "y": 1250,
   "width": 180,
   "height": 70,
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
   "seed": 1054694556,
   "version": 1,
   "versionNonce": 1400646600,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pCl4LKTy"
    },
    {
     "type": "arrow",
     "id": "FApF2jGU"
    },
    {
     "type": "arrow",
     "id": "bQxMfwVT"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "pCl4LKTy",
   "type": "text",
   "x": 885.0,
   "y": 1275.0,
   "width": 90.0,
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
   "seed": 894579228,
   "version": 1,
   "versionNonce": 457558626,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OutOfStock",
   "originalText": "OutOfStock",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "OaWxxj7W",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kUHU5u9w",
   "type": "ellipse",
   "x": 0,
   "y": 1330,
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
   "seed": 1966233782,
   "version": 1,
   "versionNonce": 29864208,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uTu51MTg"
    },
    {
     "type": "arrow",
     "id": "h9Czz8Cq"
    },
    {
     "type": "arrow",
     "id": "uD1K2gjs"
    },
    {
     "type": "arrow",
     "id": "EINSgF3l"
    },
    {
     "type": "arrow",
     "id": "bQxMfwVT"
    },
    {
     "type": "arrow",
     "id": "RiNL0GEP"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "uTu51MTg",
   "type": "text",
   "x": 45.0,
   "y": 1355.0,
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
   "seed": 1416413884,
   "version": 1,
   "versionNonce": 1407469876,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Idle",
   "originalText": "Idle",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "kUHU5u9w",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "o0mcoObO",
   "type": "ellipse",
   "x": 840,
   "y": 1450,
   "width": 198,
   "height": 70,
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
   "seed": 556241573,
   "version": 1,
   "versionNonce": 837153401,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ooFR2i1d"
    },
    {
     "type": "arrow",
     "id": "VL02DFUi"
    },
    {
     "type": "arrow",
     "id": "RiNL0GEP"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ooFR2i1d",
   "type": "text",
   "x": 885.0,
   "y": 1475.0,
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
   "seed": 666685962,
   "version": 1,
   "versionNonce": 859332252,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OutOfService",
   "originalText": "OutOfService",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "o0mcoObO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WZ8CrQgU",
   "type": "ellipse",
   "x": 0,
   "y": 1550,
   "width": 162,
   "height": 70,
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
   "seed": 2002803544,
   "version": 1,
   "versionNonce": 782947404,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sNcFSM8W"
    },
    {
     "type": "arrow",
     "id": "h9Czz8Cq"
    },
    {
     "type": "arrow",
     "id": "uD1K2gjs"
    },
    {
     "type": "arrow",
     "id": "jeAuaZ1y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "sNcFSM8W",
   "type": "text",
   "x": 45.0,
   "y": 1575.0,
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
   "seed": 874756922,
   "version": 1,
   "versionNonce": 83920336,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "HasMoney",
   "originalText": "HasMoney",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "WZ8CrQgU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "21hHuqQA",
   "type": "ellipse",
   "x": 420,
   "y": 1550,
   "width": 180,
   "height": 70,
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
   "seed": 1544889852,
   "version": 1,
   "versionNonce": 454367407,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "D2H6x3SR"
    },
    {
     "type": "arrow",
     "id": "jeAuaZ1y"
    },
    {
     "type": "arrow",
     "id": "EINSgF3l"
    },
    {
     "type": "arrow",
     "id": "FApF2jGU"
    },
    {
     "type": "arrow",
     "id": "VL02DFUi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "D2H6x3SR",
   "type": "text",
   "x": 465.0,
   "y": 1575.0,
   "width": 90.0,
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
   "seed": 291074571,
   "version": 1,
   "versionNonce": 1835385107,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Dispensing",
   "originalText": "Dispensing",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "21hHuqQA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ldfY6dQr",
   "type": "rectangle",
   "x": 0,
   "y": 1790,
   "width": 256.0,
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
   "seed": 624217345,
   "version": 1,
   "versionNonce": 662661664,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ILUYf8em"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ILUYf8em",
   "type": "text",
   "x": 12,
   "y": 1805.0,
   "width": 216.0,
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
   "seed": 1195652873,
   "version": 1,
   "versionNonce": 1058123669,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "slots\nPK (machine_id, code)\nproduct_id, price_paise\nqty CHECK (qty >= 0)\nUPDATE ... WHERE qty > 0",
   "originalText": "slots\nPK (machine_id, code)\nproduct_id, price_paise\nqty CHECK (qty >= 0)\nUPDATE ... WHERE qty > 0",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ldfY6dQr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2cEtgvoL",
   "type": "rectangle",
   "x": 420,
   "y": 1790,
   "width": 301.0,
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
   "seed": 1531179834,
   "version": 1,
   "versionNonce": 504236133,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NN4VpKHO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NN4VpKHO",
   "type": "text",
   "x": 432,
   "y": 1805.0,
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
   "seed": 1697606838,
   "version": 1,
   "versionNonce": 627074846,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "coin_box\nPK (machine_id, denomination)\ncount CHECK (count >= 0)",
   "originalText": "coin_box\nPK (machine_id, denomination)\ncount CHECK (count >= 0)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2cEtgvoL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WhGWz3sC",
   "type": "rectangle",
   "x": 860,
   "y": 1790,
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
   "seed": 128098833,
   "version": 1,
   "versionNonce": 656262267,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UvQKkpjD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "UvQKkpjD",
   "type": "text",
   "x": 872,
   "y": 1805.0,
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
   "seed": 619218457,
   "version": 1,
   "versionNonce": 542115973,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "sales\nid PK, machine_id, slot_code\npaid_paise, change_paise, status\nidempotency_key UNIQUE",
   "originalText": "sales\nid PK, machine_id, slot_code\npaid_paise, change_paise, status\nidempotency_key UNIQUE",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "WhGWz3sC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IszCw0GM",
   "type": "arrow",
   "x": 336.0,
   "y": 126.97402597402598,
   "width": 121.0,
   "height": 6.285714285714292,
   "angle": 0,
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
   "seed": 701062688,
   "version": 1,
   "versionNonce": 808816775,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1CGJe9A8"
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
     -121.0,
     -6.285714285714292
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "J81uDMtK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "OTthD3K9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "1CGJe9A8",
   "type": "text",
   "x": 220.375,
   "y": 115.08116883116884,
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
   "seed": 2017601384,
   "version": 1,
   "versionNonce": 1057390970,
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
   "containerId": "IszCw0GM",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LTEc8XO8",
   "type": "arrow",
   "x": 479.6804347826087,
   "y": 214.0,
   "width": 11.230434782608711,
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
   "seed": 82719109,
   "version": 1,
   "versionNonce": 2046896449,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZAGqhnwV"
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
     -11.230434782608711,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "J81uDMtK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "a8AI9JHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ZAGqhnwV",
   "type": "text",
   "x": 415.0027173913044,
   "y": 246.25,
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
   "seed": 2055038,
   "version": 1,
   "versionNonce": 636080584,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "current state 1",
   "originalText": "current state 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "LTEc8XO8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "w86kKBj3",
   "type": "arrow",
   "x": 645.0,
   "y": 126.58802177858439,
   "width": 251.0,
   "height": 13.666061705989108,
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
   "seed": 2100967229,
   "version": 1,
   "versionNonce": 1615572840,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uyRoHmQT"
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
     251.0,
     -13.666061705989108
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "J81uDMtK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lEV26Slc",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "uyRoHmQT",
   "type": "text",
   "x": 754.75,
   "y": 111.00499092558984,
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
   "seed": 841040510,
   "version": 1,
   "versionNonce": 1126165791,
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
   "containerId": "w86kKBj3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mdx9c6yu",
   "type": "arrow",
   "x": 1296.0,
   "y": 98.41526520051747,
   "width": 109.0,
   "height": 2.820181112548511,
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
   "seed": 859504343,
   "version": 1,
   "versionNonce": 1605135456,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sZDmhQoU"
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
     -109.0,
     2.820181112548511
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Ycbg1O9a",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lEV26Slc",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "sZDmhQoU",
   "type": "text",
   "x": 1202.125,
   "y": 91.07535575679172,
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
   "seed": 620148461,
   "version": 1,
   "versionNonce": 1725842989,
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
   "containerId": "mdx9c6yu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DrHEbqPm",
   "type": "arrow",
   "x": 645.0,
   "y": 202.17391304347825,
   "width": 251.0,
   "height": 109.13043478260869,
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
   "seed": 1124228991,
   "version": 1,
   "versionNonce": 1443555267,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "10Z2EFPG"
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
     251.0,
     109.13043478260869
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "J81uDMtK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "eqClLnIs",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "10Z2EFPG",
   "type": "text",
   "x": 742.9375,
   "y": 247.98913043478262,
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
   "seed": 1805802652,
   "version": 1,
   "versionNonce": 1964930479,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "returns",
   "originalText": "returns",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "DrHEbqPm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "L4OFxNb4",
   "type": "arrow",
   "x": 141.4918918918919,
   "y": 516.0,
   "width": 194.5081081081081,
   "height": 92.50385604113109,
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
   "seed": 1647308918,
   "version": 1,
   "versionNonce": 1507327800,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "32EAdSMy"
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
     194.5081081081081,
     -92.50385604113109
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "S20vJopZ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "a8AI9JHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "32EAdSMy",
   "type": "text",
   "x": 199.37094594594595,
   "y": 460.9980719794345,
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
   "seed": 220559661,
   "version": 1,
   "versionNonce": 103638774,
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
   "containerId": "L4OFxNb4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YtFjfdRI",
   "type": "arrow",
   "x": 360.6459459459459,
   "y": 516.0,
   "width": 53.4108108108108,
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
   "seed": 1617987364,
   "version": 1,
   "versionNonce": 885821164,
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
     53.4108108108108,
     -82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "iTo2OUdl",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "a8AI9JHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "Tc2nfxtu",
   "type": "arrow",
   "x": 580.2081081081081,
   "y": 516.0,
   "width": 65.8216216216216,
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
   "seed": 393357621,
   "version": 1,
   "versionNonce": 1250536290,
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
     -65.8216216216216,
     -82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "drLulU41",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "a8AI9JHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "Os0w3k5b",
   "type": "arrow",
   "x": 792.4243243243243,
   "y": 516.0,
   "width": 210.4243243243243,
   "height": 95.29620563035496,
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
   "seed": 639282456,
   "version": 1,
   "versionNonce": 58168005,
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
     -210.4243243243243,
     -95.29620563035496
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "d7tbBGvs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "a8AI9JHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "UdI92ubE",
   "type": "arrow",
   "x": 1036.0,
   "y": 522.5571955719557,
   "width": 454.0,
   "height": 123.97047970479707,
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
   "seed": 1168747610,
   "version": 1,
   "versionNonce": 1650166520,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LKmhXnXl"
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
     -454.0,
     -123.97047970479707
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "glVAB7d3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "a8AI9JHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "LKmhXnXl",
   "type": "text",
   "x": 769.625,
   "y": 451.8219557195572,
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
   "seed": 1493530260,
   "version": 1,
   "versionNonce": 443942225,
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
   "containerId": "UdI92ubE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "VoLqeDOm",
   "type": "arrow",
   "x": 251.0,
   "y": 815.0,
   "width": 65.0,
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
   "seed": 1364570009,
   "version": 1,
   "versionNonce": 1268470220,
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
     65.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "g4ZKrTlK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "M8VdQjAv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DWPQ2dhE",
   "type": "arrow",
   "x": 571.0,
   "y": 815.0,
   "width": 65.0,
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
   "seed": 151230816,
   "version": 1,
   "versionNonce": 1091108211,
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
     65.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "M8VdQjAv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "kNskVlKi",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "wJ3fBpE9",
   "type": "arrow",
   "x": 873.0,
   "y": 815.0,
   "width": 83.0,
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
   "seed": 419357416,
   "version": 1,
   "versionNonce": 545738998,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "si958rxE"
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
     83.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "kNskVlKi",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "qFlxTcc6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "si958rxE",
   "type": "text",
   "x": 890.875,
   "y": 806.25,
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
   "seed": 730096440,
   "version": 1,
   "versionNonce": 49008243,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "all ok",
   "originalText": "all ok",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "wJ3fBpE9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tKXEhwdJ",
   "type": "arrow",
   "x": 1193.0,
   "y": 815.0,
   "width": 83.0,
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
   "seed": 1155405176,
   "version": 1,
   "versionNonce": 1818146170,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2mtBUxBh"
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
     83.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qFlxTcc6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "f6MEU252",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "2mtBUxBh",
   "type": "text",
   "x": 1175.4375,
   "y": 806.25,
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
   "seed": 1925426623,
   "version": 1,
   "versionNonce": 863104758,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "change possible",
   "originalText": "change possible",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "tKXEhwdJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kf702QvD",
   "type": "arrow",
   "x": 1486.0,
   "y": 817.9494382022472,
   "width": 110.0,
   "height": 3.089887640449433,
   "angle": 0,
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
   "seed": 459733473,
   "version": 1,
   "versionNonce": 1796502761,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Omsj3uk6"
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
     110.0,
     3.089887640449433
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "f6MEU252",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5DElixta",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Omsj3uk6",
   "type": "text",
   "x": 1505.5625,
   "y": 810.7443820224719,
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
   "seed": 61460182,
   "version": 1,
   "versionNonce": 570862485,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "dispensed",
   "originalText": "dispensed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Kf702QvD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AKxL5eqi",
   "type": "arrow",
   "x": 753.7022727272728,
   "y": 854.0,
   "width": 2.4954545454545496,
   "height": 122.0,
   "angle": 0,
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
   "seed": 219768382,
   "version": 1,
   "versionNonce": 1125218229,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "X5Lm3isG"
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
     -2.4954545454545496,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "kNskVlKi",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "JVg6DHGq",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "X5Lm3isG",
   "type": "text",
   "x": 736.7045454545455,
   "y": 906.25,
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
   "seed": 1808563279,
   "version": 1,
   "versionNonce": 969350838,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "fail",
   "originalText": "fail",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "AKxL5eqi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SNqLxcTy",
   "type": "arrow",
   "x": 1077.1325,
   "y": 854.0,
   "width": 8.235000000000127,
   "height": 122.0,
   "angle": 0,
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
   "seed": 627201800,
   "version": 1,
   "versionNonce": 913493667,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "05wmHEHX"
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
     8.235000000000127,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qFlxTcc6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "hYDmdEUm",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "05wmHEHX",
   "type": "text",
   "x": 1010.375,
   "y": 906.25,
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
   "seed": 830865688,
   "version": 1,
   "versionNonce": 20053063,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "cannot make change",
   "originalText": "cannot make change",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "SNqLxcTy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AFor4TqD",
   "type": "arrow",
   "x": 1386.85,
   "y": 854.0,
   "width": 18.300000000000182,
   "height": 122.0,
   "angle": 0,
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
   "seed": 964916522,
   "version": 1,
   "versionNonce": 405041391,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "g52oFIWH"
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
     18.300000000000182,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "f6MEU252",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "y1BvmHSH",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "g52oFIWH",
   "type": "text",
   "x": 1352.6875,
   "y": 906.25,
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
   "seed": 833761777,
   "version": 1,
   "versionNonce": 1291813687,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "motor error",
   "originalText": "motor error",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "AFor4TqD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "h9Czz8Cq",
   "type": "arrow",
   "x": 51.23725238195769,
   "y": 1405.179030834932,
   "width": 11.624040502334438,
   "height": 142.0716061396431,
   "angle": 0,
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
   "seed": 63920638,
   "version": 1,
   "versionNonce": 1974113708,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dEagYvnt"
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
     11.624040502334438,
     142.0716061396431
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "kUHU5u9w",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "WZ8CrQgU",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "dEagYvnt",
   "type": "text",
   "x": 13.736772633124907,
   "y": 1467.4648339047535,
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
   "seed": 1141091363,
   "version": 1,
   "versionNonce": 2077673390,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "insert coin",
   "originalText": "insert coin",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "h9Czz8Cq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uD1K2gjs",
   "type": "arrow",
   "x": 92.76138100593973,
   "y": 1544.8042661282584,
   "width": 11.624040502334438,
   "height": 142.0716061396431,
   "angle": 0,
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
   "seed": 630548364,
   "version": 1,
   "versionNonce": 1303539134,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0KIodh0A"
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
     -11.624040502334438,
     -142.0716061396431
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WZ8CrQgU",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "kUHU5u9w",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0KIodh0A",
   "type": "text",
   "x": 31.8243607547725,
   "y": 1465.0184630584367,
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
   "seed": 257487389,
   "version": 1,
   "versionNonce": 1538845520,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "cancel, refund",
   "originalText": "cancel, refund",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "uD1K2gjs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jeAuaZ1y",
   "type": "arrow",
   "x": 166.0,
   "y": 1585.0,
   "width": 250.0,
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
   "seed": 1406369728,
   "version": 1,
   "versionNonce": 394265622,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hssoWxSd"
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
     250.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WZ8CrQgU",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "21hHuqQA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "hssoWxSd",
   "type": "text",
   "x": 208.3125,
   "y": 1576.25,
   "width": 165.375,
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
   "seed": 150028965,
   "version": 1,
   "versionNonce": 1522804064,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "select ok + change ok",
   "originalText": "select ok + change ok",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jeAuaZ1y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EINSgF3l",
   "type": "arrow",
   "x": 449.4141117895538,
   "y": 1555.1814420440758,
   "width": 335.2513152366214,
   "height": 165.0006473200374,
   "angle": 0,
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
   "seed": 1363372148,
   "version": 1,
   "versionNonce": 413392560,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "mm7scsna"
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
     -335.2513152366214,
     -165.0006473200374
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "21hHuqQA",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "kUHU5u9w",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "mm7scsna",
   "type": "text",
   "x": 199.10095417124307,
   "y": 1463.931118384057,
   "width": 165.375,
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
   "seed": 827213706,
   "version": 1,
   "versionNonce": 1434684375,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "dispensed, stock left",
   "originalText": "dispensed, stock left",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "EINSgF3l",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FApF2jGU",
   "type": "arrow",
   "x": 557.2132545231956,
   "y": 1551.276246769146,
   "width": 325.5734909536088,
   "height": 232.55249353829186,
   "angle": 0,
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
   "seed": 1144059109,
   "version": 1,
   "versionNonce": 1963855091,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2q0KEIcE"
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
     325.5734909536088,
     -232.55249353829186
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "21hHuqQA",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "OaWxxj7W",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "2q0KEIcE",
   "type": "text",
   "x": 664.875,
   "y": 1426.25,
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
   "seed": 1495983729,
   "version": 1,
   "versionNonce": 1456064804,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "last item sold",
   "originalText": "last item sold",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "FApF2jGU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "VL02DFUi",
   "type": "arrow",
   "x": 591.9515052655522,
   "y": 1565.8970850196847,
   "width": 259.3370493447643,
   "height": 60.45152665379101,
   "angle": 0,
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
   "seed": 882651436,
   "version": 1,
   "versionNonce": 1591537209,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "QueUsjMj"
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
     259.3370493447643,
     -60.45152665379101
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "21hHuqQA",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "o0mcoObO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "QueUsjMj",
   "type": "text",
   "x": 662.5575299379343,
   "y": 1526.9213216927892,
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
   "seed": 1032592066,
   "version": 1,
   "versionNonce": 2128795842,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "jam, refund all",
   "originalText": "jam, refund all",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "VL02DFUi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bQxMfwVT",
   "type": "arrow",
   "x": 838.2418656421403,
   "y": 1293.466725200264,
   "width": 709.0681222932226,
   "height": 65.42727772025114,
   "angle": 0,
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
   "seed": 1631142492,
   "version": 1,
   "versionNonce": 1919580479,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "SfaOuI6G"
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
     -709.0681222932226,
     65.42727772025114
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "OaWxxj7W",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "kUHU5u9w",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "SfaOuI6G",
   "type": "text",
   "x": 456.145304495529,
   "y": 1317.4303640603894,
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
   "seed": 1287485662,
   "version": 1,
   "versionNonce": 662173233,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "restock",
   "originalText": "restock",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "bQxMfwVT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RiNL0GEP",
   "type": "arrow",
   "x": 842.1437957702485,
   "y": 1471.7320268178423,
   "width": 713.9254464007723,
   "height": 97.79800635627021,
   "angle": 0,
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
   "seed": 644408897,
   "version": 1,
   "versionNonce": 2089456578,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LCN8g1lI"
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
     -713.9254464007723,
     -97.79800635627021
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "o0mcoObO",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "kUHU5u9w",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "LCN8g1lI",
   "type": "text",
   "x": 461.55607256986235,
   "y": 1414.0830236397073,
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
   "seed": 55640102,
   "version": 1,
   "versionNonce": 1631653060,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "repair",
   "originalText": "repair",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "RiNL0GEP",
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