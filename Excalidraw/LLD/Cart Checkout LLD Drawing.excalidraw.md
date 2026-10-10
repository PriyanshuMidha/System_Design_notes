---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^b6JdNUoA

2. Core flow: Checkout (a small saga) ^AHYHbq2m

3. State machine: Reservation ^Elpps1Ra

4. Storage ^n2eoxsTa

EXPIRED gives stock back like RELEASED.
TTL must be longer than the payment timeout. ^1KGbKecf

CheckoutService (facade)
- idem map[user|key]*entry
- usage map[user|code]int
+ Checkout(ctx, key, cart, code) ^fqCqng3c

Cart
- UserID
- Items []Item
  {SKU, Qty, UnitPrice paise} ^gRBdMkTT

Coupon
- Code, ExpiresAt
- MinCart, PerUserLimit
- Rule DiscountStrategy ^awgBmE9K

Order
- ID, UserID
- Subtotal, Discount, Total
- PaymentID, ReservationID ^NQGiWyzL

<<interface>>
Catalog
+ Price(sku) (int64, bool) ^BJg5T9ov

<<interface>>
Validator (chain)
expiry -> min cart -> usage ^q4i4XHrE

<<interface>>
DiscountStrategy
+ Discount(cart) int64 ^LoxfbUK6

<<interface>>
OrderRepository
+ Save(order) error ^Mw2Vk6VR

<<interface>>
Inventory
+ Reserve(items) Reservation
+ Commit(id), Release(id) ^7HrG5tVv

<<interface>>
PaymentGateway
+ Charge(user, amt, idemKey)
+ Refund(paymentID) ^YLJG6hXm

FlatOff | PercentOff | BOGO ^vQyhTDQf

Reservation
- ID, Items, ExpiresAt ^FTpNVozN

Razorpay / UPI SDK ^5MlEQLkh

Client
Idempotency-Key ^HXejZTzG

1. reprice
vs catalog ^cqSK7SWr

2. idempotency check
coupon chain + consume
(under lock) ^93FHTDRe

3. Reserve stock
all-or-nothing, TTL ^JwKiBJ7T

ErrPriceChanged
show new total, no side effects ^11EVs5xC

ErrOutOfStock
undo coupon, free key ^eUzSs2gS

4. Charge
with idem key ^Pi9sGcaM

5. Commit hold
Save order, retry 3x ^oZQx3B2x

Order placed
store under key ^czpJyE1Z

ErrPaymentFailed
Release stock, undo coupon ^YvAOcJTv

Refund + Release + undo coupon
ErrOrderSaveFailed ^y5ZZwyQH

refund fails too:
ErrNeedsReconcile
keep key + stock, ops fix ^qzxydb6c

HELD ^aKCJHC99

COMMITTED ^50nQTV73

RELEASED ^K59ETUAP

EXPIRED ^WM1Mm1CI

inventory
 sku PK
 available INT CHECK >= 0
 reserved INT ^ERyPAAku

reservations
 id PK, user_id
 status, expires_at
 INDEX (status, expires_at) ^sXBkPaol

coupon_usage
 PK (user_id, code)
 used INT ^robKnyyM

orders
 id PK, status, totals
 payment_id UNIQUE
 UNIQUE (user_id, idempotency_key) ^tqHCAW0z

prices ^0kmhwm24

0..1 coupon ^aphVeQoI

uses ^4kKGTfgZ

uses ^UFodAUVp

uses ^n8Bfxg2d

uses ^p5cKrQz8

has 1 ^IR09JRTk

implements ^beYkmr1b

saved by ^ELqlEXYD

creates ^qmE26Nic

adapted to ^yP3aoaxX

same ^9MScb8lS

changed ^TO6EtMgt

fail ^zxjkQHtb

held ^p6TOAjpf

fail ^Ogge0v8d

paid ^pXjf6u7C

ok ^stdUuf8f

fail ^h9kdwL9h

refund error ^VqYAyVCY

payment ok ^k9ut81vi

payment failed ^emXZr6Py

TTL sweeper ^wGVKCy3Z

order save failed ^gBD5ZbqB

held qty ^U2zexl1T

same tx ^DJNdRWz5

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "b6JdNUoA",
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
   "seed": 1589751730,
   "version": 1,
   "versionNonce": 24081585,
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
   "id": "AHYHbq2m",
   "type": "text",
   "x": 0,
   "y": 860,
   "width": 582.75,
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
   "seed": 464133455,
   "version": 1,
   "versionNonce": 613842453,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: Checkout (a small saga)",
   "originalText": "2. Core flow: Checkout (a small saga)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Elpps1Ra",
   "type": "text",
   "x": 0,
   "y": 1720,
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
   "seed": 1344369157,
   "version": 1,
   "versionNonce": 1151205071,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machine: Reservation",
   "originalText": "3. State machine: Reservation",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "n2eoxsTa",
   "type": "text",
   "x": 0,
   "y": 2100,
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
   "seed": 1008119883,
   "version": 1,
   "versionNonce": 1752997689,
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
   "id": "1KGbKecf",
   "type": "text",
   "x": 720,
   "y": 1840,
   "width": 396.0,
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
   "seed": 1495377854,
   "version": 1,
   "versionNonce": 844144367,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "EXPIRED gives stock back like RELEASED.\nTTL must be longer than the payment timeout.",
   "originalText": "EXPIRED gives stock back like RELEASED.\nTTL must be longer than the payment timeout.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jDESIuCE",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 328.0,
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
   "seed": 532904114,
   "version": 1,
   "versionNonce": 1229028142,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "fqCqng3c"
    },
    {
     "type": "arrow",
     "id": "NFDwp2c8"
    },
    {
     "type": "arrow",
     "id": "XZjhrvRr"
    },
    {
     "type": "arrow",
     "id": "CWIyvGfL"
    },
    {
     "type": "arrow",
     "id": "14GiAlod"
    },
    {
     "type": "arrow",
     "id": "7ycPBWjF"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "fqCqng3c",
   "type": "text",
   "x": 12,
   "y": 75.0,
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
   "seed": 1447534331,
   "version": 1,
   "versionNonce": 1471993131,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "CheckoutService (facade)\n- idem map[user|key]*entry\n- usage map[user|code]int\n+ Checkout(ctx, key, cart, code)",
   "originalText": "CheckoutService (facade)\n- idem map[user|key]*entry\n- usage map[user|code]int\n+ Checkout(ctx, key, cart, code)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "jDESIuCE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1mqPvvQM",
   "type": "rectangle",
   "x": 440,
   "y": 60,
   "width": 301.0,
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
   "seed": 323242474,
   "version": 1,
   "versionNonce": 1158241880,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gRBdMkTT"
    },
    {
     "type": "arrow",
     "id": "NFDwp2c8"
    },
    {
     "type": "arrow",
     "id": "0nUDZpoJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gRBdMkTT",
   "type": "text",
   "x": 452,
   "y": 75.0,
   "width": 261.0,
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
   "seed": 1180831629,
   "version": 1,
   "versionNonce": 2070243113,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Cart\n- UserID\n- Items []Item\n  {SKU, Qty, UnitPrice paise}",
   "originalText": "Cart\n- UserID\n- Items []Item\n  {SKU, Qty, UnitPrice paise}",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "1mqPvvQM",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TxLjB7Wy",
   "type": "rectangle",
   "x": 840,
   "y": 60,
   "width": 247.0,
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
   "seed": 2011711256,
   "version": 1,
   "versionNonce": 480852751,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "awgBmE9K"
    },
    {
     "type": "arrow",
     "id": "0nUDZpoJ"
    },
    {
     "type": "arrow",
     "id": "rbpWRTnk"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "awgBmE9K",
   "type": "text",
   "x": 852,
   "y": 75.0,
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
   "seed": 1058419051,
   "version": 1,
   "versionNonce": 575359844,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Coupon\n- Code, ExpiresAt\n- MinCart, PerUserLimit\n- Rule DiscountStrategy",
   "originalText": "Coupon\n- Code, ExpiresAt\n- MinCart, PerUserLimit\n- Rule DiscountStrategy",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "TxLjB7Wy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zpnhT5XG",
   "type": "rectangle",
   "x": 1260,
   "y": 60,
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
   "seed": 1231021865,
   "version": 1,
   "versionNonce": 1495239635,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NQGiWyzL"
    },
    {
     "type": "arrow",
     "id": "lAEaISuW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NQGiWyzL",
   "type": "text",
   "x": 1272,
   "y": 75.0,
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
   "seed": 340741908,
   "version": 1,
   "versionNonce": 405077192,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order\n- ID, UserID\n- Subtotal, Discount, Total\n- PaymentID, ReservationID",
   "originalText": "Order\n- ID, UserID\n- Subtotal, Discount, Total\n- PaymentID, ReservationID",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zpnhT5XG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aAwJ77o9",
   "type": "rectangle",
   "x": 0,
   "y": 300,
   "width": 274.0,
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
   "seed": 1141997450,
   "version": 1,
   "versionNonce": 1091994120,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BJg5T9ov"
    },
    {
     "type": "arrow",
     "id": "XZjhrvRr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "BJg5T9ov",
   "type": "text",
   "x": 12,
   "y": 315.0,
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
   "seed": 482086123,
   "version": 1,
   "versionNonce": 799238252,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nCatalog\n+ Price(sku) (int64, bool)",
   "originalText": "<<interface>>\nCatalog\n+ Price(sku) (int64, bool)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "aAwJ77o9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Hu13sdFd",
   "type": "rectangle",
   "x": 440,
   "y": 300,
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
   "seed": 1596590771,
   "version": 1,
   "versionNonce": 1407325634,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "q4i4XHrE"
    },
    {
     "type": "arrow",
     "id": "CWIyvGfL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "q4i4XHrE",
   "type": "text",
   "x": 452,
   "y": 315.0,
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
   "seed": 1961941934,
   "version": 1,
   "versionNonce": 1865938180,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nValidator (chain)\nexpiry -> min cart -> usage",
   "originalText": "<<interface>>\nValidator (chain)\nexpiry -> min cart -> usage",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Hu13sdFd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ypBDzslQ",
   "type": "rectangle",
   "x": 840,
   "y": 300,
   "width": 238.0,
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
   "seed": 2049357475,
   "version": 1,
   "versionNonce": 226791861,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LoxfbUK6"
    },
    {
     "type": "arrow",
     "id": "rbpWRTnk"
    },
    {
     "type": "arrow",
     "id": "8blR3IxL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "LoxfbUK6",
   "type": "text",
   "x": 852,
   "y": 315.0,
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
   "seed": 673861505,
   "version": 1,
   "versionNonce": 2060924052,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nDiscountStrategy\n+ Discount(cart) int64",
   "originalText": "<<interface>>\nDiscountStrategy\n+ Discount(cart) int64",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ypBDzslQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wm6R9rI6",
   "type": "rectangle",
   "x": 1260,
   "y": 300,
   "width": 211.0,
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
   "seed": 1222986786,
   "version": 1,
   "versionNonce": 315282007,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Mw2Vk6VR"
    },
    {
     "type": "arrow",
     "id": "lAEaISuW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Mw2Vk6VR",
   "type": "text",
   "x": 1272,
   "y": 315.0,
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
   "seed": 335964019,
   "version": 1,
   "versionNonce": 1512599297,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nOrderRepository\n+ Save(order) error",
   "originalText": "<<interface>>\nOrderRepository\n+ Save(order) error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "wm6R9rI6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5c7zS9Qy",
   "type": "rectangle",
   "x": 0,
   "y": 520,
   "width": 292.0,
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
   "seed": 907750707,
   "version": 1,
   "versionNonce": 1852684838,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7HrG5tVv"
    },
    {
     "type": "arrow",
     "id": "14GiAlod"
    },
    {
     "type": "arrow",
     "id": "pg8LN0ky"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7HrG5tVv",
   "type": "text",
   "x": 12,
   "y": 535.0,
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
   "seed": 677954885,
   "version": 1,
   "versionNonce": 37844155,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nInventory\n+ Reserve(items) Reservation\n+ Commit(id), Release(id)",
   "originalText": "<<interface>>\nInventory\n+ Reserve(items) Reservation\n+ Commit(id), Release(id)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5c7zS9Qy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jWKSQNk7",
   "type": "rectangle",
   "x": 440,
   "y": 520,
   "width": 292.0,
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
   "seed": 1009508260,
   "version": 1,
   "versionNonce": 1337058204,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YLJG6hXm"
    },
    {
     "type": "arrow",
     "id": "7ycPBWjF"
    },
    {
     "type": "arrow",
     "id": "FJxo4rPj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "YLJG6hXm",
   "type": "text",
   "x": 452,
   "y": 535.0,
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
   "seed": 451203150,
   "version": 1,
   "versionNonce": 1670571763,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nPaymentGateway\n+ Charge(user, amt, idemKey)\n+ Refund(paymentID)",
   "originalText": "<<interface>>\nPaymentGateway\n+ Charge(user, amt, idemKey)\n+ Refund(paymentID)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "jWKSQNk7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wmBn8G6c",
   "type": "rectangle",
   "x": 840,
   "y": 520,
   "width": 283.0,
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
   "seed": 648303255,
   "version": 1,
   "versionNonce": 418272853,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vQyhTDQf"
    },
    {
     "type": "arrow",
     "id": "8blR3IxL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vQyhTDQf",
   "type": "text",
   "x": 860.0,
   "y": 540.0,
   "width": 243.0,
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
   "seed": 1611978969,
   "version": 1,
   "versionNonce": 35762741,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "FlatOff | PercentOff | BOGO",
   "originalText": "FlatOff | PercentOff | BOGO",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "wmBn8G6c",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "oUsqcsvd",
   "type": "rectangle",
   "x": 0,
   "y": 720,
   "width": 238.0,
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
   "seed": 1747439509,
   "version": 1,
   "versionNonce": 1943853202,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FTpNVozN"
    },
    {
     "type": "arrow",
     "id": "pg8LN0ky"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "FTpNVozN",
   "type": "text",
   "x": 12,
   "y": 735.0,
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
   "seed": 1145224818,
   "version": 1,
   "versionNonce": 1357907299,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Reservation\n- ID, Items, ExpiresAt",
   "originalText": "Reservation\n- ID, Items, ExpiresAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "oUsqcsvd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "H4CYSyFI",
   "type": "rectangle",
   "x": 440,
   "y": 720,
   "width": 202.0,
   "height": 60,
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
   "seed": 1976557546,
   "version": 1,
   "versionNonce": 557094089,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5MlEQLkh"
    },
    {
     "type": "arrow",
     "id": "FJxo4rPj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5MlEQLkh",
   "type": "text",
   "x": 460.0,
   "y": 740.0,
   "width": 162.0,
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
   "seed": 1927973848,
   "version": 1,
   "versionNonce": 1755633986,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Razorpay / UPI SDK",
   "originalText": "Razorpay / UPI SDK",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "H4CYSyFI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OPd6YFeq",
   "type": "rectangle",
   "x": 0,
   "y": 920,
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
   "seed": 389325420,
   "version": 1,
   "versionNonce": 180229978,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HXejZTzG"
    },
    {
     "type": "arrow",
     "id": "U8JAvNz0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "HXejZTzG",
   "type": "text",
   "x": 12,
   "y": 935.0,
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
   "seed": 1206058621,
   "version": 1,
   "versionNonce": 1686252160,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Client\nIdempotency-Key",
   "originalText": "Client\nIdempotency-Key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "OPd6YFeq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FSf1zDte",
   "type": "rectangle",
   "x": 260,
   "y": 920,
   "width": 140,
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
   "seed": 960738613,
   "version": 1,
   "versionNonce": 1522995026,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cqSK7SWr"
    },
    {
     "type": "arrow",
     "id": "U8JAvNz0"
    },
    {
     "type": "arrow",
     "id": "T3AGo8Rv"
    },
    {
     "type": "arrow",
     "id": "4E3Yaaee"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "cqSK7SWr",
   "type": "text",
   "x": 272,
   "y": 935.0,
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
   "seed": 1988652143,
   "version": 1,
   "versionNonce": 618573982,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1. reprice\nvs catalog",
   "originalText": "1. reprice\nvs catalog",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "FSf1zDte",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "APPJfYdO",
   "type": "rectangle",
   "x": 530,
   "y": 920,
   "width": 238.0,
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
   "seed": 981805521,
   "version": 1,
   "versionNonce": 1258332789,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "93FHTDRe"
    },
    {
     "type": "arrow",
     "id": "T3AGo8Rv"
    },
    {
     "type": "arrow",
     "id": "dUh6EoaP"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "93FHTDRe",
   "type": "text",
   "x": 542,
   "y": 935.0,
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
   "seed": 1989320803,
   "version": 1,
   "versionNonce": 5630648,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. idempotency check\ncoupon chain + consume\n(under lock)",
   "originalText": "2. idempotency check\ncoupon chain + consume\n(under lock)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "APPJfYdO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zfYpqmPd",
   "type": "rectangle",
   "x": 900,
   "y": 920,
   "width": 211.0,
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
   "seed": 579673793,
   "version": 1,
   "versionNonce": 303214200,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JwKiBJ7T"
    },
    {
     "type": "arrow",
     "id": "dUh6EoaP"
    },
    {
     "type": "arrow",
     "id": "1eBcqeYi"
    },
    {
     "type": "arrow",
     "id": "DoyReAkb"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "JwKiBJ7T",
   "type": "text",
   "x": 912,
   "y": 935.0,
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
   "seed": 1424788174,
   "version": 1,
   "versionNonce": 1245721540,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Reserve stock\nall-or-nothing, TTL",
   "originalText": "3. Reserve stock\nall-or-nothing, TTL",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zfYpqmPd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Xc9JIaQp",
   "type": "rectangle",
   "x": 200,
   "y": 1100,
   "width": 319.0,
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
   "seed": 1624127495,
   "version": 1,
   "versionNonce": 217872325,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "11EVs5xC"
    },
    {
     "type": "arrow",
     "id": "4E3Yaaee"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "11EVs5xC",
   "type": "text",
   "x": 212,
   "y": 1115.0,
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
   "seed": 362427298,
   "version": 1,
   "versionNonce": 1727958100,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrPriceChanged\nshow new total, no side effects",
   "originalText": "ErrPriceChanged\nshow new total, no side effects",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Xc9JIaQp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iK9rLPF8",
   "type": "rectangle",
   "x": 1240,
   "y": 920,
   "width": 229.0,
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
   "seed": 1224819468,
   "version": 1,
   "versionNonce": 2100173037,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "eUzSs2gS"
    },
    {
     "type": "arrow",
     "id": "1eBcqeYi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "eUzSs2gS",
   "type": "text",
   "x": 1252,
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
   "seed": 872331769,
   "version": 1,
   "versionNonce": 1304901459,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrOutOfStock\nundo coupon, free key",
   "originalText": "ErrOutOfStock\nundo coupon, free key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "iK9rLPF8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KQMc06aJ",
   "type": "rectangle",
   "x": 900,
   "y": 1270,
   "width": 157.0,
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
   "seed": 1197258309,
   "version": 1,
   "versionNonce": 1025797846,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Pi9sGcaM"
    },
    {
     "type": "arrow",
     "id": "DoyReAkb"
    },
    {
     "type": "arrow",
     "id": "QLeobhTr"
    },
    {
     "type": "arrow",
     "id": "sgubnLHI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Pi9sGcaM",
   "type": "text",
   "x": 912,
   "y": 1285.0,
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
   "seed": 2001730288,
   "version": 1,
   "versionNonce": 336031831,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Charge\nwith idem key",
   "originalText": "4. Charge\nwith idem key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KQMc06aJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nIXBLZqI",
   "type": "rectangle",
   "x": 500,
   "y": 1270,
   "width": 220.0,
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
   "seed": 247586566,
   "version": 1,
   "versionNonce": 566025160,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oZQx3B2x"
    },
    {
     "type": "arrow",
     "id": "sgubnLHI"
    },
    {
     "type": "arrow",
     "id": "qPDbT8w9"
    },
    {
     "type": "arrow",
     "id": "eqYJJiYo"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "oZQx3B2x",
   "type": "text",
   "x": 512,
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
   "seed": 887337689,
   "version": 1,
   "versionNonce": 611546789,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "5. Commit hold\nSave order, retry 3x",
   "originalText": "5. Commit hold\nSave order, retry 3x",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "nIXBLZqI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "COmwVEjJ",
   "type": "rectangle",
   "x": 120,
   "y": 1270,
   "width": 175.0,
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
   "seed": 1234324191,
   "version": 1,
   "versionNonce": 367733277,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "czpJyE1Z"
    },
    {
     "type": "arrow",
     "id": "qPDbT8w9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "czpJyE1Z",
   "type": "text",
   "x": 132,
   "y": 1285.0,
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
   "seed": 2050832644,
   "version": 1,
   "versionNonce": 260759110,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order placed\nstore under key",
   "originalText": "Order placed\nstore under key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "COmwVEjJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Tvm3xvx0",
   "type": "rectangle",
   "x": 1240,
   "y": 1270,
   "width": 274.0,
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
   "seed": 1045772672,
   "version": 1,
   "versionNonce": 1900570759,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YvAOcJTv"
    },
    {
     "type": "arrow",
     "id": "QLeobhTr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "YvAOcJTv",
   "type": "text",
   "x": 1252,
   "y": 1285.0,
   "width": 234.0,
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
   "seed": 1414002064,
   "version": 1,
   "versionNonce": 2058212108,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrPaymentFailed\nRelease stock, undo coupon",
   "originalText": "ErrPaymentFailed\nRelease stock, undo coupon",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Tvm3xvx0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cNT3HvTZ",
   "type": "rectangle",
   "x": 500,
   "y": 1440,
   "width": 310.0,
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
   "seed": 755170686,
   "version": 1,
   "versionNonce": 1110177243,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "y5ZZwyQH"
    },
    {
     "type": "arrow",
     "id": "eqYJJiYo"
    },
    {
     "type": "arrow",
     "id": "qV9lfAzE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "y5ZZwyQH",
   "type": "text",
   "x": 512,
   "y": 1455.0,
   "width": 270.0,
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
   "seed": 1427009028,
   "version": 1,
   "versionNonce": 1853784863,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Refund + Release + undo coupon\nErrOrderSaveFailed",
   "originalText": "Refund + Release + undo coupon\nErrOrderSaveFailed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "cNT3HvTZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "J48gpWTN",
   "type": "rectangle",
   "x": 980,
   "y": 1440,
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
   "seed": 238869409,
   "version": 1,
   "versionNonce": 661700970,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qzxydb6c"
    },
    {
     "type": "arrow",
     "id": "qV9lfAzE"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "qzxydb6c",
   "type": "text",
   "x": 992,
   "y": 1455.0,
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
   "seed": 1454207875,
   "version": 1,
   "versionNonce": 1944756972,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "refund fails too:\nErrNeedsReconcile\nkeep key + stock, ops fix",
   "originalText": "refund fails too:\nErrNeedsReconcile\nkeep key + stock, ops fix",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "J48gpWTN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "G4wbBVoD",
   "type": "ellipse",
   "x": 0,
   "y": 1800,
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
   "seed": 825896691,
   "version": 1,
   "versionNonce": 902053088,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aKCJHC99"
    },
    {
     "type": "arrow",
     "id": "ineZCSeV"
    },
    {
     "type": "arrow",
     "id": "q4OVxwGt"
    },
    {
     "type": "arrow",
     "id": "ytO5RQa5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "aKCJHC99",
   "type": "text",
   "x": 52.0,
   "y": 1820.0,
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
   "seed": 76555624,
   "version": 1,
   "versionNonce": 767856709,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "HELD",
   "originalText": "HELD",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "G4wbBVoD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Vjv1FUN1",
   "type": "ellipse",
   "x": 400,
   "y": 1800,
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
   "seed": 1564459041,
   "version": 1,
   "versionNonce": 635943005,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "50nQTV73"
    },
    {
     "type": "arrow",
     "id": "ineZCSeV"
    },
    {
     "type": "arrow",
     "id": "tmDDRGsf"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "50nQTV73",
   "type": "text",
   "x": 429.5,
   "y": 1820.0,
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
   "seed": 504882698,
   "version": 1,
   "versionNonce": 1620210768,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "COMMITTED",
   "originalText": "COMMITTED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Vjv1FUN1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Tmf7zYqJ",
   "type": "ellipse",
   "x": 400,
   "y": 1960,
   "width": 140,
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
   "seed": 1758784999,
   "version": 1,
   "versionNonce": 856149617,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "K59ETUAP"
    },
    {
     "type": "arrow",
     "id": "q4OVxwGt"
    },
    {
     "type": "arrow",
     "id": "tmDDRGsf"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "K59ETUAP",
   "type": "text",
   "x": 434.0,
   "y": 1980.0,
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
   "seed": 840695144,
   "version": 1,
   "versionNonce": 338643466,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "RELEASED",
   "originalText": "RELEASED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Tmf7zYqJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MQCG6pZx",
   "type": "ellipse",
   "x": 0,
   "y": 1960,
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
   "seed": 1648249279,
   "version": 1,
   "versionNonce": 1971851162,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WM1Mm1CI"
    },
    {
     "type": "arrow",
     "id": "ytO5RQa5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "WM1Mm1CI",
   "type": "text",
   "x": 38.5,
   "y": 1980.0,
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
   "seed": 1671564677,
   "version": 1,
   "versionNonce": 1798217374,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "EXPIRED",
   "originalText": "EXPIRED",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "MQCG6pZx",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AVkllwFc",
   "type": "rectangle",
   "x": 0,
   "y": 2160,
   "width": 265.0,
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
   "seed": 927815316,
   "version": 1,
   "versionNonce": 12624864,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ERyPAAku"
    },
    {
     "type": "arrow",
     "id": "OvTbwtjH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ERyPAAku",
   "type": "text",
   "x": 12,
   "y": 2175.0,
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
   "seed": 571999528,
   "version": 1,
   "versionNonce": 1621156340,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "inventory\n sku PK\n available INT CHECK >= 0\n reserved INT",
   "originalText": "inventory\n sku PK\n available INT CHECK >= 0\n reserved INT",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "AVkllwFc",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MLPOlE6k",
   "type": "rectangle",
   "x": 360,
   "y": 2160,
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
   "seed": 1445076299,
   "version": 1,
   "versionNonce": 1899047835,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sXBkPaol"
    },
    {
     "type": "arrow",
     "id": "OvTbwtjH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "sXBkPaol",
   "type": "text",
   "x": 372,
   "y": 2175.0,
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
   "seed": 299732744,
   "version": 1,
   "versionNonce": 840416946,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "reservations\n id PK, user_id\n status, expires_at\n INDEX (status, expires_at)",
   "originalText": "reservations\n id PK, user_id\n status, expires_at\n INDEX (status, expires_at)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "MLPOlE6k",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JUfPf3bT",
   "type": "rectangle",
   "x": 740,
   "y": 2160,
   "width": 211.0,
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
   "seed": 1808574517,
   "version": 1,
   "versionNonce": 614914942,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "robKnyyM"
    },
    {
     "type": "arrow",
     "id": "4ZwNvhZJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "robKnyyM",
   "type": "text",
   "x": 752,
   "y": 2175.0,
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
   "seed": 2103661196,
   "version": 1,
   "versionNonce": 1665677235,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "coupon_usage\n PK (user_id, code)\n used INT",
   "originalText": "coupon_usage\n PK (user_id, code)\n used INT",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "JUfPf3bT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ND8NQTha",
   "type": "rectangle",
   "x": 1060,
   "y": 2160,
   "width": 346.0,
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
   "seed": 2070134680,
   "version": 1,
   "versionNonce": 1931295002,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tqHCAW0z"
    },
    {
     "type": "arrow",
     "id": "4ZwNvhZJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "tqHCAW0z",
   "type": "text",
   "x": 1072,
   "y": 2175.0,
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
   "seed": 847242912,
   "version": 1,
   "versionNonce": 1285634942,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "orders\n id PK, status, totals\n payment_id UNIQUE\n UNIQUE (user_id, idempotency_key)",
   "originalText": "orders\n id PK, status, totals\n payment_id UNIQUE\n UNIQUE (user_id, idempotency_key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ND8NQTha",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NFDwp2c8",
   "type": "arrow",
   "x": 332.0,
   "y": 115.0,
   "width": 104.0,
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
   "seed": 524626550,
   "version": 1,
   "versionNonce": 1771759088,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0kmhwm24"
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
     104.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jDESIuCE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1mqPvvQM",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0kmhwm24",
   "type": "text",
   "x": 360.375,
   "y": 106.25,
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
   "seed": 748416998,
   "version": 1,
   "versionNonce": 1163663488,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "prices",
   "originalText": "prices",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NFDwp2c8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "0nUDZpoJ",
   "type": "arrow",
   "x": 745.0,
   "y": 115.0,
   "width": 91.0,
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
   "seed": 1306118173,
   "version": 1,
   "versionNonce": 1312278281,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aphVeQoI"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "1mqPvvQM",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "TxLjB7Wy",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "aphVeQoI",
   "type": "text",
   "x": 747.1875,
   "y": 106.25,
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
   "seed": 1746784651,
   "version": 1,
   "versionNonce": 114607290,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "0..1 coupon",
   "originalText": "0..1 coupon",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "0nUDZpoJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XZjhrvRr",
   "type": "arrow",
   "x": 157.07391304347826,
   "y": 174.0,
   "width": 14.321739130434793,
   "height": 122.0,
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
   "seed": 1603001648,
   "version": 1,
   "versionNonce": 1757277017,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4kKGTfgZ"
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
     -14.321739130434793,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jDESIuCE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "aAwJ77o9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "4kKGTfgZ",
   "type": "text",
   "x": 134.16304347826087,
   "y": 226.25,
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
   "seed": 1077353660,
   "version": 1,
   "versionNonce": 2060519259,
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
   "containerId": "XZjhrvRr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "CWIyvGfL",
   "type": "arrow",
   "x": 271.0978260869565,
   "y": 174.0,
   "width": 221.45652173913044,
   "height": 122.0,
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
   "seed": 1234854019,
   "version": 1,
   "versionNonce": 1932805402,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UFodAUVp"
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
     221.45652173913044,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jDESIuCE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Hu13sdFd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "UFodAUVp",
   "type": "text",
   "x": 366.07608695652175,
   "y": 226.25,
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
   "seed": 1026225782,
   "version": 1,
   "versionNonce": 1635925839,
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
   "containerId": "CWIyvGfL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "14GiAlod",
   "type": "arrow",
   "x": 161.69130434782608,
   "y": 174.0,
   "width": 13.382608695652152,
   "height": 342.0,
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
   "seed": 1517993296,
   "version": 1,
   "versionNonce": 700184698,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "n8Bfxg2d"
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
     -13.382608695652152,
     342.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jDESIuCE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5c7zS9Qy",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "n8Bfxg2d",
   "type": "text",
   "x": 139.25,
   "y": 336.25,
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
   "seed": 725077574,
   "version": 1,
   "versionNonce": 1437577219,
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
   "containerId": "14GiAlod",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7ycPBWjF",
   "type": "arrow",
   "x": 218.12608695652176,
   "y": 174.0,
   "width": 313.74782608695654,
   "height": 342.0,
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
   "seed": 439303625,
   "version": 1,
   "versionNonce": 1714188313,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "p5cKrQz8"
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
     313.74782608695654,
     342.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jDESIuCE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "jWKSQNk7",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "p5cKrQz8",
   "type": "text",
   "x": 359.25,
   "y": 336.25,
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
   "seed": 965366966,
   "version": 1,
   "versionNonce": 692810,
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
   "containerId": "7ycPBWjF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rbpWRTnk",
   "type": "arrow",
   "x": 962.3456521739131,
   "y": 174.0,
   "width": 2.3869565217391937,
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
   "seed": 1577430469,
   "version": 1,
   "versionNonce": 908583890,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IR09JRTk"
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
     -2.3869565217391937,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "TxLjB7Wy",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ypBDzslQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "IR09JRTk",
   "type": "text",
   "x": 941.4646739130435,
   "y": 226.25,
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
   "seed": 262298643,
   "version": 1,
   "versionNonce": 1580716773,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "has 1",
   "originalText": "has 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "rbpWRTnk",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8blR3IxL",
   "type": "arrow",
   "x": 977.7682926829268,
   "y": 516.0,
   "width": 13.39024390243901,
   "height": 122.0,
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
   "seed": 834991010,
   "version": 1,
   "versionNonce": 2039360659,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "beYkmr1b"
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
     -13.39024390243901,
     -122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "wmBn8G6c",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ypBDzslQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "beYkmr1b",
   "type": "text",
   "x": 931.6981707317073,
   "y": 446.25,
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
   "seed": 1402174044,
   "version": 1,
   "versionNonce": 576857559,
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
   "containerId": "8blR3IxL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lAEaISuW",
   "type": "arrow",
   "x": 1392.2652173913043,
   "y": 174.0,
   "width": 19.095652173913095,
   "height": 122.0,
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
   "seed": 341707301,
   "version": 1,
   "versionNonce": 1843852377,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ELqlEXYD"
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
     -19.095652173913095,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "zpnhT5XG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wm6R9rI6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ELqlEXYD",
   "type": "text",
   "x": 1351.2173913043478,
   "y": 226.25,
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
   "seed": 83297613,
   "version": 1,
   "versionNonce": 451026765,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "saved by",
   "originalText": "saved by",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "lAEaISuW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pg8LN0ky",
   "type": "arrow",
   "x": 137.15,
   "y": 634.0,
   "width": 12.300000000000011,
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
   "seed": 2075800564,
   "version": 1,
   "versionNonce": 1043841053,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qmE26Nic"
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
     -12.300000000000011,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5c7zS9Qy",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "oUsqcsvd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "qmE26Nic",
   "type": "text",
   "x": 103.4375,
   "y": 666.25,
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
   "seed": 225834662,
   "version": 1,
   "versionNonce": 950919024,
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
   "containerId": "pg8LN0ky",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FJxo4rPj",
   "type": "arrow",
   "x": 549.7428571428571,
   "y": 716.0,
   "width": 21.08571428571429,
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
   "seed": 1377509786,
   "version": 1,
   "versionNonce": 362484505,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "yP3aoaxX"
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
     21.08571428571429,
     -82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "H4CYSyFI",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "jWKSQNk7",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "yP3aoaxX",
   "type": "text",
   "x": 520.9107142857142,
   "y": 666.25,
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
   "seed": 832363529,
   "version": 1,
   "versionNonce": 1910470654,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "adapted to",
   "originalText": "adapted to",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "FJxo4rPj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "U8JAvNz0",
   "type": "arrow",
   "x": 179.0,
   "y": 955.0,
   "width": 77.0,
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
   "seed": 1506911876,
   "version": 1,
   "versionNonce": 715524730,
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
     77.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "OPd6YFeq",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "FSf1zDte",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "T3AGo8Rv",
   "type": "arrow",
   "x": 404.0,
   "y": 957.3197492163009,
   "width": 122.0,
   "height": 3.8244514106582983,
   "angle": 0,
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
   "seed": 991970358,
   "version": 1,
   "versionNonce": 1228105940,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9MScb8lS"
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
     122.0,
     3.8244514106582983
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "FSf1zDte",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "APPJfYdO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "9MScb8lS",
   "type": "text",
   "x": 449.25,
   "y": 950.4819749216301,
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
   "seed": 556668580,
   "version": 1,
   "versionNonce": 1795519057,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "same",
   "originalText": "same",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "T3AGo8Rv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dUh6EoaP",
   "type": "arrow",
   "x": 772.0,
   "y": 961.5497896213184,
   "width": 124.0,
   "height": 3.478260869565247,
   "angle": 0,
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
   "seed": 180787658,
   "version": 1,
   "versionNonce": 2101500194,
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
     124.0,
     -3.478260869565247
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "APPJfYdO",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "zfYpqmPd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "4E3Yaaee",
   "type": "arrow",
   "x": 336.39166666666665,
   "y": 994.0,
   "width": 16.716666666666697,
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
   "seed": 613840495,
   "version": 1,
   "versionNonce": 1740805551,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "TO6EtMgt"
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
     16.716666666666697,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "FSf1zDte",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Xc9JIaQp",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "TO6EtMgt",
   "type": "text",
   "x": 317.1875,
   "y": 1036.25,
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
   "seed": 197502763,
   "version": 1,
   "versionNonce": 447804573,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "changed",
   "originalText": "changed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "4E3Yaaee",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1eBcqeYi",
   "type": "arrow",
   "x": 1115.0,
   "y": 955.0,
   "width": 121.0,
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
   "seed": 2062886646,
   "version": 1,
   "versionNonce": 2069023328,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zxjkQHtb"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "zfYpqmPd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "iK9rLPF8",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "zxjkQHtb",
   "type": "text",
   "x": 1159.75,
   "y": 946.25,
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
   "seed": 227007534,
   "version": 1,
   "versionNonce": 1271642310,
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
   "containerId": "1eBcqeYi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DoyReAkb",
   "type": "arrow",
   "x": 1002.4914285714285,
   "y": 994.0,
   "width": 20.98285714285703,
   "height": 272.0,
   "angle": 0,
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
   "seed": 1523966697,
   "version": 1,
   "versionNonce": 2040181979,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "p6TOAjpf"
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
     -20.98285714285703,
     272.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "zfYpqmPd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "KQMc06aJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "p6TOAjpf",
   "type": "text",
   "x": 976.25,
   "y": 1121.25,
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
   "seed": 1698810496,
   "version": 1,
   "versionNonce": 1004900789,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "held",
   "originalText": "held",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "DoyReAkb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QLeobhTr",
   "type": "arrow",
   "x": 1061.0,
   "y": 1305.0,
   "width": 175.0,
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
   "seed": 1555505542,
   "version": 1,
   "versionNonce": 2071317156,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Ogge0v8d"
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
     175.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KQMc06aJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Tvm3xvx0",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Ogge0v8d",
   "type": "text",
   "x": 1132.75,
   "y": 1296.25,
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
   "seed": 2007833472,
   "version": 1,
   "versionNonce": 238465849,
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
   "containerId": "QLeobhTr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "sgubnLHI",
   "type": "arrow",
   "x": 896.0,
   "y": 1305.0,
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
   "seed": 366448016,
   "version": 1,
   "versionNonce": 898757932,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pXjf6u7C"
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
     -172.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KQMc06aJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "nIXBLZqI",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "pXjf6u7C",
   "type": "text",
   "x": 794.25,
   "y": 1296.25,
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
   "seed": 1821870775,
   "version": 1,
   "versionNonce": 67842492,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "paid",
   "originalText": "paid",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "sgubnLHI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qPDbT8w9",
   "type": "arrow",
   "x": 496.0,
   "y": 1305.0,
   "width": 197.0,
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
   "seed": 1190315796,
   "version": 1,
   "versionNonce": 748967030,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "stdUuf8f"
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
     -197.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "nIXBLZqI",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "COmwVEjJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "stdUuf8f",
   "type": "text",
   "x": 389.625,
   "y": 1296.25,
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
   "seed": 2076974041,
   "version": 1,
   "versionNonce": 1578620425,
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
   "containerId": "qPDbT8w9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eqYJJiYo",
   "type": "arrow",
   "x": 620.3235294117648,
   "y": 1344.0,
   "width": 24.352941176470495,
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
   "seed": 1926406439,
   "version": 1,
   "versionNonce": 469609060,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "h9kdwL9h"
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
     24.352941176470495,
     92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "nIXBLZqI",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "cNT3HvTZ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "h9kdwL9h",
   "type": "text",
   "x": 616.75,
   "y": 1381.25,
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
   "seed": 1727382832,
   "version": 1,
   "versionNonce": 1019852315,
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
   "containerId": "eqYJJiYo",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qV9lfAzE",
   "type": "arrow",
   "x": 814.0,
   "y": 1478.4754098360656,
   "width": 162.0,
   "height": 3.5409836065573472,
   "angle": 0,
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
   "seed": 1670972094,
   "version": 1,
   "versionNonce": 1000025278,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VqYAyVCY"
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
     162.0,
     3.5409836065573472
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "cNT3HvTZ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "J48gpWTN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "VqYAyVCY",
   "type": "text",
   "x": 847.75,
   "y": 1471.4959016393443,
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
   "seed": 955799660,
   "version": 1,
   "versionNonce": 1767223798,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "refund error",
   "originalText": "refund error",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "qV9lfAzE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ineZCSeV",
   "type": "arrow",
   "x": 144.0,
   "y": 1830.0,
   "width": 252.0,
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
   "seed": 939726153,
   "version": 1,
   "versionNonce": 1555462647,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "k9ut81vi"
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
     252.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "G4wbBVoD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Vjv1FUN1",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "k9ut81vi",
   "type": "text",
   "x": 230.625,
   "y": 1821.25,
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
   "seed": 774258366,
   "version": 1,
   "versionNonce": 1524077359,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "payment ok",
   "originalText": "payment ok",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ineZCSeV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "q4OVxwGt",
   "type": "arrow",
   "x": 125.81252714193838,
   "y": 1852.3250108567754,
   "width": 288.3749457161232,
   "height": 115.34997828644919,
   "angle": 0,
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
   "seed": 1826654864,
   "version": 1,
   "versionNonce": 802950530,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "emXZr6Py"
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
     288.3749457161232,
     115.34997828644919
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "G4wbBVoD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Tmf7zYqJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "emXZr6Py",
   "type": "text",
   "x": 214.875,
   "y": 1901.25,
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
   "seed": 1014634604,
   "version": 1,
   "versionNonce": 220281331,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "payment failed",
   "originalText": "payment failed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "q4OVxwGt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ytO5RQa5",
   "type": "arrow",
   "x": 70.0,
   "y": 1864.0,
   "width": 0.0,
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
   "seed": 627647000,
   "version": 1,
   "versionNonce": 149048940,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "wGVKCy3Z"
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
     92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "G4wbBVoD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "MQCG6pZx",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "wGVKCy3Z",
   "type": "text",
   "x": 26.6875,
   "y": 1901.25,
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
   "seed": 1431532562,
   "version": 1,
   "versionNonce": 1312000026,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "TTL sweeper",
   "originalText": "TTL sweeper",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ytO5RQa5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tmDDRGsf",
   "type": "arrow",
   "x": 470.0,
   "y": 1864.0,
   "width": 0.0,
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
   "seed": 1424972132,
   "version": 1,
   "versionNonce": 260697589,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gBD5ZbqB"
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
     92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Vjv1FUN1",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Tmf7zYqJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "gBD5ZbqB",
   "type": "text",
   "x": 403.0625,
   "y": 1901.25,
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
   "seed": 1174559904,
   "version": 1,
   "versionNonce": 1521387037,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "order save failed",
   "originalText": "order save failed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "tmDDRGsf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OvTbwtjH",
   "type": "arrow",
   "x": 269.0,
   "y": 2215.0,
   "width": 87.0,
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
   "seed": 107595324,
   "version": 1,
   "versionNonce": 360539031,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "U2zexl1T"
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
     87.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "AVkllwFc",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "MLPOlE6k",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "U2zexl1T",
   "type": "text",
   "x": 281.0,
   "y": 2206.25,
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
   "seed": 813256033,
   "version": 1,
   "versionNonce": 1642094031,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "held qty",
   "originalText": "held qty",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "OvTbwtjH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4ZwNvhZJ",
   "type": "arrow",
   "x": 955.0,
   "y": 2207.825806451613,
   "width": 101.0,
   "height": 2.606451612903129,
   "angle": 0,
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
   "seed": 367659845,
   "version": 1,
   "versionNonce": 1292388796,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DJNdRWz5"
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
     101.0,
     2.606451612903129
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "JUfPf3bT",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ND8NQTha",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DJNdRWz5",
   "type": "text",
   "x": 977.9375,
   "y": 2200.3790322580644,
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
   "seed": 1616338751,
   "version": 1,
   "versionNonce": 552337351,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "same tx",
   "originalText": "same tx",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "4ZwNvhZJ",
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