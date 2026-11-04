---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
1. Entities and relationships ^YDxakh1L

2. Core flow: BorrowBook, ReturnBook, ReportLost ^0NC0NOau

3. State machine: BookCopy ^2BMeLj9v

4. Storage ^GuJArTNr

Search/reserve a Book.
Borrow/return/hold/lose a BookCopy. ^i2KhAtS1

Lost is terminal. ^pNR2uSMk

Book (catalog)
- ISBN, Title, Author
- Category, Price ^UiLN3WWc

BookCopy (physical)
- ID, ISBN
- Status, HeldFor ^VvJgQRZb

Loan
- CopyID, MemberID
- IssuedAt, DueAt ^VMTGtxOb

Member
- ID
- active loans ^whYBogMO

Reservation queue
isbn -> FIFO member IDs ^iKrwv8gs

Library (facade)
+ SearchBooks(ctx, q)
+ BorrowBook(ctx, member, isbn)
+ ReturnBook(ctx, copyID)
+ ReserveBook(ctx, member, isbn)
+ ReportLost(ctx, copyID) ^KoGLV1pE

<<interface>>
FineStrategy
+ Fine(daysLate) int64 ^aYAGYwXD

PerDayFine
per day, capped ^cchIkIEk

<<interface>>
Notifier
+ BookAvailable(ctx, member, isbn) ^iC3nOF8D

Member
BorrowBook(isbn) ^s7yZLeLP

lock
book exists? ^aioS2x4Y

active < maxLoans? ^LXFeMcDO

pick copy: Held for me,
else first Available ^RF24Nl9g

mark Issued, dequeue
Loan due = now + 14d ^FkZ51rSZ

ErrBookNotFound ^iZGehzGU

ErrLimitReached ^B72jeQQi

ErrNoCopyAvailable
-> ReserveBook ^96R3oMTn

Member
ReturnBook(copyID) ^vNydp9zY

close loan
FineStrategy.Fine(daysLate) ^P3krS6al

queue empty: Available
else Held for head ^nCGnwFsE

unlock, then
Notifier.BookAvailable(head) ^YKnCf9gD

ErrNotIssued
duplicate return or lost ^ZV4dzlLn

Member
ReportLost(copyID) ^lVivfd6N

close loan
charge = fine + Book.Price ^WOSGWY5l

copy -> Lost
never lent again ^GlPJmsRP

Available ^CRjJNTfw

Issued ^qrRYigCp

Held ^8ZuqyiJ2

Lost ^EmLMPNWy

books
isbn PK
title, author, category
price_paise
idx lower(title), lower(author) ^CXjYEMQD

book_copies
id PK, isbn FK
status CHECK available,
  issued, held, lost
held_for FK members ^hekOKS3G

loans
id PK, copy_id FK, member_id FK
due_at, returned_at, lost
fine_paise
UNIQUE copy_id WHERE
  returned_at IS NULL ^NxEOGi0M

reservations
id PK = FIFO order
isbn, member_id, status
UNIQUE (isbn, member_id)
  WHERE active ^kzvizSqn

1 to many copies ^zDivDWER

0..1 open loan ^YRHM8Plg

1 to many ^87RPxJ1J

catalog ^DJ6WS777

copies ^ItuOWMNN

queue per ISBN ^X9miNJjG

tracks open ^HdbbWtUf

uses ^LFrjHJIA

notifies after unlock ^atCXkxI9

implements ^QUWf3Xog

yes ^6t5SxFWs

yes ^jXSbv5TW

copy found ^whyhDz4C

no ^2FVMW2IG

no ^R30UB3br

none ^t2ZDDftE

open loan ^ivld6Fsq

if Held ^DGt359eS

no open loan ^WTVXpZjH

borrow ^k5EISXNP

return, queue empty ^4qWdTIhW

return, someone waiting ^W5u2x3JH

queue head borrows ^uuLNcctS

ReportLost ^TehkLXgx

isbn FK ^USkAClz3

copy_id FK ^tpJdZwHX

%%
## Drawing
```json
{
 "type": "excalidraw",
 "version": 2,
 "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin",
 "elements": [
  {
   "id": "YDxakh1L",
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
   "seed": 1759812394,
   "version": 1,
   "versionNonce": 194423153,
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
   "id": "0NC0NOau",
   "type": "text",
   "x": 0,
   "y": 740,
   "width": 756.0,
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
   "seed": 189557157,
   "version": 1,
   "versionNonce": 702913565,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "2. Core flow: BorrowBook, ReturnBook, ReportLost",
   "originalText": "2. Core flow: BorrowBook, ReturnBook, ReportLost",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "2BMeLj9v",
   "type": "text",
   "x": 0,
   "y": 1680,
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
   "seed": 1626667082,
   "version": 1,
   "versionNonce": 347602156,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "3. State machine: BookCopy",
   "originalText": "3. State machine: BookCopy",
   "fontSize": 28,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "GuJArTNr",
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
   "seed": 1396939506,
   "version": 1,
   "versionNonce": 733682638,
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
   "id": "i2KhAtS1",
   "type": "text",
   "x": 1120,
   "y": 520,
   "width": 315.0,
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
   "seed": 866869579,
   "version": 1,
   "versionNonce": 1400408796,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Search/reserve a Book.\nBorrow/return/hold/lose a BookCopy.",
   "originalText": "Search/reserve a Book.\nBorrow/return/hold/lose a BookCopy.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pNR2uSMk",
   "type": "text",
   "x": 640,
   "y": 1980,
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
   "seed": 407874838,
   "version": 1,
   "versionNonce": 210378680,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Lost is terminal.",
   "originalText": "Lost is terminal.",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "top",
   "containerId": null,
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "TErYEcYl",
   "type": "rectangle",
   "x": 0,
   "y": 60,
   "width": 229.0,
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
   "seed": 1307559171,
   "version": 1,
   "versionNonce": 984490728,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "UiLN3WWc"
    },
    {
     "type": "arrow",
     "id": "mIdQCyBe"
    },
    {
     "type": "arrow",
     "id": "CzbXwjLq"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "UiLN3WWc",
   "type": "text",
   "x": 12,
   "y": 75.0,
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
   "seed": 2099486835,
   "version": 1,
   "versionNonce": 781095358,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Book (catalog)\n- ISBN, Title, Author\n- Category, Price",
   "originalText": "Book (catalog)\n- ISBN, Title, Author\n- Category, Price",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "TErYEcYl",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hrdIXyZF",
   "type": "rectangle",
   "x": 380,
   "y": 60,
   "width": 211.0,
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
   "seed": 548409146,
   "version": 1,
   "versionNonce": 708081856,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VvJgQRZb"
    },
    {
     "type": "arrow",
     "id": "mIdQCyBe"
    },
    {
     "type": "arrow",
     "id": "l1ELduPi"
    },
    {
     "type": "arrow",
     "id": "A3nuM99V"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VvJgQRZb",
   "type": "text",
   "x": 392,
   "y": 75.0,
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
   "seed": 1346340579,
   "version": 1,
   "versionNonce": 1204634745,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "BookCopy (physical)\n- ID, ISBN\n- Status, HeldFor",
   "originalText": "BookCopy (physical)\n- ID, ISBN\n- Status, HeldFor",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "hrdIXyZF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7FpTnr1A",
   "type": "rectangle",
   "x": 760,
   "y": 60,
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
   "seed": 819457153,
   "version": 1,
   "versionNonce": 12637303,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "VMTGtxOb"
    },
    {
     "type": "arrow",
     "id": "l1ELduPi"
    },
    {
     "type": "arrow",
     "id": "sipe8dao"
    },
    {
     "type": "arrow",
     "id": "VXgmzzep"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "VMTGtxOb",
   "type": "text",
   "x": 772,
   "y": 75.0,
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
   "seed": 256082153,
   "version": 1,
   "versionNonce": 303611277,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Loan\n- CopyID, MemberID\n- IssuedAt, DueAt",
   "originalText": "Loan\n- CopyID, MemberID\n- IssuedAt, DueAt",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "7FpTnr1A",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mIxBvHhL",
   "type": "rectangle",
   "x": 1120,
   "y": 60,
   "width": 166.0,
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
   "seed": 1125218256,
   "version": 1,
   "versionNonce": 2034931533,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "whYBogMO"
    },
    {
     "type": "arrow",
     "id": "sipe8dao"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "whYBogMO",
   "type": "text",
   "x": 1132,
   "y": 75.0,
   "width": 126.0,
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
   "seed": 15501510,
   "version": 1,
   "versionNonce": 2104724666,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Member\n- ID\n- active loans",
   "originalText": "Member\n- ID\n- active loans",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "mIxBvHhL",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Kf2EGvsK",
   "type": "rectangle",
   "x": 0,
   "y": 300,
   "width": 247.0,
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
   "seed": 1541913656,
   "version": 1,
   "versionNonce": 102109344,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iKrwv8gs"
    },
    {
     "type": "arrow",
     "id": "JfcdjNUe"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "iKrwv8gs",
   "type": "text",
   "x": 12,
   "y": 315.0,
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
   "seed": 1825402908,
   "version": 1,
   "versionNonce": 400502327,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Reservation queue\nisbn -> FIFO member IDs",
   "originalText": "Reservation queue\nisbn -> FIFO member IDs",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "Kf2EGvsK",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YRyDrnun",
   "type": "rectangle",
   "x": 380,
   "y": 300,
   "width": 328.0,
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
   "seed": 1566537903,
   "version": 1,
   "versionNonce": 1495984568,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "KoGLV1pE"
    },
    {
     "type": "arrow",
     "id": "CzbXwjLq"
    },
    {
     "type": "arrow",
     "id": "A3nuM99V"
    },
    {
     "type": "arrow",
     "id": "JfcdjNUe"
    },
    {
     "type": "arrow",
     "id": "VXgmzzep"
    },
    {
     "type": "arrow",
     "id": "JOXbRGFN"
    },
    {
     "type": "arrow",
     "id": "7u2PFEpU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "KoGLV1pE",
   "type": "text",
   "x": 392,
   "y": 315.0,
   "width": 288.0,
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
   "seed": 1114457826,
   "version": 1,
   "versionNonce": 425156629,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Library (facade)\n+ SearchBooks(ctx, q)\n+ BorrowBook(ctx, member, isbn)\n+ ReturnBook(ctx, copyID)\n+ ReserveBook(ctx, member, isbn)\n+ ReportLost(ctx, copyID)",
   "originalText": "Library (facade)\n+ SearchBooks(ctx, q)\n+ BorrowBook(ctx, member, isbn)\n+ ReturnBook(ctx, copyID)\n+ ReserveBook(ctx, member, isbn)\n+ ReportLost(ctx, copyID)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "YRyDrnun",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "LfSmVsWo",
   "type": "rectangle",
   "x": 860,
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
   "seed": 1434426549,
   "version": 1,
   "versionNonce": 527224624,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aYAGYwXD"
    },
    {
     "type": "arrow",
     "id": "JOXbRGFN"
    },
    {
     "type": "arrow",
     "id": "gMvcqAKr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "aYAGYwXD",
   "type": "text",
   "x": 872,
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
   "seed": 1244453888,
   "version": 1,
   "versionNonce": 268312161,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nFineStrategy\n+ Fine(daysLate) int64",
   "originalText": "<<interface>>\nFineStrategy\n+ Fine(daysLate) int64",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "LfSmVsWo",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "leeREGJV",
   "type": "rectangle",
   "x": 860,
   "y": 520,
   "width": 175.0,
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
   "seed": 2117612901,
   "version": 1,
   "versionNonce": 1638178575,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "cchIkIEk"
    },
    {
     "type": "arrow",
     "id": "gMvcqAKr"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "cchIkIEk",
   "type": "text",
   "x": 872,
   "y": 535.0,
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
   "seed": 1295697079,
   "version": 1,
   "versionNonce": 626090096,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "PerDayFine\nper day, capped",
   "originalText": "PerDayFine\nper day, capped",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "leeREGJV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4ZJwdChI",
   "type": "rectangle",
   "x": 380,
   "y": 560,
   "width": 346.0,
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
   "seed": 413686371,
   "version": 1,
   "versionNonce": 1354564140,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iC3nOF8D"
    },
    {
     "type": "arrow",
     "id": "7u2PFEpU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "iC3nOF8D",
   "type": "text",
   "x": 392,
   "y": 575.0,
   "width": 306.0,
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
   "seed": 326817920,
   "version": 1,
   "versionNonce": 119227367,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "<<interface>>\nNotifier\n+ BookAvailable(ctx, member, isbn)",
   "originalText": "<<interface>>\nNotifier\n+ BookAvailable(ctx, member, isbn)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "4ZJwdChI",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "r6xTC2Vq",
   "type": "rectangle",
   "x": 0,
   "y": 800,
   "width": 184.0,
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
   "seed": 155633509,
   "version": 1,
   "versionNonce": 2061922190,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "s7yZLeLP"
    },
    {
     "type": "arrow",
     "id": "EvFWVJZq"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "s7yZLeLP",
   "type": "text",
   "x": 12,
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
   "seed": 1720537811,
   "version": 1,
   "versionNonce": 94800068,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Member\nBorrowBook(isbn)",
   "originalText": "Member\nBorrowBook(isbn)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "r6xTC2Vq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "xWIHTM51",
   "type": "rectangle",
   "x": 320,
   "y": 800,
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
   "seed": 1333584675,
   "version": 1,
   "versionNonce": 229696207,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "aioS2x4Y"
    },
    {
     "type": "arrow",
     "id": "EvFWVJZq"
    },
    {
     "type": "arrow",
     "id": "pvqKbVpV"
    },
    {
     "type": "arrow",
     "id": "bB4IbhsS"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "aioS2x4Y",
   "type": "text",
   "x": 332,
   "y": 815.0,
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
   "seed": 420695578,
   "version": 1,
   "versionNonce": 996231899,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "lock\nbook exists?",
   "originalText": "lock\nbook exists?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "xWIHTM51",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "34AqLRng",
   "type": "rectangle",
   "x": 640,
   "y": 800,
   "width": 202.0,
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
   "seed": 1329069951,
   "version": 1,
   "versionNonce": 1610026600,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LXFeMcDO"
    },
    {
     "type": "arrow",
     "id": "pvqKbVpV"
    },
    {
     "type": "arrow",
     "id": "wkjxJn8m"
    },
    {
     "type": "arrow",
     "id": "bdRZoq9z"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "LXFeMcDO",
   "type": "text",
   "x": 660.0,
   "y": 820.0,
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
   "seed": 1269945123,
   "version": 1,
   "versionNonce": 912724418,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "active < maxLoans?",
   "originalText": "active < maxLoans?",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "34AqLRng",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mcMwmoTj",
   "type": "rectangle",
   "x": 960,
   "y": 800,
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
   "seed": 1438683559,
   "version": 1,
   "versionNonce": 137531933,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "RF24Nl9g"
    },
    {
     "type": "arrow",
     "id": "wkjxJn8m"
    },
    {
     "type": "arrow",
     "id": "r0mWnijD"
    },
    {
     "type": "arrow",
     "id": "hhNDCAS3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "RF24Nl9g",
   "type": "text",
   "x": 972,
   "y": 815.0,
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
   "seed": 412550084,
   "version": 1,
   "versionNonce": 1111465997,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "pick copy: Held for me,\nelse first Available",
   "originalText": "pick copy: Held for me,\nelse first Available",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "mcMwmoTj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "CjzJqqTu",
   "type": "rectangle",
   "x": 1300,
   "y": 800,
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
   "seed": 1475112117,
   "version": 1,
   "versionNonce": 190176188,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "FkZ51rSZ"
    },
    {
     "type": "arrow",
     "id": "r0mWnijD"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "FkZ51rSZ",
   "type": "text",
   "x": 1312,
   "y": 815.0,
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
   "seed": 1537473206,
   "version": 1,
   "versionNonce": 1459308334,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "mark Issued, dequeue\nLoan due = now + 14d",
   "originalText": "mark Issued, dequeue\nLoan due = now + 14d",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "CjzJqqTu",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "dNxLdEuj",
   "type": "rectangle",
   "x": 320,
   "y": 980,
   "width": 175.0,
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
   "roundness": {
    "type": 3
   },
   "seed": 977650729,
   "version": 1,
   "versionNonce": 1254019316,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "iZGehzGU"
    },
    {
     "type": "arrow",
     "id": "bB4IbhsS"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "iZGehzGU",
   "type": "text",
   "x": 340.0,
   "y": 1000.0,
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
   "seed": 1326395860,
   "version": 1,
   "versionNonce": 1974974144,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrBookNotFound",
   "originalText": "ErrBookNotFound",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "dNxLdEuj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "cJ6GawA2",
   "type": "rectangle",
   "x": 640,
   "y": 980,
   "width": 175.0,
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
   "roundness": {
    "type": 3
   },
   "seed": 1106881956,
   "version": 1,
   "versionNonce": 1024858832,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "B72jeQQi"
    },
    {
     "type": "arrow",
     "id": "bdRZoq9z"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "B72jeQQi",
   "type": "text",
   "x": 660.0,
   "y": 1000.0,
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
   "seed": 1936368012,
   "version": 1,
   "versionNonce": 2101277508,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrLimitReached",
   "originalText": "ErrLimitReached",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "cJ6GawA2",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "g0msFRkT",
   "type": "rectangle",
   "x": 960,
   "y": 980,
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
   "seed": 752724486,
   "version": 1,
   "versionNonce": 881817969,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "96R3oMTn"
    },
    {
     "type": "arrow",
     "id": "hhNDCAS3"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "96R3oMTn",
   "type": "text",
   "x": 972,
   "y": 995.0,
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
   "seed": 995974558,
   "version": 1,
   "versionNonce": 595558577,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrNoCopyAvailable\n-> ReserveBook",
   "originalText": "ErrNoCopyAvailable\n-> ReserveBook",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "g0msFRkT",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "fEXLz8cj",
   "type": "rectangle",
   "x": 0,
   "y": 1140,
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
   "seed": 1324994174,
   "version": 1,
   "versionNonce": 160715472,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "vNydp9zY"
    },
    {
     "type": "arrow",
     "id": "JnTUAJ9h"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "vNydp9zY",
   "type": "text",
   "x": 12,
   "y": 1155.0,
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
   "seed": 1157396084,
   "version": 1,
   "versionNonce": 1478161292,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Member\nReturnBook(copyID)",
   "originalText": "Member\nReturnBook(copyID)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "fEXLz8cj",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "AaI9i6FF",
   "type": "rectangle",
   "x": 340,
   "y": 1140,
   "width": 283.0,
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
   "seed": 1521128696,
   "version": 1,
   "versionNonce": 628137929,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "P3krS6al"
    },
    {
     "type": "arrow",
     "id": "JnTUAJ9h"
    },
    {
     "type": "arrow",
     "id": "ldS6Irj5"
    },
    {
     "type": "arrow",
     "id": "pbgLwahU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "P3krS6al",
   "type": "text",
   "x": 352,
   "y": 1155.0,
   "width": 243.0,
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
   "seed": 274438651,
   "version": 1,
   "versionNonce": 1697132281,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "close loan\nFineStrategy.Fine(daysLate)",
   "originalText": "close loan\nFineStrategy.Fine(daysLate)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "AaI9i6FF",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7KBWtTXN",
   "type": "rectangle",
   "x": 720,
   "y": 1140,
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
   "seed": 287203209,
   "version": 1,
   "versionNonce": 1870878955,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "nCGnwFsE"
    },
    {
     "type": "arrow",
     "id": "ldS6Irj5"
    },
    {
     "type": "arrow",
     "id": "mXdWL2g7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "nCGnwFsE",
   "type": "text",
   "x": 732,
   "y": 1155.0,
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
   "seed": 1104853489,
   "version": 1,
   "versionNonce": 1640488321,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "queue empty: Available\nelse Held for head",
   "originalText": "queue empty: Available\nelse Held for head",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "7KBWtTXN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "4BkjtM57",
   "type": "rectangle",
   "x": 1080,
   "y": 1140,
   "width": 292.0,
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
   "seed": 2125353259,
   "version": 1,
   "versionNonce": 475352522,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YKnCf9gD"
    },
    {
     "type": "arrow",
     "id": "mXdWL2g7"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "YKnCf9gD",
   "type": "text",
   "x": 1092,
   "y": 1155.0,
   "width": 252.0,
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
   "seed": 1240719947,
   "version": 1,
   "versionNonce": 1729875205,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "unlock, then\nNotifier.BookAvailable(head)",
   "originalText": "unlock, then\nNotifier.BookAvailable(head)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "4BkjtM57",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "k67uvC42",
   "type": "rectangle",
   "x": 340,
   "y": 1320,
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
   "seed": 173121100,
   "version": 1,
   "versionNonce": 740483867,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ZV4dzlLn"
    },
    {
     "type": "arrow",
     "id": "pbgLwahU"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "ZV4dzlLn",
   "type": "text",
   "x": 352,
   "y": 1335.0,
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
   "seed": 1352630638,
   "version": 1,
   "versionNonce": 1664342358,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ErrNotIssued\nduplicate return or lost",
   "originalText": "ErrNotIssued\nduplicate return or lost",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "k67uvC42",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "CXeht50s",
   "type": "rectangle",
   "x": 0,
   "y": 1480,
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
   "seed": 1843661494,
   "version": 1,
   "versionNonce": 1902835285,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "lVivfd6N"
    },
    {
     "type": "arrow",
     "id": "BQS1QlV6"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "lVivfd6N",
   "type": "text",
   "x": 12,
   "y": 1495.0,
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
   "seed": 1756274420,
   "version": 1,
   "versionNonce": 1116300833,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Member\nReportLost(copyID)",
   "originalText": "Member\nReportLost(copyID)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "CXeht50s",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "5HXeUeW3",
   "type": "rectangle",
   "x": 340,
   "y": 1480,
   "width": 274.0,
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
   "seed": 726112090,
   "version": 1,
   "versionNonce": 1161627670,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WOSGWY5l"
    },
    {
     "type": "arrow",
     "id": "BQS1QlV6"
    },
    {
     "type": "arrow",
     "id": "sRGo2D60"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "WOSGWY5l",
   "type": "text",
   "x": 352,
   "y": 1495.0,
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
   "seed": 1299663630,
   "version": 1,
   "versionNonce": 1645154042,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "close loan\ncharge = fine + Book.Price",
   "originalText": "close loan\ncharge = fine + Book.Price",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "5HXeUeW3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "jbjLW5Hc",
   "type": "rectangle",
   "x": 720,
   "y": 1480,
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
   "seed": 2072759150,
   "version": 1,
   "versionNonce": 1491193922,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "GlPJmsRP"
    },
    {
     "type": "arrow",
     "id": "sRGo2D60"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "GlPJmsRP",
   "type": "text",
   "x": 732,
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
   "seed": 2146966475,
   "version": 1,
   "versionNonce": 1073202571,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "copy -> Lost\nnever lent again",
   "originalText": "copy -> Lost\nnever lent again",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "jbjLW5Hc",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "UoDzstX9",
   "type": "ellipse",
   "x": 0,
   "y": 1760,
   "width": 171,
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
   "seed": 1033008303,
   "version": 1,
   "versionNonce": 1205723095,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "CRjJNTfw"
    },
    {
     "type": "arrow",
     "id": "Mvm0bEVV"
    },
    {
     "type": "arrow",
     "id": "u59Bvyr1"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "CRjJNTfw",
   "type": "text",
   "x": 45.0,
   "y": 1785.0,
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
   "seed": 930934982,
   "version": 1,
   "versionNonce": 1344297041,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Available",
   "originalText": "Available",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "UoDzstX9",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "BT22uWd3",
   "type": "ellipse",
   "x": 420,
   "y": 1760,
   "width": 144,
   "height": 70,
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
   "seed": 263813931,
   "version": 1,
   "versionNonce": 2137959252,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "qrRYigCp"
    },
    {
     "type": "arrow",
     "id": "Mvm0bEVV"
    },
    {
     "type": "arrow",
     "id": "u59Bvyr1"
    },
    {
     "type": "arrow",
     "id": "X7qJN0Pp"
    },
    {
     "type": "arrow",
     "id": "7zAJa9Ej"
    },
    {
     "type": "arrow",
     "id": "NsxURRVR"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "qrRYigCp",
   "type": "text",
   "x": 465.0,
   "y": 1785.0,
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
   "seed": 1468606755,
   "version": 1,
   "versionNonce": 1881737322,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Issued",
   "originalText": "Issued",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "BT22uWd3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8nL5cuTr",
   "type": "ellipse",
   "x": 840,
   "y": 1760,
   "width": 126,
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
   "seed": 765863494,
   "version": 1,
   "versionNonce": 1041112638,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "8ZuqyiJ2"
    },
    {
     "type": "arrow",
     "id": "X7qJN0Pp"
    },
    {
     "type": "arrow",
     "id": "7zAJa9Ej"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "8ZuqyiJ2",
   "type": "text",
   "x": 885.0,
   "y": 1785.0,
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
   "seed": 1643922320,
   "version": 1,
   "versionNonce": 2067501459,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Held",
   "originalText": "Held",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "8nL5cuTr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NGkgnwDQ",
   "type": "ellipse",
   "x": 420,
   "y": 1960,
   "width": 126,
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
   "seed": 1564262010,
   "version": 1,
   "versionNonce": 1355023478,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "EmLMPNWy"
    },
    {
     "type": "arrow",
     "id": "NsxURRVR"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "EmLMPNWy",
   "type": "text",
   "x": 465.0,
   "y": 1985.0,
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
   "seed": 48072906,
   "version": 1,
   "versionNonce": 432361392,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "Lost",
   "originalText": "Lost",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NGkgnwDQ",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wBYE5RnG",
   "type": "rectangle",
   "x": 0,
   "y": 2200,
   "width": 319.0,
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
   "seed": 1971355732,
   "version": 1,
   "versionNonce": 1196341115,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "CXjYEMQD"
    },
    {
     "type": "arrow",
     "id": "Z2rAVLLh"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "CXjYEMQD",
   "type": "text",
   "x": 12,
   "y": 2215.0,
   "width": 279.0,
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
   "seed": 88081470,
   "version": 1,
   "versionNonce": 704426752,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "books\nisbn PK\ntitle, author, category\nprice_paise\nidx lower(title), lower(author)",
   "originalText": "books\nisbn PK\ntitle, author, category\nprice_paise\nidx lower(title), lower(author)",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "wBYE5RnG",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "8ykIic0T",
   "type": "rectangle",
   "x": 400,
   "y": 2200,
   "width": 247.0,
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
   "seed": 1826576913,
   "version": 1,
   "versionNonce": 930903619,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "hekOKS3G"
    },
    {
     "type": "arrow",
     "id": "Z2rAVLLh"
    },
    {
     "type": "arrow",
     "id": "tpo7hmWJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "hekOKS3G",
   "type": "text",
   "x": 412,
   "y": 2215.0,
   "width": 207.0,
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
   "seed": 346824967,
   "version": 1,
   "versionNonce": 2116680869,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "book_copies\nid PK, isbn FK\nstatus CHECK available,\n  issued, held, lost\nheld_for FK members",
   "originalText": "book_copies\nid PK, isbn FK\nstatus CHECK available,\n  issued, held, lost\nheld_for FK members",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "8ykIic0T",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "YEYVWM4m",
   "type": "rectangle",
   "x": 760,
   "y": 2200,
   "width": 319.0,
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
   "seed": 303276371,
   "version": 1,
   "versionNonce": 294249249,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "NxEOGi0M"
    },
    {
     "type": "arrow",
     "id": "tpo7hmWJ"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "NxEOGi0M",
   "type": "text",
   "x": 772,
   "y": 2215.0,
   "width": 279.0,
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
   "seed": 2056140213,
   "version": 1,
   "versionNonce": 1169727327,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "loans\nid PK, copy_id FK, member_id FK\ndue_at, returned_at, lost\nfine_paise\nUNIQUE copy_id WHERE\n  returned_at IS NULL",
   "originalText": "loans\nid PK, copy_id FK, member_id FK\ndue_at, returned_at, lost\nfine_paise\nUNIQUE copy_id WHERE\n  returned_at IS NULL",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "YEYVWM4m",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "zk9FucC0",
   "type": "rectangle",
   "x": 1180,
   "y": 2200,
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
   "seed": 370650605,
   "version": 1,
   "versionNonce": 1104633568,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "kzvizSqn"
    }
   ],
   "updated": 1,
   "link": null,
   "locked": false
  },
  {
   "id": "kzvizSqn",
   "type": "text",
   "x": 1192,
   "y": 2215.0,
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
   "seed": 2109934267,
   "version": 1,
   "versionNonce": 1857153981,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "reservations\nid PK = FIFO order\nisbn, member_id, status\nUNIQUE (isbn, member_id)\n  WHERE active",
   "originalText": "reservations\nid PK = FIFO order\nisbn, member_id, status\nUNIQUE (isbn, member_id)\n  WHERE active",
   "fontSize": 16,
   "fontFamily": 5,
   "textAlign": "left",
   "verticalAlign": "middle",
   "containerId": "zk9FucC0",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "mIdQCyBe",
   "type": "arrow",
   "x": 233.0,
   "y": 105.0,
   "width": 143.0,
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
   "seed": 872233763,
   "version": 1,
   "versionNonce": 1188813910,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "zDivDWER"
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
     143.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "TErYEcYl",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "hrdIXyZF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "diamond",
   "elbowed": false
  },
  {
   "id": "zDivDWER",
   "type": "text",
   "x": 241.5,
   "y": 96.25,
   "width": 126.0,
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
   "seed": 248473440,
   "version": 1,
   "versionNonce": 1578896978,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "1 to many copies",
   "originalText": "1 to many copies",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "mIdQCyBe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "l1ELduPi",
   "type": "arrow",
   "x": 595.0,
   "y": 105.0,
   "width": 161.0,
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
   "seed": 1156498804,
   "version": 1,
   "versionNonce": 1147838718,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "YRHM8Plg"
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
     161.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "hrdIXyZF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7FpTnr1A",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "YRHM8Plg",
   "type": "text",
   "x": 620.375,
   "y": 96.25,
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
   "seed": 636081562,
   "version": 1,
   "versionNonce": 311652767,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "0..1 open loan",
   "originalText": "0..1 open loan",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "l1ELduPi",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "sipe8dao",
   "type": "arrow",
   "x": 1116.0,
   "y": 105.0,
   "width": 150.0,
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
   "seed": 235563173,
   "version": 1,
   "versionNonce": 999276320,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "87RPxJ1J"
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
     -150.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "mIxBvHhL",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7FpTnr1A",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "87RPxJ1J",
   "type": "text",
   "x": 1005.5625,
   "y": 96.25,
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
   "seed": 1249677672,
   "version": 1,
   "versionNonce": 1787870989,
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
   "containerId": "sipe8dao",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "CzbXwjLq",
   "type": "arrow",
   "x": 418.3314814814815,
   "y": 296.0,
   "width": 225.8851851851852,
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
   "seed": 1409581000,
   "version": 1,
   "versionNonce": 262416908,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DJ6WS777"
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
     -225.8851851851852,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YRyDrnun",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "TErYEcYl",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DJ6WS777",
   "type": "text",
   "x": 277.8263888888889,
   "y": 216.25,
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
   "seed": 1359671443,
   "version": 1,
   "versionNonce": 1367854005,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "catalog",
   "originalText": "catalog",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "CzbXwjLq",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "A3nuM99V",
   "type": "arrow",
   "x": 526.8833333333333,
   "y": 296.0,
   "width": 30.76666666666665,
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
   "seed": 1425221774,
   "version": 1,
   "versionNonce": 1629820877,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ItuOWMNN"
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
     -30.76666666666665,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YRyDrnun",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "hrdIXyZF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ItuOWMNN",
   "type": "text",
   "x": 487.875,
   "y": 216.25,
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
   "seed": 722319747,
   "version": 1,
   "versionNonce": 582510212,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "copies",
   "originalText": "copies",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "A3nuM99V",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JfcdjNUe",
   "type": "arrow",
   "x": 376.0,
   "y": 359.0190249702735,
   "width": 125.0,
   "height": 11.890606420927497,
   "angle": 0,
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
   "seed": 1013081768,
   "version": 1,
   "versionNonce": 1679834272,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "X9miNJjG"
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
     -125.0,
     -11.890606420927497
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YRyDrnun",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "Kf2EGvsK",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "X9miNJjG",
   "type": "text",
   "x": 258.375,
   "y": 344.32372175980976,
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
   "seed": 1489748035,
   "version": 1,
   "versionNonce": 2069214534,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "queue per ISBN",
   "originalText": "queue per ISBN",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "JfcdjNUe",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "VXgmzzep",
   "type": "arrow",
   "x": 636.7518518518518,
   "y": 296.0,
   "width": 166.71851851851852,
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
   "seed": 685279527,
   "version": 1,
   "versionNonce": 1070521218,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "HdbbWtUf"
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
     166.71851851851852,
     -142.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YRyDrnun",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7FpTnr1A",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "HdbbWtUf",
   "type": "text",
   "x": 676.7986111111111,
   "y": 216.25,
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
   "seed": 1587779496,
   "version": 1,
   "versionNonce": 1387701882,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "tracks open",
   "originalText": "tracks open",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "VXgmzzep",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JOXbRGFN",
   "type": "arrow",
   "x": 712.0,
   "y": 363.41379310344826,
   "width": 144.0,
   "height": 9.931034482758605,
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
   "seed": 229361462,
   "version": 1,
   "versionNonce": 2072746471,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "LFrjHJIA"
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
     144.0,
     -9.931034482758605
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YRyDrnun",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "LfSmVsWo",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "LFrjHJIA",
   "type": "text",
   "x": 768.25,
   "y": 349.69827586206895,
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
   "seed": 1417284505,
   "version": 1,
   "versionNonce": 973004007,
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
   "containerId": "JOXbRGFN",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7u2PFEpU",
   "type": "arrow",
   "x": 547.091304347826,
   "y": 454.0,
   "width": 3.9913043478261443,
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
   "seed": 444976109,
   "version": 1,
   "versionNonce": 933591583,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "atCXkxI9"
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
     3.9913043478261443,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YRyDrnun",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "4ZJwdChI",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "atCXkxI9",
   "type": "text",
   "x": 466.3994565217391,
   "y": 496.25,
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
   "seed": 978897052,
   "version": 1,
   "versionNonce": 18959067,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "notifies after unlock",
   "originalText": "notifies after unlock",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "7u2PFEpU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "gMvcqAKr",
   "type": "arrow",
   "x": 953.35,
   "y": 516.0,
   "width": 18.299999999999955,
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
   "seed": 371966808,
   "version": 1,
   "versionNonce": 1990550506,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "QUWf3Xog"
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
     18.299999999999955,
     -122.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "leeREGJV",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "LfSmVsWo",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "triangle",
   "elbowed": false
  },
  {
   "id": "QUWf3Xog",
   "type": "text",
   "x": 923.125,
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
   "seed": 654141898,
   "version": 1,
   "versionNonce": 1599826171,
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
   "containerId": "gMvcqAKr",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "EvFWVJZq",
   "type": "arrow",
   "x": 188.0,
   "y": 835.0,
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
   "seed": 1496138764,
   "version": 1,
   "versionNonce": 1268820880,
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
     128.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "r6xTC2Vq",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "xWIHTM51",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "pvqKbVpV",
   "type": "arrow",
   "x": 472.0,
   "y": 833.8760806916426,
   "width": 164.0,
   "height": 2.3631123919308266,
   "angle": 0,
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
   "seed": 246076479,
   "version": 1,
   "versionNonce": 725427494,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "6t5SxFWs"
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
     164.0,
     -2.3631123919308266
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "xWIHTM51",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "34AqLRng",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "6t5SxFWs",
   "type": "text",
   "x": 542.1875,
   "y": 823.9445244956772,
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
   "seed": 1074268870,
   "version": 1,
   "versionNonce": 377496267,
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
   "containerId": "pvqKbVpV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "wkjxJn8m",
   "type": "arrow",
   "x": 846.0,
   "y": 831.5328467153284,
   "width": 110.0,
   "height": 1.6058394160584157,
   "angle": 0,
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
   "seed": 117521575,
   "version": 1,
   "versionNonce": 605331615,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "jXSbv5TW"
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
     1.6058394160584157
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "34AqLRng",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "mcMwmoTj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "jXSbv5TW",
   "type": "text",
   "x": 889.1875,
   "y": 823.5857664233577,
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
   "seed": 942278073,
   "version": 1,
   "versionNonce": 1403285533,
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
   "containerId": "wkjxJn8m",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "r0mWnijD",
   "type": "arrow",
   "x": 1211.0,
   "y": 835.0,
   "width": 85.0,
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
   "seed": 1717596382,
   "version": 1,
   "versionNonce": 983393611,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "whyhDz4C"
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
     85.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "mcMwmoTj",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "CjzJqqTu",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "whyhDz4C",
   "type": "text",
   "x": 1214.125,
   "y": 826.25,
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
   "seed": 1518135868,
   "version": 1,
   "versionNonce": 11558938,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "copy found",
   "originalText": "copy found",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "r0mWnijD",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bB4IbhsS",
   "type": "arrow",
   "x": 397.00857142857143,
   "y": 874.0,
   "width": 7.8685714285714425,
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
   "seed": 1669041001,
   "version": 1,
   "versionNonce": 1899428300,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "2FVMW2IG"
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
     7.8685714285714425,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "xWIHTM51",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "dNxLdEuj",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "2FVMW2IG",
   "type": "text",
   "x": 393.0678571428572,
   "y": 916.25,
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
   "seed": 902321652,
   "version": 1,
   "versionNonce": 1571460138,
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
   "containerId": "bB4IbhsS",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "bdRZoq9z",
   "type": "arrow",
   "x": 738.45,
   "y": 864.0,
   "width": 8.400000000000091,
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
   "seed": 248410448,
   "version": 1,
   "versionNonce": 995409396,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "R30UB3br"
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
     -8.400000000000091,
     112.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "34AqLRng",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "cJ6GawA2",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "R30UB3br",
   "type": "text",
   "x": 726.375,
   "y": 911.25,
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
   "seed": 1260830457,
   "version": 1,
   "versionNonce": 1056316374,
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
   "containerId": "bdRZoq9z",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "hhNDCAS3",
   "type": "arrow",
   "x": 1078.625,
   "y": 874.0,
   "width": 12.75,
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
   "seed": 291633648,
   "version": 1,
   "versionNonce": 14941508,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "t2ZDDftE"
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
     -12.75,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "mcMwmoTj",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "g0msFRkT",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "t2ZDDftE",
   "type": "text",
   "x": 1056.5,
   "y": 916.25,
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
   "seed": 258171363,
   "version": 1,
   "versionNonce": 144123785,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "none",
   "originalText": "none",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "hhNDCAS3",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "JnTUAJ9h",
   "type": "arrow",
   "x": 206.0,
   "y": 1175.0,
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
   "seed": 1098947129,
   "version": 1,
   "versionNonce": 157945242,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "ivld6Fsq"
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
    "elementId": "fEXLz8cj",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "AaI9i6FF",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "ivld6Fsq",
   "type": "text",
   "x": 235.5625,
   "y": 1166.25,
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
   "seed": 313012749,
   "version": 1,
   "versionNonce": 1655703692,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "open loan",
   "originalText": "open loan",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "JnTUAJ9h",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "ldS6Irj5",
   "type": "arrow",
   "x": 627.0,
   "y": 1175.0,
   "width": 89.0,
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
   "seed": 1550543859,
   "version": 1,
   "versionNonce": 1448052051,
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
     89.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "AaI9i6FF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "7KBWtTXN",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "mXdWL2g7",
   "type": "arrow",
   "x": 962.0,
   "y": 1175.0,
   "width": 114.0,
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
   "seed": 24444586,
   "version": 1,
   "versionNonce": 1944959450,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "DGt359eS"
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
     114.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "7KBWtTXN",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "4BkjtM57",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "DGt359eS",
   "type": "text",
   "x": 991.4375,
   "y": 1166.25,
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
   "seed": 305487607,
   "version": 1,
   "versionNonce": 1407555888,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "if Held",
   "originalText": "if Held",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "mXdWL2g7",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "pbgLwahU",
   "type": "arrow",
   "x": 478.575,
   "y": 1214.0,
   "width": 7.649999999999977,
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
   "seed": 268210165,
   "version": 1,
   "versionNonce": 53869443,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "WTVXpZjH"
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
     -7.649999999999977,
     102.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "AaI9i6FF",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "k67uvC42",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "WTVXpZjH",
   "type": "text",
   "x": 427.5,
   "y": 1256.25,
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
   "seed": 1934965099,
   "version": 1,
   "versionNonce": 1671620428,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "no open loan",
   "originalText": "no open loan",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "pbgLwahU",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "BQS1QlV6",
   "type": "arrow",
   "x": 206.0,
   "y": 1515.0,
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
   "seed": 1641164245,
   "version": 1,
   "versionNonce": 969240239,
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
     130.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "CXeht50s",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "5HXeUeW3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "sRGo2D60",
   "type": "arrow",
   "x": 618.0,
   "y": 1515.0,
   "width": 98.0,
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
   "seed": 389579391,
   "version": 1,
   "versionNonce": 588042436,
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
     98.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "5HXeUeW3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "jbjLW5Hc",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "Mvm0bEVV",
   "type": "arrow",
   "x": 175.0,
   "y": 1810.0,
   "width": 241.0,
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
   "seed": 1748827750,
   "version": 1,
   "versionNonce": 317661014,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "k5EISXNP"
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
     241.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "UoDzstX9",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "BT22uWd3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "k5EISXNP",
   "type": "text",
   "x": 271.875,
   "y": 1801.25,
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
   "seed": 1374199484,
   "version": 1,
   "versionNonce": 1909038355,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "borrow",
   "originalText": "borrow",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Mvm0bEVV",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "u59Bvyr1",
   "type": "arrow",
   "x": 416.0,
   "y": 1780.0,
   "width": 241.0,
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
   "seed": 2129313664,
   "version": 1,
   "versionNonce": 2129048427,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "4qWdTIhW"
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
     -241.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "BT22uWd3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "UoDzstX9",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "4qWdTIhW",
   "type": "text",
   "x": 220.6875,
   "y": 1771.25,
   "width": 149.625,
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
   "seed": 1520741298,
   "version": 1,
   "versionNonce": 249515891,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "return, queue empty",
   "originalText": "return, queue empty",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "u59Bvyr1",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "X7qJN0Pp",
   "type": "arrow",
   "x": 568.0,
   "y": 1810.0,
   "width": 268.0,
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
   "seed": 313467934,
   "version": 1,
   "versionNonce": 1693526098,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "W5u2x3JH"
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
     268.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "BT22uWd3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8nL5cuTr",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "W5u2x3JH",
   "type": "text",
   "x": 611.4375,
   "y": 1801.25,
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
   "seed": 1878255660,
   "version": 1,
   "versionNonce": 283982629,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "return, someone waiting",
   "originalText": "return, someone waiting",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "X7qJN0Pp",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "7zAJa9Ej",
   "type": "arrow",
   "x": 836.0,
   "y": 1780.0,
   "width": 268.0,
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
   "seed": 1328189912,
   "version": 1,
   "versionNonce": 1707781234,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "uuLNcctS"
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
     -268.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "8nL5cuTr",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "BT22uWd3",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "uuLNcctS",
   "type": "text",
   "x": 631.125,
   "y": 1771.25,
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
   "seed": 939458249,
   "version": 1,
   "versionNonce": 1644283627,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "queue head borrows",
   "originalText": "queue head borrows",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "7zAJa9Ej",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "NsxURRVR",
   "type": "arrow",
   "x": 490.245467735718,
   "y": 1833.9896058729332,
   "width": 5.491069502687026,
   "height": 122.02376672637865,
   "angle": 0,
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
   "seed": 245092121,
   "version": 1,
   "versionNonce": 1297000512,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "TehkLXgx"
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
     -5.491069502687026,
     122.02376672637865
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "BT22uWd3",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "NGkgnwDQ",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "TehkLXgx",
   "type": "text",
   "x": 448.1249329843745,
   "y": 1886.2514892361226,
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
   "seed": 1771202711,
   "version": 1,
   "versionNonce": 446988829,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "ReportLost",
   "originalText": "ReportLost",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "NsxURRVR",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "Z2rAVLLh",
   "type": "arrow",
   "x": 396.0,
   "y": 2265.0,
   "width": 73.0,
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
   "seed": 755659940,
   "version": 1,
   "versionNonce": 915214702,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "USkAClz3"
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
     -73.0,
     0.0
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "8ykIic0T",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "wBYE5RnG",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "USkAClz3",
   "type": "text",
   "x": 331.9375,
   "y": 2256.25,
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
   "seed": 1972408932,
   "version": 1,
   "versionNonce": 2131832166,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "isbn FK",
   "originalText": "isbn FK",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "Z2rAVLLh",
   "autoResize": true,
   "lineHeight": 1.25
  },
  {
   "id": "tpo7hmWJ",
   "type": "arrow",
   "x": 756.0,
   "y": 2270.871212121212,
   "width": 105.0,
   "height": 2.6515151515150137,
   "angle": 0,
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
   "seed": 942345579,
   "version": 1,
   "versionNonce": 935418439,
   "isDeleted": false,
   "boundElements": [
    {
     "type": "text",
     "id": "tpJdZwHX"
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
     -105.0,
     -2.6515151515150137
    ]
   ],
   "lastCommittedPoint": null,
   "startBinding": {
    "elementId": "YEYVWM4m",
    "focus": 0,
    "gap": 4
   },
   "endBinding": {
    "elementId": "8ykIic0T",
    "focus": 0,
    "gap": 4
   },
   "startArrowhead": null,
   "endArrowhead": "arrow",
   "elbowed": false
  },
  {
   "id": "tpJdZwHX",
   "type": "text",
   "x": 664.125,
   "y": 2260.7954545454545,
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
   "seed": 22401536,
   "version": 1,
   "versionNonce": 2066820475,
   "isDeleted": false,
   "boundElements": [],
   "updated": 1,
   "link": null,
   "locked": false,
   "text": "copy_id FK",
   "originalText": "copy_id FK",
   "fontSize": 14,
   "fontFamily": 5,
   "textAlign": "center",
   "verticalAlign": "middle",
   "containerId": "tpo7hmWJ",
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