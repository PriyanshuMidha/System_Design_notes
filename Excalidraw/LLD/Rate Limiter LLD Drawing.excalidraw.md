---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^m7KZu4Bg

2. Token bucket (capacity 10, refill 5 per second) ^2f9B0hCu

3. Core flow: Allow on every request ^NzSbmSYb

4. Storage: config in SQL, state in Redis ^dSOivvC3

Fixed window: 2x burst at edges.
Sliding log: exact, more memory.
Token bucket: bursts OK, average
controlled. Default choice. ^FSrNc6zK

<<interface>>
Limiter
+ Allow(ctx, key) (bool, error) ^iJhPAPiX

Middleware (Decorator)
- keyFn KeyFunc
- mode FailMode
+ wrap(next http.Handler) ^M3olJ8Qo

TokenBucket
- capacity, rate float64
- buckets map[key]*bucket
+ Allow(ctx, key) ^1NcAPIns

FixedWindow
- limit int, size Duration
- windows map[key]*window
+ Allow(ctx, key) ^vUk9lBDu

SlidingWindowLog
- limit int, window Duration
- logs map[key][]time.Time
+ Allow(ctx, key) ^hgOmLqFb

<<interface>>
Clock
+ Now() time.Time ^5ewvhGVH

bucket (per key)
- tokens float64
- last time.Time ^pNAQn5kl

Refill: +5 tokens per second
tokens = min(10, tokens + elapsed x 5)
(lazy, computed on each Allow) ^zWh23STZ

Request
(tokens = 3) ^X1TdaBk7

TOKEN BUCKET
capacity = 10 (max burst)
tokens now = 3
[o] [o] [o] [ ] [ ] ... ^dV6d82Ol

ALLOWED
tokens = tokens - 1
-> handler, 200 ^7KsETifx

Request
(tokens = 0) ^qq0r1IzY

DENIED
429 Too Many Requests
Retry-After: 1 ^CgXCANnN

Client request ^Y0at1FmH

Middleware
key = user ID or IP ^Mji8d6LB

Limiter.Allow
(memory or Redis Lua) ^zbVLAhpb

Handler -> 200 ^1AVJ6HoK

429 Too Many Requests
Retry-After: 1 ^EJNd21dV

Redis down + FailClosed
503 (login, OTP, payment) ^ihjwA9og

Redis down + FailOpen
serve anyway, alert ^etx9PpcL

rate_limit_policies (SQL, config)
id PK, name UNIQUE
algorithm: fixed | sliding | token
capacity > 0
refill_per_sec, window_seconds
fail_mode: open | closed ^JxmoapTz

Redis (state, hot path)
fixed:   INCR + EXPIRE rl:{key}:{window}
token:   HASH {tokens, last}
sliding: ZSET of timestamps
one Lua script per check = atomic
use Redis TIME, not pod clocks ^tV6wjbIW

implements ^W1sLCQtJ

implements ^Ofo15FMr

implements ^nRGOZXYJ

uses ^NLUFhiIe

uses (all 3 do) ^x6d3N533

1 to many, per key ^lvkjobP6

drip in ^xjVrAfPl

take 1 ^7wZ6xcmn

tokens >= 1 ^ki9VmB4x

take 1 ^0crFYDKc

tokens < 1 ^B5m7INNu

Allow ^tnm6VaSB

allowed ^5UPYWRoG

denied ^hGf91e9W

error ^IafBYwy2

error ^J2tp01Rd

factory builds limiter ^dsgv3qjx

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "m7KZu4Bg",
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
   "seed": 1091603838,
   "version": 1,
   "versionNonce": 1426807113,
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
   "id": "2f9B0hCu",
   "type": "text",
   "x": 0,
   "y": 640,
   "width": 787.5,
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
   "seed": 1803042333,
   "version": 1,
   "versionNonce": 1120007006,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Token bucket (capacity 10, refill 5 per second)",
   "originalText": "2. Token bucket (capacity 10, refill 5 per second)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NzSbmSYb",
   "type": "text",
   "x": 0,
   "y": 1260,
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
   "seed": 976248308,
   "version": 1,
   "versionNonce": 530793945,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Core flow: Allow on every request",
   "originalText": "3. Core flow: Allow on every request",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dSOivvC3",
   "type": "text",
   "x": 0,
   "y": 1720,
   "width": 645.75,
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
   "seed": 90924907,
   "version": 1,
   "versionNonce": 1913211625,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "4. Storage: config in SQL, state in Redis",
   "originalText": "4. Storage: config in SQL, state in Redis",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FSrNc6zK",
   "type": "text",
   "x": 1060,
   "y": 440,
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
   "seed": 521855897,
   "version": 1,
   "versionNonce": 832941577,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Fixed window: 2x burst at edges.\nSliding log: exact, more memory.\nToken bucket: bursts OK, average\ncontrolled. Default choice.",
   "originalText": "Fixed window: 2x burst at edges.\nSliding log: exact, more memory.\nToken bucket: bursts OK, average\ncontrolled. Default choice.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DPxlaJ6k",
   "type": "rectangle",
   "x": 400,
   "y": 60,
   "width": 319.0,
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
   "seed": 486702038,
   "version": 1,
   "versionNonce": 237001497,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iJhPAPiX"
    },
    {
     "type": "arrow",
     "id": "ar1sRp1F"
    },
    {
     "type": "arrow",
     "id": "LEouNYsH"
    },
    {
     "type": "arrow",
     "id": "rhC98P1G"
    },
    {
     "type": "arrow",
     "id": "vaaIHDQX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "iJhPAPiX",
   "type": "text",
   "x": 412,
   "y": 75.0,
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
   "seed": 974832078,
   "version": 1,
   "versionNonce": 658465108,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nLimiter\n+ Allow(ctx, key) (bool, error)",
   "originalText": "<<interface>>\nLimiter\n+ Allow(ctx, key) (bool, error)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "DPxlaJ6k",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EJgh91Co",
   "type": "rectangle",
   "x": 860,
   "y": 60,
   "width": 265.0,
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
   "seed": 656821462,
   "version": 1,
   "versionNonce": 2130474851,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "M3olJ8Qo"
    },
    {
     "type": "arrow",
     "id": "vaaIHDQX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "M3olJ8Qo",
   "type": "text",
   "x": 872,
   "y": 75.0,
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
   "seed": 1616275207,
   "version": 1,
   "versionNonce": 1477052971,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Middleware (Decorator)\n- keyFn KeyFunc\n- mode FailMode\n+ wrap(next http.Handler)",
   "originalText": "Middleware (Decorator)\n- keyFn KeyFunc\n- mode FailMode\n+ wrap(next http.Handler)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "EJgh91Co",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lJ71uGpj",
   "type": "rectangle",
   "x": 0,
   "y": 280,
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
   "seed": 543094483,
   "version": 1,
   "versionNonce": 1521507907,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1NcAPIns"
    },
    {
     "type": "arrow",
     "id": "ar1sRp1F"
    },
    {
     "type": "arrow",
     "id": "VdafIIsW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "1NcAPIns",
   "type": "text",
   "x": 12,
   "y": 295.0,
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
   "seed": 812838116,
   "version": 1,
   "versionNonce": 294394018,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "TokenBucket\n- capacity, rate float64\n- buckets map[key]*bucket\n+ Allow(ctx, key)",
   "originalText": "TokenBucket\n- capacity, rate float64\n- buckets map[key]*bucket\n+ Allow(ctx, key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lJ71uGpj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Ck0rYkiy",
   "type": "rectangle",
   "x": 340,
   "y": 280,
   "width": 274.0,
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
   "seed": 1379452116,
   "version": 1,
   "versionNonce": 480186346,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vUk9lBDu"
    },
    {
     "type": "arrow",
     "id": "LEouNYsH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vUk9lBDu",
   "type": "text",
   "x": 352,
   "y": 295.0,
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
   "seed": 837519078,
   "version": 1,
   "versionNonce": 1913099818,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "FixedWindow\n- limit int, size Duration\n- windows map[key]*window\n+ Allow(ctx, key)",
   "originalText": "FixedWindow\n- limit int, size Duration\n- windows map[key]*window\n+ Allow(ctx, key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Ck0rYkiy",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "PfhpgoC2",
   "type": "rectangle",
   "x": 680,
   "y": 280,
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
   "seed": 1266572736,
   "version": 1,
   "versionNonce": 1095125257,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hgOmLqFb"
    },
    {
     "type": "arrow",
     "id": "rhC98P1G"
    },
    {
     "type": "arrow",
     "id": "cN1hV1zV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hgOmLqFb",
   "type": "text",
   "x": 692,
   "y": 295.0,
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
   "seed": 114279665,
   "version": 1,
   "versionNonce": 1928183192,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SlidingWindowLog\n- limit int, window Duration\n- logs map[key][]time.Time\n+ Allow(ctx, key)",
   "originalText": "SlidingWindowLog\n- limit int, window Duration\n- logs map[key][]time.Time\n+ Allow(ctx, key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "PfhpgoC2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uy1WEWiO",
   "type": "rectangle",
   "x": 1060,
   "y": 280,
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
   "seed": 1069157112,
   "version": 1,
   "versionNonce": 420572450,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5ewvhGVH"
    },
    {
     "type": "arrow",
     "id": "cN1hV1zV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5ewvhGVH",
   "type": "text",
   "x": 1072,
   "y": 295.0,
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
   "seed": 604278516,
   "version": 1,
   "versionNonce": 1702491727,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nClock\n+ Now() time.Time",
   "originalText": "<<interface>>\nClock\n+ Now() time.Time",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "uy1WEWiO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rsUmyOBI",
   "type": "rectangle",
   "x": 0,
   "y": 480,
   "width": 184.0,
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
   "seed": 800483388,
   "version": 1,
   "versionNonce": 1564134476,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pNAQn5kl"
    },
    {
     "type": "arrow",
     "id": "VdafIIsW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "pNAQn5kl",
   "type": "text",
   "x": 12,
   "y": 495.0,
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
   "seed": 332232344,
   "version": 1,
   "versionNonce": 1434746944,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "bucket (per key)\n- tokens float64\n- last time.Time",
   "originalText": "bucket (per key)\n- tokens float64\n- last time.Time",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "rsUmyOBI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aFamvMmk",
   "type": "rectangle",
   "x": 380,
   "y": 700,
   "width": 382.0,
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
   "seed": 386262872,
   "version": 1,
   "versionNonce": 36845408,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zWh23STZ"
    },
    {
     "type": "arrow",
     "id": "gLS23b38"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "zWh23STZ",
   "type": "text",
   "x": 392,
   "y": 715.0,
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
   "seed": 845791361,
   "version": 1,
   "versionNonce": 928914308,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Refill: +5 tokens per second\ntokens = min(10, tokens + elapsed x 5)\n(lazy, computed on each Allow)",
   "originalText": "Refill: +5 tokens per second\ntokens = min(10, tokens + elapsed x 5)\n(lazy, computed on each Allow)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "aFamvMmk",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ZmpdZlL5",
   "type": "rectangle",
   "x": 0,
   "y": 900,
   "width": 148.0,
   "height": 70.0,
   "angle": 0,
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
   "seed": 973588618,
   "version": 1,
   "versionNonce": 855105954,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "X1TdaBk7"
    },
    {
     "type": "arrow",
     "id": "vh8xQcZJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "X1TdaBk7",
   "type": "text",
   "x": 12,
   "y": 915.0,
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
   "seed": 512837864,
   "version": 1,
   "versionNonce": 1534627272,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Request\n(tokens = 3)",
   "originalText": "Request\n(tokens = 3)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ZmpdZlL5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nxqqEa92",
   "type": "rectangle",
   "x": 380,
   "y": 880,
   "width": 300,
   "height": 180,
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
   "seed": 603611545,
   "version": 1,
   "versionNonce": 630011122,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dV6d82Ol"
    },
    {
     "type": "arrow",
     "id": "gLS23b38"
    },
    {
     "type": "arrow",
     "id": "vh8xQcZJ"
    },
    {
     "type": "arrow",
     "id": "mbYWfUjO"
    },
    {
     "type": "arrow",
     "id": "Ui4GevkV"
    },
    {
     "type": "arrow",
     "id": "tm29yEjp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dV6d82Ol",
   "type": "text",
   "x": 392,
   "y": 930.0,
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
   "seed": 2013213102,
   "version": 1,
   "versionNonce": 421396462,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "TOKEN BUCKET\ncapacity = 10 (max burst)\ntokens now = 3\n[o] [o] [o] [ ] [ ] ...",
   "originalText": "TOKEN BUCKET\ncapacity = 10 (max burst)\ntokens now = 3\n[o] [o] [o] [ ] [ ] ...",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "nxqqEa92",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ZWLFpwNN",
   "type": "rectangle",
   "x": 820,
   "y": 860,
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
   "seed": 637176746,
   "version": 1,
   "versionNonce": 418191748,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7KsETifx"
    },
    {
     "type": "arrow",
     "id": "mbYWfUjO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7KsETifx",
   "type": "text",
   "x": 832,
   "y": 875.0,
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
   "seed": 133099132,
   "version": 1,
   "versionNonce": 1701145886,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ALLOWED\ntokens = tokens - 1\n-> handler, 200",
   "originalText": "ALLOWED\ntokens = tokens - 1\n-> handler, 200",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ZWLFpwNN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ZtCSr142",
   "type": "rectangle",
   "x": 0,
   "y": 1100,
   "width": 148.0,
   "height": 70.0,
   "angle": 0,
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
   "seed": 276692728,
   "version": 1,
   "versionNonce": 929200865,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qq0r1IzY"
    },
    {
     "type": "arrow",
     "id": "Ui4GevkV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "qq0r1IzY",
   "type": "text",
   "x": 12,
   "y": 1115.0,
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
   "seed": 1456194595,
   "version": 1,
   "versionNonce": 1234511163,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Request\n(tokens = 0)",
   "originalText": "Request\n(tokens = 0)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ZtCSr142",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "T38go0eb",
   "type": "rectangle",
   "x": 820,
   "y": 1060,
   "width": 229.0,
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
   "seed": 174647451,
   "version": 1,
   "versionNonce": 682484739,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "CgXCANnN"
    },
    {
     "type": "arrow",
     "id": "tm29yEjp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "CgXCANnN",
   "type": "text",
   "x": 832,
   "y": 1075.0,
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
   "seed": 687374043,
   "version": 1,
   "versionNonce": 1881055691,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "DENIED\n429 Too Many Requests\nRetry-After: 1",
   "originalText": "DENIED\n429 Too Many Requests\nRetry-After: 1",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "T38go0eb",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "q4lZAVqG",
   "type": "rectangle",
   "x": 0,
   "y": 1320,
   "width": 166.0,
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
   "seed": 1757666201,
   "version": 1,
   "versionNonce": 1111013510,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Y0at1FmH"
    },
    {
     "type": "arrow",
     "id": "UIgyYP2W"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Y0at1FmH",
   "type": "text",
   "x": 20.0,
   "y": 1340.0,
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
   "seed": 2117377909,
   "version": 1,
   "versionNonce": 167953286,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Client request",
   "originalText": "Client request",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "q4lZAVqG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QnM2RLAa",
   "type": "rectangle",
   "x": 300,
   "y": 1320,
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
   "seed": 1996307788,
   "version": 1,
   "versionNonce": 1863102220,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Mji8d6LB"
    },
    {
     "type": "arrow",
     "id": "UIgyYP2W"
    },
    {
     "type": "arrow",
     "id": "fnKjAUg9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Mji8d6LB",
   "type": "text",
   "x": 312,
   "y": 1335.0,
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
   "seed": 901009494,
   "version": 1,
   "versionNonce": 1486154985,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Middleware\nkey = user ID or IP",
   "originalText": "Middleware\nkey = user ID or IP",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "QnM2RLAa",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "l8mPznRs",
   "type": "rectangle",
   "x": 620,
   "y": 1320,
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
   "seed": 1608171364,
   "version": 1,
   "versionNonce": 635492515,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zbVLAhpb"
    },
    {
     "type": "arrow",
     "id": "fnKjAUg9"
    },
    {
     "type": "arrow",
     "id": "nPFKIgzI"
    },
    {
     "type": "arrow",
     "id": "emvRLIXw"
    },
    {
     "type": "arrow",
     "id": "kCePRVHj"
    },
    {
     "type": "arrow",
     "id": "mFYLLp8T"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "zbVLAhpb",
   "type": "text",
   "x": 632,
   "y": 1335.0,
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
   "seed": 1615492611,
   "version": 1,
   "versionNonce": 198452365,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Limiter.Allow\n(memory or Redis Lua)",
   "originalText": "Limiter.Allow\n(memory or Redis Lua)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "l8mPznRs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Okgqqda4",
   "type": "rectangle",
   "x": 980,
   "y": 1320,
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
   "seed": 678461529,
   "version": 1,
   "versionNonce": 857651580,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1AVJ6HoK"
    },
    {
     "type": "arrow",
     "id": "nPFKIgzI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "1AVJ6HoK",
   "type": "text",
   "x": 1000.0,
   "y": 1340.0,
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
   "seed": 1436160278,
   "version": 1,
   "versionNonce": 1729294515,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Handler -> 200",
   "originalText": "Handler -> 200",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Okgqqda4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Xcz3yrc1",
   "type": "rectangle",
   "x": 260,
   "y": 1520,
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
   "seed": 684323277,
   "version": 1,
   "versionNonce": 303318184,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EJNd21dV"
    },
    {
     "type": "arrow",
     "id": "emvRLIXw"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EJNd21dV",
   "type": "text",
   "x": 272,
   "y": 1535.0,
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
   "seed": 1192246908,
   "version": 1,
   "versionNonce": 710049056,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "429 Too Many Requests\nRetry-After: 1",
   "originalText": "429 Too Many Requests\nRetry-After: 1",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Xcz3yrc1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fMYgTcQN",
   "type": "rectangle",
   "x": 620,
   "y": 1520,
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
   "seed": 1557670117,
   "version": 1,
   "versionNonce": 688582348,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ihjwA9og"
    },
    {
     "type": "arrow",
     "id": "kCePRVHj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ihjwA9og",
   "type": "text",
   "x": 632,
   "y": 1535.0,
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
   "seed": 649484619,
   "version": 1,
   "versionNonce": 5767089,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Redis down + FailClosed\n503 (login, OTP, payment)",
   "originalText": "Redis down + FailClosed\n503 (login, OTP, payment)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "fMYgTcQN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mxmw6dkF",
   "type": "rectangle",
   "x": 1000,
   "y": 1520,
   "width": 229.0,
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
   "seed": 1561722929,
   "version": 1,
   "versionNonce": 345027451,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "etx9PpcL"
    },
    {
     "type": "arrow",
     "id": "mFYLLp8T"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "etx9PpcL",
   "type": "text",
   "x": 1012,
   "y": 1535.0,
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
   "seed": 1149803304,
   "version": 1,
   "versionNonce": 560259455,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Redis down + FailOpen\nserve anyway, alert",
   "originalText": "Redis down + FailOpen\nserve anyway, alert",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "mxmw6dkF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jgvIKDz3",
   "type": "rectangle",
   "x": 0,
   "y": 1780,
   "width": 346.0,
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
   "seed": 167830614,
   "version": 1,
   "versionNonce": 594713981,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JxmoapTz"
    },
    {
     "type": "arrow",
     "id": "hpktpZE9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "JxmoapTz",
   "type": "text",
   "x": 12,
   "y": 1795.0,
   "width": 306.0,
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
   "seed": 1456766209,
   "version": 1,
   "versionNonce": 1778123308,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "rate_limit_policies (SQL, config)\nid PK, name UNIQUE\nalgorithm: fixed | sliding | token\ncapacity > 0\nrefill_per_sec, window_seconds\nfail_mode: open | closed",
   "originalText": "rate_limit_policies (SQL, config)\nid PK, name UNIQUE\nalgorithm: fixed | sliding | token\ncapacity > 0\nrefill_per_sec, window_seconds\nfail_mode: open | closed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "jgvIKDz3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KuNmLja4",
   "type": "rectangle",
   "x": 520,
   "y": 1780,
   "width": 400.0,
   "height": 150.0,
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
   "seed": 1228222114,
   "version": 1,
   "versionNonce": 335576603,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tV6wjbIW"
    },
    {
     "type": "arrow",
     "id": "hpktpZE9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "tV6wjbIW",
   "type": "text",
   "x": 532,
   "y": 1795.0,
   "width": 360.0,
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
   "seed": 1558780742,
   "version": 1,
   "versionNonce": 1338071451,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Redis (state, hot path)\nfixed:   INCR + EXPIRE rl:{key}:{window}\ntoken:   HASH {tokens, last}\nsliding: ZSET of timestamps\none Lua script per check = atomic\nuse Redis TIME, not pod clocks",
   "originalText": "Redis (state, hot path)\nfixed:   INCR + EXPIRE rl:{key}:{window}\ntoken:   HASH {tokens, last}\nsliding: ZSET of timestamps\none Lua script per check = atomic\nuse Redis TIME, not pod clocks",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KuNmLja4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ar1sRp1F",
   "type": "arrow",
   "x": 242.03478260869565,
   "y": 276.0,
   "width": 226.49565217391307,
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
   "seed": 410530508,
   "version": 1,
   "versionNonce": 14581628,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "W1sLCQtJ"
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
     226.49565217391307,
     -122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "lJ71uGpj",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "DPxlaJ6k",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "W1sLCQtJ",
   "type": "text",
   "x": 315.9076086956522,
   "y": 206.25,
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
   "seed": 774461182,
   "version": 1,
   "versionNonce": 1757099356,
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
   "containerId": "ar1sRp1F",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LEouNYsH",
   "type": "arrow",
   "x": 498.1630434782609,
   "y": 276.0,
   "width": 43.76086956521738,
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
   "seed": 960204913,
   "version": 1,
   "versionNonce": 1827014799,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Ofo15FMr"
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
     43.76086956521738,
     -122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Ck0rYkiy",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "DPxlaJ6k",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "Ofo15FMr",
   "type": "text",
   "x": 480.6684782608695,
   "y": 206.25,
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
   "seed": 1160844122,
   "version": 1,
   "versionNonce": 575184295,
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
   "containerId": "LEouNYsH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rhC98P1G",
   "type": "arrow",
   "x": 757.6369565217391,
   "y": 276.0,
   "width": 141.36086956521729,
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
   "seed": 1666011596,
   "version": 1,
   "versionNonce": 212192263,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nRGOZXYJ"
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
     -141.36086956521729,
     -122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "PfhpgoC2",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "DPxlaJ6k",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "nRGOZXYJ",
   "type": "text",
   "x": 647.5815217391305,
   "y": 206.25,
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
   "seed": 1922507056,
   "version": 1,
   "versionNonce": 1372510906,
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
   "containerId": "rhC98P1G",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vaaIHDQX",
   "type": "arrow",
   "x": 856.0,
   "y": 111.84757505773672,
   "width": 133.0,
   "height": 3.0715935334873024,
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
   "seed": 571772820,
   "version": 1,
   "versionNonce": 816972372,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NLUFhiIe"
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
     -133.0,
     -3.0715935334873024
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "EJgh91Co",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "DPxlaJ6k",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NLUFhiIe",
   "type": "text",
   "x": 773.75,
   "y": 101.56177829099306,
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
   "seed": 85026915,
   "version": 1,
   "versionNonce": 422830729,
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
   "containerId": "vaaIHDQX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cN1hV1zV",
   "type": "arrow",
   "x": 976.0,
   "y": 330.46142208774586,
   "width": 80.0,
   "height": 2.420574886535576,
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
   "seed": 2110672170,
   "version": 1,
   "versionNonce": 620256534,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "x6d3N533"
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
     80.0,
     -2.420574886535576
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "PfhpgoC2",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "uy1WEWiO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "x6d3N533",
   "type": "text",
   "x": 956.9375,
   "y": 320.50113464447804,
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
   "seed": 848736403,
   "version": 1,
   "versionNonce": 2102875933,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "uses (all 3 do)",
   "originalText": "uses (all 3 do)",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "cN1hV1zV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "VdafIIsW",
   "type": "arrow",
   "x": 119.92368421052632,
   "y": 394.0,
   "width": 17.478947368421046,
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
   "seed": 2014174802,
   "version": 1,
   "versionNonce": 714315715,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lvkjobP6"
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
     -17.478947368421046,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "lJ71uGpj",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "rsUmyOBI",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "lvkjobP6",
   "type": "text",
   "x": 40.309210526315795,
   "y": 426.25,
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
   "seed": 797214126,
   "version": 1,
   "versionNonce": 364312654,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1 to many, per key",
   "originalText": "1 to many, per key",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "VdafIIsW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gLS23b38",
   "type": "arrow",
   "x": 562.0711111111111,
   "y": 794.0,
   "width": 14.942222222222199,
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
   "seed": 1283532566,
   "version": 1,
   "versionNonce": 583060358,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xjVrAfPl"
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
     -14.942222222222199,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "aFamvMmk",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "nxqqEa92",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "xjVrAfPl",
   "type": "text",
   "x": 527.0375,
   "y": 826.25,
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
   "seed": 1680240048,
   "version": 1,
   "versionNonce": 1662358939,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "drip in",
   "originalText": "drip in",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "gLS23b38",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vh8xQcZJ",
   "type": "arrow",
   "x": 152.0,
   "y": 940.9868421052631,
   "width": 224.0,
   "height": 17.192982456140385,
   "angle": 0,
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
   "seed": 859863838,
   "version": 1,
   "versionNonce": 145110971,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7wZ6xcmn"
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
     224.0,
     17.192982456140385
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ZmpdZlL5",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "nxqqEa92",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7wZ6xcmn",
   "type": "text",
   "x": 240.375,
   "y": 940.8333333333333,
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
   "seed": 343200254,
   "version": 1,
   "versionNonce": 1577426955,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "take 1",
   "originalText": "take 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "vh8xQcZJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mbYWfUjO",
   "type": "arrow",
   "x": 684.0,
   "y": 944.6902654867257,
   "width": 132.0,
   "height": 21.694058154235222,
   "angle": 0,
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
   "seed": 694622539,
   "version": 1,
   "versionNonce": 1461189933,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ki9VmB4x"
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
     -21.694058154235222
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "nxqqEa92",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ZWLFpwNN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ki9VmB4x",
   "type": "text",
   "x": 706.6875,
   "y": 925.0932364096082,
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
   "seed": 1738687829,
   "version": 1,
   "versionNonce": 1087703129,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "tokens >= 1",
   "originalText": "tokens >= 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "mbYWfUjO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Ui4GevkV",
   "type": "arrow",
   "x": 152.0,
   "y": 1106.7763157894738,
   "width": 224.0,
   "height": 81.05263157894751,
   "angle": 0,
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
   "seed": 1498180751,
   "version": 1,
   "versionNonce": 1887831229,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0crFYDKc"
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
     224.0,
     -81.05263157894751
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ZtCSr142",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "nxqqEa92",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0crFYDKc",
   "type": "text",
   "x": 240.375,
   "y": 1057.5,
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
   "seed": 215292659,
   "version": 1,
   "versionNonce": 550516042,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "take 1",
   "originalText": "take 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Ui4GevkV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tm29yEjp",
   "type": "arrow",
   "x": 684.0,
   "y": 1021.3967861557478,
   "width": 132.0,
   "height": 44.05438813349815,
   "angle": 0,
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
   "seed": 2120207202,
   "version": 1,
   "versionNonce": 1688970045,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "B5m7INNu"
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
     44.05438813349815
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "nxqqEa92",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "T38go0eb",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "B5m7INNu",
   "type": "text",
   "x": 710.625,
   "y": 1034.673980222497,
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
   "seed": 890544505,
   "version": 1,
   "versionNonce": 859207439,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "tokens < 1",
   "originalText": "tokens < 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "tm29yEjp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "UIgyYP2W",
   "type": "arrow",
   "x": 170.0,
   "y": 1351.3488372093022,
   "width": 126.0,
   "height": 1.9534883720930338,
   "angle": 0,
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
   "seed": 1963820955,
   "version": 1,
   "versionNonce": 557438,
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
     126.0,
     1.9534883720930338
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "q4lZAVqG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "QnM2RLAa",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "fnKjAUg9",
   "type": "arrow",
   "x": 515.0,
   "y": 1355.0,
   "width": 101.0,
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
   "seed": 745211545,
   "version": 1,
   "versionNonce": 323601464,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tnm6VaSB"
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
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "QnM2RLAa",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "l8mPznRs",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "tnm6VaSB",
   "type": "text",
   "x": 545.8125,
   "y": 1346.25,
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
   "seed": 806144000,
   "version": 1,
   "versionNonce": 1032666003,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Allow",
   "originalText": "Allow",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "fnKjAUg9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nPFKIgzI",
   "type": "arrow",
   "x": 853.0,
   "y": 1353.1963470319636,
   "width": 123.0,
   "height": 1.8721461187215027,
   "angle": 0,
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
   "seed": 1585239357,
   "version": 1,
   "versionNonce": 1177728665,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5UPYWRoG"
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
     123.0,
     -1.8721461187215027
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "l8mPznRs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Okgqqda4",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5UPYWRoG",
   "type": "text",
   "x": 886.9375,
   "y": 1343.5102739726028,
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
   "seed": 1638833064,
   "version": 1,
   "versionNonce": 1292088711,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "allowed",
   "originalText": "allowed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "nPFKIgzI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "emvRLIXw",
   "type": "arrow",
   "x": 664.3,
   "y": 1394.0,
   "width": 219.59999999999997,
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
   "seed": 1387220598,
   "version": 1,
   "versionNonce": 2111039996,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hGf91e9W"
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
     -219.59999999999997,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "l8mPznRs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Xcz3yrc1",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "hGf91e9W",
   "type": "text",
   "x": 530.875,
   "y": 1446.25,
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
   "seed": 1064213738,
   "version": 1,
   "versionNonce": 1908962851,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "denied",
   "originalText": "denied",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "emvRLIXw",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kCePRVHj",
   "type": "arrow",
   "x": 738.01,
   "y": 1394.0,
   "width": 10.980000000000018,
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
   "seed": 142798775,
   "version": 1,
   "versionNonce": 1336432175,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IafBYwy2"
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
     10.980000000000018,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "l8mPznRs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "fMYgTcQN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "IafBYwy2",
   "type": "text",
   "x": 723.8125,
   "y": 1446.25,
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
   "seed": 639684402,
   "version": 1,
   "versionNonce": 1386603681,
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
   "containerId": "kCePRVHj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mFYLLp8T",
   "type": "arrow",
   "x": 808.6,
   "y": 1394.0,
   "width": 231.80000000000007,
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
   "seed": 184461166,
   "version": 1,
   "versionNonce": 1967055,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "J2tp01Rd"
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
     231.80000000000007,
     122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "l8mPznRs",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "mxmw6dkF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "J2tp01Rd",
   "type": "text",
   "x": 904.8125,
   "y": 1446.25,
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
   "seed": 2039527366,
   "version": 1,
   "versionNonce": 352124708,
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
   "containerId": "mFYLLp8T",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hpktpZE9",
   "type": "arrow",
   "x": 350.0,
   "y": 1855.0,
   "width": 166.0,
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
   "seed": 1956053108,
   "version": 1,
   "versionNonce": 2082272653,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dsgv3qjx"
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
     166.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jgvIKDz3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "KuNmLja4",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "dsgv3qjx",
   "type": "text",
   "x": 346.375,
   "y": 1846.25,
   "width": 173.25,
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
   "seed": 874596793,
   "version": 1,
   "versionNonce": 1315371796,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "factory builds limiter",
   "originalText": "factory builds limiter",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "hpktpZE9",
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