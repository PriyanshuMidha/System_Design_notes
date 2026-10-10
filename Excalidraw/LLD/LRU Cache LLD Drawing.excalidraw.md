---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^LYlKlBlh

2. Data structure: map + doubly linked list ^aRakjRjv

3. Core flow: Get(k) ^3ek5YyZF

4. Core flow: Put(k, v, ttl) ^Z001U0IN

head.next = most recent
tail.prev = least recent, evict here
all moves are O(1) pointer swaps ^nNldeDM6

Expired entries are removed lazily on Get,
or in bulk by Sweep() on a ticker. ^w5oRfURg

LRU[K, V]
- mu sync.Mutex
- cap int
- items map[K]*node
- head, tail *node (sentinels)
+ Get(k) (V, bool)
+ Put(k, v, ttl)
+ Delete(k) bool
+ Sweep() int ^BQGCUh9a

node[K, V]
- key K  (needed to delete from map)
- val V
- expiresAt time.Time (zero = never)
- prev, next *node ^nE4tnE7M

<<func>>
now() time.Time
time.Now or fake clock ^pHCiyTQ6

<<func>>
onEvict(k, v, reason)
called outside the lock ^fi1kpN3K

items map[K]*node
 k3 -> node
 k1 -> node
 k2 -> node ^znIvR1zt

head
sentinel ^lE9GKamE

k3  MRU
exp 10:05 ^ohlhdOWY

k1
exp never ^PbLiCbcQ

k2  LRU
exp 10:01 expired ^t9xyo4Re

tail
sentinel ^hzVQtzuB

Caller
Get(k) ^N57iYyoB

lock mu
items[k] ^y1QJdY3K

expired?
now >= expiresAt ^M3BGecQp

moveToFront(n)
return v, true ^6tTx0bmS

not in map
return zero, false ^jUJVZxtT

unlink + delete key
unlock, onEvict(Expired)
return zero, false ^6JayW0WQ

Caller
Put(k, v, ttl) ^6qGuVYBx

lock mu
key exists? ^5g7S46Jf

full?
len == cap ^yZ2G3yHl

new node, pushFront
unlock, then onEvict ^gLEM6Ozr

yes: update val + expiry
moveToFront, no eviction ^5P2PgAS2

evict tail.prev
unlink + delete key ^8DkM5k4h

owns 0 to cap ^FqG3nAoq

uses ^5NjABQ5j

notifies ^1ozEtfOM

next ^aOMZi1fd

prev ^oQvvQQKR

next ^2NnfMxVX

prev ^185e40W0

next ^kZpPZ0ct

prev ^aqcSQZEy

next ^lAPgmlPB

prev ^ZjdN6Ama

found ^ZvqgFEGZ

no ^gtCBdLKd

miss ^efCJQhDq

yes ^0AFYSSo9

no ^lKLBvg4U

no ^XhRFdhSq

yes ^RcwyhLN9

yes ^NhdmFt4r

then ^d7HxBrKL

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "LYlKlBlh",
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
   "seed": 709515785,
   "version": 1,
   "versionNonce": 1584758833,
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
   "id": "aRakjRjv",
   "type": "text",
   "x": 0,
   "y": 420,
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
   "seed": 2079807786,
   "version": 1,
   "versionNonce": 223479070,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Data structure: map + doubly linked list",
   "originalText": "2. Data structure: map + doubly linked list",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3ek5YyZF",
   "type": "text",
   "x": 0,
   "y": 900,
   "width": 315.0,
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
   "seed": 316367574,
   "version": 1,
   "versionNonce": 586514856,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Core flow: Get(k)",
   "originalText": "3. Core flow: Get(k)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Z001U0IN",
   "type": "text",
   "x": 0,
   "y": 1260,
   "width": 441.0,
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
   "seed": 1688736287,
   "version": 1,
   "versionNonce": 1297945816,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Core flow: Put(k, v, ttl)",
   "originalText": "4. Core flow: Put(k, v, ttl)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nNldeDM6",
   "type": "text",
   "x": 0,
   "y": 500,
   "width": 324.0,
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
   "seed": 765608300,
   "version": 1,
   "versionNonce": 1584887291,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "head.next = most recent\ntail.prev = least recent, evict here\nall moves are O(1) pointer swaps",
   "originalText": "head.next = most recent\ntail.prev = least recent, evict here\nall moves are O(1) pointer swaps",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "w5oRfURg",
   "type": "text",
   "x": 900,
   "y": 480,
   "width": 378.0,
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
   "seed": 538172953,
   "version": 1,
   "versionNonce": 230101085,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Expired entries are removed lazily on Get,\nor in bulk by Sweep() on a ticker.",
   "originalText": "Expired entries are removed lazily on Get,\nor in bulk by Sweep() on a ticker.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gt0lKb4B",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 310.0,
   "height": 210.0,
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
   "seed": 1078077453,
   "version": 1,
   "versionNonce": 1126120774,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BQGCUh9a"
    },
    {
     "type": "arrow",
     "id": "9Zh5AHI5"
    },
    {
     "type": "arrow",
     "id": "KvDVXOS8"
    },
    {
     "type": "arrow",
     "id": "saOwGjl0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "BQGCUh9a",
   "type": "text",
   "x": 12,
   "y": 75.0,
   "width": 270.0,
   "height": 180.0,
   "angle": 0,
   "strokeColor": "#1e1e1e",
   "backgroundColor": "transparent",
   "fillStyle": "solid",
   "strokeWidth": 2,
   "strokeStyle": "solid",
   "roughness": 1,
   "opacity": 100,
   "groupIds": [],
   "frameId": null,
   "roundness": null,
   "seed": 1173586012,
   "version": 1,
   "versionNonce": 1104421495,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LRU[K, V]\n- mu sync.Mutex\n- cap int\n- items map[K]*node\n- head, tail *node (sentinels)\n+ Get(k) (V, bool)\n+ Put(k, v, ttl)\n+ Delete(k) bool\n+ Sweep() int",
   "originalText": "LRU[K, V]\n- mu sync.Mutex\n- cap int\n- items map[K]*node\n- head, tail *node (sentinels)\n+ Get(k) (V, bool)\n+ Put(k, v, ttl)\n+ Delete(k) bool\n+ Sweep() int",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "gt0lKb4B",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Y3idzoPq",
   "type": "rectangle",
   "x": 480,
   "y": 60,
   "width": 364.0,
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
   "seed": 1951840773,
   "version": 1,
   "versionNonce": 769961029,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nE4tnE7M"
    },
    {
     "type": "arrow",
     "id": "9Zh5AHI5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nE4tnE7M",
   "type": "text",
   "x": 492,
   "y": 75.0,
   "width": 324.0,
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
   "seed": 180168440,
   "version": 1,
   "versionNonce": 1747398034,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "node[K, V]\n- key K  (needed to delete from map)\n- val V\n- expiresAt time.Time (zero = never)\n- prev, next *node",
   "originalText": "node[K, V]\n- key K  (needed to delete from map)\n- val V\n- expiresAt time.Time (zero = never)\n- prev, next *node",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Y3idzoPq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "xgVsx6Ae",
   "type": "rectangle",
   "x": 960,
   "y": 60,
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
   "seed": 98676475,
   "version": 1,
   "versionNonce": 1394716635,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pHCiyTQ6"
    },
    {
     "type": "arrow",
     "id": "KvDVXOS8"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "pHCiyTQ6",
   "type": "text",
   "x": 972,
   "y": 75.0,
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
   "seed": 1400854201,
   "version": 1,
   "versionNonce": 1725719597,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<func>>\nnow() time.Time\ntime.Now or fake clock",
   "originalText": "<<func>>\nnow() time.Time\ntime.Now or fake clock",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "xgVsx6Ae",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1ttQ7jj8",
   "type": "rectangle",
   "x": 960,
   "y": 230,
   "width": 247.0,
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
   "seed": 1111122215,
   "version": 1,
   "versionNonce": 1226562680,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "fi1kpN3K"
    },
    {
     "type": "arrow",
     "id": "saOwGjl0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "fi1kpN3K",
   "type": "text",
   "x": 972,
   "y": 245.0,
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
   "seed": 1113026855,
   "version": 1,
   "versionNonce": 154774157,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<func>>\nonEvict(k, v, reason)\ncalled outside the lock",
   "originalText": "<<func>>\nonEvict(k, v, reason)\ncalled outside the lock",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "1ttQ7jj8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qLN8M7xv",
   "type": "rectangle",
   "x": 500,
   "y": 480,
   "width": 193.0,
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
   "seed": 272261779,
   "version": 1,
   "versionNonce": 1370616794,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "znIvR1zt"
    },
    {
     "type": "arrow",
     "id": "ahEp6MJl"
    },
    {
     "type": "arrow",
     "id": "ljlb6ch7"
    },
    {
     "type": "arrow",
     "id": "tuwh4qYV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "znIvR1zt",
   "type": "text",
   "x": 512,
   "y": 495.0,
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
   "seed": 309257651,
   "version": 1,
   "versionNonce": 395684481,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "items map[K]*node\n k3 -> node\n k1 -> node\n k2 -> node",
   "originalText": "items map[K]*node\n k3 -> node\n k1 -> node\n k2 -> node",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "qLN8M7xv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SOn8MTnb",
   "type": "rectangle",
   "x": 0,
   "y": 700,
   "width": 140,
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
   "seed": 1025815531,
   "version": 1,
   "versionNonce": 47020590,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lE9GKamE"
    },
    {
     "type": "arrow",
     "id": "lQUdSDju"
    },
    {
     "type": "arrow",
     "id": "BR1KlaCH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "lE9GKamE",
   "type": "text",
   "x": 12,
   "y": 715.0,
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
   "seed": 1363314005,
   "version": 1,
   "versionNonce": 1675300495,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "head\nsentinel",
   "originalText": "head\nsentinel",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "SOn8MTnb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8Ea7h6eg",
   "type": "rectangle",
   "x": 250,
   "y": 700,
   "width": 140,
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
   "seed": 1856290072,
   "version": 1,
   "versionNonce": 244749723,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ohlhdOWY"
    },
    {
     "type": "arrow",
     "id": "lQUdSDju"
    },
    {
     "type": "arrow",
     "id": "BR1KlaCH"
    },
    {
     "type": "arrow",
     "id": "73DxwC4a"
    },
    {
     "type": "arrow",
     "id": "fpzeY63z"
    },
    {
     "type": "arrow",
     "id": "ahEp6MJl"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ohlhdOWY",
   "type": "text",
   "x": 262,
   "y": 715.0,
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
   "seed": 669759213,
   "version": 1,
   "versionNonce": 487582666,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "k3  MRU\nexp 10:05",
   "originalText": "k3  MRU\nexp 10:05",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "8Ea7h6eg",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2ZaKDpcz",
   "type": "rectangle",
   "x": 530,
   "y": 700,
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
   "seed": 611613843,
   "version": 1,
   "versionNonce": 1131895134,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "PbLiCbcQ"
    },
    {
     "type": "arrow",
     "id": "73DxwC4a"
    },
    {
     "type": "arrow",
     "id": "fpzeY63z"
    },
    {
     "type": "arrow",
     "id": "5dltJ2MD"
    },
    {
     "type": "arrow",
     "id": "z13BKPat"
    },
    {
     "type": "arrow",
     "id": "ljlb6ch7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "PbLiCbcQ",
   "type": "text",
   "x": 542,
   "y": 715.0,
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
   "seed": 2089866357,
   "version": 1,
   "versionNonce": 2070093643,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "k1\nexp never",
   "originalText": "k1\nexp never",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2ZaKDpcz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "So7EIg0v",
   "type": "rectangle",
   "x": 810,
   "y": 700,
   "width": 193.0,
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
   "seed": 1973523800,
   "version": 1,
   "versionNonce": 1038142291,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "t9xyo4Re"
    },
    {
     "type": "arrow",
     "id": "5dltJ2MD"
    },
    {
     "type": "arrow",
     "id": "z13BKPat"
    },
    {
     "type": "arrow",
     "id": "B4sNWLZ2"
    },
    {
     "type": "arrow",
     "id": "68UbaeBj"
    },
    {
     "type": "arrow",
     "id": "tuwh4qYV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "t9xyo4Re",
   "type": "text",
   "x": 822,
   "y": 715.0,
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
   "seed": 525606465,
   "version": 1,
   "versionNonce": 1093401758,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "k2  LRU\nexp 10:01 expired",
   "originalText": "k2  LRU\nexp 10:01 expired",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "So7EIg0v",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8YYVHnx2",
   "type": "rectangle",
   "x": 1120,
   "y": 700,
   "width": 140,
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
   "seed": 171633898,
   "version": 1,
   "versionNonce": 449501713,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hzVQtzuB"
    },
    {
     "type": "arrow",
     "id": "B4sNWLZ2"
    },
    {
     "type": "arrow",
     "id": "68UbaeBj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hzVQtzuB",
   "type": "text",
   "x": 1132,
   "y": 715.0,
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
   "seed": 2108138663,
   "version": 1,
   "versionNonce": 551887182,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "tail\nsentinel",
   "originalText": "tail\nsentinel",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "8YYVHnx2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NFPMF7S6",
   "type": "rectangle",
   "x": 0,
   "y": 960,
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
   "seed": 528962661,
   "version": 1,
   "versionNonce": 2125788115,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "N57iYyoB"
    },
    {
     "type": "arrow",
     "id": "zVJgYQ7X"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "N57iYyoB",
   "type": "text",
   "x": 12,
   "y": 975.0,
   "width": 54.0,
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
   "seed": 242935340,
   "version": 1,
   "versionNonce": 604748092,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Caller\nGet(k)",
   "originalText": "Caller\nGet(k)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "NFPMF7S6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6zMoL9TN",
   "type": "rectangle",
   "x": 250,
   "y": 960,
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
   "seed": 182468677,
   "version": 1,
   "versionNonce": 1554151724,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "y1QJdY3K"
    },
    {
     "type": "arrow",
     "id": "zVJgYQ7X"
    },
    {
     "type": "arrow",
     "id": "jKNQjMxD"
    },
    {
     "type": "arrow",
     "id": "SgE74srD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "y1QJdY3K",
   "type": "text",
   "x": 262,
   "y": 975.0,
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
   "seed": 1918392871,
   "version": 1,
   "versionNonce": 1129246772,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock mu\nitems[k]",
   "originalText": "lock mu\nitems[k]",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "6zMoL9TN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "BmlVqTTK",
   "type": "rectangle",
   "x": 520,
   "y": 960,
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
   "seed": 1963448888,
   "version": 1,
   "versionNonce": 1316156901,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "M3BGecQp"
    },
    {
     "type": "arrow",
     "id": "jKNQjMxD"
    },
    {
     "type": "arrow",
     "id": "3z9KENd4"
    },
    {
     "type": "arrow",
     "id": "gXNg2IuO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "M3BGecQp",
   "type": "text",
   "x": 532,
   "y": 975.0,
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
   "seed": 641625516,
   "version": 1,
   "versionNonce": 1129960599,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "expired?\nnow >= expiresAt",
   "originalText": "expired?\nnow >= expiresAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "BmlVqTTK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OYtYQW9S",
   "type": "rectangle",
   "x": 840,
   "y": 960,
   "width": 166.0,
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
   "seed": 1181007037,
   "version": 1,
   "versionNonce": 1529928786,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "6tTx0bmS"
    },
    {
     "type": "arrow",
     "id": "3z9KENd4"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "6tTx0bmS",
   "type": "text",
   "x": 852,
   "y": 975.0,
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
   "seed": 1872760388,
   "version": 1,
   "versionNonce": 1404902965,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "moveToFront(n)\nreturn v, true",
   "originalText": "moveToFront(n)\nreturn v, true",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "OYtYQW9S",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bCuCt4rx",
   "type": "rectangle",
   "x": 250,
   "y": 1120,
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
   "seed": 1693288900,
   "version": 1,
   "versionNonce": 1151817388,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jUJVZxtT"
    },
    {
     "type": "arrow",
     "id": "SgE74srD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jUJVZxtT",
   "type": "text",
   "x": 262,
   "y": 1135.0,
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
   "seed": 381355029,
   "version": 1,
   "versionNonce": 822763121,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "not in map\nreturn zero, false",
   "originalText": "not in map\nreturn zero, false",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "bCuCt4rx",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RPmCrUYr",
   "type": "rectangle",
   "x": 560,
   "y": 1120,
   "width": 256.0,
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
   "seed": 1505238309,
   "version": 1,
   "versionNonce": 580437236,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "6JayW0WQ"
    },
    {
     "type": "arrow",
     "id": "gXNg2IuO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "6JayW0WQ",
   "type": "text",
   "x": 572,
   "y": 1135.0,
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
   "seed": 1246268745,
   "version": 1,
   "versionNonce": 244731842,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "unlink + delete key\nunlock, onEvict(Expired)\nreturn zero, false",
   "originalText": "unlink + delete key\nunlock, onEvict(Expired)\nreturn zero, false",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "RPmCrUYr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DofdoFcA",
   "type": "rectangle",
   "x": 0,
   "y": 1320,
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
   "seed": 2071853891,
   "version": 1,
   "versionNonce": 1078790193,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "6qGuVYBx"
    },
    {
     "type": "arrow",
     "id": "kh6vgLcO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "6qGuVYBx",
   "type": "text",
   "x": 12,
   "y": 1335.0,
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
   "seed": 1497204761,
   "version": 1,
   "versionNonce": 1687073430,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Caller\nPut(k, v, ttl)",
   "originalText": "Caller\nPut(k, v, ttl)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "DofdoFcA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Be1V4g1q",
   "type": "rectangle",
   "x": 250,
   "y": 1320,
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
   "seed": 1191463131,
   "version": 1,
   "versionNonce": 714635629,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5g7S46Jf"
    },
    {
     "type": "arrow",
     "id": "kh6vgLcO"
    },
    {
     "type": "arrow",
     "id": "H2miNL2V"
    },
    {
     "type": "arrow",
     "id": "Ktl45Dxf"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5g7S46Jf",
   "type": "text",
   "x": 262,
   "y": 1335.0,
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
   "seed": 1074705838,
   "version": 1,
   "versionNonce": 22351654,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock mu\nkey exists?",
   "originalText": "lock mu\nkey exists?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Be1V4g1q",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "n22iRs4x",
   "type": "rectangle",
   "x": 520,
   "y": 1320,
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
   "seed": 2082295005,
   "version": 1,
   "versionNonce": 1167086023,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "yZ2G3yHl"
    },
    {
     "type": "arrow",
     "id": "H2miNL2V"
    },
    {
     "type": "arrow",
     "id": "It4DwAgL"
    },
    {
     "type": "arrow",
     "id": "zW57YxGi"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "yZ2G3yHl",
   "type": "text",
   "x": 532,
   "y": 1335.0,
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
   "seed": 1717526716,
   "version": 1,
   "versionNonce": 1399266545,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "full?\nlen == cap",
   "originalText": "full?\nlen == cap",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "n22iRs4x",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "M6x0QY7B",
   "type": "rectangle",
   "x": 800,
   "y": 1320,
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
   "seed": 1435667002,
   "version": 1,
   "versionNonce": 1584723205,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gLEM6Ozr"
    },
    {
     "type": "arrow",
     "id": "It4DwAgL"
    },
    {
     "type": "arrow",
     "id": "X3V07LqX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "gLEM6Ozr",
   "type": "text",
   "x": 812,
   "y": 1335.0,
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
   "seed": 1159694099,
   "version": 1,
   "versionNonce": 1844002430,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "new node, pushFront\nunlock, then onEvict",
   "originalText": "new node, pushFront\nunlock, then onEvict",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "M6x0QY7B",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5wDfST7I",
   "type": "rectangle",
   "x": 200,
   "y": 1490,
   "width": 256.0,
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
   "seed": 1138846301,
   "version": 1,
   "versionNonce": 23967965,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5P2PgAS2"
    },
    {
     "type": "arrow",
     "id": "Ktl45Dxf"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5P2PgAS2",
   "type": "text",
   "x": 212,
   "y": 1505.0,
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
   "seed": 1629255400,
   "version": 1,
   "versionNonce": 1634713080,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "yes: update val + expiry\nmoveToFront, no eviction",
   "originalText": "yes: update val + expiry\nmoveToFront, no eviction",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5wDfST7I",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5AIvrXRD",
   "type": "rectangle",
   "x": 520,
   "y": 1490,
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
   "seed": 1855998362,
   "version": 1,
   "versionNonce": 1352523676,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8DkM5k4h"
    },
    {
     "type": "arrow",
     "id": "zW57YxGi"
    },
    {
     "type": "arrow",
     "id": "X3V07LqX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "8DkM5k4h",
   "type": "text",
   "x": 532,
   "y": 1505.0,
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
   "seed": 1607157452,
   "version": 1,
   "versionNonce": 991335494,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "evict tail.prev\nunlink + delete key",
   "originalText": "evict tail.prev\nunlink + delete key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5AIvrXRD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9Zh5AHI5",
   "type": "arrow",
   "x": 314.0,
   "y": 152.45562130177515,
   "width": 162.0,
   "height": 12.781065088757401,
   "angle": 0,
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
   "seed": 1100011754,
   "version": 1,
   "versionNonce": 574648113,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FqG3nAoq"
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
     -12.781065088757401
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gt0lKb4B",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Y3idzoPq",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "FqG3nAoq",
   "type": "text",
   "x": 343.8125,
   "y": 137.31508875739644,
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
   "seed": 1025910124,
   "version": 1,
   "versionNonce": 64925418,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "owns 0 to cap",
   "originalText": "owns 0 to cap",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9Zh5AHI5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KvDVXOS8",
   "type": "arrow",
   "x": 314.0,
   "y": 154.67532467532467,
   "width": 642.0,
   "height": 41.688311688311686,
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
   "seed": 1074363772,
   "version": 1,
   "versionNonce": 1653483568,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5NjABQ5j"
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
     642.0,
     -41.688311688311686
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gt0lKb4B",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "xgVsx6Ae",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5NjABQ5j",
   "type": "text",
   "x": 619.25,
   "y": 125.08116883116884,
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
   "seed": 1268489108,
   "version": 1,
   "versionNonce": 965510280,
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
   "containerId": "KvDVXOS8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "saOwGjl0",
   "type": "arrow",
   "x": 314.0,
   "y": 183.83683360258482,
   "width": 642.0,
   "height": 76.05815831987076,
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
   "seed": 318656863,
   "version": 1,
   "versionNonce": 582712391,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1ozEtfOM"
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
     642.0,
     76.05815831987076
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gt0lKb4B",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1ttQ7jj8",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "1ozEtfOM",
   "type": "text",
   "x": 603.5,
   "y": 213.1159127625202,
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
   "seed": 409433301,
   "version": 1,
   "versionNonce": 772642735,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "notifies",
   "originalText": "notifies",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "saOwGjl0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lQUdSDju",
   "type": "arrow",
   "x": 144.0,
   "y": 747.0,
   "width": 102.0,
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
   "seed": 1661947030,
   "version": 1,
   "versionNonce": 1527248244,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aOMZi1fd"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "SOn8MTnb",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8Ea7h6eg",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "aOMZi1fd",
   "type": "text",
   "x": 179.25,
   "y": 738.25,
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
   "seed": 1084675063,
   "version": 1,
   "versionNonce": 719477924,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "next",
   "originalText": "next",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "lQUdSDju",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "BR1KlaCH",
   "type": "arrow",
   "x": 246.0,
   "y": 723.0,
   "width": 102.0,
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
   "seed": 1410020537,
   "version": 1,
   "versionNonce": 1702261233,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oQvvQQKR"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "8Ea7h6eg",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "SOn8MTnb",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "oQvvQQKR",
   "type": "text",
   "x": 179.25,
   "y": 714.25,
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
   "seed": 932962351,
   "version": 1,
   "versionNonce": 493736750,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "prev",
   "originalText": "prev",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "BR1KlaCH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "73DxwC4a",
   "type": "arrow",
   "x": 394.0,
   "y": 747.0,
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
   "seed": 878124064,
   "version": 1,
   "versionNonce": 1083888669,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2NnfMxVX"
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
    "elementId": "8Ea7h6eg",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "2ZaKDpcz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "2NnfMxVX",
   "type": "text",
   "x": 444.25,
   "y": 738.25,
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
   "seed": 665849754,
   "version": 1,
   "versionNonce": 857494502,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "next",
   "originalText": "next",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "73DxwC4a",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fpzeY63z",
   "type": "arrow",
   "x": 526.0,
   "y": 723.0,
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
   "seed": 286497560,
   "version": 1,
   "versionNonce": 1931132068,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "185e40W0"
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
     -132.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2ZaKDpcz",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8Ea7h6eg",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "185e40W0",
   "type": "text",
   "x": 444.25,
   "y": 714.25,
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
   "seed": 362733295,
   "version": 1,
   "versionNonce": 51749148,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "prev",
   "originalText": "prev",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "fpzeY63z",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5dltJ2MD",
   "type": "arrow",
   "x": 674.0,
   "y": 747.0,
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
   "seed": 1600874040,
   "version": 1,
   "versionNonce": 1528526444,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kZpPZ0ct"
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
    "elementId": "2ZaKDpcz",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "So7EIg0v",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "kZpPZ0ct",
   "type": "text",
   "x": 724.25,
   "y": 738.25,
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
   "seed": 1971669282,
   "version": 1,
   "versionNonce": 871859545,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "next",
   "originalText": "next",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "5dltJ2MD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "z13BKPat",
   "type": "arrow",
   "x": 806.0,
   "y": 723.0,
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
   "seed": 365566735,
   "version": 1,
   "versionNonce": 440444888,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aqcSQZEy"
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
     -132.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "So7EIg0v",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "2ZaKDpcz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "aqcSQZEy",
   "type": "text",
   "x": 724.25,
   "y": 714.25,
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
   "seed": 2000591429,
   "version": 1,
   "versionNonce": 1063926278,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "prev",
   "originalText": "prev",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "z13BKPat",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "B4sNWLZ2",
   "type": "arrow",
   "x": 1007.0,
   "y": 747.0,
   "width": 109.0,
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
   "seed": 619792720,
   "version": 1,
   "versionNonce": 889741257,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lAPgmlPB"
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
     109.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "So7EIg0v",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8YYVHnx2",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "lAPgmlPB",
   "type": "text",
   "x": 1045.75,
   "y": 738.25,
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
   "seed": 1715843646,
   "version": 1,
   "versionNonce": 1308983613,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "next",
   "originalText": "next",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "B4sNWLZ2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "68UbaeBj",
   "type": "arrow",
   "x": 1116.0,
   "y": 723.0,
   "width": 109.0,
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
   "seed": 296422638,
   "version": 1,
   "versionNonce": 763096924,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZjdN6Ama"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "8YYVHnx2",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "So7EIg0v",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ZjdN6Ama",
   "type": "text",
   "x": 1045.75,
   "y": 714.25,
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
   "seed": 1562770921,
   "version": 1,
   "versionNonce": 990802571,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "prev",
   "originalText": "prev",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "68UbaeBj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ahEp6MJl",
   "type": "arrow",
   "x": 514.9325,
   "y": 594.0,
   "width": 141.015,
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
   "seed": 1069523967,
   "version": 1,
   "versionNonce": 2012008509,
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
     -141.015,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qLN8M7xv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8Ea7h6eg",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ljlb6ch7",
   "type": "arrow",
   "x": 597.5325,
   "y": 594.0,
   "width": 1.7849999999999682,
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
   "seed": 678864438,
   "version": 1,
   "versionNonce": 1645207712,
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
     1.7849999999999682,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qLN8M7xv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "2ZaKDpcz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "tuwh4qYV",
   "type": "arrow",
   "x": 687.95,
   "y": 594.0,
   "width": 158.0999999999999,
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
   "seed": 1741251810,
   "version": 1,
   "versionNonce": 800101039,
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
     158.0999999999999,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qLN8M7xv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "So7EIg0v",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "zVJgYQ7X",
   "type": "arrow",
   "x": 144.0,
   "y": 995.0,
   "width": 102.0,
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
   "seed": 1391670644,
   "version": 1,
   "versionNonce": 1739641486,
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
     102.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "NFPMF7S6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "6zMoL9TN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jKNQjMxD",
   "type": "arrow",
   "x": 394.0,
   "y": 995.0,
   "width": 122.0,
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
   "seed": 1841764025,
   "version": 1,
   "versionNonce": 374484345,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZvqgFEGZ"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "6zMoL9TN",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "BmlVqTTK",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ZvqgFEGZ",
   "type": "text",
   "x": 435.3125,
   "y": 986.25,
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
   "seed": 1798512349,
   "version": 1,
   "versionNonce": 2061762956,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "found",
   "originalText": "found",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jKNQjMxD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3z9KENd4",
   "type": "arrow",
   "x": 708.0,
   "y": 995.0,
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
   "seed": 43475468,
   "version": 1,
   "versionNonce": 1719008681,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "gtCBdLKd"
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
    "elementId": "BmlVqTTK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "OYtYQW9S",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "gtCBdLKd",
   "type": "text",
   "x": 764.125,
   "y": 986.25,
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
   "seed": 1884995075,
   "version": 1,
   "versionNonce": 120788639,
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
   "containerId": "3z9KENd4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "SgE74srD",
   "type": "arrow",
   "x": 327.55625,
   "y": 1034.0,
   "width": 15.887500000000045,
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
   "seed": 504926163,
   "version": 1,
   "versionNonce": 1936545940,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "efCJQhDq"
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
     15.887500000000045,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "6zMoL9TN",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "bCuCt4rx",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "efCJQhDq",
   "type": "text",
   "x": 319.75,
   "y": 1066.25,
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
   "seed": 1122941749,
   "version": 1,
   "versionNonce": 902292416,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "miss",
   "originalText": "miss",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "SgE74srD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gXNg2IuO",
   "type": "arrow",
   "x": 629.435294117647,
   "y": 1034.0,
   "width": 36.65882352941185,
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
   "seed": 1634584517,
   "version": 1,
   "versionNonce": 370767355,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0AFYSSo9"
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
     36.65882352941185,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "BmlVqTTK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "RPmCrUYr",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0AFYSSo9",
   "type": "text",
   "x": 635.9522058823529,
   "y": 1066.25,
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
   "seed": 2019966525,
   "version": 1,
   "versionNonce": 1521113363,
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
   "containerId": "gXNg2IuO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kh6vgLcO",
   "type": "arrow",
   "x": 170.0,
   "y": 1355.0,
   "width": 76.0,
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
   "seed": 387696396,
   "version": 1,
   "versionNonce": 153925600,
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
     76.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "DofdoFcA",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Be1V4g1q",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "H2miNL2V",
   "type": "arrow",
   "x": 394.0,
   "y": 1355.0,
   "width": 122.0,
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
   "seed": 609289402,
   "version": 1,
   "versionNonce": 1406831139,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lKLBvg4U"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Be1V4g1q",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "n22iRs4x",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "lKLBvg4U",
   "type": "text",
   "x": 447.125,
   "y": 1346.25,
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
   "seed": 962810013,
   "version": 1,
   "versionNonce": 363888705,
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
   "containerId": "H2miNL2V",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "It4DwAgL",
   "type": "arrow",
   "x": 664.0,
   "y": 1355.0,
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
   "seed": 1866717980,
   "version": 1,
   "versionNonce": 787468156,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "XhRFdhSq"
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
    "elementId": "n22iRs4x",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "M6x0QY7B",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "XhRFdhSq",
   "type": "text",
   "x": 722.125,
   "y": 1346.25,
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
   "seed": 1647487132,
   "version": 1,
   "versionNonce": 2122408263,
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
   "containerId": "It4DwAgL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Ktl45Dxf",
   "type": "arrow",
   "x": 321.83529411764704,
   "y": 1394.0,
   "width": 4.329411764705924,
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
   "seed": 535843515,
   "version": 1,
   "versionNonce": 927644300,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "RcwyhLN9"
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
     4.329411764705924,
     92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Be1V4g1q",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5wDfST7I",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "RcwyhLN9",
   "type": "text",
   "x": 312.1875,
   "y": 1431.25,
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
   "seed": 1276570655,
   "version": 1,
   "versionNonce": 1043339589,
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
   "containerId": "Ktl45Dxf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zW57YxGi",
   "type": "arrow",
   "x": 598.1441176470588,
   "y": 1394.0,
   "width": 19.211764705882388,
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
   "seed": 741319307,
   "version": 1,
   "versionNonce": 1093323994,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NhdmFt4r"
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
     19.211764705882388,
     92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "n22iRs4x",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5AIvrXRD",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NhdmFt4r",
   "type": "text",
   "x": 595.9375,
   "y": 1431.25,
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
   "seed": 953043457,
   "version": 1,
   "versionNonce": 1623341918,
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
   "containerId": "zW57YxGi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "X3V07LqX",
   "type": "arrow",
   "x": 690.7676470588235,
   "y": 1486.0,
   "width": 153.96470588235297,
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
   "seed": 33970960,
   "version": 1,
   "versionNonce": 800315773,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "d7HxBrKL"
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
     153.96470588235297,
     -92.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5AIvrXRD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "M6x0QY7B",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "d7HxBrKL",
   "type": "text",
   "x": 752.0,
   "y": 1431.25,
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
   "seed": 204042471,
   "version": 1,
   "versionNonce": 7709774,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "then",
   "originalText": "then",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "X3V07LqX",
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