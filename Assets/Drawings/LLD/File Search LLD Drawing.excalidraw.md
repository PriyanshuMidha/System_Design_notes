---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships (Composite tree) ^q2raNiOt

2. Filter expression tree: ext=.go AND NOT size>1048576 ^TemWWHSJ

3. Core flow: Search loop ^JgFp5Vdp

Two trees: data tree (Composite) + query tree (Interpreter).
Pruned-by-depth dirs are NOT marked visited.
Real FS: io/fs.WalkDir, visited key = (device, inode). ^FAHAS41H

<<interface>>
Node
+ Name() string ^Auo2zcwx

File (leaf)
- name string
+ Size int64
+ Ext() string ^abOQiQ8D

Directory (composite)
- children []Node
+ Denied bool
+ Add(nodes...) ^7qQoPxEG

Symlink
+ Target Node
(may point to an ancestor) ^dqiibjI4

Search(ctx, root, filter, opt)
- visited map[*Directory]bool
- frontier []item
-> Result{Matches, Skipped} ^7O7xPW7p

Options
+ Order DFS | BFS
+ MaxDepth (0 = unlimited)
+ FollowSymlinks ^0uwqxkui

<<interface>>
Filter
+ Match(*File) bool ^wUfZjvAu

And ^dcAWBP2l

ExtensionIs(.go) ^4yFnWXS5

Not ^nhheCS7G

SizeGreaterThan(1048576) ^vYU2Sj7v

Parse(expr)
recursive descent
NOT > AND > OR
bad term -> ErrInvalidExpr ^LU0pXXxQ

pop item
DFS: end (stack)
BFS: front (queue) ^9OZ1PiAT

ctx cancelled
-> return ctx.Err() ^lVVy7blg

Symlink?
follow -> Target
else skip ^ubQ9SdDK

File:
filter.Match(f) ^dNJ4NbeQ

append Match
{path, file} ^Nbkrn77n

Directory checks
1 depth >= MaxDepth?
2 visited?
3 Denied? ^cyjQHMs3

skip subtree
(denied -> Skipped) ^DjFnMDpO

mark visited
push children
depth + 1 ^7oAF1M9z

implements ^pg9SmvVJ

implements ^DUYdOQdp

implements ^H9BO1w1j

owns 0..* ^uGkCaBnx

target (cycle!) ^BJqfa7or

walks ^VOCdfrQh

uses ^nXXfh0LW

left ^kjzSHBn5

right ^Qpy6VDjt

inner ^Dz4ekpsU

implements ^NaJni2jS

builds ^qWlYLmKD

check first ^efnNiE4w

file ^JTX4pJN3

dir ^wW1jWJQx

true ^ANMOwRpF

any yes ^8UUP1fct

all no ^0vn4oWhx

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "q2raNiOt",
   "type": "text",
   "x": 0,
   "y": 0,
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
   "seed": 199740817,
   "version": 1,
   "versionNonce": 941895470,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1. Entities and relationships (Composite tree)",
   "originalText": "1. Entities and relationships (Composite tree)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TemWWHSJ",
   "type": "text",
   "x": 0,
   "y": 560,
   "width": 866.25,
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
   "seed": 266136257,
   "version": 1,
   "versionNonce": 1288817729,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Filter expression tree: ext=.go AND NOT size>1048576",
   "originalText": "2. Filter expression tree: ext=.go AND NOT size>1048576",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JgFp5Vdp",
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
   "seed": 1392459804,
   "version": 1,
   "versionNonce": 1015647517,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Core flow: Search loop",
   "originalText": "3. Core flow: Search loop",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "FAHAS41H",
   "type": "text",
   "x": 0,
   "y": 1600,
   "width": 540.0,
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
   "seed": 164075030,
   "version": 1,
   "versionNonce": 843884240,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Two trees: data tree (Composite) + query tree (Interpreter).\nPruned-by-depth dirs are NOT marked visited.\nReal FS: io/fs.WalkDir, visited key = (device, inode).",
   "originalText": "Two trees: data tree (Composite) + query tree (Interpreter).\nPruned-by-depth dirs are NOT marked visited.\nReal FS: io/fs.WalkDir, visited key = (device, inode).",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "242pcPGX",
   "type": "rectangle",
   "x": 380,
   "y": 70,
   "width": 175.0,
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
   "seed": 384719072,
   "version": 1,
   "versionNonce": 1772244660,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Auo2zcwx"
    },
    {
     "type": "arrow",
     "id": "KOrymy59"
    },
    {
     "type": "arrow",
     "id": "PZmf9pMt"
    },
    {
     "type": "arrow",
     "id": "8f04GQNQ"
    },
    {
     "type": "arrow",
     "id": "pZC6mnOH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Auo2zcwx",
   "type": "text",
   "x": 392,
   "y": 85.0,
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
   "seed": 1391373253,
   "version": 1,
   "versionNonce": 277527109,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nNode\n+ Name() string",
   "originalText": "<<interface>>\nNode\n+ Name() string",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "242pcPGX",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7nAnvKzH",
   "type": "rectangle",
   "x": 0,
   "y": 300,
   "width": 166.0,
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
   "seed": 1819347447,
   "version": 1,
   "versionNonce": 1172732326,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "abOQiQ8D"
    },
    {
     "type": "arrow",
     "id": "KOrymy59"
    },
    {
     "type": "arrow",
     "id": "Sl5JmyB3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "abOQiQ8D",
   "type": "text",
   "x": 12,
   "y": 315.0,
   "width": 126.0,
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
   "seed": 1695660113,
   "version": 1,
   "versionNonce": 426994748,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "File (leaf)\n- name string\n+ Size int64\n+ Ext() string",
   "originalText": "File (leaf)\n- name string\n+ Size int64\n+ Ext() string",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "7nAnvKzH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "b2Qo38I3",
   "type": "rectangle",
   "x": 360,
   "y": 300,
   "width": 229.0,
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
   "seed": 1297252253,
   "version": 1,
   "versionNonce": 509669814,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7qQoPxEG"
    },
    {
     "type": "arrow",
     "id": "PZmf9pMt"
    },
    {
     "type": "arrow",
     "id": "Sl5JmyB3"
    },
    {
     "type": "arrow",
     "id": "9OQDrbYL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7qQoPxEG",
   "type": "text",
   "x": 372,
   "y": 315.0,
   "width": 189.0,
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
   "seed": 361670623,
   "version": 1,
   "versionNonce": 1312537948,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Directory (composite)\n- children []Node\n+ Denied bool\n+ Add(nodes...)",
   "originalText": "Directory (composite)\n- children []Node\n+ Denied bool\n+ Add(nodes...)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "b2Qo38I3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8xnH1vs0",
   "type": "rectangle",
   "x": 760,
   "y": 300,
   "width": 274.0,
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
   "seed": 515061096,
   "version": 1,
   "versionNonce": 1322119918,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dqiibjI4"
    },
    {
     "type": "arrow",
     "id": "8f04GQNQ"
    },
    {
     "type": "arrow",
     "id": "9OQDrbYL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dqiibjI4",
   "type": "text",
   "x": 772,
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
   "seed": 1992786164,
   "version": 1,
   "versionNonce": 1894537750,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Symlink\n+ Target Node\n(may point to an ancestor)",
   "originalText": "Symlink\n+ Target Node\n(may point to an ancestor)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "8xnH1vs0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "CmX6xXLw",
   "type": "rectangle",
   "x": 820,
   "y": 70,
   "width": 310.0,
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
   "seed": 84025205,
   "version": 1,
   "versionNonce": 827559088,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7O7xPW7p"
    },
    {
     "type": "arrow",
     "id": "pZC6mnOH"
    },
    {
     "type": "arrow",
     "id": "d85Pj6HI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7O7xPW7p",
   "type": "text",
   "x": 832,
   "y": 85.0,
   "width": 270.0,
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
   "seed": 1073034895,
   "version": 1,
   "versionNonce": 1202453725,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Search(ctx, root, filter, opt)\n- visited map[*Directory]bool\n- frontier []item\n-> Result{Matches, Skipped}",
   "originalText": "Search(ctx, root, filter, opt)\n- visited map[*Directory]bool\n- frontier []item\n-> Result{Matches, Skipped}",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "CmX6xXLw",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "D4644jIz",
   "type": "rectangle",
   "x": 1260,
   "y": 300,
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
   "seed": 1250474081,
   "version": 1,
   "versionNonce": 34312750,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0uwqxkui"
    },
    {
     "type": "arrow",
     "id": "d85Pj6HI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "0uwqxkui",
   "type": "text",
   "x": 1272,
   "y": 315.0,
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
   "seed": 1818190802,
   "version": 1,
   "versionNonce": 75059078,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Options\n+ Order DFS | BFS\n+ MaxDepth (0 = unlimited)\n+ FollowSymlinks",
   "originalText": "Options\n+ Order DFS | BFS\n+ MaxDepth (0 = unlimited)\n+ FollowSymlinks",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "D4644jIz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jK69es7S",
   "type": "rectangle",
   "x": 0,
   "y": 640,
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
   "seed": 1276518120,
   "version": 1,
   "versionNonce": 416754922,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "wUfZjvAu"
    },
    {
     "type": "arrow",
     "id": "ZVBqI1a2"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "wUfZjvAu",
   "type": "text",
   "x": 12,
   "y": 655.0,
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
   "seed": 683709647,
   "version": 1,
   "versionNonce": 225947458,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nFilter\n+ Match(*File) bool",
   "originalText": "<<interface>>\nFilter\n+ Match(*File) bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "jK69es7S",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wgQqVwBJ",
   "type": "ellipse",
   "x": 520,
   "y": 640,
   "width": 140,
   "height": 60,
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
   "seed": 239505137,
   "version": 1,
   "versionNonce": 1955829383,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dcAWBP2l"
    },
    {
     "type": "arrow",
     "id": "RyXgzDCU"
    },
    {
     "type": "arrow",
     "id": "w72PLAGu"
    },
    {
     "type": "arrow",
     "id": "ZVBqI1a2"
    },
    {
     "type": "arrow",
     "id": "6uFzsuE0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dcAWBP2l",
   "type": "text",
   "x": 576.5,
   "y": 660.0,
   "width": 27.0,
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
   "seed": 369934314,
   "version": 1,
   "versionNonce": 584484029,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "And",
   "originalText": "And",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "wgQqVwBJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gcnGH4ZU",
   "type": "rectangle",
   "x": 340,
   "y": 820,
   "width": 184.0,
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
   "seed": 1748139441,
   "version": 1,
   "versionNonce": 993391057,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4yFnWXS5"
    },
    {
     "type": "arrow",
     "id": "RyXgzDCU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "4yFnWXS5",
   "type": "text",
   "x": 360.0,
   "y": 840.0,
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
   "seed": 289602596,
   "version": 1,
   "versionNonce": 1410051676,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ExtensionIs(.go)",
   "originalText": "ExtensionIs(.go)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "gcnGH4ZU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "m6Upy9vl",
   "type": "ellipse",
   "x": 720,
   "y": 820,
   "width": 140,
   "height": 60,
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
   "seed": 768466090,
   "version": 1,
   "versionNonce": 1952680905,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nhheCS7G"
    },
    {
     "type": "arrow",
     "id": "w72PLAGu"
    },
    {
     "type": "arrow",
     "id": "kwqe2gXC"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nhheCS7G",
   "type": "text",
   "x": 776.5,
   "y": 840.0,
   "width": 27.0,
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
   "seed": 651963586,
   "version": 1,
   "versionNonce": 692614298,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Not",
   "originalText": "Not",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "m6Upy9vl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pFgckrgO",
   "type": "rectangle",
   "x": 680,
   "y": 960,
   "width": 256.0,
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
   "seed": 378554092,
   "version": 1,
   "versionNonce": 544327920,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vYU2Sj7v"
    },
    {
     "type": "arrow",
     "id": "kwqe2gXC"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vYU2Sj7v",
   "type": "text",
   "x": 700.0,
   "y": 980.0,
   "width": 216.0,
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
   "seed": 2099561343,
   "version": 1,
   "versionNonce": 73570845,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SizeGreaterThan(1048576)",
   "originalText": "SizeGreaterThan(1048576)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "pFgckrgO",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bvZhk2IR",
   "type": "rectangle",
   "x": 1060,
   "y": 640,
   "width": 274.0,
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
   "seed": 1947513812,
   "version": 1,
   "versionNonce": 1378710311,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LU0pXXxQ"
    },
    {
     "type": "arrow",
     "id": "6uFzsuE0"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "LU0pXXxQ",
   "type": "text",
   "x": 1072,
   "y": 655.0,
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
   "seed": 1606152766,
   "version": 1,
   "versionNonce": 279629939,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Parse(expr)\nrecursive descent\nNOT > AND > OR\nbad term -> ErrInvalidExpr",
   "originalText": "Parse(expr)\nrecursive descent\nNOT > AND > OR\nbad term -> ErrInvalidExpr",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "bvZhk2IR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "75yTziV5",
   "type": "rectangle",
   "x": 0,
   "y": 1140,
   "width": 202.0,
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
   "seed": 327068336,
   "version": 1,
   "versionNonce": 1612102589,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9OZ1PiAT"
    },
    {
     "type": "arrow",
     "id": "9Unlh3NI"
    },
    {
     "type": "arrow",
     "id": "8KvIlF8M"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "9OZ1PiAT",
   "type": "text",
   "x": 12,
   "y": 1155.0,
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
   "seed": 510599688,
   "version": 1,
   "versionNonce": 1277225066,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "pop item\nDFS: end (stack)\nBFS: front (queue)",
   "originalText": "pop item\nDFS: end (stack)\nBFS: front (queue)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "75yTziV5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "44g9esmS",
   "type": "rectangle",
   "x": 0,
   "y": 1320,
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
   "seed": 1675892164,
   "version": 1,
   "versionNonce": 229854643,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lVVy7blg"
    },
    {
     "type": "arrow",
     "id": "9Unlh3NI"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "lVVy7blg",
   "type": "text",
   "x": 12,
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
   "seed": 414614736,
   "version": 1,
   "versionNonce": 2027082014,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ctx cancelled\n-> return ctx.Err()",
   "originalText": "ctx cancelled\n-> return ctx.Err()",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "44g9esmS",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LUfyRdm0",
   "type": "rectangle",
   "x": 300,
   "y": 1140,
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
   "seed": 824379278,
   "version": 1,
   "versionNonce": 1809291748,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ubQ9SdDK"
    },
    {
     "type": "arrow",
     "id": "8KvIlF8M"
    },
    {
     "type": "arrow",
     "id": "XYLqcaQm"
    },
    {
     "type": "arrow",
     "id": "F0HpqZJL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ubQ9SdDK",
   "type": "text",
   "x": 312,
   "y": 1155.0,
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
   "seed": 1128461118,
   "version": 1,
   "versionNonce": 1789624768,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Symlink?\nfollow -> Target\nelse skip",
   "originalText": "Symlink?\nfollow -> Target\nelse skip",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "LUfyRdm0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "OqGvEpbS",
   "type": "rectangle",
   "x": 600,
   "y": 1060,
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
   "seed": 1539369034,
   "version": 1,
   "versionNonce": 1808791578,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dNJ4NbeQ"
    },
    {
     "type": "arrow",
     "id": "XYLqcaQm"
    },
    {
     "type": "arrow",
     "id": "4wA5UC1p"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "dNJ4NbeQ",
   "type": "text",
   "x": 612,
   "y": 1075.0,
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
   "seed": 1671641266,
   "version": 1,
   "versionNonce": 1406849320,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "File:\nfilter.Match(f)",
   "originalText": "File:\nfilter.Match(f)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "OqGvEpbS",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "0RW2M9kB",
   "type": "rectangle",
   "x": 900,
   "y": 1060,
   "width": 148.0,
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
   "seed": 1562272488,
   "version": 1,
   "versionNonce": 1064981570,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Nbkrn77n"
    },
    {
     "type": "arrow",
     "id": "4wA5UC1p"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Nbkrn77n",
   "type": "text",
   "x": 912,
   "y": 1075.0,
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
   "seed": 654550502,
   "version": 1,
   "versionNonce": 48804324,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "append Match\n{path, file}",
   "originalText": "append Match\n{path, file}",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "0RW2M9kB",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tXPQHThV",
   "type": "rectangle",
   "x": 600,
   "y": 1260,
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
   "seed": 1624082756,
   "version": 1,
   "versionNonce": 2082273278,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cyjQHMs3"
    },
    {
     "type": "arrow",
     "id": "F0HpqZJL"
    },
    {
     "type": "arrow",
     "id": "US6bYGfq"
    },
    {
     "type": "arrow",
     "id": "DHklNKy7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "cyjQHMs3",
   "type": "text",
   "x": 612,
   "y": 1275.0,
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
   "seed": 519631490,
   "version": 1,
   "versionNonce": 732842015,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Directory checks\n1 depth >= MaxDepth?\n2 visited?\n3 Denied?",
   "originalText": "Directory checks\n1 depth >= MaxDepth?\n2 visited?\n3 Denied?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "tXPQHThV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fZkSsmn1",
   "type": "rectangle",
   "x": 620,
   "y": 1460,
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
   "seed": 495964925,
   "version": 1,
   "versionNonce": 2108292938,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DjFnMDpO"
    },
    {
     "type": "arrow",
     "id": "US6bYGfq"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "DjFnMDpO",
   "type": "text",
   "x": 632,
   "y": 1475.0,
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
   "seed": 434831673,
   "version": 1,
   "versionNonce": 967576842,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "skip subtree\n(denied -> Skipped)",
   "originalText": "skip subtree\n(denied -> Skipped)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "fZkSsmn1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Y0UhdYTv",
   "type": "rectangle",
   "x": 960,
   "y": 1260,
   "width": 157.0,
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
   "seed": 1145859442,
   "version": 1,
   "versionNonce": 563886352,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7oAF1M9z"
    },
    {
     "type": "arrow",
     "id": "DHklNKy7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "7oAF1M9z",
   "type": "text",
   "x": 972,
   "y": 1275.0,
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
   "seed": 940825864,
   "version": 1,
   "versionNonce": 752358077,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "mark visited\npush children\ndepth + 1",
   "originalText": "mark visited\npush children\ndepth + 1",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Y0UhdYTv",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KOrymy59",
   "type": "arrow",
   "x": 170.0,
   "y": 300.6957087126138,
   "width": 218.9979166666667,
   "height": 136.6957087126138,
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
   "seed": 1382418093,
   "version": 1,
   "versionNonce": 956095359,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "pg9SmvVJ"
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
     218.9979166666667,
     -136.6957087126138
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "7nAnvKzH",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "242pcPGX",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "pg9SmvVJ",
   "type": "text",
   "x": 240.12395833333335,
   "y": 223.5978543563069,
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
   "seed": 236776580,
   "version": 1,
   "versionNonce": 641898026,
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
   "containerId": "KOrymy59",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "PZmf9pMt",
   "type": "arrow",
   "x": 472.77916666666664,
   "y": 296.0,
   "width": 3.849999999999966,
   "height": 132.0,
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
   "seed": 676111788,
   "version": 1,
   "versionNonce": 172510958,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DUYdOQdp"
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
     -3.849999999999966,
     -132.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "b2Qo38I3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "242pcPGX",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "DUYdOQdp",
   "type": "text",
   "x": 431.47916666666663,
   "y": 221.25,
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
   "seed": 1974002722,
   "version": 1,
   "versionNonce": 888932084,
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
   "containerId": "PZmf9pMt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8f04GQNQ",
   "type": "arrow",
   "x": 805.4978260869565,
   "y": 296.0,
   "width": 246.49782608695648,
   "height": 132.0011641443539,
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
   "seed": 69036784,
   "version": 1,
   "versionNonce": 1155597537,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "H9BO1w1j"
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
     -246.49782608695648,
     -132.0011641443539
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "8xnH1vs0",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "242pcPGX",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "H9BO1w1j",
   "type": "text",
   "x": 642.8739130434783,
   "y": 221.24941792782306,
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
   "seed": 352671904,
   "version": 1,
   "versionNonce": 1563216093,
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
   "containerId": "8f04GQNQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Sl5JmyB3",
   "type": "arrow",
   "x": 356.0,
   "y": 355.0,
   "width": 186.0,
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
   "seed": 1315850584,
   "version": 1,
   "versionNonce": 1606684143,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uGkCaBnx"
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
     -186.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "b2Qo38I3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7nAnvKzH",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "uGkCaBnx",
   "type": "text",
   "x": 227.5625,
   "y": 346.25,
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
   "seed": 540385777,
   "version": 1,
   "versionNonce": 604440469,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "owns 0..*",
   "originalText": "owns 0..*",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Sl5JmyB3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9OQDrbYL",
   "type": "arrow",
   "x": 756.0,
   "y": 348.33727810650885,
   "width": 163.0,
   "height": 3.857988165680524,
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
   "seed": 1772551111,
   "version": 1,
   "versionNonce": 1935514748,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BJqfa7or"
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
     -163.0,
     3.857988165680524
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "8xnH1vs0",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "b2Qo38I3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "BJqfa7or",
   "type": "text",
   "x": 615.4375,
   "y": 341.51627218934914,
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
   "seed": 909295445,
   "version": 1,
   "versionNonce": 1454164426,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "target (cycle!)",
   "originalText": "target (cycle!)",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9OQDrbYL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pZC6mnOH",
   "type": "arrow",
   "x": 816.0,
   "y": 121.86699507389163,
   "width": 257.0,
   "height": 5.0640394088670035,
   "angle": 0,
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
   "seed": 709239972,
   "version": 1,
   "versionNonce": 1159718249,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VOCdfrQh"
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
     -257.0,
     -5.0640394088670035
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "CmX6xXLw",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "242pcPGX",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "VOCdfrQh",
   "type": "text",
   "x": 667.8125,
   "y": 110.58497536945814,
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
   "seed": 232570616,
   "version": 1,
   "versionNonce": 461657396,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "walks",
   "originalText": "walks",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "pZC6mnOH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "d85Pj6HI",
   "type": "arrow",
   "x": 1083.2521739130434,
   "y": 184.0,
   "width": 205.4956521739132,
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
   "seed": 1985884600,
   "version": 1,
   "versionNonce": 1233695098,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nXXfh0LW"
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
     205.4956521739132,
     112.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "CmX6xXLw",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "D4644jIz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "nXXfh0LW",
   "type": "text",
   "x": 1170.25,
   "y": 231.25,
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
   "seed": 1226660590,
   "version": 1,
   "versionNonce": 1410233412,
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
   "containerId": "d85Pj6HI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "RyXgzDCU",
   "type": "arrow",
   "x": 562.3217685239323,
   "y": 701.5321624410898,
   "width": 100.47732407948786,
   "height": 114.46783755891022,
   "angle": 0,
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
   "seed": 1370094645,
   "version": 1,
   "versionNonce": 1240096350,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kjzSHBn5"
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
     -100.47732407948786,
     114.46783755891022
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "wgQqVwBJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "gcnGH4ZU",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "kjzSHBn5",
   "type": "text",
   "x": 496.3331064841884,
   "y": 750.016081220545,
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
   "seed": 2096251496,
   "version": 1,
   "versionNonce": 412280049,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "left",
   "originalText": "left",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "RyXgzDCU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "w72PLAGu",
   "type": "arrow",
   "x": 623.6468290823582,
   "y": 700.2821461741224,
   "width": 132.70634183528364,
   "height": 119.43570765175514,
   "angle": 0,
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
   "seed": 103842940,
   "version": 1,
   "versionNonce": 2103760159,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Qpy6VDjt"
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
     132.70634183528364,
     119.43570765175514
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "wgQqVwBJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "m6Upy9vl",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Qpy6VDjt",
   "type": "text",
   "x": 670.3125,
   "y": 751.25,
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
   "seed": 457960286,
   "version": 1,
   "versionNonce": 2131552192,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "right",
   "originalText": "right",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "w72PLAGu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kwqe2gXC",
   "type": "arrow",
   "x": 794.3638210728021,
   "y": 883.9408305662389,
   "width": 9.264750355769252,
   "height": 72.0591694337611,
   "angle": 0,
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
   "seed": 829531862,
   "version": 1,
   "versionNonce": 2092039933,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Dz4ekpsU"
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
     9.264750355769252,
     72.0591694337611
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "m6Upy9vl",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pFgckrgO",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Dz4ekpsU",
   "type": "text",
   "x": 779.3086962506868,
   "y": 911.2204152831195,
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
   "seed": 968904068,
   "version": 1,
   "versionNonce": 303254349,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "inner",
   "originalText": "inner",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "kwqe2gXC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ZVBqI1a2",
   "type": "arrow",
   "x": 516.167427359754,
   "y": 672.2858381622367,
   "width": 301.167427359754,
   "height": 9.32406895850636,
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
   "seed": 981514399,
   "version": 1,
   "versionNonce": 1867153119,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NaJni2jS"
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
     -301.167427359754,
     9.32406895850636
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "wgQqVwBJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "jK69es7S",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "NaJni2jS",
   "type": "text",
   "x": 326.208713679877,
   "y": 668.1978726414899,
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
   "seed": 2092644192,
   "version": 1,
   "versionNonce": 1394665849,
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
   "containerId": "ZVBqI1a2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6uFzsuE0",
   "type": "arrow",
   "x": 1056.0,
   "y": 689.1927512355849,
   "width": 392.295530462206,
   "height": 16.15714705363291,
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
   "seed": 704082319,
   "version": 1,
   "versionNonce": 205778994,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qWlYLmKD"
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
     -392.295530462206,
     -16.15714705363291
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "bvZhk2IR",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wgQqVwBJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "qWlYLmKD",
   "type": "text",
   "x": 836.227234768897,
   "y": 672.3641777087685,
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
   "seed": 974267655,
   "version": 1,
   "versionNonce": 1372461751,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "builds",
   "originalText": "builds",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "6uFzsuE0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9Unlh3NI",
   "type": "arrow",
   "x": 102.29705882352941,
   "y": 1234.0,
   "width": 2.170588235294119,
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
   "seed": 1508883184,
   "version": 1,
   "versionNonce": 2101853009,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "efnNiE4w"
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
     2.170588235294119,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "75yTziV5",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "44g9esmS",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "efnNiE4w",
   "type": "text",
   "x": 60.069852941176464,
   "y": 1266.25,
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
   "seed": 138964902,
   "version": 1,
   "versionNonce": 882345721,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "check first",
   "originalText": "check first",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9Unlh3NI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8KvIlF8M",
   "type": "arrow",
   "x": 206.0,
   "y": 1185.0,
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
   "seed": 366410472,
   "version": 1,
   "versionNonce": 1710102768,
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
    "elementId": "75yTziV5",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "LUfyRdm0",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "XYLqcaQm",
   "type": "arrow",
   "x": 488.0,
   "y": 1155.761421319797,
   "width": 108.0,
   "height": 32.89340101522839,
   "angle": 0,
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
   "seed": 426603283,
   "version": 1,
   "versionNonce": 1421615052,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JTX4pJN3"
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
     -32.89340101522839
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "LUfyRdm0",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "OqGvEpbS",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "JTX4pJN3",
   "type": "text",
   "x": 526.25,
   "y": 1130.5647208121827,
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
   "seed": 1177056655,
   "version": 1,
   "versionNonce": 467121420,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "file",
   "originalText": "file",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XYLqcaQm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "F0HpqZJL",
   "type": "arrow",
   "x": 488.0,
   "y": 1224.245283018868,
   "width": 108.0,
   "height": 44.15094339622647,
   "angle": 0,
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
   "seed": 945232844,
   "version": 1,
   "versionNonce": 1095905272,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "wW1jWJQx"
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
     44.15094339622647
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "LUfyRdm0",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "tXPQHThV",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "wW1jWJQx",
   "type": "text",
   "x": 530.1875,
   "y": 1237.5707547169811,
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
   "seed": 1320873232,
   "version": 1,
   "versionNonce": 608692170,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "dir",
   "originalText": "dir",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "F0HpqZJL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4wA5UC1p",
   "type": "arrow",
   "x": 779.0,
   "y": 1095.0,
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
   "seed": 1753268115,
   "version": 1,
   "versionNonce": 432661669,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ANMOwRpF"
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
     117.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "OqGvEpbS",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "0RW2M9kB",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ANMOwRpF",
   "type": "text",
   "x": 821.75,
   "y": 1086.25,
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
   "seed": 1859715751,
   "version": 1,
   "versionNonce": 423007213,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "true",
   "originalText": "true",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "4wA5UC1p",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "US6bYGfq",
   "type": "arrow",
   "x": 715.0805555555555,
   "y": 1374.0,
   "width": 7.061111111111131,
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
   "seed": 780333330,
   "version": 1,
   "versionNonce": 961067701,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8UUP1fct"
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
     7.061111111111131,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "tXPQHThV",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "fZkSsmn1",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "8UUP1fct",
   "type": "text",
   "x": 691.0486111111111,
   "y": 1406.25,
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
   "seed": 405899480,
   "version": 1,
   "versionNonce": 1695970449,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "any yes",
   "originalText": "any yes",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "US6bYGfq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "DHklNKy7",
   "type": "arrow",
   "x": 824.0,
   "y": 1311.5296803652968,
   "width": 132.0,
   "height": 4.01826484018261,
   "angle": 0,
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
   "seed": 777962529,
   "version": 1,
   "versionNonce": 446036631,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0vn4oWhx"
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
     -4.01826484018261
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "tXPQHThV",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Y0UhdYTv",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "0vn4oWhx",
   "type": "text",
   "x": 866.375,
   "y": 1300.7705479452056,
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
   "seed": 1047451907,
   "version": 1,
   "versionNonce": 1762476456,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "all no",
   "originalText": "all no",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "DHklNKy7",
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