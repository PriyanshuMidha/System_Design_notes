---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^hBeQmKo2

2. Core flow: worker processes one notification ^veIhbgXF

3. State machine: Notification ^5K7JcyPT

4. Storage ^6Q0jaaOk

OrderListener (Observer)
+ OnOrderEvent(ctx, e)
one Notification per channel ^GlQoadKj

Service (Facade)
- queue chan Notification
+ Enqueue (non-blocking)
+ Start(ctx, workers)
+ Process(ctx, n) ^EkwtqHmR

SenderFactory
+ Get(channel) Sender ^SODNgmVa

<<interface>>
Sender
+ Send(ctx, to, body) error ^EtfxEsW5

<<interface>>
PrefStore
+ Get(ctx, userID) UserPrefs ^2lAjyVM0

IdemStore
+ Claim(key) bool
+ Release(key) ^8ljWXXIC

SMSAdapter
wraps SendSMS(phone, text) ^Y65plbJp

WhatsAppAdapter
wraps PostMessage(
  WhatsAppMessage) ^RwYcfI8N

RateLimitedSender
(Decorator)
- Next Sender
- Limit *TokenBucket ^XMFtFJqD

TokenBucket
- capacity, perSec
- tokens, now func()
+ Allow() bool ^Udstt9bU

Order event
placed ^z3wiqvhY

OrderListener
key = order:123:placed:sms ^jcFq0ANX

Bounded queue
full -> ErrQueueFull ^RWZKtMwY

Worker pool
N goroutines ^Xib2vznb

Claim
idempotency key ^GEsLlONL

Duplicate:
ErrDuplicate, drop ^tV0HMNcE

Prefs: opted out?
contact? render template ^EeoHDNtp

Factory.Get(channel) ^JRAEkKkI

RateLimitedSender
take a token ^L3ho4Fwr

Provider adapter
SMS / WhatsApp / email ^5lmRzkge

Sent ^ceLa5u4c

Opted out or no contact:
skip, no retry ^UWrJriwf

Error or ErrRateLimited:
backoff 100, 200, 400 ms ^d0h9nzLg

Max retries:
release key, DLQ ^K8kuuXIK

Pending ^hrzFE62O

Sending ^b4n8ufls

Sent ^stkBRKby

Skipped ^QRsTbKEO

Retrying ^GuuiH705

Failed
(DLQ) ^mMC1zTz2

notifications
id PK
idempotency_key UNIQUE
status, attempts, last_error ^I78aRyyZ

delivery_attempts
notification_id, attempt
provider, error
PK (notification_id, attempt) ^Dea6GQns

user_preferences
user_id, channel, contact
opted_out, opted_in_at
PK (user_id, channel) ^pZV3Nxok

templates
id, channel, body
PK (id, channel) ^KiIl0CwP

Enqueue ^KHjTJ9z7

uses ^GcBFxK5V

uses ^Xtp1S0qx

owns ^cn83OBOP

1 per channel ^DeDGsmLK

implements ^HC04jBOy

implements ^oRAAFbms

implements + wraps ^iYJL6RDJ

1 per provider ^o1yVqqrl

already claimed ^YdmdRBpO

no ^GkOokxYs

fail ^NiClorw9

no token ^xaVmBlQX

give up ^hT91piXT

worker claims key ^AuI54x5s

provider ok ^zKeVUrat

error / rate limited ^20CoaVvG

after backoff ^EmMlcKWO

max retries ^jFav00Wm

opted out ^vqaqY4Wl

many to 1 ^F58C6fTJ

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "hBeQmKo2",
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
   "seed": 684778176,
   "version": 1,
   "versionNonce": 136040302,
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
   "id": "veIhbgXF",
   "type": "text",
   "x": 0,
   "y": 970.0,
   "width": 740.25,
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
   "seed": 420265171,
   "version": 1,
   "versionNonce": 496235672,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: worker processes one notification",
   "originalText": "2. Core flow: worker processes one notification",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5K7JcyPT",
   "type": "text",
   "x": 0,
   "y": 1820.0,
   "width": 472.5,
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
   "seed": 973696299,
   "version": 1,
   "versionNonce": 2139497509,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machine: Notification",
   "originalText": "3. State machine: Notification",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6Q0jaaOk",
   "type": "text",
   "x": 0,
   "y": 2480.0,
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
   "seed": 1517342463,
   "version": 1,
   "versionNonce": 1223622556,
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
   "id": "RJ0J7abW",
   "type": "rectangle",
   "x": 200,
   "y": 70,
   "width": 292.0,
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
   "seed": 402152659,
   "version": 1,
   "versionNonce": 1875347622,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GlQoadKj"
    },
    {
     "type": "arrow",
     "id": "yUgYVy0E"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "GlQoadKj",
   "type": "text",
   "x": 212,
   "y": 85.0,
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
   "seed": 951381040,
   "version": 1,
   "versionNonce": 1893107358,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OrderListener (Observer)\n+ OnOrderEvent(ctx, e)\none Notification per channel",
   "originalText": "OrderListener (Observer)\n+ OnOrderEvent(ctx, e)\none Notification per channel",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "RJ0J7abW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ITgV0v4q",
   "type": "rectangle",
   "x": 692.0,
   "y": 70,
   "width": 265.0,
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
   "seed": 830948574,
   "version": 1,
   "versionNonce": 853153803,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EkwtqHmR"
    },
    {
     "type": "arrow",
     "id": "yUgYVy0E"
    },
    {
     "type": "arrow",
     "id": "MOOQxWib"
    },
    {
     "type": "arrow",
     "id": "9Ite8Ahj"
    },
    {
     "type": "arrow",
     "id": "GCCs9L0y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EkwtqHmR",
   "type": "text",
   "x": 704.0,
   "y": 85.0,
   "width": 225.0,
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
   "seed": 315870253,
   "version": 1,
   "versionNonce": 1717155077,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Service (Facade)\n- queue chan Notification\n+ Enqueue (non-blocking)\n+ Start(ctx, workers)\n+ Process(ctx, n)",
   "originalText": "Service (Facade)\n- queue chan Notification\n+ Enqueue (non-blocking)\n+ Start(ctx, workers)\n+ Process(ctx, n)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ITgV0v4q",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tW821X5t",
   "type": "rectangle",
   "x": 0,
   "y": 350.0,
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
   "seed": 10400316,
   "version": 1,
   "versionNonce": 747425642,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "SODNgmVa"
    },
    {
     "type": "arrow",
     "id": "MOOQxWib"
    },
    {
     "type": "arrow",
     "id": "EYHOazRL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "SODNgmVa",
   "type": "text",
   "x": 12,
   "y": 365.0,
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
   "seed": 57139077,
   "version": 1,
   "versionNonce": 748789083,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SenderFactory\n+ Get(channel) Sender",
   "originalText": "SenderFactory\n+ Get(channel) Sender",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "tW821X5t",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cJABZYbd",
   "type": "rectangle",
   "x": 309.0,
   "y": 350.0,
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
   "seed": 403097341,
   "version": 1,
   "versionNonce": 1089281919,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EtfxEsW5"
    },
    {
     "type": "arrow",
     "id": "EYHOazRL"
    },
    {
     "type": "arrow",
     "id": "XP7GUdG7"
    },
    {
     "type": "arrow",
     "id": "n2wCiCnB"
    },
    {
     "type": "arrow",
     "id": "iBtduwJK"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EtfxEsW5",
   "type": "text",
   "x": 321.0,
   "y": 365.0,
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
   "seed": 171091703,
   "version": 1,
   "versionNonce": 1362235503,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nSender\n+ Send(ctx, to, body) error",
   "originalText": "<<interface>>\nSender\n+ Send(ctx, to, body) error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "cJABZYbd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "W43enJry",
   "type": "rectangle",
   "x": 672.0,
   "y": 350.0,
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
   "seed": 1915117415,
   "version": 1,
   "versionNonce": 925266011,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2lAjyVM0"
    },
    {
     "type": "arrow",
     "id": "9Ite8Ahj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "2lAjyVM0",
   "type": "text",
   "x": 684.0,
   "y": 365.0,
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
   "seed": 396157243,
   "version": 1,
   "versionNonce": 1413873978,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nPrefStore\n+ Get(ctx, userID) UserPrefs",
   "originalText": "<<interface>>\nPrefStore\n+ Get(ctx, userID) UserPrefs",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "W43enJry",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kchmj2Vc",
   "type": "rectangle",
   "x": 1044.0,
   "y": 350.0,
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
   "seed": 1657288667,
   "version": 1,
   "versionNonce": 450323847,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8ljWXXIC"
    },
    {
     "type": "arrow",
     "id": "GCCs9L0y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "8ljWXXIC",
   "type": "text",
   "x": 1056.0,
   "y": 365.0,
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
   "seed": 1997395737,
   "version": 1,
   "versionNonce": 1278842248,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "IdemStore\n+ Claim(key) bool\n+ Release(key)",
   "originalText": "IdemStore\n+ Claim(key) bool\n+ Release(key)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Kchmj2Vc",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KnC60V0x",
   "type": "rectangle",
   "x": 0,
   "y": 590.0,
   "width": 274.0,
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
   "seed": 1942016216,
   "version": 1,
   "versionNonce": 236390570,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Y65plbJp"
    },
    {
     "type": "arrow",
     "id": "XP7GUdG7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Y65plbJp",
   "type": "text",
   "x": 12,
   "y": 605.0,
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
   "seed": 271379913,
   "version": 1,
   "versionNonce": 831249944,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SMSAdapter\nwraps SendSMS(phone, text)",
   "originalText": "SMSAdapter\nwraps SendSMS(phone, text)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "KnC60V0x",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YOcxlA8G",
   "type": "rectangle",
   "x": 364.0,
   "y": 590.0,
   "width": 202.0,
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
   "seed": 867528618,
   "version": 1,
   "versionNonce": 524615435,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "RwYcfI8N"
    },
    {
     "type": "arrow",
     "id": "n2wCiCnB"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "RwYcfI8N",
   "type": "text",
   "x": 376.0,
   "y": 605.0,
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
   "seed": 1372789150,
   "version": 1,
   "versionNonce": 957921405,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "WhatsAppAdapter\nwraps PostMessage(\n  WhatsAppMessage)",
   "originalText": "WhatsAppAdapter\nwraps PostMessage(\n  WhatsAppMessage)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "YOcxlA8G",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WAHmX3uY",
   "type": "rectangle",
   "x": 656.0,
   "y": 590.0,
   "width": 220.0,
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
   "seed": 1949343662,
   "version": 1,
   "versionNonce": 1692015946,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "XMFtFJqD"
    },
    {
     "type": "arrow",
     "id": "iBtduwJK"
    },
    {
     "type": "arrow",
     "id": "QotRtP07"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "XMFtFJqD",
   "type": "text",
   "x": 668.0,
   "y": 605.0,
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
   "seed": 1787187131,
   "version": 1,
   "versionNonce": 601063548,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "RateLimitedSender\n(Decorator)\n- Next Sender\n- Limit *TokenBucket",
   "originalText": "RateLimitedSender\n(Decorator)\n- Next Sender\n- Limit *TokenBucket",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "WAHmX3uY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RSI9bNMz",
   "type": "rectangle",
   "x": 966.0,
   "y": 590.0,
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
   "seed": 952186590,
   "version": 1,
   "versionNonce": 953043834,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Udstt9bU"
    },
    {
     "type": "arrow",
     "id": "QotRtP07"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Udstt9bU",
   "type": "text",
   "x": 978.0,
   "y": 605.0,
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
   "seed": 125634556,
   "version": 1,
   "versionNonce": 329453503,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "TokenBucket\n- capacity, perSec\n- tokens, now func()\n+ Allow() bool",
   "originalText": "TokenBucket\n- capacity, perSec\n- tokens, now func()\n+ Allow() bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "RSI9bNMz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GwhYMntE",
   "type": "rectangle",
   "x": 0,
   "y": 1040.0,
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
   "seed": 1879577648,
   "version": 1,
   "versionNonce": 1442170629,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "z3wiqvhY"
    },
    {
     "type": "arrow",
     "id": "qxwbIKXG"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "z3wiqvhY",
   "type": "text",
   "x": 12,
   "y": 1055.0,
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
   "seed": 898745943,
   "version": 1,
   "versionNonce": 998522272,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Order event\nplaced",
   "originalText": "Order event\nplaced",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "GwhYMntE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "s1z1dx3L",
   "type": "rectangle",
   "x": 230,
   "y": 1040.0,
   "width": 274.0,
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
   "seed": 1655830267,
   "version": 1,
   "versionNonce": 2073095622,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jcFq0ANX"
    },
    {
     "type": "arrow",
     "id": "qxwbIKXG"
    },
    {
     "type": "arrow",
     "id": "mf7HPPM2"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jcFq0ANX",
   "type": "text",
   "x": 242,
   "y": 1055.0,
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
   "seed": 1178574422,
   "version": 1,
   "versionNonce": 964384901,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "OrderListener\nkey = order:123:placed:sms",
   "originalText": "OrderListener\nkey = order:123:placed:sms",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "s1z1dx3L",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QcXKEWpi",
   "type": "rectangle",
   "x": 594.0,
   "y": 1040.0,
   "width": 220.0,
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
   "seed": 692868185,
   "version": 1,
   "versionNonce": 1424830636,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "RWZKtMwY"
    },
    {
     "type": "arrow",
     "id": "mf7HPPM2"
    },
    {
     "type": "arrow",
     "id": "JE5GdUSF"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "RWZKtMwY",
   "type": "text",
   "x": 606.0,
   "y": 1055.0,
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
   "seed": 1100538815,
   "version": 1,
   "versionNonce": 1328338364,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Bounded queue\nfull -> ErrQueueFull",
   "originalText": "Bounded queue\nfull -> ErrQueueFull",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "QcXKEWpi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lqAi4hRz",
   "type": "rectangle",
   "x": 904.0,
   "y": 1040.0,
   "width": 148.0,
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
   "seed": 1594438416,
   "version": 1,
   "versionNonce": 565742728,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Xib2vznb"
    },
    {
     "type": "arrow",
     "id": "JE5GdUSF"
    },
    {
     "type": "arrow",
     "id": "3I8IiZeX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Xib2vznb",
   "type": "text",
   "x": 916.0,
   "y": 1055.0,
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
   "seed": 700050075,
   "version": 1,
   "versionNonce": 1604837591,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Worker pool\nN goroutines",
   "originalText": "Worker pool\nN goroutines",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "lqAi4hRz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pC9H2qeT",
   "type": "rectangle",
   "x": 1142.0,
   "y": 1040.0,
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
   "seed": 1444548261,
   "version": 1,
   "versionNonce": 363053177,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GEsLlONL"
    },
    {
     "type": "arrow",
     "id": "3I8IiZeX"
    },
    {
     "type": "arrow",
     "id": "rWl2viuG"
    },
    {
     "type": "arrow",
     "id": "5lSmmrPs"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "GEsLlONL",
   "type": "text",
   "x": 1154.0,
   "y": 1055.0,
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
   "seed": 1806483974,
   "version": 1,
   "versionNonce": 1570906119,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Claim\nidempotency key",
   "originalText": "Claim\nidempotency key",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "pC9H2qeT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1GgqBmrK",
   "type": "rectangle",
   "x": 1407.0,
   "y": 1040.0,
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
   "seed": 1120384495,
   "version": 1,
   "versionNonce": 1282224392,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tV0HMNcE"
    },
    {
     "type": "arrow",
     "id": "5lSmmrPs"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "tV0HMNcE",
   "type": "text",
   "x": 1419.0,
   "y": 1055.0,
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
   "seed": 1701768607,
   "version": 1,
   "versionNonce": 1361103963,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Duplicate:\nErrDuplicate, drop",
   "originalText": "Duplicate:\nErrDuplicate, drop",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "1GgqBmrK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IGqDBq2G",
   "type": "rectangle",
   "x": 0,
   "y": 1260.0,
   "width": 256.0,
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
   "seed": 1107667587,
   "version": 1,
   "versionNonce": 1919529981,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EeoHDNtp"
    },
    {
     "type": "arrow",
     "id": "rWl2viuG"
    },
    {
     "type": "arrow",
     "id": "QmZPdN8A"
    },
    {
     "type": "arrow",
     "id": "3Oz6p4sL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EeoHDNtp",
   "type": "text",
   "x": 12,
   "y": 1275.0,
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
   "seed": 1882350032,
   "version": 1,
   "versionNonce": 387781378,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Prefs: opted out?\ncontact? render template",
   "originalText": "Prefs: opted out?\ncontact? render template",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "IGqDBq2G",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qePbSC6p",
   "type": "rectangle",
   "x": 346.0,
   "y": 1260.0,
   "width": 220.0,
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
   "seed": 761728471,
   "version": 1,
   "versionNonce": 99401116,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JRAEkKkI"
    },
    {
     "type": "arrow",
     "id": "QmZPdN8A"
    },
    {
     "type": "arrow",
     "id": "qDSqOmWI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "JRAEkKkI",
   "type": "text",
   "x": 366.0,
   "y": 1280.0,
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
   "seed": 244967015,
   "version": 1,
   "versionNonce": 1505633389,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Factory.Get(channel)",
   "originalText": "Factory.Get(channel)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "qePbSC6p",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hyrCSeN9",
   "type": "rectangle",
   "x": 656.0,
   "y": 1260.0,
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
   "seed": 774565331,
   "version": 1,
   "versionNonce": 418910258,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "L3ho4Fwr"
    },
    {
     "type": "arrow",
     "id": "qDSqOmWI"
    },
    {
     "type": "arrow",
     "id": "J1CdHGVH"
    },
    {
     "type": "arrow",
     "id": "rUyoQM7y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "L3ho4Fwr",
   "type": "text",
   "x": 668.0,
   "y": 1275.0,
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
   "seed": 1406994107,
   "version": 1,
   "versionNonce": 288275917,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "RateLimitedSender\ntake a token",
   "originalText": "RateLimitedSender\ntake a token",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "hyrCSeN9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pHG8UY5M",
   "type": "rectangle",
   "x": 939.0,
   "y": 1260.0,
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
   "seed": 1481549731,
   "version": 1,
   "versionNonce": 1207117380,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5lmRzkge"
    },
    {
     "type": "arrow",
     "id": "J1CdHGVH"
    },
    {
     "type": "arrow",
     "id": "L4jok3qp"
    },
    {
     "type": "arrow",
     "id": "tP0wK1Z8"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5lmRzkge",
   "type": "text",
   "x": 951.0,
   "y": 1275.0,
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
   "seed": 2072969999,
   "version": 1,
   "versionNonce": 15388205,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Provider adapter\nSMS / WhatsApp / email",
   "originalText": "Provider adapter\nSMS / WhatsApp / email",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "pHG8UY5M",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QoMv4QAn",
   "type": "rectangle",
   "x": 1267.0,
   "y": 1260.0,
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
   "roundness": {
    "type": 3
   },
   "seed": 1188396473,
   "version": 1,
   "versionNonce": 76294425,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ceLa5u4c"
    },
    {
     "type": "arrow",
     "id": "L4jok3qp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ceLa5u4c",
   "type": "text",
   "x": 1319.0,
   "y": 1280.0,
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
   "seed": 1169414732,
   "version": 1,
   "versionNonce": 1206806554,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Sent",
   "originalText": "Sent",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "QoMv4QAn",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TSFtVP5X",
   "type": "rectangle",
   "x": 0,
   "y": 1480.0,
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
   "seed": 1162395592,
   "version": 1,
   "versionNonce": 1990757591,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UWrJriwf"
    },
    {
     "type": "arrow",
     "id": "3Oz6p4sL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "UWrJriwf",
   "type": "text",
   "x": 12,
   "y": 1495.0,
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
   "seed": 639164968,
   "version": 1,
   "versionNonce": 876879671,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Opted out or no contact:\nskip, no retry",
   "originalText": "Opted out or no contact:\nskip, no retry",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "TSFtVP5X",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iZmEwgcA",
   "type": "rectangle",
   "x": 346.0,
   "y": 1480.0,
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
   "seed": 1335628615,
   "version": 1,
   "versionNonce": 778765809,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "d0h9nzLg"
    },
    {
     "type": "arrow",
     "id": "tP0wK1Z8"
    },
    {
     "type": "arrow",
     "id": "rUyoQM7y"
    },
    {
     "type": "arrow",
     "id": "lF4AEZd9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "d0h9nzLg",
   "type": "text",
   "x": 358.0,
   "y": 1495.0,
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
   "seed": 770394452,
   "version": 1,
   "versionNonce": 1541788882,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Error or ErrRateLimited:\nbackoff 100, 200, 400 ms",
   "originalText": "Error or ErrRateLimited:\nbackoff 100, 200, 400 ms",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "iZmEwgcA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Cnq3ZuFt",
   "type": "rectangle",
   "x": 692.0,
   "y": 1480.0,
   "width": 184.0,
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
   "seed": 624665457,
   "version": 1,
   "versionNonce": 1422133536,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "K8kuuXIK"
    },
    {
     "type": "arrow",
     "id": "lF4AEZd9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "K8kuuXIK",
   "type": "text",
   "x": 704.0,
   "y": 1495.0,
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
   "seed": 1160581636,
   "version": 1,
   "versionNonce": 819275947,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Max retries:\nrelease key, DLQ",
   "originalText": "Max retries:\nrelease key, DLQ",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Cnq3ZuFt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wOthLIcR",
   "type": "ellipse",
   "x": 60,
   "y": 1890.0,
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
   "seed": 576200386,
   "version": 1,
   "versionNonce": 1337910176,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hrzFE62O"
    },
    {
     "type": "arrow",
     "id": "T3v8rTaR"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hrzFE62O",
   "type": "text",
   "x": 118.5,
   "y": 1920.0,
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
   "seed": 395104317,
   "version": 1,
   "versionNonce": 1327466166,
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
   "containerId": "wOthLIcR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jkq2FuOu",
   "type": "ellipse",
   "x": 460,
   "y": 1890.0,
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
   "seed": 712428216,
   "version": 1,
   "versionNonce": 83693041,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "b4n8ufls"
    },
    {
     "type": "arrow",
     "id": "T3v8rTaR"
    },
    {
     "type": "arrow",
     "id": "aXjqEZBY"
    },
    {
     "type": "arrow",
     "id": "gqf4UZiZ"
    },
    {
     "type": "arrow",
     "id": "yPlZDrXh"
    },
    {
     "type": "arrow",
     "id": "IQIrzwRc"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "b4n8ufls",
   "type": "text",
   "x": 518.5,
   "y": 1920.0,
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
   "seed": 395953108,
   "version": 1,
   "versionNonce": 1516049114,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Sending",
   "originalText": "Sending",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jkq2FuOu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mXOBaMHd",
   "type": "ellipse",
   "x": 860,
   "y": 1890.0,
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
   "seed": 1679112901,
   "version": 1,
   "versionNonce": 1725539604,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "stkBRKby"
    },
    {
     "type": "arrow",
     "id": "aXjqEZBY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "stkBRKby",
   "type": "text",
   "x": 932.0,
   "y": 1920.0,
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
   "seed": 1494924592,
   "version": 1,
   "versionNonce": 799091062,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Sent",
   "originalText": "Sent",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "mXOBaMHd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "x1jT1EEi",
   "type": "ellipse",
   "x": 60,
   "y": 2120.0,
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
   "seed": 1614590214,
   "version": 1,
   "versionNonce": 1987711112,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "QRsTbKEO"
    },
    {
     "type": "arrow",
     "id": "IQIrzwRc"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "QRsTbKEO",
   "type": "text",
   "x": 118.5,
   "y": 2150.0,
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
   "seed": 1119778624,
   "version": 1,
   "versionNonce": 4221887,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Skipped",
   "originalText": "Skipped",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "x1jT1EEi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "q7ONXgzv",
   "type": "ellipse",
   "x": 460,
   "y": 2120.0,
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
   "seed": 330741044,
   "version": 1,
   "versionNonce": 135170263,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GuuiH705"
    },
    {
     "type": "arrow",
     "id": "gqf4UZiZ"
    },
    {
     "type": "arrow",
     "id": "yPlZDrXh"
    },
    {
     "type": "arrow",
     "id": "r2zru6VU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "GuuiH705",
   "type": "text",
   "x": 514.0,
   "y": 2150.0,
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
   "seed": 912681446,
   "version": 1,
   "versionNonce": 686694802,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Retrying",
   "originalText": "Retrying",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "q7ONXgzv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qCClxMZY",
   "type": "ellipse",
   "x": 860,
   "y": 2120.0,
   "width": 180,
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
   "seed": 2045248680,
   "version": 1,
   "versionNonce": 717645833,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "mMC1zTz2"
    },
    {
     "type": "arrow",
     "id": "r2zru6VU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "mMC1zTz2",
   "type": "text",
   "x": 872,
   "y": 2145.0,
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
   "seed": 1216499271,
   "version": 1,
   "versionNonce": 2057439578,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Failed\n(DLQ)",
   "originalText": "Failed\n(DLQ)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "qCClxMZY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RZOH7D2Z",
   "type": "rectangle",
   "x": 0,
   "y": 2550.0,
   "width": 292.0,
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
   "seed": 747714550,
   "version": 1,
   "versionNonce": 1340874311,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "I78aRyyZ"
    },
    {
     "type": "arrow",
     "id": "fms1dlqn"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "I78aRyyZ",
   "type": "text",
   "x": 12,
   "y": 2565.0,
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
   "seed": 2010039100,
   "version": 1,
   "versionNonce": 831243453,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "notifications\nid PK\nidempotency_key UNIQUE\nstatus, attempts, last_error",
   "originalText": "notifications\nid PK\nidempotency_key UNIQUE\nstatus, attempts, last_error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "RZOH7D2Z",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wK6SLHZD",
   "type": "rectangle",
   "x": 372.0,
   "y": 2550.0,
   "width": 301.0,
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
   "seed": 777503953,
   "version": 1,
   "versionNonce": 1373788887,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Dea6GQns"
    },
    {
     "type": "arrow",
     "id": "fms1dlqn"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Dea6GQns",
   "type": "text",
   "x": 384.0,
   "y": 2565.0,
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
   "seed": 1218402581,
   "version": 1,
   "versionNonce": 1201127604,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "delivery_attempts\nnotification_id, attempt\nprovider, error\nPK (notification_id, attempt)",
   "originalText": "delivery_attempts\nnotification_id, attempt\nprovider, error\nPK (notification_id, attempt)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "wK6SLHZD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7ZgiQAcZ",
   "type": "rectangle",
   "x": 753.0,
   "y": 2550.0,
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
   "seed": 1585291716,
   "version": 1,
   "versionNonce": 1321731153,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pZV3Nxok"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "pZV3Nxok",
   "type": "text",
   "x": 765.0,
   "y": 2565.0,
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
   "seed": 1447976034,
   "version": 1,
   "versionNonce": 1791156384,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "user_preferences\nuser_id, channel, contact\nopted_out, opted_in_at\nPK (user_id, channel)",
   "originalText": "user_preferences\nuser_id, channel, contact\nopted_out, opted_in_at\nPK (user_id, channel)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "7ZgiQAcZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "om9a7K0y",
   "type": "rectangle",
   "x": 1098.0,
   "y": 2550.0,
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
   "seed": 807934249,
   "version": 1,
   "versionNonce": 709960229,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KiIl0CwP"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KiIl0CwP",
   "type": "text",
   "x": 1110.0,
   "y": 2565.0,
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
   "seed": 1110359123,
   "version": 1,
   "versionNonce": 1214537936,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "templates\nid, channel, body\nPK (id, channel)",
   "originalText": "templates\nid, channel, body\nPK (id, channel)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "om9a7K0y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "yUgYVy0E",
   "type": "arrow",
   "x": 496.0,
   "y": 121.26959247648902,
   "width": 192.0,
   "height": 8.025078369905955,
   "angle": 0,
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
   "seed": 1342003170,
   "version": 1,
   "versionNonce": 45600499,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KHjTJ9z7"
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
     8.025078369905955
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "RJ0J7abW",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ITgV0v4q",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "KHjTJ9z7",
   "type": "text",
   "x": 564.4375,
   "y": 116.53213166144201,
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
   "seed": 1696735932,
   "version": 1,
   "versionNonce": 2140212616,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Enqueue",
   "originalText": "Enqueue",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "yUgYVy0E",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MOOQxWib",
   "type": "arrow",
   "x": 688.0,
   "y": 183.06338028169014,
   "width": 462.74,
   "height": 162.93661971830986,
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
   "seed": 1244263106,
   "version": 1,
   "versionNonce": 195637094,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GcBFxK5V"
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
     -462.74,
     162.93661971830986
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ITgV0v4q",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "tW821X5t",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "GcBFxK5V",
   "type": "text",
   "x": 440.88,
   "y": 255.78169014084506,
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
   "seed": 1665058090,
   "version": 1,
   "versionNonce": 358568495,
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
   "containerId": "MOOQxWib",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9Ite8Ahj",
   "type": "arrow",
   "x": 822.775,
   "y": 204.0,
   "width": 3.5499999999999545,
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
   "seed": 1664066783,
   "version": 1,
   "versionNonce": 537180304,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Xtp1S0qx"
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
     -3.5499999999999545,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ITgV0v4q",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "W43enJry",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Xtp1S0qx",
   "type": "text",
   "x": 805.25,
   "y": 266.25,
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
   "seed": 756332321,
   "version": 1,
   "versionNonce": 1442097381,
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
   "containerId": "9Ite8Ahj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GCCs9L0y",
   "type": "arrow",
   "x": 908.3615384615384,
   "y": 204.0,
   "width": 172.58461538461552,
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
   "seed": 363469597,
   "version": 1,
   "versionNonce": 325868663,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cn83OBOP"
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
     172.58461538461552,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ITgV0v4q",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Kchmj2Vc",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "cn83OBOP",
   "type": "text",
   "x": 978.9038461538462,
   "y": 266.25,
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
   "seed": 1993779835,
   "version": 1,
   "versionNonce": 738003454,
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
   "containerId": "GCCs9L0y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EYHOazRL",
   "type": "arrow",
   "x": 233.0,
   "y": 388.5267857142857,
   "width": 72.0,
   "height": 2.1428571428571104,
   "angle": 0,
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
   "seed": 890099682,
   "version": 1,
   "versionNonce": 1288815728,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DeDGsmLK"
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
     2.1428571428571104
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "tW821X5t",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "cJABZYbd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DeDGsmLK",
   "type": "text",
   "x": 217.8125,
   "y": 380.8482142857143,
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
   "seed": 571374014,
   "version": 1,
   "versionNonce": 251221337,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1 per channel",
   "originalText": "1 per channel",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "EYHOazRL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XP7GUdG7",
   "type": "arrow",
   "x": 190.15869565217392,
   "y": 586.0,
   "width": 193.5521739130435,
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
   "seed": 888229957,
   "version": 1,
   "versionNonce": 733671863,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HC04jBOy"
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
     193.5521739130435,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KnC60V0x",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "cJABZYbd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "HC04jBOy",
   "type": "text",
   "x": 247.55978260869568,
   "y": 506.25,
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
   "seed": 1450042945,
   "version": 1,
   "versionNonce": 1500541193,
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
   "containerId": "XP7GUdG7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "n2wCiCnB",
   "type": "arrow",
   "x": 462.0395833333333,
   "y": 586.0,
   "width": 8.579166666666652,
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
   "seed": 452464930,
   "version": 1,
   "versionNonce": 1539660048,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "oRAAFbms"
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
     -8.579166666666652,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YOcxlA8G",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "cJABZYbd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "oRAAFbms",
   "type": "text",
   "x": 418.375,
   "y": 506.25,
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
   "seed": 494410221,
   "version": 1,
   "versionNonce": 1186319529,
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
   "containerId": "n2wCiCnB",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iBtduwJK",
   "type": "arrow",
   "x": 691.542,
   "y": 586.0,
   "width": 179.20400000000006,
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
   "seed": 1671126196,
   "version": 1,
   "versionNonce": 326810795,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iYJL6RDJ"
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
     -179.20400000000006,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WAHmX3uY",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "cJABZYbd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "iYJL6RDJ",
   "type": "text",
   "x": 531.065,
   "y": 506.25,
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
   "seed": 1714403623,
   "version": 1,
   "versionNonce": 827966252,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "implements + wraps",
   "originalText": "implements + wraps",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "iBtduwJK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QotRtP07",
   "type": "arrow",
   "x": 880.0,
   "y": 645.0,
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
   "seed": 2040169287,
   "version": 1,
   "versionNonce": 1751770360,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "o1yVqqrl"
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
     82.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WAHmX3uY",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "RSI9bNMz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "o1yVqqrl",
   "type": "text",
   "x": 865.875,
   "y": 636.25,
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
   "seed": 336850894,
   "version": 1,
   "versionNonce": 251935799,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1 per provider",
   "originalText": "1 per provider",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "QotRtP07",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qxwbIKXG",
   "type": "arrow",
   "x": 144.0,
   "y": 1075.0,
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
   "seed": 802067810,
   "version": 1,
   "versionNonce": 868988655,
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
    "elementId": "GwhYMntE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "s1z1dx3L",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "mf7HPPM2",
   "type": "arrow",
   "x": 508.0,
   "y": 1075.0,
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
   "seed": 486246613,
   "version": 1,
   "versionNonce": 2024875639,
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
    "elementId": "s1z1dx3L",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "QcXKEWpi",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "JE5GdUSF",
   "type": "arrow",
   "x": 818.0,
   "y": 1075.0,
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
   "seed": 1954271784,
   "version": 1,
   "versionNonce": 1335540250,
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
    "elementId": "QcXKEWpi",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "lqAi4hRz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "3I8IiZeX",
   "type": "arrow",
   "x": 1056.0,
   "y": 1075.0,
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
   "seed": 397578878,
   "version": 1,
   "versionNonce": 1267289126,
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
    "elementId": "lqAi4hRz",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pC9H2qeT",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "rWl2viuG",
   "type": "arrow",
   "x": 1138.0,
   "y": 1093.2750794371311,
   "width": 878.0,
   "height": 175.36087153881067,
   "angle": 0,
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
   "seed": 1852542259,
   "version": 1,
   "versionNonce": 70318944,
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
     -878.0,
     175.36087153881067
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pC9H2qeT",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "IGqDBq2G",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "QmZPdN8A",
   "type": "arrow",
   "x": 260.0,
   "y": 1292.9878048780488,
   "width": 82.0,
   "height": 1.25,
   "angle": 0,
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
   "seed": 1094332887,
   "version": 1,
   "versionNonce": 1593928686,
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
     -1.25
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "IGqDBq2G",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "qePbSC6p",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "qDSqOmWI",
   "type": "arrow",
   "x": 570.0,
   "y": 1291.9224283305227,
   "width": 82.0,
   "height": 1.3827993254637931,
   "angle": 0,
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
   "seed": 1593229282,
   "version": 1,
   "versionNonce": 84606677,
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
     1.3827993254637931
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "qePbSC6p",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "hyrCSeN9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "J1CdHGVH",
   "type": "arrow",
   "x": 853.0,
   "y": 1295.0,
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
   "seed": 913915042,
   "version": 1,
   "versionNonce": 500334141,
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
    "elementId": "hyrCSeN9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pHG8UY5M",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "L4jok3qp",
   "type": "arrow",
   "x": 1181.0,
   "y": 1292.7956989247311,
   "width": 82.0,
   "height": 1.4695340501791634,
   "angle": 0,
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
   "seed": 291625564,
   "version": 1,
   "versionNonce": 1206277318,
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
     -1.4695340501791634
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pHG8UY5M",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "QoMv4QAn",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5lSmmrPs",
   "type": "arrow",
   "x": 1321.0,
   "y": 1075.0,
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
   "seed": 820760546,
   "version": 1,
   "versionNonce": 1612948064,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YdmdRBpO"
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
     82.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pC9H2qeT",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1GgqBmrK",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "YdmdRBpO",
   "type": "text",
   "x": 1302.9375,
   "y": 1066.25,
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
   "seed": 1568965695,
   "version": 1,
   "versionNonce": 222970954,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "already claimed",
   "originalText": "already claimed",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "5lSmmrPs",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3Oz6p4sL",
   "type": "arrow",
   "x": 128.0,
   "y": 1334.0,
   "width": 0.0,
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
   "seed": 1344663654,
   "version": 1,
   "versionNonce": 47711716,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GkOokxYs"
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
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "IGqDBq2G",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "TSFtVP5X",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "GkOokxYs",
   "type": "text",
   "x": 120.125,
   "y": 1396.25,
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
   "seed": 507777255,
   "version": 1,
   "versionNonce": 1393280094,
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
   "containerId": "3Oz6p4sL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tP0wK1Z8",
   "type": "arrow",
   "x": 954.4727272727273,
   "y": 1334.0,
   "width": 376.9454545454546,
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
   "seed": 618938705,
   "version": 1,
   "versionNonce": 1428191000,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NiClorw9"
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
     -376.9454545454546,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pHG8UY5M",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "iZmEwgcA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NiClorw9",
   "type": "text",
   "x": 750.25,
   "y": 1396.25,
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
   "seed": 328226885,
   "version": 1,
   "versionNonce": 1402517492,
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
   "containerId": "tP0wK1Z8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "rUyoQM7y",
   "type": "arrow",
   "x": 703.1295454545455,
   "y": 1334.0,
   "width": 179.7590909090909,
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
   "seed": 1911043552,
   "version": 1,
   "versionNonce": 1077469397,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xaVmBlQX"
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
     -179.7590909090909,
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "hyrCSeN9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "iZmEwgcA",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "xaVmBlQX",
   "type": "text",
   "x": 581.75,
   "y": 1396.25,
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
   "seed": 1568824733,
   "version": 1,
   "versionNonce": 1892277792,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "no token",
   "originalText": "no token",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "rUyoQM7y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lF4AEZd9",
   "type": "arrow",
   "x": 606.0,
   "y": 1515.0,
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
   "seed": 1684748277,
   "version": 1,
   "versionNonce": 378312375,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hT91piXT"
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
     82.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "iZmEwgcA",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Cnq3ZuFt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "hT91piXT",
   "type": "text",
   "x": 619.4375,
   "y": 1506.25,
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
   "seed": 1728529249,
   "version": 1,
   "versionNonce": 502204643,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "give up",
   "originalText": "give up",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "lF4AEZd9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "T3v8rTaR",
   "type": "arrow",
   "x": 244.0,
   "y": 1930.0,
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
   "seed": 1836447388,
   "version": 1,
   "versionNonce": 68025506,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "AuI54x5s"
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
    "elementId": "wOthLIcR",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "jkq2FuOu",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "AuI54x5s",
   "type": "text",
   "x": 283.0625,
   "y": 1921.25,
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
   "seed": 1267777990,
   "version": 1,
   "versionNonce": 1809154122,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "worker claims key",
   "originalText": "worker claims key",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "T3v8rTaR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aXjqEZBY",
   "type": "arrow",
   "x": 644.0,
   "y": 1930.0,
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
   "seed": 1904046184,
   "version": 1,
   "versionNonce": 873024825,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zKeVUrat"
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
    "elementId": "jkq2FuOu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "mXOBaMHd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "zKeVUrat",
   "type": "text",
   "x": 706.6875,
   "y": 1921.25,
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
   "seed": 625383745,
   "version": 1,
   "versionNonce": 2046178722,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "provider ok",
   "originalText": "provider ok",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "aXjqEZBY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gqf4UZiZ",
   "type": "arrow",
   "x": 535.0,
   "y": 1974.0,
   "width": 0.0,
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
   "seed": 1803564473,
   "version": 1,
   "versionNonce": 450113892,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "20CoaVvG"
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
     142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jkq2FuOu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "q7ONXgzv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "20CoaVvG",
   "type": "text",
   "x": 456.25,
   "y": 2036.25,
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
   "seed": 43576883,
   "version": 1,
   "versionNonce": 997545915,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "error / rate limited",
   "originalText": "error / rate limited",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "gqf4UZiZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "yPlZDrXh",
   "type": "arrow",
   "x": 565.0,
   "y": 2116.0,
   "width": 0.0,
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
   "seed": 911343104,
   "version": 1,
   "versionNonce": 1482010372,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EmMlcKWO"
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
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "q7ONXgzv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "jkq2FuOu",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "EmMlcKWO",
   "type": "text",
   "x": 513.8125,
   "y": 2036.25,
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
   "seed": 633358777,
   "version": 1,
   "versionNonce": 1009065070,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "after backoff",
   "originalText": "after backoff",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "yPlZDrXh",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "r2zru6VU",
   "type": "arrow",
   "x": 643.966500676881,
   "y": 2161.174581258461,
   "width": 212.06051365208464,
   "height": 2.6507564206513052,
   "angle": 0,
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
   "seed": 1620747678,
   "version": 1,
   "versionNonce": 1747835767,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jFav00Wm"
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
     212.06051365208464,
     2.6507564206513052
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "q7ONXgzv",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "qCClxMZY",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jFav00Wm",
   "type": "text",
   "x": 706.6842575029233,
   "y": 2153.7499594687865,
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
   "seed": 725499493,
   "version": 1,
   "versionNonce": 743283734,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "max retries",
   "originalText": "max retries",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "r2zru6VU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IQIrzwRc",
   "type": "arrow",
   "x": 490.65577206265755,
   "y": 1964.122931063972,
   "width": 281.3115441253151,
   "height": 161.75413787205616,
   "angle": 0,
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
   "seed": 193906002,
   "version": 1,
   "versionNonce": 987378512,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vqaqY4Wl"
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
     -281.3115441253151,
     161.75413787205616
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "jkq2FuOu",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "x1jT1EEi",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "vqaqY4Wl",
   "type": "text",
   "x": 314.5625,
   "y": 2036.25,
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
   "seed": 975200923,
   "version": 1,
   "versionNonce": 1001758446,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "opted out",
   "originalText": "opted out",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "IQIrzwRc",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fms1dlqn",
   "type": "arrow",
   "x": 368.0,
   "y": 2605.0,
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
   "seed": 936399391,
   "version": 1,
   "versionNonce": 582261120,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "F58C6fTJ"
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
    "elementId": "wK6SLHZD",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "RZOH7D2Z",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "F58C6fTJ",
   "type": "text",
   "x": 296.5625,
   "y": 2596.25,
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
   "seed": 1082727462,
   "version": 1,
   "versionNonce": 1185693363,
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
   "containerId": "fms1dlqn",
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