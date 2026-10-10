---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^tSHEVng0

2. Core flow: AddExpense and DeleteExpense ^pSW7nhVP

3. Worked example: simplify debts (amounts in Rs) ^aALVAVqH

4. Storage ^Lt8of3Ed

Expenses: a paid 12 dinner (equal 4 ways), b paid 4 movie (exact c 2, d 2), c paid 2 taxi (50% a, 50% d)
Nets: a +8, b +1, c -3, d -6  (sum = 0) ^9GPVsTtC

BEFORE: 7 raw debts (arrow = owes) ^5gGC9Fhc

AFTER: 3 transfers ^b6gupOV5

Greedy: biggest debtor pays biggest creditor, repeat.
1) d pays a 6 (a left +2)  2) c pays a 2 (c left -1)  3) c pays b 1
7 debts -> 3 transfers (at most n-1).  Delete taxi -> a +9, b +1, c -5, d -5 ^2puSIfMY

Group
- ID, members set
- net map[user]int64 ^J8w23Uwi

User
- ID, Name ^BzlC0KkN

<<interface>>
SplitStrategy
+ Split(total, users, values) ^KJ4sezFY

NewSplitStrategy(type)
Factory ^LCokGcQr

Expense
- ID, PaidBy, Total
- Shares map[user]int64
- Deleted bool ^ncw084vn

EqualSplit
floor + leftover paise
in sorted user order ^Vz0exWc7

ExactSplit
sum must = total ^xlP2oswg

PercentSplit
basis points, sum = 10000 ^aQvJaEuW

Share
- UserID
- AmountPaise ^0ORtCS7M

Transfer
- From, To, Amount ^86deYJUL

Client ^mZIceCQG

AddExpense(req) ^6uxk35H4

Factory -> strategy
Split(): shares in paise ^y7cMmwau

Lock + check payer and
participants are members ^usMIJmgA

applyDeltas(+1)
payer + total
each participant - share
nets sum to 0 ^DjoCgDca

Bad split
percent != 100, exact != total
nothing changed ^mg9xwPHj

ErrNotGroupMember
user not in group ^9QKNBI3m

DeleteExpense(id) ^vijcKZEe

applyDeltas(-1)
reverse STORED shares
mark Deleted ^0rpY8L8K

already deleted
no-op (idempotent) ^9CxT6cKQ

a +8 ^jhZtR3KC

b +1 ^U7UoytUQ

c -3 ^WJpoIjOn

d -6 ^S3lUwMXB

a +8 ^Qvob5s9Z

b +1 ^5IMNzD2f

c -3 ^tQ5XULnZ

d -6 ^Hqc1mMfi

group_members
PK (group_id, user_id) ^xvuTeMWG

expenses
id PK, total_paise > 0
FK (group_id, paid_by) -> members
UNIQUE (group_id, request_id)
deleted_at (soft delete) ^nH5kAAiF

expense_shares
PK (expense_id, user_id)
FK (group_id, user_id) -> members
share_paise >= 0 ^NEM86eCV

group_balances
PK (group_id, user_id)
net_paise += delta (relative)
sum of nets = 0 ^Evd9Pr7v

members, many to many ^omb6gA7T

1 to many ^VNjgGS5W

1 to many ^LkpAepVD

uses ^IjeLXj7U

implements ^mHyFzthw

implements ^zjpzfefI

implements ^JcQ1OkMC

creates ^I3GhsMko

SimplifyDebts produces ^qNM3Udur

shares ok ^7LJYerLR

all members ^MKx9p4om

invalid ^A0ijzE77

stranger ^8GVSRBX1

first time ^7QP50pT3

retry ^dOI6yShB

3 ^iNk31lSn

3 ^tM4hMnz2

1 ^a4LNg3MU

3 ^iXUHfdXW

2 ^DhM78E8q

2 ^5y3DKLqI

1 ^usgr0KqP

6 ^Q7j69Biu

2 ^HHEyjE7R

1 ^7xjtnQMD

FK ^W9Auunon

FK ^1riDNYBi

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "tSHEVng0",
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
   "seed": 1424358289,
   "version": 1,
   "versionNonce": 1352305136,
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
   "id": "pSW7nhVP",
   "type": "text",
   "x": 0,
   "y": 620,
   "width": 661.5,
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
   "seed": 391115825,
   "version": 1,
   "versionNonce": 611672454,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: AddExpense and DeleteExpense",
   "originalText": "2. Core flow: AddExpense and DeleteExpense",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "aALVAVqH",
   "type": "text",
   "x": 0,
   "y": 1320,
   "width": 771.75,
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
   "seed": 1251792009,
   "version": 1,
   "versionNonce": 2140965125,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. Worked example: simplify debts (amounts in Rs)",
   "originalText": "3. Worked example: simplify debts (amounts in Rs)",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Lt8of3Ed",
   "type": "text",
   "x": 0,
   "y": 2140,
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
   "seed": 1425785728,
   "version": 1,
   "versionNonce": 441650129,
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
   "id": "9GPVsTtC",
   "type": "text",
   "x": 0,
   "y": 1370,
   "width": 936.0,
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
   "seed": 1970146778,
   "version": 1,
   "versionNonce": 2106001368,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Expenses: a paid 12 dinner (equal 4 ways), b paid 4 movie (exact c 2, d 2), c paid 2 taxi (50% a, 50% d)\nNets: a +8, b +1, c -3, d -6  (sum = 0)",
   "originalText": "Expenses: a paid 12 dinner (equal 4 ways), b paid 4 movie (exact c 2, d 2), c paid 2 taxi (50% a, 50% d)\nNets: a +8, b +1, c -3, d -6  (sum = 0)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5gGC9Fhc",
   "type": "text",
   "x": 0,
   "y": 1430,
   "width": 306.0,
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
   "seed": 1006554387,
   "version": 1,
   "versionNonce": 650757568,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "BEFORE: 7 raw debts (arrow = owes)",
   "originalText": "BEFORE: 7 raw debts (arrow = owes)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "b6gupOV5",
   "type": "text",
   "x": 900,
   "y": 1430,
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
   "seed": 2043220886,
   "version": 1,
   "versionNonce": 50973879,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "AFTER: 3 transfers",
   "originalText": "AFTER: 3 transfers",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2puSIfMY",
   "type": "text",
   "x": 0,
   "y": 1990,
   "width": 684.0,
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
   "seed": 1239117690,
   "version": 1,
   "versionNonce": 137094049,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Greedy: biggest debtor pays biggest creditor, repeat.\n1) d pays a 6 (a left +2)  2) c pays a 2 (c left -1)  3) c pays b 1\n7 debts -> 3 transfers (at most n-1).  Delete taxi -> a +9, b +1, c -5, d -5",
   "originalText": "Greedy: biggest debtor pays biggest creditor, repeat.\n1) d pays a 6 (a left +2)  2) c pays a 2 (c left -1)  3) c pays b 1\n7 debts -> 3 transfers (at most n-1).  Delete taxi -> a +9, b +1, c -5, d -5",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "goaZf8yY",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 220.0,
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
   "seed": 982172669,
   "version": 1,
   "versionNonce": 1228194728,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "J8w23Uwi"
    },
    {
     "type": "arrow",
     "id": "8yBmPxkU"
    },
    {
     "type": "arrow",
     "id": "7cWPZku5"
    },
    {
     "type": "arrow",
     "id": "9KXqk6lW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "J8w23Uwi",
   "type": "text",
   "x": 12,
   "y": 75.0,
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
   "seed": 1369706731,
   "version": 1,
   "versionNonce": 178492745,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Group\n- ID, members set\n- net map[user]int64",
   "originalText": "Group\n- ID, members set\n- net map[user]int64",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "goaZf8yY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "W29IoyWm",
   "type": "rectangle",
   "x": 380,
   "y": 60,
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
   "seed": 1059137312,
   "version": 1,
   "versionNonce": 1647076816,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "BzlC0KkN"
    },
    {
     "type": "arrow",
     "id": "8yBmPxkU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "BzlC0KkN",
   "type": "text",
   "x": 392,
   "y": 75.0,
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
   "seed": 909556240,
   "version": 1,
   "versionNonce": 1314153677,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "User\n- ID, Name",
   "originalText": "User\n- ID, Name",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "W29IoyWm",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wugn9pf6",
   "type": "rectangle",
   "x": 700,
   "y": 60,
   "width": 301.0,
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
   "seed": 958234685,
   "version": 1,
   "versionNonce": 1789025817,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KJ4sezFY"
    },
    {
     "type": "arrow",
     "id": "tBKGjDmK"
    },
    {
     "type": "arrow",
     "id": "leLvMcsF"
    },
    {
     "type": "arrow",
     "id": "Hr4nqu4C"
    },
    {
     "type": "arrow",
     "id": "hCFk5XKl"
    },
    {
     "type": "arrow",
     "id": "4ZMzyig5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KJ4sezFY",
   "type": "text",
   "x": 712,
   "y": 75.0,
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
   "seed": 1669680752,
   "version": 1,
   "versionNonce": 1693577624,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nSplitStrategy\n+ Split(total, users, values)",
   "originalText": "<<interface>>\nSplitStrategy\n+ Split(total, users, values)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "wugn9pf6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cGfEiPDB",
   "type": "rectangle",
   "x": 1100,
   "y": 60,
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
   "seed": 923144316,
   "version": 1,
   "versionNonce": 1358343472,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LCokGcQr"
    },
    {
     "type": "arrow",
     "id": "4ZMzyig5"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "LCokGcQr",
   "type": "text",
   "x": 1112,
   "y": 75.0,
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
   "seed": 783601508,
   "version": 1,
   "versionNonce": 1747332210,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "NewSplitStrategy(type)\nFactory",
   "originalText": "NewSplitStrategy(type)\nFactory",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "cGfEiPDB",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pD3W4VgK",
   "type": "rectangle",
   "x": 0,
   "y": 260,
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
   "seed": 934954872,
   "version": 1,
   "versionNonce": 1160803759,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ncw084vn"
    },
    {
     "type": "arrow",
     "id": "7cWPZku5"
    },
    {
     "type": "arrow",
     "id": "W3d57NEA"
    },
    {
     "type": "arrow",
     "id": "tBKGjDmK"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ncw084vn",
   "type": "text",
   "x": 12,
   "y": 275.0,
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
   "seed": 925017220,
   "version": 1,
   "versionNonce": 953791271,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Expense\n- ID, PaidBy, Total\n- Shares map[user]int64\n- Deleted bool",
   "originalText": "Expense\n- ID, PaidBy, Total\n- Shares map[user]int64\n- Deleted bool",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "pD3W4VgK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "6xsoOJzU",
   "type": "rectangle",
   "x": 540,
   "y": 260,
   "width": 238.0,
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
   "seed": 1235911235,
   "version": 1,
   "versionNonce": 733115540,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Vz0exWc7"
    },
    {
     "type": "arrow",
     "id": "leLvMcsF"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Vz0exWc7",
   "type": "text",
   "x": 552,
   "y": 275.0,
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
   "seed": 2064736039,
   "version": 1,
   "versionNonce": 358958281,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "EqualSplit\nfloor + leftover paise\nin sorted user order",
   "originalText": "EqualSplit\nfloor + leftover paise\nin sorted user order",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "6xsoOJzU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2GzzIEtf",
   "type": "rectangle",
   "x": 860,
   "y": 260,
   "width": 184.0,
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
   "seed": 668219894,
   "version": 1,
   "versionNonce": 294417940,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xlP2oswg"
    },
    {
     "type": "arrow",
     "id": "Hr4nqu4C"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "xlP2oswg",
   "type": "text",
   "x": 872,
   "y": 275.0,
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
   "seed": 868341319,
   "version": 1,
   "versionNonce": 280217280,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ExactSplit\nsum must = total",
   "originalText": "ExactSplit\nsum must = total",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "2GzzIEtf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5kdcueKP",
   "type": "rectangle",
   "x": 1120,
   "y": 260,
   "width": 265.0,
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
   "seed": 1050267056,
   "version": 1,
   "versionNonce": 990669472,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aQvJaEuW"
    },
    {
     "type": "arrow",
     "id": "hCFk5XKl"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "aQvJaEuW",
   "type": "text",
   "x": 1132,
   "y": 275.0,
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
   "seed": 148786628,
   "version": 1,
   "versionNonce": 461889429,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PercentSplit\nbasis points, sum = 10000",
   "originalText": "PercentSplit\nbasis points, sum = 10000",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5kdcueKP",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dmOc0DDM",
   "type": "rectangle",
   "x": 0,
   "y": 460,
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
   "seed": 925470172,
   "version": 1,
   "versionNonce": 86414936,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0ORtCS7M"
    },
    {
     "type": "arrow",
     "id": "W3d57NEA"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "0ORtCS7M",
   "type": "text",
   "x": 12,
   "y": 475.0,
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
   "seed": 297831306,
   "version": 1,
   "versionNonce": 77874226,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Share\n- UserID\n- AmountPaise",
   "originalText": "Share\n- UserID\n- AmountPaise",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "dmOc0DDM",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XQStChnW",
   "type": "rectangle",
   "x": 420,
   "y": 460,
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
   "seed": 1779068358,
   "version": 1,
   "versionNonce": 757293949,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "86deYJUL"
    },
    {
     "type": "arrow",
     "id": "9KXqk6lW"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "86deYJUL",
   "type": "text",
   "x": 432,
   "y": 475.0,
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
   "seed": 1129932791,
   "version": 1,
   "versionNonce": 386883802,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Transfer\n- From, To, Amount",
   "originalText": "Transfer\n- From, To, Amount",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "XQStChnW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "glyhM8Rd",
   "type": "rectangle",
   "x": 0,
   "y": 680,
   "width": 140,
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
   "seed": 241415914,
   "version": 1,
   "versionNonce": 152495286,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "mZIceCQG"
    },
    {
     "type": "arrow",
     "id": "qUaVmQef"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "mZIceCQG",
   "type": "text",
   "x": 43.0,
   "y": 700.0,
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
   "seed": 2040009262,
   "version": 1,
   "versionNonce": 1864738959,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Client",
   "originalText": "Client",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "glyhM8Rd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9YnLwpLJ",
   "type": "rectangle",
   "x": 200,
   "y": 680,
   "width": 175.0,
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
   "seed": 1826644008,
   "version": 1,
   "versionNonce": 2026995767,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "6uxk35H4"
    },
    {
     "type": "arrow",
     "id": "qUaVmQef"
    },
    {
     "type": "arrow",
     "id": "NgcqQfaB"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "6uxk35H4",
   "type": "text",
   "x": 220.0,
   "y": 700.0,
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
   "seed": 91840500,
   "version": 1,
   "versionNonce": 1325158170,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "AddExpense(req)",
   "originalText": "AddExpense(req)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9YnLwpLJ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eksxDRUe",
   "type": "rectangle",
   "x": 480,
   "y": 680,
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
   "seed": 1525163585,
   "version": 1,
   "versionNonce": 1440710995,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "y7cMmwau"
    },
    {
     "type": "arrow",
     "id": "NgcqQfaB"
    },
    {
     "type": "arrow",
     "id": "jTdRZm8G"
    },
    {
     "type": "arrow",
     "id": "dYyLynvZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "y7cMmwau",
   "type": "text",
   "x": 492,
   "y": 695.0,
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
   "seed": 2139926124,
   "version": 1,
   "versionNonce": 1018031038,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Factory -> strategy\nSplit(): shares in paise",
   "originalText": "Factory -> strategy\nSplit(): shares in paise",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "eksxDRUe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tLcxYef6",
   "type": "rectangle",
   "x": 820,
   "y": 680,
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
   "seed": 1103761616,
   "version": 1,
   "versionNonce": 1935815922,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "usMIJmgA"
    },
    {
     "type": "arrow",
     "id": "jTdRZm8G"
    },
    {
     "type": "arrow",
     "id": "Dbyc3chr"
    },
    {
     "type": "arrow",
     "id": "jV1g90EP"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "usMIJmgA",
   "type": "text",
   "x": 832,
   "y": 695.0,
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
   "seed": 9899795,
   "version": 1,
   "versionNonce": 1106508774,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Lock + check payer and\nparticipants are members",
   "originalText": "Lock + check payer and\nparticipants are members",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "tLcxYef6",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "waYUSxDl",
   "type": "rectangle",
   "x": 1160,
   "y": 680,
   "width": 256.0,
   "height": 110.0,
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
   "seed": 929241280,
   "version": 1,
   "versionNonce": 622986593,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DjoCgDca"
    },
    {
     "type": "arrow",
     "id": "Dbyc3chr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "DjoCgDca",
   "type": "text",
   "x": 1172,
   "y": 695.0,
   "width": 216.0,
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
   "seed": 838125215,
   "version": 1,
   "versionNonce": 1724499907,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "applyDeltas(+1)\npayer + total\neach participant - share\nnets sum to 0",
   "originalText": "applyDeltas(+1)\npayer + total\neach participant - share\nnets sum to 0",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "waYUSxDl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "siMS01l4",
   "type": "rectangle",
   "x": 480,
   "y": 860,
   "width": 310.0,
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
   "seed": 1242042966,
   "version": 1,
   "versionNonce": 486545392,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "mg9xwPHj"
    },
    {
     "type": "arrow",
     "id": "dYyLynvZ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "mg9xwPHj",
   "type": "text",
   "x": 492,
   "y": 875.0,
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
   "seed": 369610322,
   "version": 1,
   "versionNonce": 48810412,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Bad split\npercent != 100, exact != total\nnothing changed",
   "originalText": "Bad split\npercent != 100, exact != total\nnothing changed",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "siMS01l4",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "h5RS6zNt",
   "type": "rectangle",
   "x": 860,
   "y": 860,
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
   "seed": 949654613,
   "version": 1,
   "versionNonce": 1406781537,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9QKNBI3m"
    },
    {
     "type": "arrow",
     "id": "jV1g90EP"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "9QKNBI3m",
   "type": "text",
   "x": 872,
   "y": 875.0,
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
   "seed": 1980792211,
   "version": 1,
   "versionNonce": 203540618,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrNotGroupMember\nuser not in group",
   "originalText": "ErrNotGroupMember\nuser not in group",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "h5RS6zNt",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ijCFmoSQ",
   "type": "rectangle",
   "x": 200,
   "y": 1040,
   "width": 193.0,
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
   "seed": 222226592,
   "version": 1,
   "versionNonce": 1919602046,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vijcKZEe"
    },
    {
     "type": "arrow",
     "id": "Dr4glBpA"
    },
    {
     "type": "arrow",
     "id": "XWTG2H4Y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vijcKZEe",
   "type": "text",
   "x": 220.0,
   "y": 1060.0,
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
   "seed": 1460593270,
   "version": 1,
   "versionNonce": 2016092437,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "DeleteExpense(id)",
   "originalText": "DeleteExpense(id)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "ijCFmoSQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GguhYPGd",
   "type": "rectangle",
   "x": 560,
   "y": 1040,
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
   "seed": 1657936553,
   "version": 1,
   "versionNonce": 1357739152,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "0rpY8L8K"
    },
    {
     "type": "arrow",
     "id": "Dr4glBpA"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "0rpY8L8K",
   "type": "text",
   "x": 572,
   "y": 1055.0,
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
   "seed": 1720852916,
   "version": 1,
   "versionNonce": 1293952903,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "applyDeltas(-1)\nreverse STORED shares\nmark Deleted",
   "originalText": "applyDeltas(-1)\nreverse STORED shares\nmark Deleted",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "GguhYPGd",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5Tisk2cE",
   "type": "rectangle",
   "x": 200,
   "y": 1180,
   "width": 202.0,
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
   "seed": 1198172042,
   "version": 1,
   "versionNonce": 1387257231,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "9CxT6cKQ"
    },
    {
     "type": "arrow",
     "id": "XWTG2H4Y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "9CxT6cKQ",
   "type": "text",
   "x": 212,
   "y": 1195.0,
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
   "seed": 57155311,
   "version": 1,
   "versionNonce": 1265264256,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "already deleted\nno-op (idempotent)",
   "originalText": "already deleted\nno-op (idempotent)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5Tisk2cE",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "KPohX2Qj",
   "type": "ellipse",
   "x": 300,
   "y": 1680,
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
   "seed": 186978495,
   "version": 1,
   "versionNonce": 2116419595,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jhZtR3KC"
    },
    {
     "type": "arrow",
     "id": "XFPoab6G"
    },
    {
     "type": "arrow",
     "id": "TVINeyst"
    },
    {
     "type": "arrow",
     "id": "lZDqRjtc"
    },
    {
     "type": "arrow",
     "id": "A1VJGYnH"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "jhZtR3KC",
   "type": "text",
   "x": 352.0,
   "y": 1700.0,
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
   "seed": 803693808,
   "version": 1,
   "versionNonce": 360627034,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "a +8",
   "originalText": "a +8",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "KPohX2Qj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hng3Cfpo",
   "type": "ellipse",
   "x": 300,
   "y": 1480,
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
   "seed": 1489944007,
   "version": 1,
   "versionNonce": 314282685,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "U7UoytUQ"
    },
    {
     "type": "arrow",
     "id": "XFPoab6G"
    },
    {
     "type": "arrow",
     "id": "qtwwMUbY"
    },
    {
     "type": "arrow",
     "id": "jSkQyqb9"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "U7UoytUQ",
   "type": "text",
   "x": 352.0,
   "y": 1500.0,
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
   "seed": 1118084777,
   "version": 1,
   "versionNonce": 1315879027,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "b +1",
   "originalText": "b +1",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "hng3Cfpo",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "POqKdbQC",
   "type": "ellipse",
   "x": 0,
   "y": 1880,
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
   "seed": 1318014335,
   "version": 1,
   "versionNonce": 1785370050,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WJpoIjOn"
    },
    {
     "type": "arrow",
     "id": "TVINeyst"
    },
    {
     "type": "arrow",
     "id": "lZDqRjtc"
    },
    {
     "type": "arrow",
     "id": "qtwwMUbY"
    },
    {
     "type": "arrow",
     "id": "kdyOJ0sL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "WJpoIjOn",
   "type": "text",
   "x": 52.0,
   "y": 1900.0,
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
   "seed": 292997111,
   "version": 1,
   "versionNonce": 206839930,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "c -3",
   "originalText": "c -3",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "POqKdbQC",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "syEnDYQe",
   "type": "ellipse",
   "x": 600,
   "y": 1880,
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
   "seed": 1293336247,
   "version": 1,
   "versionNonce": 145059720,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "S3lUwMXB"
    },
    {
     "type": "arrow",
     "id": "A1VJGYnH"
    },
    {
     "type": "arrow",
     "id": "jSkQyqb9"
    },
    {
     "type": "arrow",
     "id": "kdyOJ0sL"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "S3lUwMXB",
   "type": "text",
   "x": 652.0,
   "y": 1900.0,
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
   "seed": 1226432058,
   "version": 1,
   "versionNonce": 1285290995,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "d -6",
   "originalText": "d -6",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "syEnDYQe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "vHyTbXQz",
   "type": "ellipse",
   "x": 1200,
   "y": 1680,
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
   "seed": 1915391637,
   "version": 1,
   "versionNonce": 2015127427,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Qvob5s9Z"
    },
    {
     "type": "arrow",
     "id": "eUPL5HCU"
    },
    {
     "type": "arrow",
     "id": "wkYgPUZp"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Qvob5s9Z",
   "type": "text",
   "x": 1252.0,
   "y": 1700.0,
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
   "seed": 1951522316,
   "version": 1,
   "versionNonce": 1186952286,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "a +8",
   "originalText": "a +8",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "vHyTbXQz",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "WqPuWCiU",
   "type": "ellipse",
   "x": 1200,
   "y": 1480,
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
   "seed": 305239370,
   "version": 1,
   "versionNonce": 1157044361,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5IMNzD2f"
    },
    {
     "type": "arrow",
     "id": "xMSM1L7l"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "5IMNzD2f",
   "type": "text",
   "x": 1252.0,
   "y": 1500.0,
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
   "seed": 1464677651,
   "version": 1,
   "versionNonce": 197693578,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "b +1",
   "originalText": "b +1",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "WqPuWCiU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "A1CO4BXi",
   "type": "ellipse",
   "x": 900,
   "y": 1880,
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
   "seed": 1336267699,
   "version": 1,
   "versionNonce": 1300146837,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tQ5XULnZ"
    },
    {
     "type": "arrow",
     "id": "wkYgPUZp"
    },
    {
     "type": "arrow",
     "id": "xMSM1L7l"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "tQ5XULnZ",
   "type": "text",
   "x": 952.0,
   "y": 1900.0,
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
   "seed": 721171008,
   "version": 1,
   "versionNonce": 1019350326,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "c -3",
   "originalText": "c -3",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "A1CO4BXi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "r9BcJjtw",
   "type": "ellipse",
   "x": 1500,
   "y": 1880,
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
   "seed": 870564344,
   "version": 1,
   "versionNonce": 1525782108,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Hqc1mMfi"
    },
    {
     "type": "arrow",
     "id": "eUPL5HCU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Hqc1mMfi",
   "type": "text",
   "x": 1552.0,
   "y": 1900.0,
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
   "seed": 1572632464,
   "version": 1,
   "versionNonce": 1074328667,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "d -6",
   "originalText": "d -6",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "r9BcJjtw",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "QGG967JW",
   "type": "rectangle",
   "x": 0,
   "y": 2200,
   "width": 238.0,
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
   "seed": 1574512717,
   "version": 1,
   "versionNonce": 1415722976,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "xvuTeMWG"
    },
    {
     "type": "arrow",
     "id": "U37yFR1y"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "xvuTeMWG",
   "type": "text",
   "x": 12,
   "y": 2215.0,
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
   "seed": 1705343211,
   "version": 1,
   "versionNonce": 1174808372,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "group_members\nPK (group_id, user_id)",
   "originalText": "group_members\nPK (group_id, user_id)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "QGG967JW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dFniybLf",
   "type": "rectangle",
   "x": 320,
   "y": 2200,
   "width": 337.0,
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
   "seed": 1919878060,
   "version": 1,
   "versionNonce": 591330547,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nH5kAAiF"
    },
    {
     "type": "arrow",
     "id": "U37yFR1y"
    },
    {
     "type": "arrow",
     "id": "y1LgJ6be"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nH5kAAiF",
   "type": "text",
   "x": 332,
   "y": 2215.0,
   "width": 297.0,
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
   "seed": 619770057,
   "version": 1,
   "versionNonce": 1889072188,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "expenses\nid PK, total_paise > 0\nFK (group_id, paid_by) -> members\nUNIQUE (group_id, request_id)\ndeleted_at (soft delete)",
   "originalText": "expenses\nid PK, total_paise > 0\nFK (group_id, paid_by) -> members\nUNIQUE (group_id, request_id)\ndeleted_at (soft delete)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "dFniybLf",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "1iWRuov1",
   "type": "rectangle",
   "x": 720,
   "y": 2200,
   "width": 337.0,
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
   "seed": 685888744,
   "version": 1,
   "versionNonce": 524408829,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NEM86eCV"
    },
    {
     "type": "arrow",
     "id": "y1LgJ6be"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NEM86eCV",
   "type": "text",
   "x": 732,
   "y": 2215.0,
   "width": 297.0,
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
   "seed": 1382066274,
   "version": 1,
   "versionNonce": 1171519138,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "expense_shares\nPK (expense_id, user_id)\nFK (group_id, user_id) -> members\nshare_paise >= 0",
   "originalText": "expense_shares\nPK (expense_id, user_id)\nFK (group_id, user_id) -> members\nshare_paise >= 0",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "1iWRuov1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "sBd9LCp7",
   "type": "rectangle",
   "x": 1110,
   "y": 2200,
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
   "seed": 842044309,
   "version": 1,
   "versionNonce": 1472259852,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Evd9Pr7v"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "Evd9Pr7v",
   "type": "text",
   "x": 1122,
   "y": 2215.0,
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
   "seed": 1444733058,
   "version": 1,
   "versionNonce": 1459010239,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "group_balances\nPK (group_id, user_id)\nnet_paise += delta (relative)\nsum of nets = 0",
   "originalText": "group_balances\nPK (group_id, user_id)\nnet_paise += delta (relative)\nsum of nets = 0",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "sBd9LCp7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8yBmPxkU",
   "type": "arrow",
   "x": 224.0,
   "y": 101.6470588235294,
   "width": 152.0,
   "height": 4.470588235294116,
   "angle": 0,
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
   "seed": 1953393529,
   "version": 1,
   "versionNonce": 1072053715,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "omb6gA7T"
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
     -4.470588235294116
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "goaZf8yY",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "W29IoyWm",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "omb6gA7T",
   "type": "text",
   "x": 217.3125,
   "y": 90.66176470588235,
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
   "seed": 252775271,
   "version": 1,
   "versionNonce": 702306749,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "members, many to many",
   "originalText": "members, many to many",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "8yBmPxkU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7cWPZku5",
   "type": "arrow",
   "x": 113.15,
   "y": 154.0,
   "width": 6.55714285714285,
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
   "seed": 40444394,
   "version": 1,
   "versionNonce": 33036229,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VNjgGS5W"
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
     6.55714285714285,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "goaZf8yY",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "pD3W4VgK",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "VNjgGS5W",
   "type": "text",
   "x": 80.99107142857143,
   "y": 196.25,
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
   "seed": 1663290132,
   "version": 1,
   "versionNonce": 323855270,
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
   "containerId": "7cWPZku5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "W3d57NEA",
   "type": "arrow",
   "x": 109.52631578947368,
   "y": 374.0,
   "width": 19.421052631578945,
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
   "seed": 1885395077,
   "version": 1,
   "versionNonce": 914024516,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LkpAepVD"
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
     -19.421052631578945,
     82.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pD3W4VgK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "dmOc0DDM",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "LkpAepVD",
   "type": "text",
   "x": 64.37828947368422,
   "y": 406.25,
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
   "seed": 767406658,
   "version": 1,
   "versionNonce": 310047531,
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
   "containerId": "W3d57NEA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tBKGjDmK",
   "type": "arrow",
   "x": 251.0,
   "y": 278.1705639614855,
   "width": 445.0,
   "height": 128.54195323246216,
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
   "seed": 61545353,
   "version": 1,
   "versionNonce": 1691650972,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "IjeLXj7U"
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
     445.0,
     -128.54195323246216
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "pD3W4VgK",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wugn9pf6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "IjeLXj7U",
   "type": "text",
   "x": 457.75,
   "y": 205.14958734525445,
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
   "seed": 284505037,
   "version": 1,
   "versionNonce": 610381583,
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
   "containerId": "tBKGjDmK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "leLvMcsF",
   "type": "arrow",
   "x": 705.9175,
   "y": 256.0,
   "width": 97.66499999999996,
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
   "seed": 937115937,
   "version": 1,
   "versionNonce": 715132286,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "mHyFzthw"
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
     97.66499999999996,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "6xsoOJzU",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wugn9pf6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "mHyFzthw",
   "type": "text",
   "x": 715.375,
   "y": 196.25,
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
   "seed": 671190023,
   "version": 1,
   "versionNonce": 1170544448,
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
   "containerId": "leLvMcsF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Hr4nqu4C",
   "type": "arrow",
   "x": 931.1657894736842,
   "y": 256.0,
   "width": 54.48947368421045,
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
   "seed": 1371574803,
   "version": 1,
   "versionNonce": 1434278202,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zjpzfefI"
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
     -54.48947368421045,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "2GzzIEtf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wugn9pf6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "zjpzfefI",
   "type": "text",
   "x": 864.546052631579,
   "y": 196.25,
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
   "seed": 1265776197,
   "version": 1,
   "versionNonce": 1427943595,
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
   "containerId": "Hr4nqu4C",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hCFk5XKl",
   "type": "arrow",
   "x": 1169.9842105263158,
   "y": 256.0,
   "width": 215.8105263157895,
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
   "seed": 1547451248,
   "version": 1,
   "versionNonce": 1717160187,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "JcQ1OkMC"
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
     -215.8105263157895,
     -102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5kdcueKP",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wugn9pf6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "JcQ1OkMC",
   "type": "text",
   "x": 1022.703947368421,
   "y": 196.25,
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
   "seed": 222150009,
   "version": 1,
   "versionNonce": 754652957,
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
   "containerId": "hCFk5XKl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4ZMzyig5",
   "type": "arrow",
   "x": 1096.0,
   "y": 98.33785617367707,
   "width": 91.0,
   "height": 2.4694708276797854,
   "angle": 0,
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
   "seed": 1920357984,
   "version": 1,
   "versionNonce": 351654524,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "I3GhsMko"
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
     -91.0,
     2.4694708276797854
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "cGfEiPDB",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wugn9pf6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "I3GhsMko",
   "type": "text",
   "x": 1022.9375,
   "y": 90.82259158751697,
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
   "seed": 1675992218,
   "version": 1,
   "versionNonce": 139238763,
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
   "containerId": "4ZMzyig5",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "9KXqk6lW",
   "type": "arrow",
   "x": 161.63846153846154,
   "y": 154.0,
   "width": 318.2615384615384,
   "height": 302.0,
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
   "seed": 1345992820,
   "version": 1,
   "versionNonce": 1457387809,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qNM3Udur"
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
     318.2615384615384,
     302.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "goaZf8yY",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "XQStChnW",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "qNM3Udur",
   "type": "text",
   "x": 234.14423076923077,
   "y": 296.25,
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
   "seed": 1766992961,
   "version": 1,
   "versionNonce": 1428419398,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "SimplifyDebts produces",
   "originalText": "SimplifyDebts produces",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "9KXqk6lW",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qUaVmQef",
   "type": "arrow",
   "x": 144.0,
   "y": 710.0,
   "width": 52.0,
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
   "seed": 147210952,
   "version": 1,
   "versionNonce": 1798407421,
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
     52.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "glyhM8Rd",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "9YnLwpLJ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "NgcqQfaB",
   "type": "arrow",
   "x": 379.0,
   "y": 711.427457098284,
   "width": 97.0,
   "height": 1.513260530421121,
   "angle": 0,
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
   "seed": 131781228,
   "version": 1,
   "versionNonce": 1716451378,
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
     1.513260530421121
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "9YnLwpLJ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "eksxDRUe",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jTdRZm8G",
   "type": "arrow",
   "x": 740.0,
   "y": 715.0,
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
   "seed": 520934046,
   "version": 1,
   "versionNonce": 67044666,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7LJYerLR"
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
     76.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eksxDRUe",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "tLcxYef6",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7LJYerLR",
   "type": "text",
   "x": 742.5625,
   "y": 706.25,
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
   "seed": 1790556602,
   "version": 1,
   "versionNonce": 1211212963,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "shares ok",
   "originalText": "shares ok",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jTdRZm8G",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Dbyc3chr",
   "type": "arrow",
   "x": 1080.0,
   "y": 722.7647058823529,
   "width": 76.0,
   "height": 4.470588235294144,
   "angle": 0,
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
   "seed": 1305856467,
   "version": 1,
   "versionNonce": 1003799685,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "MKx9p4om"
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
     76.0,
     4.470588235294144
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "tLcxYef6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "waYUSxDl",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "MKx9p4om",
   "type": "text",
   "x": 1074.6875,
   "y": 716.25,
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
   "seed": 871950293,
   "version": 1,
   "versionNonce": 75307772,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "all members",
   "originalText": "all members",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Dbyc3chr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dYyLynvZ",
   "type": "arrow",
   "x": 613.5421052631579,
   "y": 754.0,
   "width": 14.49473684210534,
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
   "seed": 2051178391,
   "version": 1,
   "versionNonce": 299037786,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "A0ijzE77"
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
     14.49473684210534,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "eksxDRUe",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "siMS01l4",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "A0ijzE77",
   "type": "text",
   "x": 593.2269736842105,
   "y": 796.25,
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
   "seed": 280698,
   "version": 1,
   "versionNonce": 1155911257,
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
   "containerId": "dYyLynvZ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jV1g90EP",
   "type": "arrow",
   "x": 949.8416666666667,
   "y": 754.0,
   "width": 4.816666666666606,
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
   "seed": 1433464253,
   "version": 1,
   "versionNonce": 1361664770,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8GVSRBX1"
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
     4.816666666666606,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "tLcxYef6",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "h5RS6zNt",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "8GVSRBX1",
   "type": "text",
   "x": 920.75,
   "y": 796.25,
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
   "seed": 1438120164,
   "version": 1,
   "versionNonce": 1245624831,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "stranger",
   "originalText": "stranger",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jV1g90EP",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Dr4glBpA",
   "type": "arrow",
   "x": 397.0,
   "y": 1073.9880952380952,
   "width": 159.0,
   "height": 6.309523809523853,
   "angle": 0,
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
   "seed": 1385400389,
   "version": 1,
   "versionNonce": 511776266,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7QP50pT3"
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
     159.0,
     6.309523809523853
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ijCFmoSQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "GguhYPGd",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7QP50pT3",
   "type": "text",
   "x": 437.125,
   "y": 1068.392857142857,
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
   "seed": 1252501693,
   "version": 1,
   "versionNonce": 1596163793,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "first time",
   "originalText": "first time",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Dr4glBpA",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XWTG2H4Y",
   "type": "arrow",
   "x": 297.5551724137931,
   "y": 1104.0,
   "width": 2.234482758620686,
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
   "seed": 2024356043,
   "version": 1,
   "versionNonce": 860671554,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "dOI6yShB"
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
     2.234482758620686,
     72.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "ijCFmoSQ",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5Tisk2cE",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "dOI6yShB",
   "type": "text",
   "x": 278.9849137931035,
   "y": 1131.25,
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
   "seed": 82914756,
   "version": 1,
   "versionNonce": 1696768,
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
   "containerId": "XWTG2H4Y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "XFPoab6G",
   "type": "arrow",
   "x": 370.0,
   "y": 1544.0,
   "width": 0.0,
   "height": 132.0,
   "angle": 0,
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
   "seed": 1855346419,
   "version": 1,
   "versionNonce": 397536125,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iNk31lSn"
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
     132.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "hng3Cfpo",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "KPohX2Qj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "iNk31lSn",
   "type": "text",
   "x": 366.0625,
   "y": 1601.25,
   "width": 7.875,
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
   "seed": 841377129,
   "version": 1,
   "versionNonce": 68951180,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3",
   "originalText": "3",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "XFPoab6G",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TVINeyst",
   "type": "arrow",
   "x": 120.31349834435059,
   "y": 1894.4854241477528,
   "width": 216.01400919805565,
   "height": 144.00933946537043,
   "angle": 0,
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
   "seed": 1065858505,
   "version": 1,
   "versionNonce": 811672203,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tM4hMnz2"
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
     216.01400919805565,
     -144.00933946537043
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "POqKdbQC",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "KPohX2Qj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "tM4hMnz2",
   "type": "text",
   "x": 224.38300294337841,
   "y": 1813.7307544150676,
   "width": 7.875,
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
   "seed": 2048089227,
   "version": 1,
   "versionNonce": 161912364,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3",
   "originalText": "3",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "TVINeyst",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "lZDqRjtc",
   "type": "arrow",
   "x": 319.6865016556494,
   "y": 1725.5145758522472,
   "width": 216.0140091980557,
   "height": 144.00933946537043,
   "angle": 0,
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
   "seed": 2046996243,
   "version": 1,
   "versionNonce": 1226285892,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "a4LNg3MU"
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
     -216.0140091980557,
     144.00933946537043
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "KPohX2Qj",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "POqKdbQC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "a4LNg3MU",
   "type": "text",
   "x": 207.74199705662156,
   "y": 1788.7692455849324,
   "width": 7.875,
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
   "seed": 1737190898,
   "version": 1,
   "versionNonce": 1571504285,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1",
   "originalText": "1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "lZDqRjtc",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "A1VJGYnH",
   "type": "arrow",
   "x": 628.0070045990278,
   "y": 1882.0046697326852,
   "width": 216.01400919805565,
   "height": 144.00933946537043,
   "angle": 0,
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
   "seed": 513542992,
   "version": 1,
   "versionNonce": 1005349006,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iXUHfdXW"
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
     -216.01400919805565,
     -144.00933946537043
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "syEnDYQe",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "KPohX2Qj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "iXUHfdXW",
   "type": "text",
   "x": 516.0625,
   "y": 1801.25,
   "width": 7.875,
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
   "seed": 1346325152,
   "version": 1,
   "versionNonce": 1298291015,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3",
   "originalText": "3",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "A1VJGYnH",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "qtwwMUbY",
   "type": "arrow",
   "x": 94.1087416129242,
   "y": 1877.8550111827676,
   "width": 251.78251677415162,
   "height": 335.7100223655352,
   "angle": 0,
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
   "seed": 127519001,
   "version": 1,
   "versionNonce": 1619864908,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DhM78E8q"
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
     251.78251677415162,
     -335.7100223655352
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "POqKdbQC",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "hng3Cfpo",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DhM78E8q",
   "type": "text",
   "x": 216.0625,
   "y": 1701.25,
   "width": 7.875,
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
   "seed": 382688020,
   "version": 1,
   "versionNonce": 205039470,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2",
   "originalText": "2",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "qtwwMUbY",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jSkQyqb9",
   "type": "arrow",
   "x": 645.8912583870758,
   "y": 1877.8550111827676,
   "width": 251.78251677415165,
   "height": 335.7100223655352,
   "angle": 0,
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
   "seed": 1977770579,
   "version": 1,
   "versionNonce": 748858513,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "5y3DKLqI"
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
     -251.78251677415165,
     -335.7100223655352
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "syEnDYQe",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "hng3Cfpo",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "5y3DKLqI",
   "type": "text",
   "x": 516.0625,
   "y": 1701.25,
   "width": 7.875,
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
   "seed": 1537838432,
   "version": 1,
   "versionNonce": 393895462,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2",
   "originalText": "2",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "jSkQyqb9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "kdyOJ0sL",
   "type": "arrow",
   "x": 596.0,
   "y": 1910.0,
   "width": 452.0,
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
   "seed": 2127830685,
   "version": 1,
   "versionNonce": 740133200,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "usgr0KqP"
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
     -452.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "syEnDYQe",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "POqKdbQC",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "usgr0KqP",
   "type": "text",
   "x": 366.0625,
   "y": 1901.25,
   "width": 7.875,
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
   "seed": 1379622937,
   "version": 1,
   "versionNonce": 503538946,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1",
   "originalText": "1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "kdyOJ0sL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "eUPL5HCU",
   "type": "arrow",
   "x": 1528.0070045990278,
   "y": 1882.0046697326852,
   "width": 216.01400919805565,
   "height": 144.00933946537043,
   "angle": 0,
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
   "seed": 1607736769,
   "version": 1,
   "versionNonce": 497256035,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "Q7j69Biu"
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
     -216.01400919805565,
     -144.00933946537043
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "r9BcJjtw",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "vHyTbXQz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Q7j69Biu",
   "type": "text",
   "x": 1416.0625,
   "y": 1801.25,
   "width": 7.875,
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
   "seed": 1819211671,
   "version": 1,
   "versionNonce": 1974947577,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "6",
   "originalText": "6",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "eUPL5HCU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wkYgPUZp",
   "type": "arrow",
   "x": 1011.9929954009722,
   "y": 1882.0046697326852,
   "width": 216.01400919805565,
   "height": 144.00933946537043,
   "angle": 0,
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
   "seed": 587086874,
   "version": 1,
   "versionNonce": 57292047,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HHEyjE7R"
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
     216.01400919805565,
     -144.00933946537043
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "A1CO4BXi",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "vHyTbXQz",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "HHEyjE7R",
   "type": "text",
   "x": 1116.0625,
   "y": 1801.25,
   "width": 7.875,
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
   "seed": 1718735194,
   "version": 1,
   "versionNonce": 969947944,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2",
   "originalText": "2",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "wkYgPUZp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "xMSM1L7l",
   "type": "arrow",
   "x": 994.1087416129242,
   "y": 1877.8550111827676,
   "width": 251.78251677415165,
   "height": 335.7100223655352,
   "angle": 0,
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
   "seed": 1254755296,
   "version": 1,
   "versionNonce": 959139699,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "7xjtnQMD"
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
     251.78251677415165,
     -335.7100223655352
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "A1CO4BXi",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "WqPuWCiU",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "7xjtnQMD",
   "type": "text",
   "x": 1116.0625,
   "y": 1701.25,
   "width": 7.875,
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
   "seed": 2014919758,
   "version": 1,
   "versionNonce": 2109778183,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1",
   "originalText": "1",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "xMSM1L7l",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "U37yFR1y",
   "type": "arrow",
   "x": 316.0,
   "y": 2250.994587280108,
   "width": 74.0,
   "height": 6.008119079837343,
   "angle": 0,
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
   "seed": 1496187811,
   "version": 1,
   "versionNonce": 1639504379,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "W9Auunon"
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
     -74.0,
     -6.008119079837343
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "dFniybLf",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "QGG967JW",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "W9Auunon",
   "type": "text",
   "x": 271.125,
   "y": 2239.2405277401895,
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
   "seed": 1875218063,
   "version": 1,
   "versionNonce": 1218869690,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "FK",
   "originalText": "FK",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "U37yFR1y",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "y1LgJ6be",
   "type": "arrow",
   "x": 716.0,
   "y": 2259.3125,
   "width": 55.0,
   "height": 1.375,
   "angle": 0,
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
   "seed": 674100972,
   "version": 1,
   "versionNonce": 1042717319,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "1riDNYBi"
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
     -55.0,
     1.375
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "1iWRuov1",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "dFniybLf",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "1riDNYBi",
   "type": "text",
   "x": 680.625,
   "y": 2251.25,
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
   "seed": 1627187765,
   "version": 1,
   "versionNonce": 1752935653,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "FK",
   "originalText": "FK",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "y1LgJ6be",
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