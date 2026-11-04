---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^pWzcYj3u

2. Core flow: Info() through the chain ^csRwDoCy

3. AsyncAppender lifecycle ^tsF6j0Iv

Locks: mutex per WriterAppender, RWMutex for closed flag, atomics for level and dropped.
Redraw: chain order, 2 strategy interfaces, async drop/flush. ^mwt9liVJ

Logger (facade)
- handler Handler
- fields []Field
- now func() time.Time
+ Info(msg, fields...)
+ With(fields...) *Logger
+ Close() error ^sPacwnyl

<<interface>>
Handler
+ Handle(Entry) error ^iqKQ0fJN

<<interface>>
Formatter
+ Format(Entry) ([]byte, error) ^izXsXieA

TextFormatter
time LEVEL msg k=v ^cJ4fQD9F

JSONFormatter
{"level":..,"msg":..} ^NdRs1ggj

LevelFilter
- min atomic.Int32
- next Handler
+ SetLevel(Level) ^4P5gsdxd

FormatHandler
- formatter Formatter
- appenders []Appender
format once, write many ^wRLvMkc2

Entry
- Time, Level
- Message
- Fields []Field ^eIz3sDwO

<<interface>>
Appender
+ Append([]byte) error
+ Close() error ^FwZnkauD

WriterAppender
- mu sync.Mutex
- w io.Writer
console / file / bytes.Buffer ^9wPab67W

AsyncAppender (decorator)
- inner Appender
- ch chan []byte (bounded)
- dropped atomic.Int64
+ Close() drains buffer ^L3XVnfQ2

App goroutine
log.Info(msg, f...) ^uzpEpJQ9

Logger.Log
stamp time + join fields ^lmusNszB

LevelFilter
level >= min ? ^UAst9vwr

below min:
return nil (cheap) ^UVCGa8Aj

FormatHandler
Format once -> bytes ^sw6z1GvN

WriterAppender
mutex + 1 Write ^ho4p460t

line written
no interleaving ^yN1glmBz

AsyncAppender.Append
non-blocking select ^wAyFBLOD

queued
worker writes later ^2QmA3dM3

buffer full:
dropped++ (no block) ^EsLr0GGC

Running ^HIxoOZNf

Closing
(drain channel) ^THIQQMRR

Closed ^NwqrdCLe

Append after Close
-> ErrClosed ^2PvrJXlg

calls head ^DSs2mugr

implements ^B70rqmhA

implements ^YU8ymUPk

next ^xyKPHDwD

uses 1 ^m8CpT6uA

1 to many ^ZKwMeA95

implements ^vNN4LQsQ

implements + wraps ^RzuSlYei

creates ^NQNYb4Ii

no ^8DAnEXD9

yes ^DqDayLf2

sync ^n8Mk4va0

async ^Js7z83mx

room ^kMSoodXS

full ^9GhXUdx8

Close() ^pTowvDoL

worker done ^TWibN4qv

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "pWzcYj3u",
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
   "seed": 1417707631,
   "version": 1,
   "versionNonce": 489661284,
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
   "id": "csRwDoCy",
   "type": "text",
   "x": 0,
   "y": 900,
   "width": 598.5,
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
   "seed": 7766491,
   "version": 1,
   "versionNonce": 882941056,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: Info() through the chain",
   "originalText": "2. Core flow: Info() through the chain",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tsF6j0Iv",
   "type": "text",
   "x": 0,
   "y": 1420,
   "width": 409.5,
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
   "seed": 231957872,
   "version": 1,
   "versionNonce": 2118430053,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. AsyncAppender lifecycle",
   "originalText": "3. AsyncAppender lifecycle",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mwt9liVJ",
   "type": "text",
   "x": 0,
   "y": 1660,
   "width": 792.0,
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
   "seed": 1578489254,
   "version": 1,
   "versionNonce": 368362115,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Locks: mutex per WriterAppender, RWMutex for closed flag, atomics for level and dropped.\nRedraw: chain order, 2 strategy interfaces, async drop/flush.",
   "originalText": "Locks: mutex per WriterAppender, RWMutex for closed flag, atomics for level and dropped.\nRedraw: chain order, 2 strategy interfaces, async drop/flush.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EuDpWazR",
   "type": "rectangle",
   "x": 0,
   "y": 70,
   "width": 265.0,
   "height": 170.0,
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
   "seed": 769293774,
   "version": 1,
   "versionNonce": 1751238822,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sPacwnyl"
    },
    {
     "type": "arrow",
     "id": "815RNmk8"
    },
    {
     "type": "arrow",
     "id": "tArGliYj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "sPacwnyl",
   "type": "text",
   "x": 12,
   "y": 85.0,
   "width": 225.0,
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
   "seed": 1031848854,
   "version": 1,
   "versionNonce": 1263560441,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Logger (facade)\n- handler Handler\n- fields []Field\n- now func() time.Time\n+ Info(msg, fields...)\n+ With(fields...) *Logger\n+ Close() error",
   "originalText": "Logger (facade)\n- handler Handler\n- fields []Field\n- now func() time.Time\n+ Info(msg, fields...)\n+ With(fields...) *Logger\n+ Close() error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "EuDpWazR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pRZY33Vt",
   "type": "rectangle",
   "x": 380,
   "y": 70,
   "width": 229.0,
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
   "seed": 1672564096,
   "version": 1,
   "versionNonce": 281435989,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iqKQ0fJN"
    },
    {
     "type": "arrow",
     "id": "815RNmk8"
    },
    {
     "type": "arrow",
     "id": "ClPYYgWx"
    },
    {
     "type": "arrow",
     "id": "iD5bKqKC"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "iqKQ0fJN",
   "type": "text",
   "x": 392,
   "y": 85.0,
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
   "seed": 1162210981,
   "version": 1,
   "versionNonce": 876177128,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nHandler\n+ Handle(Entry) error",
   "originalText": "<<interface>>\nHandler\n+ Handle(Entry) error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "pRZY33Vt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aE0y4a3f",
   "type": "rectangle",
   "x": 760,
   "y": 70,
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
   "seed": 1612470442,
   "version": 1,
   "versionNonce": 252122285,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "izXsXieA"
    },
    {
     "type": "arrow",
     "id": "pkQxxbJU"
    },
    {
     "type": "arrow",
     "id": "MtaHSi6J"
    },
    {
     "type": "arrow",
     "id": "5R2hqTdb"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "izXsXieA",
   "type": "text",
   "x": 772,
   "y": 85.0,
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
   "seed": 202957834,
   "version": 1,
   "versionNonce": 1714530876,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nFormatter\n+ Format(Entry) ([]byte, error)",
   "originalText": "<<interface>>\nFormatter\n+ Format(Entry) ([]byte, error)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "aE0y4a3f",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "E064D24B",
   "type": "rectangle",
   "x": 1180,
   "y": 20,
   "width": 202.0,
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
   "seed": 764419333,
   "version": 1,
   "versionNonce": 768882687,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cJ4fQD9F"
    },
    {
     "type": "arrow",
     "id": "MtaHSi6J"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "cJ4fQD9F",
   "type": "text",
   "x": 1192,
   "y": 35.0,
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
   "seed": 98007492,
   "version": 1,
   "versionNonce": 206681020,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "TextFormatter\ntime LEVEL msg k=v",
   "originalText": "TextFormatter\ntime LEVEL msg k=v",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "E064D24B",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "uWBY5jqw",
   "type": "rectangle",
   "x": 1180,
   "y": 150,
   "width": 229.0,
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
   "seed": 371481774,
   "version": 1,
   "versionNonce": 2088014416,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NdRs1ggj"
    },
    {
     "type": "arrow",
     "id": "5R2hqTdb"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NdRs1ggj",
   "type": "text",
   "x": 1192,
   "y": 165.0,
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
   "seed": 641695607,
   "version": 1,
   "versionNonce": 1370194208,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "JSONFormatter\n{\"level\":..,\"msg\":..}",
   "originalText": "JSONFormatter\n{\"level\":..,\"msg\":..}",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "uWBY5jqw",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vEhDPYXX",
   "type": "rectangle",
   "x": 280,
   "y": 320,
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
   "seed": 724532015,
   "version": 1,
   "versionNonce": 1771800321,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4P5gsdxd"
    },
    {
     "type": "arrow",
     "id": "ClPYYgWx"
    },
    {
     "type": "arrow",
     "id": "d3GdziBz"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "4P5gsdxd",
   "type": "text",
   "x": 292,
   "y": 335.0,
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
   "seed": 1269587695,
   "version": 1,
   "versionNonce": 659249430,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LevelFilter\n- min atomic.Int32\n- next Handler\n+ SetLevel(Level)",
   "originalText": "LevelFilter\n- min atomic.Int32\n- next Handler\n+ SetLevel(Level)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "vEhDPYXX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "i9Qs2HfB",
   "type": "rectangle",
   "x": 620,
   "y": 320,
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
   "seed": 994595446,
   "version": 1,
   "versionNonce": 935930203,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "wRLvMkc2"
    },
    {
     "type": "arrow",
     "id": "iD5bKqKC"
    },
    {
     "type": "arrow",
     "id": "d3GdziBz"
    },
    {
     "type": "arrow",
     "id": "pkQxxbJU"
    },
    {
     "type": "arrow",
     "id": "cMTBu6L5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "wRLvMkc2",
   "type": "text",
   "x": 632,
   "y": 335.0,
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
   "seed": 1304703479,
   "version": 1,
   "versionNonce": 274605620,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "FormatHandler\n- formatter Formatter\n- appenders []Appender\nformat once, write many",
   "originalText": "FormatHandler\n- formatter Formatter\n- appenders []Appender\nformat once, write many",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "i9Qs2HfB",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1kGNQLJk",
   "type": "rectangle",
   "x": 0,
   "y": 360,
   "width": 184.0,
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
   "seed": 2128936113,
   "version": 1,
   "versionNonce": 1664464811,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "eIz3sDwO"
    },
    {
     "type": "arrow",
     "id": "tArGliYj"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "eIz3sDwO",
   "type": "text",
   "x": 12,
   "y": 375.0,
   "width": 144.0,
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
   "seed": 490671146,
   "version": 1,
   "versionNonce": 73022008,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Entry\n- Time, Level\n- Message\n- Fields []Field",
   "originalText": "Entry\n- Time, Level\n- Message\n- Fields []Field",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "1kGNQLJk",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zBzWwz8x",
   "type": "rectangle",
   "x": 760,
   "y": 540,
   "width": 238.0,
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
   "seed": 651987055,
   "version": 1,
   "versionNonce": 1336360747,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FwZnkauD"
    },
    {
     "type": "arrow",
     "id": "cMTBu6L5"
    },
    {
     "type": "arrow",
     "id": "Q1lymThK"
    },
    {
     "type": "arrow",
     "id": "jvBY0oNY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "FwZnkauD",
   "type": "text",
   "x": 772,
   "y": 555.0,
   "width": 198.0,
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
   "seed": 760661983,
   "version": 1,
   "versionNonce": 2076118227,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nAppender\n+ Append([]byte) error\n+ Close() error",
   "originalText": "<<interface>>\nAppender\n+ Append([]byte) error\n+ Close() error",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zBzWwz8x",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pwDtAifG",
   "type": "rectangle",
   "x": 300,
   "y": 700,
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
   "seed": 1799836293,
   "version": 1,
   "versionNonce": 2104175478,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9wPab67W"
    },
    {
     "type": "arrow",
     "id": "Q1lymThK"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "9wPab67W",
   "type": "text",
   "x": 312,
   "y": 715.0,
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
   "seed": 2083316520,
   "version": 1,
   "versionNonce": 880772832,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "WriterAppender\n- mu sync.Mutex\n- w io.Writer\nconsole / file / bytes.Buffer",
   "originalText": "WriterAppender\n- mu sync.Mutex\n- w io.Writer\nconsole / file / bytes.Buffer",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "pwDtAifG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2eGTJDT9",
   "type": "rectangle",
   "x": 1120,
   "y": 680,
   "width": 274.0,
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
   "seed": 1431549891,
   "version": 1,
   "versionNonce": 964352962,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "L3XVnfQ2"
    },
    {
     "type": "arrow",
     "id": "jvBY0oNY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "L3XVnfQ2",
   "type": "text",
   "x": 1132,
   "y": 695.0,
   "width": 234.0,
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
   "seed": 2048208654,
   "version": 1,
   "versionNonce": 44582266,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "AsyncAppender (decorator)\n- inner Appender\n- ch chan []byte (bounded)\n- dropped atomic.Int64\n+ Close() drains buffer",
   "originalText": "AsyncAppender (decorator)\n- inner Appender\n- ch chan []byte (bounded)\n- dropped atomic.Int64\n+ Close() drains buffer",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2eGTJDT9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "BYoOeUYF",
   "type": "rectangle",
   "x": 0,
   "y": 970,
   "width": 211.0,
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
   "seed": 1821181308,
   "version": 1,
   "versionNonce": 1217431861,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uzpEpJQ9"
    },
    {
     "type": "arrow",
     "id": "205wd7T1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "uzpEpJQ9",
   "type": "text",
   "x": 12,
   "y": 985.0,
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
   "seed": 98988379,
   "version": 1,
   "versionNonce": 270687513,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "App goroutine\nlog.Info(msg, f...)",
   "originalText": "App goroutine\nlog.Info(msg, f...)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "BYoOeUYF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "UAlTFzFW",
   "type": "rectangle",
   "x": 280,
   "y": 970,
   "width": 256.0,
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
   "seed": 1243726723,
   "version": 1,
   "versionNonce": 1098783396,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lmusNszB"
    },
    {
     "type": "arrow",
     "id": "205wd7T1"
    },
    {
     "type": "arrow",
     "id": "5ZYWDcl3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "lmusNszB",
   "type": "text",
   "x": 292,
   "y": 985.0,
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
   "seed": 646738657,
   "version": 1,
   "versionNonce": 1627219448,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Logger.Log\nstamp time + join fields",
   "originalText": "Logger.Log\nstamp time + join fields",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "UAlTFzFW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "3zkZ5kVF",
   "type": "rectangle",
   "x": 580,
   "y": 970,
   "width": 166.0,
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
   "seed": 12252672,
   "version": 1,
   "versionNonce": 1551227776,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UAst9vwr"
    },
    {
     "type": "arrow",
     "id": "5ZYWDcl3"
    },
    {
     "type": "arrow",
     "id": "fhudK2QY"
    },
    {
     "type": "arrow",
     "id": "8RjfSXV0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "UAst9vwr",
   "type": "text",
   "x": 592,
   "y": 985.0,
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
   "seed": 413048232,
   "version": 1,
   "versionNonce": 1074083424,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "LevelFilter\nlevel >= min ?",
   "originalText": "LevelFilter\nlevel >= min ?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "3zkZ5kVF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zTzFipW3",
   "type": "rectangle",
   "x": 560,
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
   "seed": 662272115,
   "version": 1,
   "versionNonce": 1067430198,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UVCGa8Aj"
    },
    {
     "type": "arrow",
     "id": "fhudK2QY"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "UVCGa8Aj",
   "type": "text",
   "x": 572,
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
   "seed": 908045643,
   "version": 1,
   "versionNonce": 1986094635,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "below min:\nreturn nil (cheap)",
   "originalText": "below min:\nreturn nil (cheap)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zTzFipW3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "I8d8u95v",
   "type": "rectangle",
   "x": 860,
   "y": 970,
   "width": 220.0,
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
   "seed": 1079734250,
   "version": 1,
   "versionNonce": 1300273012,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "sw6z1GvN"
    },
    {
     "type": "arrow",
     "id": "8RjfSXV0"
    },
    {
     "type": "arrow",
     "id": "jx1LTdmR"
    },
    {
     "type": "arrow",
     "id": "saiR8sWm"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "sw6z1GvN",
   "type": "text",
   "x": 872,
   "y": 985.0,
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
   "seed": 586883965,
   "version": 1,
   "versionNonce": 1467947086,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "FormatHandler\nFormat once -> bytes",
   "originalText": "FormatHandler\nFormat once -> bytes",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "I8d8u95v",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9c6sWXqF",
   "type": "rectangle",
   "x": 1180,
   "y": 900,
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
   "seed": 1037340671,
   "version": 1,
   "versionNonce": 2087360174,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ho4p460t"
    },
    {
     "type": "arrow",
     "id": "jx1LTdmR"
    },
    {
     "type": "arrow",
     "id": "EShSPz0j"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ho4p460t",
   "type": "text",
   "x": 1192,
   "y": 915.0,
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
   "seed": 85369845,
   "version": 1,
   "versionNonce": 18280103,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "WriterAppender\nmutex + 1 Write",
   "originalText": "WriterAppender\nmutex + 1 Write",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "9c6sWXqF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "nhOOmSeu",
   "type": "rectangle",
   "x": 1480,
   "y": 900,
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
   "seed": 1613550923,
   "version": 1,
   "versionNonce": 1604985676,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "yN1glmBz"
    },
    {
     "type": "arrow",
     "id": "EShSPz0j"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "yN1glmBz",
   "type": "text",
   "x": 1492,
   "y": 915.0,
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
   "seed": 482406493,
   "version": 1,
   "versionNonce": 1322036083,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "line written\nno interleaving",
   "originalText": "line written\nno interleaving",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "nhOOmSeu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WZhCz6Ov",
   "type": "rectangle",
   "x": 1180,
   "y": 1090,
   "width": 220.0,
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
   "seed": 152807866,
   "version": 1,
   "versionNonce": 102734165,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "wAyFBLOD"
    },
    {
     "type": "arrow",
     "id": "saiR8sWm"
    },
    {
     "type": "arrow",
     "id": "b4SW8eeO"
    },
    {
     "type": "arrow",
     "id": "6CwywUjX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "wAyFBLOD",
   "type": "text",
   "x": 1192,
   "y": 1105.0,
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
   "seed": 1025748178,
   "version": 1,
   "versionNonce": 218636864,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "AsyncAppender.Append\nnon-blocking select",
   "originalText": "AsyncAppender.Append\nnon-blocking select",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "WZhCz6Ov",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "IwbRyD8h",
   "type": "rectangle",
   "x": 1500,
   "y": 1050,
   "width": 211.0,
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
   "seed": 1445634167,
   "version": 1,
   "versionNonce": 703850389,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2QmA3dM3"
    },
    {
     "type": "arrow",
     "id": "b4SW8eeO"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "2QmA3dM3",
   "type": "text",
   "x": 1512,
   "y": 1065.0,
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
   "seed": 1257177085,
   "version": 1,
   "versionNonce": 696279452,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "queued\nworker writes later",
   "originalText": "queued\nworker writes later",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "IwbRyD8h",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qOvhkPlQ",
   "type": "rectangle",
   "x": 1500,
   "y": 1200,
   "width": 220.0,
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
   "seed": 1687486477,
   "version": 1,
   "versionNonce": 971866960,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EsLr0GGC"
    },
    {
     "type": "arrow",
     "id": "6CwywUjX"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EsLr0GGC",
   "type": "text",
   "x": 1512,
   "y": 1215.0,
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
   "seed": 815675998,
   "version": 1,
   "versionNonce": 693390664,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "buffer full:\ndropped++ (no block)",
   "originalText": "buffer full:\ndropped++ (no block)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "qOvhkPlQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kx74jFDX",
   "type": "ellipse",
   "x": 0,
   "y": 1500,
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
   "seed": 1888599319,
   "version": 1,
   "versionNonce": 727126901,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HIxoOZNf"
    },
    {
     "type": "arrow",
     "id": "2Pz89blA"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "HIxoOZNf",
   "type": "text",
   "x": 38.5,
   "y": 1520.0,
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
   "seed": 613439472,
   "version": 1,
   "versionNonce": 1460856502,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Running",
   "originalText": "Running",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Kx74jFDX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ztnN0bel",
   "type": "ellipse",
   "x": 340,
   "y": 1500,
   "width": 175.0,
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
   "roundness": null,
   "seed": 610559975,
   "version": 1,
   "versionNonce": 794666921,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "THIQQMRR"
    },
    {
     "type": "arrow",
     "id": "2Pz89blA"
    },
    {
     "type": "arrow",
     "id": "eiUfBIoV"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "THIQQMRR",
   "type": "text",
   "x": 352,
   "y": 1515.0,
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
   "seed": 1152805315,
   "version": 1,
   "versionNonce": 254921746,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Closing\n(drain channel)",
   "originalText": "Closing\n(drain channel)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "ztnN0bel",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gUcmvYHE",
   "type": "ellipse",
   "x": 700,
   "y": 1500,
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
   "seed": 1129811390,
   "version": 1,
   "versionNonce": 533729784,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NwqrdCLe"
    },
    {
     "type": "arrow",
     "id": "eiUfBIoV"
    },
    {
     "type": "arrow",
     "id": "thEaCe6h"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NwqrdCLe",
   "type": "text",
   "x": 743.0,
   "y": 1520.0,
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
   "seed": 784908294,
   "version": 1,
   "versionNonce": 881458787,
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
   "containerId": "gUcmvYHE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "yUkTu92N",
   "type": "rectangle",
   "x": 1000,
   "y": 1500,
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
   "seed": 1392670656,
   "version": 1,
   "versionNonce": 766068080,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2PvrJXlg"
    },
    {
     "type": "arrow",
     "id": "thEaCe6h"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "2PvrJXlg",
   "type": "text",
   "x": 1012,
   "y": 1515.0,
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
   "seed": 1980083691,
   "version": 1,
   "versionNonce": 182670602,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Append after Close\n-> ErrClosed",
   "originalText": "Append after Close\n-> ErrClosed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "yUkTu92N",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "815RNmk8",
   "type": "arrow",
   "x": 269.0,
   "y": 139.91712707182322,
   "width": 107.0,
   "height": 11.823204419889521,
   "angle": 0,
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
   "seed": 782469749,
   "version": 1,
   "versionNonce": 1598688581,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DSs2mugr"
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
     107.0,
     -11.823204419889521
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "EuDpWazR",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pRZY33Vt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DSs2mugr",
   "type": "text",
   "x": 283.125,
   "y": 125.25552486187846,
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
   "seed": 474437508,
   "version": 1,
   "versionNonce": 1461430923,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "calls head",
   "originalText": "calls head",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "815RNmk8",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ClPYYgWx",
   "type": "arrow",
   "x": 406.75576923076926,
   "y": 316.0,
   "width": 66.35384615384612,
   "height": 152.0,
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
   "seed": 704248179,
   "version": 1,
   "versionNonce": 344350407,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "B70rqmhA"
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
     66.35384615384612,
     -152.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "vEhDPYXX",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pRZY33Vt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "B70rqmhA",
   "type": "text",
   "x": 400.5576923076923,
   "y": 231.25,
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
   "seed": 1507829846,
   "version": 1,
   "versionNonce": 956528242,
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
   "containerId": "ClPYYgWx",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "iD5bKqKC",
   "type": "arrow",
   "x": 686.9961538461539,
   "y": 316.0,
   "width": 145.56923076923078,
   "height": 152.0,
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
   "seed": 931498615,
   "version": 1,
   "versionNonce": 72375852,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YU8ymUPk"
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
     -145.56923076923078,
     -152.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "i9Qs2HfB",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pRZY33Vt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "YU8ymUPk",
   "type": "text",
   "x": 574.8365384615386,
   "y": 231.25,
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
   "seed": 2038706522,
   "version": 1,
   "versionNonce": 393049536,
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
   "containerId": "iD5bKqKC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "d3GdziBz",
   "type": "arrow",
   "x": 486.0,
   "y": 375.0,
   "width": 130.0,
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
   "seed": 1729447236,
   "version": 1,
   "versionNonce": 1140387102,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xyKPHDwD"
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
    "elementId": "vEhDPYXX",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "i9Qs2HfB",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "xyKPHDwD",
   "type": "text",
   "x": 535.25,
   "y": 366.25,
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
   "seed": 1734778646,
   "version": 1,
   "versionNonce": 2051821,
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
   "containerId": "d3GdziBz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pkQxxbJU",
   "type": "arrow",
   "x": 783.4384615384615,
   "y": 316.0,
   "width": 102.89230769230767,
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
   "seed": 1521292331,
   "version": 1,
   "versionNonce": 860540419,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "m8CpT6uA"
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
     102.89230769230767,
     -152.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "i9Qs2HfB",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "aE0y4a3f",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "m8CpT6uA",
   "type": "text",
   "x": 811.2596153846154,
   "y": 231.25,
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
   "seed": 1171205532,
   "version": 1,
   "versionNonce": 1893133122,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "uses 1",
   "originalText": "uses 1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "pkQxxbJU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "MtaHSi6J",
   "type": "arrow",
   "x": 1176.0,
   "y": 72.42738589211618,
   "width": 93.0,
   "height": 15.435684647302907,
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
   "seed": 828917946,
   "version": 1,
   "versionNonce": 206200036,
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
     -93.0,
     15.435684647302907
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "E064D24B",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "aE0y4a3f",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "5R2hqTdb",
   "type": "arrow",
   "x": 1176.0,
   "y": 162.88,
   "width": 93.0,
   "height": 17.359999999999985,
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
   "seed": 366433613,
   "version": 1,
   "versionNonce": 800794493,
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
     -93.0,
     -17.359999999999985
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "uWBY5jqw",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "aE0y4a3f",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "cMTBu6L5",
   "type": "arrow",
   "x": 779.8386363636364,
   "y": 434.0,
   "width": 62.82272727272721,
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
   "seed": 921385404,
   "version": 1,
   "versionNonce": 1518068134,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZKwMeA95"
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
     62.82272727272721,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "i9Qs2HfB",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "zBzWwz8x",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "ZKwMeA95",
   "type": "text",
   "x": 775.8125,
   "y": 476.25,
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
   "seed": 77088398,
   "version": 1,
   "versionNonce": 1022075626,
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
   "containerId": "cMTBu6L5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Q1lymThK",
   "type": "arrow",
   "x": 605.0,
   "y": 697.3103850641774,
   "width": 151.0,
   "height": 56.38273045507583,
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
   "seed": 312887589,
   "version": 1,
   "versionNonce": 1428573251,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vNN4LQsQ"
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
     151.0,
     -56.38273045507583
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pwDtAifG",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "zBzWwz8x",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "vNN4LQsQ",
   "type": "text",
   "x": 641.125,
   "y": 660.3690198366394,
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
   "seed": 509740579,
   "version": 1,
   "versionNonce": 1255862645,
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
   "containerId": "Q1lymThK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jvBY0oNY",
   "type": "arrow",
   "x": 1116.0,
   "y": 689.047619047619,
   "width": 114.0,
   "height": 45.238095238095184,
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
   "seed": 1653091897,
   "version": 1,
   "versionNonce": 963442229,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "RzuSlYei"
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
     -114.0,
     -45.238095238095184
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2eGTJDT9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "zBzWwz8x",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "RzuSlYei",
   "type": "text",
   "x": 988.125,
   "y": 657.6785714285714,
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
   "seed": 1823426559,
   "version": 1,
   "versionNonce": 1317310599,
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
   "containerId": "jvBY0oNY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tArGliYj",
   "type": "arrow",
   "x": 118.63653846153846,
   "y": 244.0,
   "width": 17.446153846153848,
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
   "seed": 305985115,
   "version": 1,
   "versionNonce": 892909578,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NQNYb4Ii"
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
     -17.446153846153848,
     112.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "EuDpWazR",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "1kGNQLJk",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NQNYb4Ii",
   "type": "text",
   "x": 82.35096153846155,
   "y": 291.25,
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
   "seed": 608592645,
   "version": 1,
   "versionNonce": 1945632328,
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
   "containerId": "tArGliYj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "205wd7T1",
   "type": "arrow",
   "x": 215.0,
   "y": 1005.0,
   "width": 61.0,
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
   "seed": 1483378224,
   "version": 1,
   "versionNonce": 951135461,
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
     61.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "BYoOeUYF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "UAlTFzFW",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5ZYWDcl3",
   "type": "arrow",
   "x": 540.0,
   "y": 1005.0,
   "width": 36.0,
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
   "seed": 1408196057,
   "version": 1,
   "versionNonce": 1123101686,
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
     36.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "UAlTFzFW",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "3zkZ5kVF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "fhudK2QY",
   "type": "arrow",
   "x": 662.48,
   "y": 1044.0,
   "width": 0.9600000000000364,
   "height": 72.0,
   "angle": 0,
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
   "seed": 1765584734,
   "version": 1,
   "versionNonce": 1804137800,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8DAnEXD9"
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
     -0.9600000000000364,
     72.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "3zkZ5kVF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "zTzFipW3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "8DAnEXD9",
   "type": "text",
   "x": 654.125,
   "y": 1071.25,
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
   "seed": 161283722,
   "version": 1,
   "versionNonce": 1932262092,
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
   "containerId": "fhudK2QY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8RjfSXV0",
   "type": "arrow",
   "x": 750.0,
   "y": 1005.0,
   "width": 106.0,
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
   "seed": 1820919792,
   "version": 1,
   "versionNonce": 1687946183,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DqDayLf2"
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
     106.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "3zkZ5kVF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "I8d8u95v",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DqDayLf2",
   "type": "text",
   "x": 791.1875,
   "y": 996.25,
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
   "seed": 1665531828,
   "version": 1,
   "versionNonce": 484559839,
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
   "containerId": "8RjfSXV0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jx1LTdmR",
   "type": "arrow",
   "x": 1084.0,
   "y": 978.1764705882352,
   "width": 92.0,
   "height": 21.64705882352939,
   "angle": 0,
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
   "seed": 627351554,
   "version": 1,
   "versionNonce": 1327669930,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "n8Mk4va0"
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
     92.0,
     -21.64705882352939
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "I8d8u95v",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "9c6sWXqF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "n8Mk4va0",
   "type": "text",
   "x": 1114.25,
   "y": 958.6029411764705,
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
   "seed": 780278246,
   "version": 1,
   "versionNonce": 37287712,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "sync",
   "originalText": "sync",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jx1LTdmR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EShSPz0j",
   "type": "arrow",
   "x": 1359.0,
   "y": 935.0,
   "width": 117.0,
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
   "seed": 1657783204,
   "version": 1,
   "versionNonce": 1070516277,
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
     117.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "9c6sWXqF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "nhOOmSeu",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "saiR8sWm",
   "type": "arrow",
   "x": 1074.0,
   "y": 1044.0,
   "width": 112.0,
   "height": 42.0,
   "angle": 0,
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
   "seed": 1317943315,
   "version": 1,
   "versionNonce": 1747319878,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Js7z83mx"
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
     112.0,
     42.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "I8d8u95v",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "WZhCz6Ov",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Js7z83mx",
   "type": "text",
   "x": 1110.3125,
   "y": 1056.25,
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
   "seed": 1703626589,
   "version": 1,
   "versionNonce": 647312427,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "async",
   "originalText": "async",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "saiR8sWm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "b4SW8eeO",
   "type": "arrow",
   "x": 1404.0,
   "y": 1110.5467511885895,
   "width": 92.0,
   "height": 11.664025356576758,
   "angle": 0,
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
   "seed": 519069759,
   "version": 1,
   "versionNonce": 810683103,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kMSoodXS"
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
     92.0,
     -11.664025356576758
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WZhCz6Ov",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "IwbRyD8h",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "kMSoodXS",
   "type": "text",
   "x": 1434.25,
   "y": 1095.9647385103012,
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
   "seed": 1129041456,
   "version": 1,
   "versionNonce": 1725810661,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "room",
   "originalText": "room",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "b4SW8eeO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6CwywUjX",
   "type": "arrow",
   "x": 1403.4545454545455,
   "y": 1164.0,
   "width": 93.09090909090901,
   "height": 32.0,
   "angle": 0,
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
   "seed": 1292554276,
   "version": 1,
   "versionNonce": 1322858879,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9GhXUdx8"
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
     93.09090909090901,
     32.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "WZhCz6Ov",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "qOvhkPlQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "9GhXUdx8",
   "type": "text",
   "x": 1434.25,
   "y": 1171.25,
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
   "seed": 1978442559,
   "version": 1,
   "versionNonce": 48583763,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "full",
   "originalText": "full",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "6CwywUjX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2Pz89blA",
   "type": "arrow",
   "x": 143.96573951078042,
   "y": 1531.0344858672836,
   "width": 192.08348047152006,
   "height": 2.6864822443569665,
   "angle": 0,
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
   "seed": 1585296754,
   "version": 1,
   "versionNonce": 535761994,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pTowvDoL"
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
     192.08348047152006,
     2.6864822443569665
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "Kx74jFDX",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "ztnN0bel",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "pTowvDoL",
   "type": "text",
   "x": 212.44497974654047,
   "y": 1523.6277269894622,
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
   "seed": 985867876,
   "version": 1,
   "versionNonce": 829010396,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Close()",
   "originalText": "Close()",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "2Pz89blA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eiUfBIoV",
   "type": "arrow",
   "x": 518.9463782437098,
   "y": 1533.6650163760041,
   "width": 177.09094655803278,
   "height": 2.585269292817884,
   "angle": 0,
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
   "seed": 2069573948,
   "version": 1,
   "versionNonce": 1198887045,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "TWibN4qv"
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
     177.09094655803278,
     -2.585269292817884
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ztnN0bel",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "gUcmvYHE",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "TWibN4qv",
   "type": "text",
   "x": 564.1793515227262,
   "y": 1523.6223817295952,
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
   "seed": 1577367889,
   "version": 1,
   "versionNonce": 1472897485,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "worker done",
   "originalText": "worker done",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "eiUfBIoV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "thEaCe6h",
   "type": "arrow",
   "x": 843.9600387145534,
   "y": 1531.1172211286187,
   "width": 152.03996128544657,
   "height": 2.2966761523480272,
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
   "seed": 460049204,
   "version": 1,
   "versionNonce": 261882665,
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
     152.03996128544657,
     2.2966761523480272
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "gUcmvYHE",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "yUkTu92N",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
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