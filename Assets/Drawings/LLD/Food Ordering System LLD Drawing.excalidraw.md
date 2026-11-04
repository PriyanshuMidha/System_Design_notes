---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^bOHv7lMa

2. Core flow: PlaceOrder(user, idemKey) ^MnPHC5h0

3. Order state machine ^AyT2DUe4

4. Storage ^VOMEIJVD

On ACCEPTED: assigner picks a rider. On REJECTED/CANCELLED: refund. Every change: observers notified after unlock. ^f7DrSmVu

Restaurant
- ID, Name
- Open bool ^R1Ony6i3

MenuItem (live)
- PricePaise int64
- Available bool ^IJQp9FId

Cart (draft)
- UserID
- RestaurantID (one only)
- Qty map[itemID]int ^eeXRID6X

Order
- Status OrderStatus
- TotalPaise int64
- IdempotencyKey
- PaymentID, PartnerID ^ybA1N1do

OrderLine (snapshot)
- Name
- UnitPricePaise
- Qty ^WrjvPeN4

OrderService (facade)
+ AddToCart(ctx, user, item, qty)
+ PlaceOrder(ctx, user, key)
+ UpdateStatus(ctx, id, actor, to) ^tsG8NANB

<<interface>>
PaymentGateway (Adapter)
+ Charge(ctx, key, amt)
+ Refund(ctx, payID, amt) ^hoYMvdbi

<<interface>>
DeliveryAssigner (Strategy)
+ Assign(ctx, order) ^4Nka7U6N

<<interface>>
StatusListener (Observer)
+ OnStatusChange(ctx, o, from) ^uYNEEc7T

RazorpayAdapter
(wraps vendor SDK) ^g8CUhb9C

see Delivery Partner
Assignment LLD ^qXSj35bk

Customer
POST /orders
Idempotency-Key ^VJIEYUaE

lock
idem[user|key] exists? ^xORYFZon

wait on pending.done
-> same order ^YqIfzdH7

register pending
take cart (delete)
validate + snapshot ^u0mSdEHY

closed / unavailable /
empty cart -> error,
release key, cart back ^obgdaTBl

unlock
pay.Charge(key, total) ^PbBA9YS1

ErrPaymentFailed
release key, cart back ^VyRWaFel

lock, save order
status PLACED
close(pending.done) ^0WYfkpwZ

unlock
notify listeners ^gjJwqVAq

PLACED ^W3JXaFpt

ACCEPTED ^39CYkI8l

PREPARING ^ybENoP2k

READY ^5hm5vUwn

PICKED_UP ^1F2gKrqP

DELIVERED ^spi8Ekj1

REJECTED
(refund) ^ZyB9ZOXQ

CANCELLED
(refund) ^m4EQFdcZ

no customer cancel
from PREPARING on ^Hfs4YUcF

orders
id PK, user_id, restaurant_id
status, total_paise, version
idempotency_key
UNIQUE(user_id, idempotency_key) ^TUW7FOxF

order_lines
order_id, item_id (PK)
name, unit_price_paise, qty
= price snapshot ^jL9jr4iG

carts / cart_items
user_id PK, restaurant_id
(user_id, item_id) PK, qty>0 ^iKRSMmPx

restaurants / menu_items
price_paise >= 0, available
INDEX(restaurant_id) ^58FRQhil

status CAS:
UPDATE ... WHERE id=$id
AND status=$from
AND version=$v ^zxroXJaN

owns 1..* ^JhcuT33Z

pinned to 1 ^So8d9k0D

owns 1..* ^VrRrpMGr

manages ^uSav7GTv

creates ^hqYOXIQJ

uses ^qZwAbxBo

uses ^AznWM6Od

0..* notifies ^pik9U8li

implements ^bw6bj9l9

implements ^AeGQHa9L

yes ^Qjy1ltNB

no ^MJyFZDoR

invalid ^VY1yGfS1

ok ^0EIg2Nix

declined ^jskb58pK

paymentID ^GX1sSJfk

restaurant ^Pukyivxg

restaurant ^1qeZDjDu

restaurant ^GWa7rnoc

partner ^HQIfsWl0

partner ^aEYSuA8J

restaurant ^jRuw8ZDq

customer ^ugmNWCK1

customer ^cfNeXfBy

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "bOHv7lMa",
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
   "seed": 1897015464,
   "version": 1,
   "versionNonce": 1974675654,
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
   "id": "MnPHC5h0",
   "type": "text",
   "x": 0,
   "y": 720,
   "width": 614.25,
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
   "seed": 180561182,
   "version": 1,
   "versionNonce": 863515741,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: PlaceOrder(user, idemKey)",
   "originalText": "2. Core flow: PlaceOrder(user, idemKey)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AyT2DUe4",
   "type": "text",
   "x": 0,
   "y": 1260,
   "width": 346.5,
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
   "seed": 1328634947,
   "version": 1,
   "versionNonce": 325683545,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Order state machine",
   "originalText": "3. Order state machine",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "VOMEIJVD",
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
   "seed": 1433893439,
   "version": 1,
   "versionNonce": 1863480296,
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
   "id": "f7DrSmVu",
   "type": "text",
   "x": 0,
   "y": 1790,
   "width": 1026.0,
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
   "seed": 705221474,
   "version": 1,
   "versionNonce": 388110109,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "On ACCEPTED: assigner picks a rider. On REJECTED/CANCELLED: refund. Every change: observers notified after unlock.",
   "originalText": "On ACCEPTED: assigner picks a rider. On REJECTED/CANCELLED: refund. Every change: observers notified after unlock.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ARm4589O",
   "type": "rectangle",
   "x": 0,
   "y": 70,
   "width": 140,
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
   "seed": 144872103,
   "version": 1,
   "versionNonce": 2123739515,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "R1Ony6i3"
    },
    {
     "type": "arrow",
     "id": "P0em1d2Y"
    },
    {
     "type": "arrow",
     "id": "1ubadrVV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "R1Ony6i3",
   "type": "text",
   "x": 12,
   "y": 85.0,
   "width": 99.0,
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
   "seed": 548551606,
   "version": 1,
   "versionNonce": 1996268261,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Restaurant\n- ID, Name\n- Open bool",
   "originalText": "Restaurant\n- ID, Name\n- Open bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ARm4589O",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2hZNGzjA",
   "type": "rectangle",
   "x": 0,
   "y": 260,
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
   "seed": 1692354270,
   "version": 1,
   "versionNonce": 1896259410,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IJQp9FId"
    },
    {
     "type": "arrow",
     "id": "P0em1d2Y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "IJQp9FId",
   "type": "text",
   "x": 12,
   "y": 275.0,
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
   "seed": 1183444333,
   "version": 1,
   "versionNonce": 814540416,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "MenuItem (live)\n- PricePaise int64\n- Available bool",
   "originalText": "MenuItem (live)\n- PricePaise int64\n- Available bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2hZNGzjA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "49n9LKXh",
   "type": "rectangle",
   "x": 340,
   "y": 70,
   "width": 265.0,
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
   "seed": 1215858154,
   "version": 1,
   "versionNonce": 524408136,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "eeXRID6X"
    },
    {
     "type": "arrow",
     "id": "1ubadrVV"
    },
    {
     "type": "arrow",
     "id": "rZKVzZ7G"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "eeXRID6X",
   "type": "text",
   "x": 352,
   "y": 85.0,
   "width": 225.0,
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
   "seed": 549600121,
   "version": 1,
   "versionNonce": 430549160,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Cart (draft)\n- UserID\n- RestaurantID (one only)\n- Qty map[itemID]int",
   "originalText": "Cart (draft)\n- UserID\n- RestaurantID (one only)\n- Qty map[itemID]int",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "49n9LKXh",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Q06uxyxy",
   "type": "rectangle",
   "x": 340,
   "y": 300,
   "width": 238.0,
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
   "seed": 170179030,
   "version": 1,
   "versionNonce": 241548688,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ybA1N1do"
    },
    {
     "type": "arrow",
     "id": "wj7kX4Ie"
    },
    {
     "type": "arrow",
     "id": "SpIQvpJh"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ybA1N1do",
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
   "seed": 1582405043,
   "version": 1,
   "versionNonce": 1058503214,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order\n- Status OrderStatus\n- TotalPaise int64\n- IdempotencyKey\n- PaymentID, PartnerID",
   "originalText": "Order\n- Status OrderStatus\n- TotalPaise int64\n- IdempotencyKey\n- PaymentID, PartnerID",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Q06uxyxy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NFjTcJQL",
   "type": "rectangle",
   "x": 0,
   "y": 460,
   "width": 220.0,
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
   "seed": 923583502,
   "version": 1,
   "versionNonce": 1450596355,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WrjvPeN4"
    },
    {
     "type": "arrow",
     "id": "wj7kX4Ie"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "WrjvPeN4",
   "type": "text",
   "x": 12,
   "y": 475.0,
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
   "seed": 1530119666,
   "version": 1,
   "versionNonce": 1307150304,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OrderLine (snapshot)\n- Name\n- UnitPricePaise\n- Qty",
   "originalText": "OrderLine (snapshot)\n- Name\n- UnitPricePaise\n- Qty",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "NFjTcJQL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XBLh7Wxb",
   "type": "rectangle",
   "x": 760,
   "y": 70,
   "width": 346.0,
   "height": 110.0,
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
   "seed": 260154790,
   "version": 1,
   "versionNonce": 601361103,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tsG8NANB"
    },
    {
     "type": "arrow",
     "id": "rZKVzZ7G"
    },
    {
     "type": "arrow",
     "id": "SpIQvpJh"
    },
    {
     "type": "arrow",
     "id": "Se0ubqFQ"
    },
    {
     "type": "arrow",
     "id": "nNtVii8l"
    },
    {
     "type": "arrow",
     "id": "qi4Zcm8o"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "tsG8NANB",
   "type": "text",
   "x": 772,
   "y": 85.0,
   "width": 306.0,
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
   "seed": 1445197214,
   "version": 1,
   "versionNonce": 54460627,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OrderService (facade)\n+ AddToCart(ctx, user, item, qty)\n+ PlaceOrder(ctx, user, key)\n+ UpdateStatus(ctx, id, actor, to)",
   "originalText": "OrderService (facade)\n+ AddToCart(ctx, user, item, qty)\n+ PlaceOrder(ctx, user, key)\n+ UpdateStatus(ctx, id, actor, to)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "XBLh7Wxb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "V2ZbSt62",
   "type": "rectangle",
   "x": 1260,
   "y": 40,
   "width": 265.0,
   "height": 110.0,
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
   "seed": 811774877,
   "version": 1,
   "versionNonce": 1380500145,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hoYMvdbi"
    },
    {
     "type": "arrow",
     "id": "Se0ubqFQ"
    },
    {
     "type": "arrow",
     "id": "5Hhhk2hD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hoYMvdbi",
   "type": "text",
   "x": 1272,
   "y": 55.0,
   "width": 225.0,
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
   "seed": 1068142675,
   "version": 1,
   "versionNonce": 983189214,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nPaymentGateway (Adapter)\n+ Charge(ctx, key, amt)\n+ Refund(ctx, payID, amt)",
   "originalText": "<<interface>>\nPaymentGateway (Adapter)\n+ Charge(ctx, key, amt)\n+ Refund(ctx, payID, amt)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "V2ZbSt62",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iz8hU6Fb",
   "type": "rectangle",
   "x": 1260,
   "y": 230,
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
   "seed": 990450134,
   "version": 1,
   "versionNonce": 1952582798,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4Nka7U6N"
    },
    {
     "type": "arrow",
     "id": "nNtVii8l"
    },
    {
     "type": "arrow",
     "id": "vmWvjLCO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "4Nka7U6N",
   "type": "text",
   "x": 1272,
   "y": 245.0,
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
   "seed": 1228251042,
   "version": 1,
   "versionNonce": 1809079784,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nDeliveryAssigner (Strategy)\n+ Assign(ctx, order)",
   "originalText": "<<interface>>\nDeliveryAssigner (Strategy)\n+ Assign(ctx, order)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "iz8hU6Fb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "h8XDzAfN",
   "type": "rectangle",
   "x": 1260,
   "y": 400,
   "width": 310.0,
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
   "seed": 2124939719,
   "version": 1,
   "versionNonce": 1292552181,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uYNEEc7T"
    },
    {
     "type": "arrow",
     "id": "qi4Zcm8o"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "uYNEEc7T",
   "type": "text",
   "x": 1272,
   "y": 415.0,
   "width": 270.0,
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
   "seed": 1704660036,
   "version": 1,
   "versionNonce": 2107875976,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nStatusListener (Observer)\n+ OnStatusChange(ctx, o, from)",
   "originalText": "<<interface>>\nStatusListener (Observer)\n+ OnStatusChange(ctx, o, from)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "h8XDzAfN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KpjaO93Y",
   "type": "rectangle",
   "x": 1700,
   "y": 40,
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
   "seed": 824794180,
   "version": 1,
   "versionNonce": 828798543,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "g8CUhb9C"
    },
    {
     "type": "arrow",
     "id": "5Hhhk2hD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "g8CUhb9C",
   "type": "text",
   "x": 1712,
   "y": 55.0,
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
   "seed": 376407938,
   "version": 1,
   "versionNonce": 1947435706,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "RazorpayAdapter\n(wraps vendor SDK)",
   "originalText": "RazorpayAdapter\n(wraps vendor SDK)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KpjaO93Y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "idhqSjfO",
   "type": "rectangle",
   "x": 1700,
   "y": 230,
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
   "seed": 1093716662,
   "version": 1,
   "versionNonce": 1576317680,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qXSj35bk"
    },
    {
     "type": "arrow",
     "id": "vmWvjLCO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "qXSj35bk",
   "type": "text",
   "x": 1712,
   "y": 245.0,
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
   "seed": 336179251,
   "version": 1,
   "versionNonce": 1264223235,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "see Delivery Partner\nAssignment LLD",
   "originalText": "see Delivery Partner\nAssignment LLD",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "idhqSjfO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "N0RQ7CeP",
   "type": "rectangle",
   "x": 0,
   "y": 800,
   "width": 175.0,
   "height": 90.0,
   "angle": 0,
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
   "seed": 1349736662,
   "version": 1,
   "versionNonce": 825414360,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VJIEYUaE"
    },
    {
     "type": "arrow",
     "id": "62fSQBC2"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VJIEYUaE",
   "type": "text",
   "x": 12,
   "y": 815.0,
   "width": 135.0,
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
   "seed": 424022199,
   "version": 1,
   "versionNonce": 1722946359,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Customer\nPOST /orders\nIdempotency-Key",
   "originalText": "Customer\nPOST /orders\nIdempotency-Key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "N0RQ7CeP",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mKgNzXia",
   "type": "rectangle",
   "x": 280,
   "y": 800,
   "width": 238.0,
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
   "seed": 790877249,
   "version": 1,
   "versionNonce": 634316999,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xORYFZon"
    },
    {
     "type": "arrow",
     "id": "62fSQBC2"
    },
    {
     "type": "arrow",
     "id": "dxycGUsC"
    },
    {
     "type": "arrow",
     "id": "LrKjXQAe"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "xORYFZon",
   "type": "text",
   "x": 292,
   "y": 815.0,
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
   "seed": 1446731299,
   "version": 1,
   "versionNonce": 685708470,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock\nidem[user|key] exists?",
   "originalText": "lock\nidem[user|key] exists?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "mKgNzXia",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "UHn7CWb0",
   "type": "rectangle",
   "x": 260,
   "y": 980,
   "width": 220.0,
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
   "seed": 275505082,
   "version": 1,
   "versionNonce": 132725689,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YqIfzdH7"
    },
    {
     "type": "arrow",
     "id": "dxycGUsC"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "YqIfzdH7",
   "type": "text",
   "x": 272,
   "y": 995.0,
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
   "seed": 1796757558,
   "version": 1,
   "versionNonce": 1858272854,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "wait on pending.done\n-> same order",
   "originalText": "wait on pending.done\n-> same order",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "UHn7CWb0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YqObCKXf",
   "type": "rectangle",
   "x": 600,
   "y": 800,
   "width": 211.0,
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
   "seed": 1777182449,
   "version": 1,
   "versionNonce": 370494251,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "u0mSdEHY"
    },
    {
     "type": "arrow",
     "id": "LrKjXQAe"
    },
    {
     "type": "arrow",
     "id": "6DUONfhe"
    },
    {
     "type": "arrow",
     "id": "wqx0pA1R"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "u0mSdEHY",
   "type": "text",
   "x": 612,
   "y": 815.0,
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
   "seed": 542116171,
   "version": 1,
   "versionNonce": 1493590776,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "register pending\ntake cart (delete)\nvalidate + snapshot",
   "originalText": "register pending\ntake cart (delete)\nvalidate + snapshot",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "YqObCKXf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6ZJiBNMz",
   "type": "rectangle",
   "x": 600,
   "y": 1000,
   "width": 238.0,
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
   "seed": 526664008,
   "version": 1,
   "versionNonce": 511909972,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "obgdaTBl"
    },
    {
     "type": "arrow",
     "id": "6DUONfhe"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "obgdaTBl",
   "type": "text",
   "x": 612,
   "y": 1015.0,
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
   "seed": 21548930,
   "version": 1,
   "versionNonce": 800495492,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "closed / unavailable /\nempty cart -> error,\nrelease key, cart back",
   "originalText": "closed / unavailable /\nempty cart -> error,\nrelease key, cart back",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "6ZJiBNMz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "0LKpeIMd",
   "type": "rectangle",
   "x": 940,
   "y": 800,
   "width": 238.0,
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
   "seed": 1864821553,
   "version": 1,
   "versionNonce": 1806590806,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PbBA9YS1"
    },
    {
     "type": "arrow",
     "id": "wqx0pA1R"
    },
    {
     "type": "arrow",
     "id": "XdJSZwcV"
    },
    {
     "type": "arrow",
     "id": "rf3jD66T"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "PbBA9YS1",
   "type": "text",
   "x": 952,
   "y": 815.0,
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
   "seed": 811037802,
   "version": 1,
   "versionNonce": 1730260148,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "unlock\npay.Charge(key, total)",
   "originalText": "unlock\npay.Charge(key, total)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "0LKpeIMd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bt1hWVbf",
   "type": "rectangle",
   "x": 980,
   "y": 1000,
   "width": 238.0,
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
   "seed": 1701291491,
   "version": 1,
   "versionNonce": 511004552,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VyRWaFel"
    },
    {
     "type": "arrow",
     "id": "XdJSZwcV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VyRWaFel",
   "type": "text",
   "x": 992,
   "y": 1015.0,
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
   "seed": 2058869222,
   "version": 1,
   "versionNonce": 547644064,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrPaymentFailed\nrelease key, cart back",
   "originalText": "ErrPaymentFailed\nrelease key, cart back",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "bt1hWVbf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Sf1hsbR8",
   "type": "rectangle",
   "x": 1260,
   "y": 800,
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
   "seed": 850037475,
   "version": 1,
   "versionNonce": 1925876442,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0WYfkpwZ"
    },
    {
     "type": "arrow",
     "id": "rf3jD66T"
    },
    {
     "type": "arrow",
     "id": "W1xgzgCG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "0WYfkpwZ",
   "type": "text",
   "x": 1272,
   "y": 815.0,
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
   "seed": 515058160,
   "version": 1,
   "versionNonce": 1599038051,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock, save order\nstatus PLACED\nclose(pending.done)",
   "originalText": "lock, save order\nstatus PLACED\nclose(pending.done)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Sf1hsbR8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "beN3ZaBy",
   "type": "rectangle",
   "x": 1580,
   "y": 800,
   "width": 184.0,
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
   "seed": 497501872,
   "version": 1,
   "versionNonce": 418112187,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gjJwqVAq"
    },
    {
     "type": "arrow",
     "id": "W1xgzgCG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gjJwqVAq",
   "type": "text",
   "x": 1592,
   "y": 815.0,
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
   "seed": 372326328,
   "version": 1,
   "versionNonce": 906822351,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "unlock\nnotify listeners",
   "originalText": "unlock\nnotify listeners",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "beN3ZaBy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Qs5o9SNn",
   "type": "ellipse",
   "x": 0,
   "y": 1360,
   "width": 140,
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
   "roundness": null,
   "seed": 1591141355,
   "version": 1,
   "versionNonce": 787178368,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "W3JXaFpt"
    },
    {
     "type": "arrow",
     "id": "NHVoHSCi"
    },
    {
     "type": "arrow",
     "id": "u5FECfEJ"
    },
    {
     "type": "arrow",
     "id": "7Kk1OF3B"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "W3JXaFpt",
   "type": "text",
   "x": 43.0,
   "y": 1380.0,
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
   "seed": 1043274375,
   "version": 1,
   "versionNonce": 2010238444,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PLACED",
   "originalText": "PLACED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Qs5o9SNn",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Iq4SK4HG",
   "type": "ellipse",
   "x": 300,
   "y": 1360,
   "width": 140,
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
   "roundness": null,
   "seed": 833931669,
   "version": 1,
   "versionNonce": 1606761247,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "39CYkI8l"
    },
    {
     "type": "arrow",
     "id": "NHVoHSCi"
    },
    {
     "type": "arrow",
     "id": "lD3P3kyb"
    },
    {
     "type": "arrow",
     "id": "88WQfSxY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "39CYkI8l",
   "type": "text",
   "x": 334.0,
   "y": 1380.0,
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
   "seed": 831915308,
   "version": 1,
   "versionNonce": 680621207,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ACCEPTED",
   "originalText": "ACCEPTED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Iq4SK4HG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MxjbE5tD",
   "type": "ellipse",
   "x": 620,
   "y": 1360,
   "width": 140,
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
   "roundness": null,
   "seed": 453785817,
   "version": 1,
   "versionNonce": 1128522495,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ybENoP2k"
    },
    {
     "type": "arrow",
     "id": "lD3P3kyb"
    },
    {
     "type": "arrow",
     "id": "jmPOmDAz"
    },
    {
     "type": "arrow",
     "id": "E9rVnUxX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ybENoP2k",
   "type": "text",
   "x": 649.5,
   "y": 1380.0,
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
   "seed": 1168813960,
   "version": 1,
   "versionNonce": 1007343121,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PREPARING",
   "originalText": "PREPARING",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "MxjbE5tD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1axqgJEP",
   "type": "ellipse",
   "x": 940,
   "y": 1360,
   "width": 140,
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
   "roundness": null,
   "seed": 363988347,
   "version": 1,
   "versionNonce": 875562329,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5hm5vUwn"
    },
    {
     "type": "arrow",
     "id": "jmPOmDAz"
    },
    {
     "type": "arrow",
     "id": "IZeWSmmG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5hm5vUwn",
   "type": "text",
   "x": 987.5,
   "y": 1380.0,
   "width": 45.0,
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
   "seed": 951143513,
   "version": 1,
   "versionNonce": 2117387217,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "READY",
   "originalText": "READY",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "1axqgJEP",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GAffQM8L",
   "type": "ellipse",
   "x": 1220,
   "y": 1360,
   "width": 140,
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
   "roundness": null,
   "seed": 1641093479,
   "version": 1,
   "versionNonce": 2074636676,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1F2gKrqP"
    },
    {
     "type": "arrow",
     "id": "IZeWSmmG"
    },
    {
     "type": "arrow",
     "id": "NPJ9Vbw9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "1F2gKrqP",
   "type": "text",
   "x": 1249.5,
   "y": 1380.0,
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
   "seed": 338344164,
   "version": 1,
   "versionNonce": 1511784275,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PICKED_UP",
   "originalText": "PICKED_UP",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "GAffQM8L",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "C9Bxom25",
   "type": "ellipse",
   "x": 1540,
   "y": 1360,
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
   "seed": 2022837299,
   "version": 1,
   "versionNonce": 1783997392,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "spi8Ekj1"
    },
    {
     "type": "arrow",
     "id": "NPJ9Vbw9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "spi8Ekj1",
   "type": "text",
   "x": 1569.5,
   "y": 1380.0,
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
   "seed": 1817246119,
   "version": 1,
   "versionNonce": 2125147560,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "DELIVERED",
   "originalText": "DELIVERED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "C9Bxom25",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bUETUAkj",
   "type": "ellipse",
   "x": 0,
   "y": 1600,
   "width": 140,
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
   "roundness": null,
   "seed": 673903983,
   "version": 1,
   "versionNonce": 926314100,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZyB9ZOXQ"
    },
    {
     "type": "arrow",
     "id": "u5FECfEJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ZyB9ZOXQ",
   "type": "text",
   "x": 12,
   "y": 1615.0,
   "width": 72.0,
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
   "seed": 572264849,
   "version": 1,
   "versionNonce": 1508162465,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "REJECTED\n(refund)",
   "originalText": "REJECTED\n(refund)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "bUETUAkj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lHQUU9gP",
   "type": "ellipse",
   "x": 300,
   "y": 1600,
   "width": 140,
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
   "roundness": null,
   "seed": 1966384952,
   "version": 1,
   "versionNonce": 869075643,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "m4EQFdcZ"
    },
    {
     "type": "arrow",
     "id": "7Kk1OF3B"
    },
    {
     "type": "arrow",
     "id": "88WQfSxY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "m4EQFdcZ",
   "type": "text",
   "x": 312,
   "y": 1615.0,
   "width": 81.0,
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
   "seed": 1541451484,
   "version": 1,
   "versionNonce": 1524201472,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "CANCELLED\n(refund)",
   "originalText": "CANCELLED\n(refund)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lHQUU9gP",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "J5lkRJSC",
   "type": "rectangle",
   "x": 620,
   "y": 1600,
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
   "seed": 2141057443,
   "version": 1,
   "versionNonce": 1566565483,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Hfs4YUcF"
    },
    {
     "type": "arrow",
     "id": "E9rVnUxX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Hfs4YUcF",
   "type": "text",
   "x": 632,
   "y": 1615.0,
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
   "seed": 653534946,
   "version": 1,
   "versionNonce": 784426995,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "no customer cancel\nfrom PREPARING on",
   "originalText": "no customer cancel\nfrom PREPARING on",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "J5lkRJSC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wUEwg9yT",
   "type": "rectangle",
   "x": 0,
   "y": 1960,
   "width": 328.0,
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
   "seed": 2076701311,
   "version": 1,
   "versionNonce": 2106744036,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "TUW7FOxF"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "TUW7FOxF",
   "type": "text",
   "x": 12,
   "y": 1975.0,
   "width": 288.0,
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
   "seed": 121709559,
   "version": 1,
   "versionNonce": 263064482,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "orders\nid PK, user_id, restaurant_id\nstatus, total_paise, version\nidempotency_key\nUNIQUE(user_id, idempotency_key)",
   "originalText": "orders\nid PK, user_id, restaurant_id\nstatus, total_paise, version\nidempotency_key\nUNIQUE(user_id, idempotency_key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "wUEwg9yT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "n82Vl3Lm",
   "type": "rectangle",
   "x": 420,
   "y": 1960,
   "width": 283.0,
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
   "seed": 833787450,
   "version": 1,
   "versionNonce": 983026528,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jL9jr4iG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jL9jr4iG",
   "type": "text",
   "x": 432,
   "y": 1975.0,
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
   "seed": 1017900528,
   "version": 1,
   "versionNonce": 139736700,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "order_lines\norder_id, item_id (PK)\nname, unit_price_paise, qty\n= price snapshot",
   "originalText": "order_lines\norder_id, item_id (PK)\nname, unit_price_paise, qty\n= price snapshot",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "n82Vl3Lm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dVY4TUYx",
   "type": "rectangle",
   "x": 800,
   "y": 1960,
   "width": 292.0,
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
   "seed": 2037601704,
   "version": 1,
   "versionNonce": 923911402,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iKRSMmPx"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "iKRSMmPx",
   "type": "text",
   "x": 812,
   "y": 1975.0,
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
   "seed": 1422786849,
   "version": 1,
   "versionNonce": 2138428371,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "carts / cart_items\nuser_id PK, restaurant_id\n(user_id, item_id) PK, qty>0",
   "originalText": "carts / cart_items\nuser_id PK, restaurant_id\n(user_id, item_id) PK, qty>0",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "dVY4TUYx",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EOONhAHw",
   "type": "rectangle",
   "x": 1180,
   "y": 1960,
   "width": 283.0,
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
   "seed": 9214861,
   "version": 1,
   "versionNonce": 1281571190,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "58FRQhil"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "58FRQhil",
   "type": "text",
   "x": 1192,
   "y": 1975.0,
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
   "seed": 1556136095,
   "version": 1,
   "versionNonce": 894996990,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "restaurants / menu_items\nprice_paise >= 0, available\nINDEX(restaurant_id)",
   "originalText": "restaurants / menu_items\nprice_paise >= 0, available\nINDEX(restaurant_id)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "EOONhAHw",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ZbkIsD0j",
   "type": "rectangle",
   "x": 1560,
   "y": 1960,
   "width": 247.0,
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
   "seed": 433942181,
   "version": 1,
   "versionNonce": 779424207,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zxroXJaN"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "zxroXJaN",
   "type": "text",
   "x": 1572,
   "y": 1975.0,
   "width": 207.0,
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
   "seed": 385493016,
   "version": 1,
   "versionNonce": 103908137,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "status CAS:\nUPDATE ... WHERE id=$id\nAND status=$from\nAND version=$v",
   "originalText": "status CAS:\nUPDATE ... WHERE id=$id\nAND status=$from\nAND version=$v",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ZbkIsD0j",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "P0em1d2Y",
   "type": "arrow",
   "x": 77.99473684210527,
   "y": 164.0,
   "width": 15.010526315789463,
   "height": 92.0,
   "angle": 0,
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
   "seed": 909939078,
   "version": 1,
   "versionNonce": 1514160344,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JhcuT33Z"
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
     15.010526315789463,
     92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ARm4589O",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "2hZNGzjA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "JhcuT33Z",
   "type": "text",
   "x": 50.0625,
   "y": 201.25,
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
   "seed": 230675799,
   "version": 1,
   "versionNonce": 975787484,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "owns 1..*",
   "originalText": "owns 1..*",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "P0em1d2Y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1ubadrVV",
   "type": "arrow",
   "x": 336.0,
   "y": 121.6086956521739,
   "width": 192.0,
   "height": 4.7701863354037215,
   "angle": 0,
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
   "seed": 37527018,
   "version": 1,
   "versionNonce": 2137081494,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "So8d9k0D"
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
     -192.0,
     -4.7701863354037215
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "49n9LKXh",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ARm4589O",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "So8d9k0D",
   "type": "text",
   "x": 196.6875,
   "y": 110.47360248447205,
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
   "seed": 1370595618,
   "version": 1,
   "versionNonce": 1281263273,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "pinned to 1",
   "originalText": "pinned to 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "1ubadrVV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wj7kX4Ie",
   "type": "arrow",
   "x": 336.0,
   "y": 417.865329512894,
   "width": 112.0,
   "height": 48.13753581661888,
   "angle": 0,
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
   "seed": 1695217899,
   "version": 1,
   "versionNonce": 433279440,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VrRrpMGr"
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
     -112.0,
     48.13753581661888
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Q06uxyxy",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "NFjTcJQL",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "VrRrpMGr",
   "type": "text",
   "x": 244.5625,
   "y": 433.18409742120343,
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
   "seed": 277081688,
   "version": 1,
   "versionNonce": 1956968690,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "owns 1..*",
   "originalText": "owns 1..*",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "wj7kX4Ie",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rZKVzZ7G",
   "type": "arrow",
   "x": 756.0,
   "y": 125.0,
   "width": 147.0,
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
   "seed": 324752188,
   "version": 1,
   "versionNonce": 1722989613,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uSav7GTv"
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
     -147.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "XBLh7Wxb",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "49n9LKXh",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "uSav7GTv",
   "type": "text",
   "x": 654.9375,
   "y": 116.25,
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
   "seed": 1578987565,
   "version": 1,
   "versionNonce": 725861997,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "manages",
   "originalText": "manages",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "rZKVzZ7G",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SpIQvpJh",
   "type": "arrow",
   "x": 816.475,
   "y": 184.0,
   "width": 234.47500000000002,
   "height": 118.72151898734177,
   "angle": 0,
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
   "seed": 1452397736,
   "version": 1,
   "versionNonce": 411598812,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hqYOXIQJ"
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
     -234.47500000000002,
     118.72151898734177
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "XBLh7Wxb",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Q06uxyxy",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "hqYOXIQJ",
   "type": "text",
   "x": 671.675,
   "y": 234.61075949367088,
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
   "seed": 466711459,
   "version": 1,
   "versionNonce": 20740126,
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
   "containerId": "SpIQvpJh",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Se0ubqFQ",
   "type": "arrow",
   "x": 1110.0,
   "y": 113.44396082698586,
   "width": 146.0,
   "height": 9.532100108813935,
   "angle": 0,
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
   "seed": 876183884,
   "version": 1,
   "versionNonce": 1815215831,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qZwAbxBo"
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
     146.0,
     -9.532100108813935
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "XBLh7Wxb",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "V2ZbSt62",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "qZwAbxBo",
   "type": "text",
   "x": 1167.25,
   "y": 99.92791077257888,
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
   "seed": 1368885198,
   "version": 1,
   "versionNonce": 1319757344,
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
   "containerId": "Se0ubqFQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nNtVii8l",
   "type": "arrow",
   "x": 1110.0,
   "y": 181.67022411953042,
   "width": 146.0,
   "height": 46.74493062966917,
   "angle": 0,
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
   "seed": 1674237509,
   "version": 1,
   "versionNonce": 890782383,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AznWM6Od"
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
     146.0,
     46.74493062966917
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "XBLh7Wxb",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "iz8hU6Fb",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "AznWM6Od",
   "type": "text",
   "x": 1167.25,
   "y": 196.292689434365,
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
   "seed": 1239333636,
   "version": 1,
   "versionNonce": 1476465190,
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
   "containerId": "nNtVii8l",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qi4Zcm8o",
   "type": "arrow",
   "x": 1021.86875,
   "y": 184.0,
   "width": 319.32499999999993,
   "height": 212.0,
   "angle": 0,
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
   "seed": 134337657,
   "version": 1,
   "versionNonce": 2044835196,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pik9U8li"
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
     319.32499999999993,
     212.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "XBLh7Wxb",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "h8XDzAfN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "pik9U8li",
   "type": "text",
   "x": 1130.34375,
   "y": 281.25,
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
   "seed": 1658587962,
   "version": 1,
   "versionNonce": 1195623463,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "0..* notifies",
   "originalText": "0..* notifies",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "qi4Zcm8o",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5Hhhk2hD",
   "type": "arrow",
   "x": 1696.0,
   "y": 80.140758873929,
   "width": 167.0,
   "height": 8.176254589963293,
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
   "seed": 1947001561,
   "version": 1,
   "versionNonce": 339011969,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "bw6bj9l9"
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
     -167.0,
     8.176254589963293
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KpjaO93Y",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "V2ZbSt62",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "bw6bj9l9",
   "type": "text",
   "x": 1573.125,
   "y": 75.47888616891065,
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
   "seed": 541507532,
   "version": 1,
   "versionNonce": 92947672,
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
   "containerId": "5Hhhk2hD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vmWvjLCO",
   "type": "arrow",
   "x": 1696.0,
   "y": 267.7906976744186,
   "width": 149.0,
   "height": 3.6474908200734717,
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
   "seed": 14818839,
   "version": 1,
   "versionNonce": 1854608700,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AeGQHa9L"
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
     -149.0,
     3.6474908200734717
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "idhqSjfO",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "iz8hU6Fb",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "AeGQHa9L",
   "type": "text",
   "x": 1582.125,
   "y": 260.86444308445533,
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
   "seed": 1942959450,
   "version": 1,
   "versionNonce": 467858601,
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
   "containerId": "vmWvjLCO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "62fSQBC2",
   "type": "arrow",
   "x": 179.0,
   "y": 842.0626003210273,
   "width": 97.0,
   "height": 3.113964686998429,
   "angle": 0,
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
   "seed": 1204355189,
   "version": 1,
   "versionNonce": 1978688484,
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
     97.0,
     -3.113964686998429
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "N0RQ7CeP",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "mKgNzXia",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "dxycGUsC",
   "type": "arrow",
   "x": 392.71666666666664,
   "y": 874.0,
   "width": 16.43333333333328,
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
   "seed": 795597701,
   "version": 1,
   "versionNonce": 464646909,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Qjy1ltNB"
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
     -16.43333333333328,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "mKgNzXia",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "UHn7CWb0",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Qjy1ltNB",
   "type": "text",
   "x": 372.6875,
   "y": 916.25,
   "width": 23.625,
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
   "seed": 1336171987,
   "version": 1,
   "versionNonce": 1732568068,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "yes",
   "originalText": "yes",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "dxycGUsC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LrKjXQAe",
   "type": "arrow",
   "x": 522.0,
   "y": 839.0130505709625,
   "width": 74.0,
   "height": 2.414355628058729,
   "angle": 0,
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
   "seed": 1127311699,
   "version": 1,
   "versionNonce": 2100609088,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "MJyFZDoR"
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
     74.0,
     2.414355628058729
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "mKgNzXia",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "YqObCKXf",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "MJyFZDoR",
   "type": "text",
   "x": 551.125,
   "y": 831.4702283849919,
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
   "seed": 1217412520,
   "version": 1,
   "versionNonce": 44760779,
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
   "containerId": "LrKjXQAe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6DUONfhe",
   "type": "arrow",
   "x": 708.8075,
   "y": 894.0,
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
   "seed": 725489343,
   "version": 1,
   "versionNonce": 1269573000,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VY1yGfS1"
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
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YqObCKXf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "6ZJiBNMz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "VY1yGfS1",
   "type": "text",
   "x": 684.6875,
   "y": 936.25,
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
   "seed": 1868805718,
   "version": 1,
   "versionNonce": 979405570,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "invalid",
   "originalText": "invalid",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "6DUONfhe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wqx0pA1R",
   "type": "arrow",
   "x": 815.0,
   "y": 841.902404526167,
   "width": 121.0,
   "height": 3.4229137199434945,
   "angle": 0,
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
   "seed": 33556163,
   "version": 1,
   "versionNonce": 774865991,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0EIg2Nix"
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
     121.0,
     -3.4229137199434945
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YqObCKXf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "0LKpeIMd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0EIg2Nix",
   "type": "text",
   "x": 867.625,
   "y": 831.4409476661951,
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
   "seed": 1064169595,
   "version": 1,
   "versionNonce": 1578851906,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ok",
   "originalText": "ok",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "wqx0pA1R",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XdJSZwcV",
   "type": "arrow",
   "x": 1066.8,
   "y": 874.0,
   "width": 24.40000000000009,
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
   "seed": 708125936,
   "version": 1,
   "versionNonce": 1296866649,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jskb58pK"
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
     24.40000000000009,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "0LKpeIMd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "bt1hWVbf",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jskb58pK",
   "type": "text",
   "x": 1047.5,
   "y": 926.25,
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
   "seed": 2035957710,
   "version": 1,
   "versionNonce": 580857351,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "declined",
   "originalText": "declined",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XdJSZwcV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rf3jD66T",
   "type": "arrow",
   "x": 1182.0,
   "y": 839.0130505709625,
   "width": 74.0,
   "height": 2.414355628058729,
   "angle": 0,
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
   "seed": 139850961,
   "version": 1,
   "versionNonce": 1588937250,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GX1sSJfk"
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
     74.0,
     2.414355628058729
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "0LKpeIMd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Sf1hsbR8",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "GX1sSJfk",
   "type": "text",
   "x": 1183.5625,
   "y": 831.4702283849919,
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
   "seed": 1843726568,
   "version": 1,
   "versionNonce": 711053917,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "paymentID",
   "originalText": "paymentID",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "rf3jD66T",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "W1xgzgCG",
   "type": "arrow",
   "x": 1475.0,
   "y": 841.4274061990212,
   "width": 101.0,
   "height": 3.2952691680261523,
   "angle": 0,
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
   "seed": 677258525,
   "version": 1,
   "versionNonce": 1413032500,
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
     101.0,
     -3.2952691680261523
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Sf1hsbR8",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "beN3ZaBy",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NHVoHSCi",
   "type": "arrow",
   "x": 144.0,
   "y": 1390.0,
   "width": 152.0,
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
   "seed": 22708821,
   "version": 1,
   "versionNonce": 2032942589,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Pukyivxg"
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
     152.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Qs5o9SNn",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Iq4SK4HG",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Pukyivxg",
   "type": "text",
   "x": 180.625,
   "y": 1381.25,
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
   "seed": 1604818364,
   "version": 1,
   "versionNonce": 1834066437,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "restaurant",
   "originalText": "restaurant",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NHVoHSCi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lD3P3kyb",
   "type": "arrow",
   "x": 444.0,
   "y": 1390.0,
   "width": 172.0,
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
   "seed": 1169579423,
   "version": 1,
   "versionNonce": 935482558,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1qeZDjDu"
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
     172.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Iq4SK4HG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "MxjbE5tD",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "1qeZDjDu",
   "type": "text",
   "x": 490.625,
   "y": 1381.25,
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
   "seed": 1452528954,
   "version": 1,
   "versionNonce": 460399213,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "restaurant",
   "originalText": "restaurant",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "lD3P3kyb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jmPOmDAz",
   "type": "arrow",
   "x": 764.0,
   "y": 1390.0,
   "width": 172.0,
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
   "seed": 637645749,
   "version": 1,
   "versionNonce": 865796627,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GWa7rnoc"
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
     172.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "MxjbE5tD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1axqgJEP",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "GWa7rnoc",
   "type": "text",
   "x": 810.625,
   "y": 1381.25,
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
   "seed": 1987079624,
   "version": 1,
   "versionNonce": 1628633337,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "restaurant",
   "originalText": "restaurant",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jmPOmDAz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IZeWSmmG",
   "type": "arrow",
   "x": 1084.0,
   "y": 1390.0,
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
   "seed": 1672552118,
   "version": 1,
   "versionNonce": 1712589161,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HQIfsWl0"
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
    "elementId": "1axqgJEP",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "GAffQM8L",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "HQIfsWl0",
   "type": "text",
   "x": 1122.4375,
   "y": 1381.25,
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
   "seed": 47551916,
   "version": 1,
   "versionNonce": 1551840921,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "partner",
   "originalText": "partner",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "IZeWSmmG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NPJ9Vbw9",
   "type": "arrow",
   "x": 1364.0,
   "y": 1390.0,
   "width": 172.0,
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
   "seed": 642176340,
   "version": 1,
   "versionNonce": 1609306076,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aEYSuA8J"
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
     172.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "GAffQM8L",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "C9Bxom25",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "aEYSuA8J",
   "type": "text",
   "x": 1422.4375,
   "y": 1381.25,
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
   "seed": 2044780998,
   "version": 1,
   "versionNonce": 158842918,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "partner",
   "originalText": "partner",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NPJ9Vbw9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "u5FECfEJ",
   "type": "arrow",
   "x": 70.0,
   "y": 1424.0,
   "width": 0.0,
   "height": 172.0,
   "angle": 0,
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
   "seed": 418707038,
   "version": 1,
   "versionNonce": 1321279733,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jRuw8ZDq"
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
     0.0,
     172.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Qs5o9SNn",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "bUETUAkj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jRuw8ZDq",
   "type": "text",
   "x": 30.625,
   "y": 1501.25,
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
   "seed": 1305037875,
   "version": 1,
   "versionNonce": 2075342440,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "restaurant",
   "originalText": "restaurant",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "u5FECfEJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7Kk1OF3B",
   "type": "arrow",
   "x": 106.28439838970573,
   "y": 1419.6322586849265,
   "width": 223.59040205146457,
   "height": 182.59882834202926,
   "angle": 0,
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
   "seed": 1218714464,
   "version": 1,
   "versionNonce": 811223942,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ugmNWCK1"
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
     223.59040205146457,
     182.59882834202926
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Qs5o9SNn",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lHQUU9gP",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ugmNWCK1",
   "type": "text",
   "x": 186.579599415438,
   "y": 1502.181672855941,
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
   "seed": 308314114,
   "version": 1,
   "versionNonce": 947432946,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "customer",
   "originalText": "customer",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "7Kk1OF3B",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "88WQfSxY",
   "type": "arrow",
   "x": 370.0,
   "y": 1424.0,
   "width": 0.0,
   "height": 172.0,
   "angle": 0,
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
   "seed": 2100846772,
   "version": 1,
   "versionNonce": 638573358,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cfNeXfBy"
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
     0.0,
     172.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Iq4SK4HG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lHQUU9gP",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "cfNeXfBy",
   "type": "text",
   "x": 338.5,
   "y": 1501.25,
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
   "seed": 12889286,
   "version": 1,
   "versionNonce": 1690074191,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "customer",
   "originalText": "customer",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "88WQfSxY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "E9rVnUxX",
   "type": "arrow",
   "x": 694.2947892639469,
   "y": 1423.942689344096,
   "width": 21.770516858502106,
   "height": 172.05731065590408,
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
   "seed": 1844082896,
   "version": 1,
   "versionNonce": 1494625184,
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
     21.770516858502106,
     172.05731065590408
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "MxjbE5tD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "J5lkRJSC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": null,
   "elbowed": false
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