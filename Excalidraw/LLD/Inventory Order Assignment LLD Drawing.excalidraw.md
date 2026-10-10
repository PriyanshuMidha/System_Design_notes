---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^PR8nb28y

2. Core flow: PlaceOrder ^dEhhB2IR

3. State machine: Order ^JDaUlGzM

4. Storage ^DRF7YWo5

Service (Facade)
- selector, inv, orders, events
- now func(), holdFor
+ PlaceOrder(ctx, req) (Order, error)
+ ConfirmPayment / Cancel
+ ExpireHolds(ctx) ^qyVD4AnD

<<interface>>
StoreSelector
+ Select(ctx, customer,
  stores, items, inv) []Store ^ftw6cOz9

<<interface>>
InventoryRepository
+ HasAll(storeID, items)
+ Reserve(store, product, qty)
+ Release(store, product, qty) ^4fhWNz3I

<<interface>>
OrderRepository
+ ClaimKey(user, key)
+ Save(order)
+ CompareAndSetStatus(id, from, to) ^giahdnAC

<<interface>>
EventPublisher
+ Publish(ctx, e) ^7twAW5Fu

NearestWithFullStock
- MaxDistanceM 3000
+ Select: in range,
  HasAll, sort by distance ^KQKZi64l

Store
- ID, Loc
- Active bool ^YQ19hiqv

Order
- ID, UserID, StoreID
- TotalPaise int64
- Status OrderStatus
- CreatedAt ^vGztkCLx

OrderItem
- ProductID
- Qty
- PricePaise int64 ^dCtdOlbK

Customer app
POST /orders
Idempotency-Key ^cMyzleJ9

1. ClaimKey
(user, key) ^vMhKz281

2. Select stores
active, within 3 km,
full stock, nearest first ^5Zxc2ZA5

3. reserveAll(store, items)
conditional decrement
per item, product-id order ^AtYuOWCX

4. Save order
status = reserved
BindKey, publish ^oWpggcPU

201 reserved
pay within 10 min ^yLzT02sp

Key already used:
return same order
(or 409 in progress) ^Tgafc4fo

Item fails mid-way:
release reserved items,
try next store ^1J3ydg7w

No store left:
ErrNoStore, release key ^YVhiatmq

Reserved ^KmBYvBKn

Confirmed ^VA72JYW8

Packed ^jMTGIKb8

Cancelled
(stock released) ^NEbm3XhT

inventory
store_id, product_id
available_qty, reserved_qty
PK (store_id, product_id)
CHECK available_qty >= 0 ^EWl7Phgs

idempotency_keys
user_id, key, order_id
PK (user_id, key) ^j4OYv2ri

orders
id PK, user_id, store_id
status, total_paise
INDEX (status, created_at) ^BupcehR0

order_items
order_id, product_id
qty, price_paise
PK (order_id, product_id) ^eQJPeoaz

uses ^QnU6YPl4

uses ^bByj4s6L

uses ^p38yuzvU

uses ^LxuJM7uo

implements ^vRMOI3MZ

1 to many ^NiSsHTGr

many to 1 ^oF0a0FIu

stock per store,product ^cI6o6MHq

retry ^zYTqahyI

0 rows ^POXNzdBD

next store ^bGEDeWal

none left ^l9FsyY0E

payment ok ^i8Dv3858

store packs ^9DhnMXEg

cancel or 10 min expiry ^1n7AskCN

cancel + refund ^72RHZClH

many to 1 ^PJuCMDVf

points to ^EiHz39n2

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "PR8nb28y",
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
   "seed": 373272784,
   "version": 1,
   "versionNonce": 2001236784,
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
   "id": "dEhhB2IR",
   "type": "text",
   "x": 0,
   "y": 1050.0,
   "width": 378.0,
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
   "seed": 866500412,
   "version": 1,
   "versionNonce": 291040084,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: PlaceOrder",
   "originalText": "2. Core flow: PlaceOrder",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JDaUlGzM",
   "type": "text",
   "x": 0,
   "y": 1720.0,
   "width": 362.25,
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
   "seed": 800208535,
   "version": 1,
   "versionNonce": 619295457,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machine: Order",
   "originalText": "3. State machine: Order",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DRF7YWo5",
   "type": "text",
   "x": 0,
   "y": 2380.0,
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
   "seed": 949310868,
   "version": 1,
   "versionNonce": 1407806479,
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
   "id": "SFaIjsKQ",
   "type": "rectangle",
   "x": 520,
   "y": 70,
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
   "seed": 1148530140,
   "version": 1,
   "versionNonce": 192793596,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qyVD4AnD"
    },
    {
     "type": "arrow",
     "id": "nBI9lwdO"
    },
    {
     "type": "arrow",
     "id": "jX7zMDxa"
    },
    {
     "type": "arrow",
     "id": "JmkaOWyx"
    },
    {
     "type": "arrow",
     "id": "aiIGgNNg"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "qyVD4AnD",
   "type": "text",
   "x": 532,
   "y": 85.0,
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
   "seed": 448975635,
   "version": 1,
   "versionNonce": 2054166418,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Service (Facade)\n- selector, inv, orders, events\n- now func(), holdFor\n+ PlaceOrder(ctx, req) (Order, error)\n+ ConfirmPayment / Cancel\n+ ExpireHolds(ctx)",
   "originalText": "Service (Facade)\n- selector, inv, orders, events\n- now func(), holdFor\n+ PlaceOrder(ctx, req) (Order, error)\n+ ConfirmPayment / Cancel\n+ ExpireHolds(ctx)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "SFaIjsKQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "g06iyHDO",
   "type": "rectangle",
   "x": 0,
   "y": 370.0,
   "width": 301.0,
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
   "seed": 372171752,
   "version": 1,
   "versionNonce": 1842632043,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ftw6cOz9"
    },
    {
     "type": "arrow",
     "id": "nBI9lwdO"
    },
    {
     "type": "arrow",
     "id": "4CsPXRfp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ftw6cOz9",
   "type": "text",
   "x": 12,
   "y": 385.0,
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
   "seed": 137810483,
   "version": 1,
   "versionNonce": 584346673,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nStoreSelector\n+ Select(ctx, customer,\n  stores, items, inv) []Store",
   "originalText": "<<interface>>\nStoreSelector\n+ Select(ctx, customer,\n  stores, items, inv) []Store",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "g06iyHDO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rD3BoPuu",
   "type": "rectangle",
   "x": 371.0,
   "y": 370.0,
   "width": 310.0,
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
   "seed": 1639151534,
   "version": 1,
   "versionNonce": 139907233,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4fhWNz3I"
    },
    {
     "type": "arrow",
     "id": "jX7zMDxa"
    },
    {
     "type": "arrow",
     "id": "i8RNolgz"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "4fhWNz3I",
   "type": "text",
   "x": 383.0,
   "y": 385.0,
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
   "seed": 1058143001,
   "version": 1,
   "versionNonce": 550435327,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nInventoryRepository\n+ HasAll(storeID, items)\n+ Reserve(store, product, qty)\n+ Release(store, product, qty)",
   "originalText": "<<interface>>\nInventoryRepository\n+ HasAll(storeID, items)\n+ Reserve(store, product, qty)\n+ Release(store, product, qty)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "rD3BoPuu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1CvJNgW4",
   "type": "rectangle",
   "x": 751.0,
   "y": 370.0,
   "width": 355.0,
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
   "seed": 1697156034,
   "version": 1,
   "versionNonce": 691528616,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "giahdnAC"
    },
    {
     "type": "arrow",
     "id": "JmkaOWyx"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "giahdnAC",
   "type": "text",
   "x": 763.0,
   "y": 385.0,
   "width": 315.0,
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
   "seed": 1366994749,
   "version": 1,
   "versionNonce": 1112600841,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nOrderRepository\n+ ClaimKey(user, key)\n+ Save(order)\n+ CompareAndSetStatus(id, from, to)",
   "originalText": "<<interface>>\nOrderRepository\n+ ClaimKey(user, key)\n+ Save(order)\n+ CompareAndSetStatus(id, from, to)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "1CvJNgW4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mCUzNG0e",
   "type": "rectangle",
   "x": 1176.0,
   "y": 370.0,
   "width": 193.0,
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
   "seed": 1373303594,
   "version": 1,
   "versionNonce": 1226605421,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7twAW5Fu"
    },
    {
     "type": "arrow",
     "id": "aiIGgNNg"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7twAW5Fu",
   "type": "text",
   "x": 1188.0,
   "y": 385.0,
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
   "seed": 719381650,
   "version": 1,
   "versionNonce": 1318652054,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nEventPublisher\n+ Publish(ctx, e)",
   "originalText": "<<interface>>\nEventPublisher\n+ Publish(ctx, e)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "mCUzNG0e",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5raoWDpg",
   "type": "rectangle",
   "x": 0,
   "y": 650.0,
   "width": 274.0,
   "height": 110.0,
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
   "seed": 1082295243,
   "version": 1,
   "versionNonce": 1797046212,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KQKZi64l"
    },
    {
     "type": "arrow",
     "id": "4CsPXRfp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KQKZi64l",
   "type": "text",
   "x": 12,
   "y": 665.0,
   "width": 234.0,
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
   "seed": 987349847,
   "version": 1,
   "versionNonce": 1966216616,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "NearestWithFullStock\n- MaxDistanceM 3000\n+ Select: in range,\n  HasAll, sort by distance",
   "originalText": "NearestWithFullStock\n- MaxDistanceM 3000\n+ Select: in range,\n  HasAll, sort by distance",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5raoWDpg",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7nKopj5R",
   "type": "rectangle",
   "x": 384.0,
   "y": 650.0,
   "width": 157.0,
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
   "seed": 516714196,
   "version": 1,
   "versionNonce": 1595799317,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YQ19hiqv"
    },
    {
     "type": "arrow",
     "id": "zuvSRmzA"
    },
    {
     "type": "arrow",
     "id": "i8RNolgz"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "YQ19hiqv",
   "type": "text",
   "x": 396.0,
   "y": 665.0,
   "width": 117.0,
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
   "seed": 1321992209,
   "version": 1,
   "versionNonce": 390426291,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Store\n- ID, Loc\n- Active bool",
   "originalText": "Store\n- ID, Loc\n- Active bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "7nKopj5R",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KbghwwxQ",
   "type": "rectangle",
   "x": 651.0,
   "y": 650.0,
   "width": 229.0,
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
   "seed": 573349933,
   "version": 1,
   "versionNonce": 1546301700,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vGztkCLx"
    },
    {
     "type": "arrow",
     "id": "P73cRAH6"
    },
    {
     "type": "arrow",
     "id": "zuvSRmzA"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vGztkCLx",
   "type": "text",
   "x": 663.0,
   "y": 665.0,
   "width": 189.0,
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
   "seed": 1810339942,
   "version": 1,
   "versionNonce": 589257371,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order\n- ID, UserID, StoreID\n- TotalPaise int64\n- Status OrderStatus\n- CreatedAt",
   "originalText": "Order\n- ID, UserID, StoreID\n- TotalPaise int64\n- Status OrderStatus\n- CreatedAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KbghwwxQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5ZZvjXC7",
   "type": "rectangle",
   "x": 990.0,
   "y": 650.0,
   "width": 202.0,
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
   "seed": 965374110,
   "version": 1,
   "versionNonce": 701439590,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dCtdOlbK"
    },
    {
     "type": "arrow",
     "id": "P73cRAH6"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dCtdOlbK",
   "type": "text",
   "x": 1002.0,
   "y": 665.0,
   "width": 162.0,
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
   "seed": 695530812,
   "version": 1,
   "versionNonce": 672246101,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OrderItem\n- ProductID\n- Qty\n- PricePaise int64",
   "originalText": "OrderItem\n- ProductID\n- Qty\n- PricePaise int64",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5ZZvjXC7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6BKncQHn",
   "type": "rectangle",
   "x": 0,
   "y": 1120.0,
   "width": 175.0,
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
   "seed": 2000781431,
   "version": 1,
   "versionNonce": 77589458,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cMyzleJ9"
    },
    {
     "type": "arrow",
     "id": "3RFflQ5J"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "cMyzleJ9",
   "type": "text",
   "x": 12,
   "y": 1135.0,
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
   "seed": 620184533,
   "version": 1,
   "versionNonce": 81942372,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Customer app\nPOST /orders\nIdempotency-Key",
   "originalText": "Customer app\nPOST /orders\nIdempotency-Key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "6BKncQHn",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "57dX3rsG",
   "type": "rectangle",
   "x": 265.0,
   "y": 1120.0,
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
   "seed": 240968797,
   "version": 1,
   "versionNonce": 2123655746,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vMhKz281"
    },
    {
     "type": "arrow",
     "id": "3RFflQ5J"
    },
    {
     "type": "arrow",
     "id": "U1n2jQc6"
    },
    {
     "type": "arrow",
     "id": "CSSgUYz1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vMhKz281",
   "type": "text",
   "x": 277.0,
   "y": 1135.0,
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
   "seed": 731673834,
   "version": 1,
   "versionNonce": 1862921110,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1. ClaimKey\n(user, key)",
   "originalText": "1. ClaimKey\n(user, key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "57dX3rsG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WEoFkTUA",
   "type": "rectangle",
   "x": 495.0,
   "y": 1120.0,
   "width": 265.0,
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
   "seed": 1135579356,
   "version": 1,
   "versionNonce": 1022018882,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5Zxc2ZA5"
    },
    {
     "type": "arrow",
     "id": "U1n2jQc6"
    },
    {
     "type": "arrow",
     "id": "77mwHt1m"
    },
    {
     "type": "arrow",
     "id": "uNcAVB4p"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5Zxc2ZA5",
   "type": "text",
   "x": 507.0,
   "y": 1135.0,
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
   "seed": 596532672,
   "version": 1,
   "versionNonce": 520210066,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Select stores\nactive, within 3 km,\nfull stock, nearest first",
   "originalText": "2. Select stores\nactive, within 3 km,\nfull stock, nearest first",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "WEoFkTUA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5StVAHFF",
   "type": "rectangle",
   "x": 850.0,
   "y": 1120.0,
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
   "seed": 215347360,
   "version": 1,
   "versionNonce": 177066630,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AtYuOWCX"
    },
    {
     "type": "arrow",
     "id": "77mwHt1m"
    },
    {
     "type": "arrow",
     "id": "mW4CUU2G"
    },
    {
     "type": "arrow",
     "id": "hz1FHuuk"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "AtYuOWCX",
   "type": "text",
   "x": 862.0,
   "y": 1135.0,
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
   "seed": 1664784066,
   "version": 1,
   "versionNonce": 1397970445,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. reserveAll(store, items)\nconditional decrement\nper item, product-id order",
   "originalText": "3. reserveAll(store, items)\nconditional decrement\nper item, product-id order",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5StVAHFF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bFfUuvVS",
   "type": "rectangle",
   "x": 1223.0,
   "y": 1120.0,
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
   "seed": 1718125856,
   "version": 1,
   "versionNonce": 1342146858,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oWpggcPU"
    },
    {
     "type": "arrow",
     "id": "mW4CUU2G"
    },
    {
     "type": "arrow",
     "id": "ayT1y7Ma"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "oWpggcPU",
   "type": "text",
   "x": 1235.0,
   "y": 1135.0,
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
   "seed": 940352354,
   "version": 1,
   "versionNonce": 928373871,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Save order\nstatus = reserved\nBindKey, publish",
   "originalText": "4. Save order\nstatus = reserved\nBindKey, publish",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "bFfUuvVS",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IhfhoUsL",
   "type": "rectangle",
   "x": 1506.0,
   "y": 1120.0,
   "width": 193.0,
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
   "seed": 949210707,
   "version": 1,
   "versionNonce": 899738168,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "yLzT02sp"
    },
    {
     "type": "arrow",
     "id": "ayT1y7Ma"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "yLzT02sp",
   "type": "text",
   "x": 1518.0,
   "y": 1135.0,
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
   "seed": 1418588341,
   "version": 1,
   "versionNonce": 1996866999,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "201 reserved\npay within 10 min",
   "originalText": "201 reserved\npay within 10 min",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "IhfhoUsL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ahhRNmje",
   "type": "rectangle",
   "x": 200,
   "y": 1360.0,
   "width": 220.0,
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
   "seed": 811888313,
   "version": 1,
   "versionNonce": 826162107,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Tgafc4fo"
    },
    {
     "type": "arrow",
     "id": "CSSgUYz1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Tgafc4fo",
   "type": "text",
   "x": 212,
   "y": 1375.0,
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
   "seed": 1067430440,
   "version": 1,
   "versionNonce": 138510823,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Key already used:\nreturn same order\n(or 409 in progress)",
   "originalText": "Key already used:\nreturn same order\n(or 409 in progress)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ahhRNmje",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2jfV56gp",
   "type": "rectangle",
   "x": 680.0,
   "y": 1360.0,
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
   "seed": 530743890,
   "version": 1,
   "versionNonce": 137149016,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1J3ydg7w"
    },
    {
     "type": "arrow",
     "id": "hz1FHuuk"
    },
    {
     "type": "arrow",
     "id": "uNcAVB4p"
    },
    {
     "type": "arrow",
     "id": "vStyJqxG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "1J3ydg7w",
   "type": "text",
   "x": 692.0,
   "y": 1375.0,
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
   "seed": 1133181165,
   "version": 1,
   "versionNonce": 628181300,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Item fails mid-way:\nrelease reserved items,\ntry next store",
   "originalText": "Item fails mid-way:\nrelease reserved items,\ntry next store",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2jfV56gp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XbYVo2RX",
   "type": "rectangle",
   "x": 1187.0,
   "y": 1360.0,
   "width": 247.0,
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
   "seed": 1586791569,
   "version": 1,
   "versionNonce": 396808241,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YVhiatmq"
    },
    {
     "type": "arrow",
     "id": "vStyJqxG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "YVhiatmq",
   "type": "text",
   "x": 1199.0,
   "y": 1375.0,
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
   "seed": 561078379,
   "version": 1,
   "versionNonce": 33004465,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "No store left:\nErrNoStore, release key",
   "originalText": "No store left:\nErrNoStore, release key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "XbYVo2RX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "plijyvnu",
   "type": "ellipse",
   "x": 100,
   "y": 1790.0,
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
   "seed": 1509057189,
   "version": 1,
   "versionNonce": 2043961571,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KmBYvBKn"
    },
    {
     "type": "arrow",
     "id": "aOw3TKy3"
    },
    {
     "type": "arrow",
     "id": "LJwqp6iG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KmBYvBKn",
   "type": "text",
   "x": 154.0,
   "y": 1820.0,
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
   "seed": 354356862,
   "version": 1,
   "versionNonce": 1091582906,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Reserved",
   "originalText": "Reserved",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "plijyvnu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4dLQANZv",
   "type": "ellipse",
   "x": 480,
   "y": 1790.0,
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
   "seed": 539464652,
   "version": 1,
   "versionNonce": 473949789,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VA72JYW8"
    },
    {
     "type": "arrow",
     "id": "aOw3TKy3"
    },
    {
     "type": "arrow",
     "id": "H8KDLjTV"
    },
    {
     "type": "arrow",
     "id": "GWn3xzSj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VA72JYW8",
   "type": "text",
   "x": 529.5,
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
   "seed": 686087246,
   "version": 1,
   "versionNonce": 583351004,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Confirmed",
   "originalText": "Confirmed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "4dLQANZv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "igoUEA0P",
   "type": "ellipse",
   "x": 860,
   "y": 1790.0,
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
   "seed": 1297383984,
   "version": 1,
   "versionNonce": 1937319861,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jMTGIKb8"
    },
    {
     "type": "arrow",
     "id": "H8KDLjTV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jMTGIKb8",
   "type": "text",
   "x": 923.0,
   "y": 1820.0,
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
   "seed": 164114463,
   "version": 1,
   "versionNonce": 172294635,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Packed",
   "originalText": "Packed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "igoUEA0P",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SNE6oqzC",
   "type": "ellipse",
   "x": 480,
   "y": 2020.0,
   "width": 224.0,
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
   "roundness": null,
   "seed": 1285492633,
   "version": 1,
   "versionNonce": 88347807,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NEbm3XhT"
    },
    {
     "type": "arrow",
     "id": "LJwqp6iG"
    },
    {
     "type": "arrow",
     "id": "GWn3xzSj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NEbm3XhT",
   "type": "text",
   "x": 492,
   "y": 2045.0,
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
   "seed": 679788924,
   "version": 1,
   "versionNonce": 849484565,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Cancelled\n(stock released)",
   "originalText": "Cancelled\n(stock released)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "SNE6oqzC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "h2GpnqYy",
   "type": "rectangle",
   "x": 0,
   "y": 2450.0,
   "width": 283.0,
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
   "seed": 726379216,
   "version": 1,
   "versionNonce": 1449744803,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EWl7Phgs"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EWl7Phgs",
   "type": "text",
   "x": 12,
   "y": 2465.0,
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
   "seed": 799877636,
   "version": 1,
   "versionNonce": 1279998563,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "inventory\nstore_id, product_id\navailable_qty, reserved_qty\nPK (store_id, product_id)\nCHECK available_qty >= 0",
   "originalText": "inventory\nstore_id, product_id\navailable_qty, reserved_qty\nPK (store_id, product_id)\nCHECK available_qty >= 0",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "h2GpnqYy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zfJnXwzH",
   "type": "rectangle",
   "x": 363.0,
   "y": 2450.0,
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
   "seed": 1279473480,
   "version": 1,
   "versionNonce": 1322792203,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "j4OYv2ri"
    },
    {
     "type": "arrow",
     "id": "gANuhTae"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "j4OYv2ri",
   "type": "text",
   "x": 375.0,
   "y": 2465.0,
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
   "seed": 1005690440,
   "version": 1,
   "versionNonce": 1881291235,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "idempotency_keys\nuser_id, key, order_id\nPK (user_id, key)",
   "originalText": "idempotency_keys\nuser_id, key, order_id\nPK (user_id, key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zfJnXwzH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "xbt6paa1",
   "type": "rectangle",
   "x": 681.0,
   "y": 2450.0,
   "width": 274.0,
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
   "seed": 461075502,
   "version": 1,
   "versionNonce": 1266899685,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BupcehR0"
    },
    {
     "type": "arrow",
     "id": "htgI3xj5"
    },
    {
     "type": "arrow",
     "id": "gANuhTae"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "BupcehR0",
   "type": "text",
   "x": 693.0,
   "y": 2465.0,
   "width": 234.0,
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
   "seed": 1689641042,
   "version": 1,
   "versionNonce": 1111604044,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "orders\nid PK, user_id, store_id\nstatus, total_paise\nINDEX (status, created_at)",
   "originalText": "orders\nid PK, user_id, store_id\nstatus, total_paise\nINDEX (status, created_at)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "xbt6paa1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EI7qRwPf",
   "type": "rectangle",
   "x": 1035.0,
   "y": 2450.0,
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
   "seed": 1062124007,
   "version": 1,
   "versionNonce": 687752192,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "eQJPeoaz"
    },
    {
     "type": "arrow",
     "id": "htgI3xj5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "eQJPeoaz",
   "type": "text",
   "x": 1047.0,
   "y": 2465.0,
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
   "seed": 638536736,
   "version": 1,
   "versionNonce": 1803444756,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "order_items\norder_id, product_id\nqty, price_paise\nPK (order_id, product_id)",
   "originalText": "order_items\norder_id, product_id\nqty, price_paise\nPK (order_id, product_id)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "EI7qRwPf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nBI9lwdO",
   "type": "arrow",
   "x": 549.6285714285714,
   "y": 224.0,
   "width": 281.97142857142853,
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
   "seed": 1343794216,
   "version": 1,
   "versionNonce": 1549283585,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "QnU6YPl4"
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
     -281.97142857142853,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SFaIjsKQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "g06iyHDO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "QnU6YPl4",
   "type": "text",
   "x": 392.8928571428571,
   "y": 286.25,
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
   "seed": 1721543103,
   "version": 1,
   "versionNonce": 514887538,
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
   "containerId": "nBI9lwdO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jX7zMDxa",
   "type": "arrow",
   "x": 657.3293103448276,
   "y": 224.0,
   "width": 88.38275862068963,
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
   "seed": 171220081,
   "version": 1,
   "versionNonce": 2049324825,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "bByj4s6L"
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
     -88.38275862068963,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SFaIjsKQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "rD3BoPuu",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "bByj4s6L",
   "type": "text",
   "x": 597.3879310344828,
   "y": 286.25,
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
   "seed": 2071291071,
   "version": 1,
   "versionNonce": 1089755554,
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
   "containerId": "jX7zMDxa",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JmkaOWyx",
   "type": "arrow",
   "x": 766.9758620689655,
   "y": 224.0,
   "width": 108.70344827586212,
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
   "seed": 2023757193,
   "version": 1,
   "versionNonce": 170850316,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "p38yuzvU"
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
     108.70344827586212,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SFaIjsKQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1CvJNgW4",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "p38yuzvU",
   "type": "text",
   "x": 805.5775862068965,
   "y": 286.25,
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
   "seed": 570530189,
   "version": 1,
   "versionNonce": 75988844,
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
   "containerId": "JmkaOWyx",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aiIGgNNg",
   "type": "arrow",
   "x": 872.1074074074074,
   "y": 224.0,
   "width": 299.89259259259256,
   "height": 143.05830388692578,
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
   "seed": 514735762,
   "version": 1,
   "versionNonce": 446805543,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LxuJM7uo"
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
     299.89259259259256,
     143.05830388692578
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SFaIjsKQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "mCUzNG0e",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "LxuJM7uo",
   "type": "text",
   "x": 1006.3037037037037,
   "y": 286.7791519434629,
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
   "seed": 290942728,
   "version": 1,
   "versionNonce": 759629793,
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
   "containerId": "aiIGgNNg",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4CsPXRfp",
   "type": "arrow",
   "x": 139.84464285714284,
   "y": 646.0,
   "width": 7.810714285714312,
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
   "seed": 1331948143,
   "version": 1,
   "versionNonce": 932479716,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vRMOI3MZ"
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
     7.810714285714312,
     -162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5raoWDpg",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "g06iyHDO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "vRMOI3MZ",
   "type": "text",
   "x": 104.375,
   "y": 556.25,
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
   "seed": 1527055366,
   "version": 1,
   "versionNonce": 1383601925,
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
   "containerId": "4CsPXRfp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "P73cRAH6",
   "type": "arrow",
   "x": 884.0,
   "y": 711.3594470046083,
   "width": 102.0,
   "height": 3.1336405529954163,
   "angle": 0,
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
   "seed": 1460482999,
   "version": 1,
   "versionNonce": 242824560,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NiSsHTGr"
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
     102.0,
     -3.1336405529954163
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KbghwwxQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5ZZvjXC7",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "NiSsHTGr",
   "type": "text",
   "x": 899.5625,
   "y": 701.0426267281107,
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
   "seed": 531273026,
   "version": 1,
   "versionNonce": 1287128424,
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
   "containerId": "P73cRAH6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zuvSRmzA",
   "type": "arrow",
   "x": 647.0,
   "y": 707.1782178217821,
   "width": 102.0,
   "height": 6.7326732673267315,
   "angle": 0,
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
   "seed": 1688238751,
   "version": 1,
   "versionNonce": 1711383909,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oF0a0FIu"
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
     -102.0,
     -6.7326732673267315
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KbghwwxQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7nKopj5R",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "oF0a0FIu",
   "type": "text",
   "x": 560.5625,
   "y": 695.0618811881188,
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
   "seed": 837086985,
   "version": 1,
   "versionNonce": 1562859515,
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
   "containerId": "zuvSRmzA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "i8RNolgz",
   "type": "arrow",
   "x": 509.1480769230769,
   "y": 504.0,
   "width": 34.680769230769215,
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
   "seed": 2015514320,
   "version": 1,
   "versionNonce": 421428813,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cI6o6MHq"
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
     -34.680769230769215,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "rD3BoPuu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7nKopj5R",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "cI6o6MHq",
   "type": "text",
   "x": 401.2451923076923,
   "y": 566.25,
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
   "seed": 79250939,
   "version": 1,
   "versionNonce": 703487967,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "stock per store,product",
   "originalText": "stock per store,product",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "i8RNolgz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3RFflQ5J",
   "type": "arrow",
   "x": 179.0,
   "y": 1161.3030303030303,
   "width": 82.0,
   "height": 3.31313131313118,
   "angle": 0,
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
   "seed": 1339371304,
   "version": 1,
   "versionNonce": 443741871,
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
     82.0,
     -3.31313131313118
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "6BKncQHn",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "57dX3rsG",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "U1n2jQc6",
   "type": "arrow",
   "x": 409.0,
   "y": 1157.5299145299145,
   "width": 82.0,
   "height": 2.803418803418708,
   "angle": 0,
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
   "seed": 1218062845,
   "version": 1,
   "versionNonce": 1781855842,
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
     82.0,
     2.803418803418708
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "57dX3rsG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "WEoFkTUA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "77mwHt1m",
   "type": "arrow",
   "x": 764.0,
   "y": 1165.0,
   "width": 82.0,
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
   "seed": 905984509,
   "version": 1,
   "versionNonce": 2066571678,
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
     82.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WEoFkTUA",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5StVAHFF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "mW4CUU2G",
   "type": "arrow",
   "x": 1137.0,
   "y": 1165.0,
   "width": 82.0,
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
   "seed": 544801045,
   "version": 1,
   "versionNonce": 1312649892,
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
     82.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5StVAHFF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "bFfUuvVS",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ayT1y7Ma",
   "type": "arrow",
   "x": 1420.0,
   "y": 1161.4487632508833,
   "width": 82.0,
   "height": 2.897526501766606,
   "angle": 0,
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
   "seed": 249887625,
   "version": 1,
   "versionNonce": 304664031,
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
     82.0,
     -2.897526501766606
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "bFfUuvVS",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "IhfhoUsL",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "CSSgUYz1",
   "type": "arrow",
   "x": 331.1,
   "y": 1194.0,
   "width": 16.200000000000045,
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
   "seed": 2105775051,
   "version": 1,
   "versionNonce": 609956551,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zYTqahyI"
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
     -16.200000000000045,
     162.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "57dX3rsG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ahhRNmje",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "zYTqahyI",
   "type": "text",
   "x": 303.3125,
   "y": 1266.25,
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
   "seed": 1503022324,
   "version": 1,
   "versionNonce": 319812864,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "retry",
   "originalText": "retry",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "CSSgUYz1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hz1FHuuk",
   "type": "arrow",
   "x": 953.1166666666667,
   "y": 1214.0,
   "width": 111.23333333333335,
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
   "seed": 1098541026,
   "version": 1,
   "versionNonce": 842710197,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "POXNzdBD"
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
     -111.23333333333335,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5StVAHFF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "2jfV56gp",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "POXNzdBD",
   "type": "text",
   "x": 873.875,
   "y": 1276.25,
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
   "seed": 1387759878,
   "version": 1,
   "versionNonce": 849579425,
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
   "containerId": "hz1FHuuk",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uNcAVB4p",
   "type": "arrow",
   "x": 767.5666666666667,
   "y": 1356.0,
   "width": 104.13333333333344,
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
   "seed": 1015947436,
   "version": 1,
   "versionNonce": 640495897,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "bGEDeWal"
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
     -104.13333333333344,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2jfV56gp",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "WEoFkTUA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "bGEDeWal",
   "type": "text",
   "x": 676.125,
   "y": 1276.25,
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
   "seed": 932395536,
   "version": 1,
   "versionNonce": 1616702268,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "next store",
   "originalText": "next store",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "uNcAVB4p",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vStyJqxG",
   "type": "arrow",
   "x": 931.0,
   "y": 1402.4852071005917,
   "width": 252.0,
   "height": 4.970414201183303,
   "angle": 0,
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
   "seed": 213736581,
   "version": 1,
   "versionNonce": 1340020731,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "l9FsyY0E"
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
     -4.970414201183303
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2jfV56gp",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "XbYVo2RX",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "l9FsyY0E",
   "type": "text",
   "x": 1021.5625,
   "y": 1391.25,
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
   "seed": 149086743,
   "version": 1,
   "versionNonce": 460986064,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "none left",
   "originalText": "none left",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "vStyJqxG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aOw3TKy3",
   "type": "arrow",
   "x": 284.0,
   "y": 1830.0,
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
   "seed": 1309276129,
   "version": 1,
   "versionNonce": 73018455,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "i8Dv3858"
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
    "elementId": "plijyvnu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "4dLQANZv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "i8Dv3858",
   "type": "text",
   "x": 340.625,
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
   "seed": 129338499,
   "version": 1,
   "versionNonce": 1041483839,
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
   "containerId": "aOw3TKy3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "H8KDLjTV",
   "type": "arrow",
   "x": 664.0,
   "y": 1830.0,
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
   "seed": 699629070,
   "version": 1,
   "versionNonce": 1928448988,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9DhnMXEg"
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
    "elementId": "4dLQANZv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "igoUEA0P",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "9DhnMXEg",
   "type": "text",
   "x": 716.6875,
   "y": 1821.25,
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
   "seed": 325528501,
   "version": 1,
   "versionNonce": 84035198,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "store packs",
   "originalText": "store packs",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "H8KDLjTV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LJwqp6iG",
   "type": "arrow",
   "x": 248.75373530379846,
   "y": 1864.346089045753,
   "width": 275.30619137806804,
   "height": 160.9376989399152,
   "angle": 0,
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
   "seed": 1372793137,
   "version": 1,
   "versionNonce": 1080880163,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1n7AskCN"
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
     275.30619137806804,
     160.9376989399152
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "plijyvnu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "SNE6oqzC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "1n7AskCN",
   "type": "text",
   "x": 295.8443309928325,
   "y": 1936.0649385157105,
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
   "seed": 2130323302,
   "version": 1,
   "versionNonce": 1586425179,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "cancel or 10 min expiry",
   "originalText": "cancel or 10 min expiry",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "LJwqp6iG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GWn3xzSj",
   "type": "arrow",
   "x": 574.1151997112901,
   "y": 1873.9578150978718,
   "width": 13.301148841183135,
   "height": 142.0804535308198,
   "angle": 0,
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
   "seed": 1626051560,
   "version": 1,
   "versionNonce": 1391764036,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "72RHZClH"
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
     13.301148841183135,
     142.0804535308198
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "4dLQANZv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "SNE6oqzC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "72RHZClH",
   "type": "text",
   "x": 521.7032741318817,
   "y": 1936.2480418632817,
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
   "seed": 1114408210,
   "version": 1,
   "versionNonce": 1713278527,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "cancel + refund",
   "originalText": "cancel + refund",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "GWn3xzSj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "htgI3xj5",
   "type": "arrow",
   "x": 1031.0,
   "y": 2505.0,
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
   "seed": 951067227,
   "version": 1,
   "versionNonce": 436933169,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PJuCMDVf"
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
    "elementId": "EI7qRwPf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "xbt6paa1",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "PJuCMDVf",
   "type": "text",
   "x": 959.5625,
   "y": 2496.25,
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
   "seed": 1023098205,
   "version": 1,
   "versionNonce": 1539760852,
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
   "containerId": "htgI3xj5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gANuhTae",
   "type": "arrow",
   "x": 605.0,
   "y": 2498.660714285714,
   "width": 72.0,
   "height": 2.1428571428573377,
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
   "seed": 1184070899,
   "version": 1,
   "versionNonce": 1635064842,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EiHz39n2"
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
     72.0,
     2.1428571428573377
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "zfJnXwzH",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "xbt6paa1",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "EiHz39n2",
   "type": "text",
   "x": 605.5625,
   "y": 2490.982142857143,
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
   "seed": 1778233501,
   "version": 1,
   "versionNonce": 1485587791,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "points to",
   "originalText": "points to",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "gANuhTae",
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