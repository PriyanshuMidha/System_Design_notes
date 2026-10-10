# LLD Question Bank with Answers

## Complete notes

This note contains important LLD practice questions with model answers.

For every answer, use this format:

```text
Requirements -> Entities -> APIs/methods -> Patterns -> Core logic -> Edge cases
```

---

## 1. Parking Lot

**Full step-by-step solution:** [[Parking Lot LLD in Go]]

### Question

Design a parking lot that supports multiple floors, multiple spot types, vehicle entry, vehicle exit, ticket generation, and fee calculation.

### Strong answer

Requirements:

- support bike/car/truck
- assign compatible spot
- generate ticket on entry
- calculate fee on exit
- track available spots

Entities:

- `Vehicle`
- `ParkingSpot`
- `Floor`
- `Ticket`
- `ParkingLot`
- `FeeReceipt`

Core methods:

```go
ParkVehicle(ctx context.Context, vehicle Vehicle) (Ticket, error)
UnparkVehicle(ctx context.Context, ticketID string) (FeeReceipt, error)
FindSpot(ctx context.Context, vehicle Vehicle) (ParkingSpot, error)
```

Patterns:

- Strategy: spot allocation strategy
- Strategy: fee calculation strategy
- Repository: ticket/spot storage

Edge cases:

- no spot available
- invalid ticket
- vehicle type does not match spot
- lost ticket
- concurrent entry to same spot

Interview explanation:

I would keep spot allocation and fee calculation as strategies because both can change independently. The parking service coordinates entry and exit, while repositories track spot and ticket state.

---

## 2. Vending Machine

**Full step-by-step solution:** [[Vending Machine LLD in Go]]

### Question

Design a vending machine that accepts money, lets user choose product, dispenses item, and returns change.

### Strong answer

Requirements:

- show products and price
- accept coins/notes
- select product
- dispense product if enough money and stock exists
- return change/refund

Entities:

- `VendingMachine`
- `Product`
- `InventorySlot`
- `Payment`
- `State`

Core methods:

```go
InsertMoney(amount int64) error
SelectProduct(productID string) error
Dispense() error
Refund() (int64, error)
```

Patterns:

- State: idle, has money, selected, dispensing
- Repository: inventory storage

Edge cases:

- insufficient money
- out of stock
- exact change unavailable
- user cancels
- machine jam/failure

Interview explanation:

State pattern is a good fit because machine behavior changes depending on whether money is inserted and product is selected. Invalid transitions are rejected clearly.

---

## 3. Library Management System

**Full step-by-step solution:** [[Library Management LLD in Go]]

### Question

Design a library system where users can search books, borrow copies, return copies, and track due dates.

### Strong answer

Requirements:

- book can have multiple physical copies
- user borrows available copy
- return updates availability
- search by title/author/category
- due date and fine support

Entities:

- `Book`
- `BookCopy`
- `Member`
- `Loan`
- `Fine`

Core methods:

```go
SearchBooks(query string) ([]Book, error)
BorrowBook(ctx context.Context, memberID string, bookID string) (Loan, error)
ReturnBook(ctx context.Context, copyID string) error
```

Patterns:

- Repository: books/copies/loans
- Strategy: fine calculation
- State: copy available/borrowed/lost

Edge cases:

- no copy available
- member limit exceeded
- overdue return
- duplicate return
- lost copy

Interview explanation:

The important modeling detail is separating `Book` from `BookCopy`. Borrowing happens on a physical copy, not on the abstract book title.

---

## 4. Meeting Room Scheduler

**Full step-by-step solution:** [[Meeting Room Scheduler LLD in Go]]

### Question

Design a meeting room booking system.

### Strong answer

Requirements:

- create room
- book room for time interval
- prevent overlapping bookings
- cancel booking
- search available rooms

Entities:

- `Room`
- `Booking`
- `User`
- `TimeSlot`

Core methods:

```go
FindAvailableRooms(ctx context.Context, start, end time.Time) ([]Room, error)
BookRoom(ctx context.Context, roomID, userID string, start, end time.Time) (Booking, error)
CancelBooking(ctx context.Context, bookingID string) error
```

Patterns:

- Repository: room/booking storage
- Strategy: room selection

Edge cases:

- invalid time range
- overlapping booking
- cancellation after meeting start
- recurring meetings
- timezone handling

Interview explanation:

The hardest part is overlap detection. A new booking conflicts if `existing.start < new.end && new.start < existing.end`.

---

## 5. LRU Cache with TTL

**Full step-by-step solution:** [[LRU Cache LLD in Go]]

### Question

Design an in-memory LRU cache with TTL.

### Strong answer

Requirements:

- `Get(key)` returns value if present and not expired
- `Put(key, value, ttl)` inserts/updates
- evict least recently used item when capacity is full
- expired item should not be returned

Entities:

- `Cache`
- `Entry`
- doubly linked list node
- map from key to node

Core methods:

```go
Get(key string) (any, bool)
Put(key string, value any, ttl time.Duration)
Delete(key string)
```

Patterns:

- not mainly GoF; data structure design
- Strategy optional for eviction policy

Edge cases:

- expired key
- update existing key
- capacity zero
- concurrent access
- memory cleanup

Interview explanation:

Use a hashmap for O(1) lookup and a doubly linked list for O(1) recency movement. On get/put, move item to front. On capacity overflow, remove from back.

---

## 6. Cart Checkout and Inventory Reservation

**Full step-by-step solution:** [[Cart Checkout with Coupons LLD in Go]]

### Question

Design checkout where a user has cart items, inventory is reserved, payment is charged, and order is created.

### Strong answer

Requirements:

- validate cart
- reserve stock
- calculate amount
- charge payment
- create order
- release inventory on payment failure

Entities:

- `Cart`
- `CartItem`
- `Inventory`
- `Reservation`
- `Payment`
- `Order`

Core methods:

```go
Checkout(ctx context.Context, userID string) (Order, error)
ReserveInventory(ctx context.Context, items []Item) (Reservation, error)
ReleaseReservation(ctx context.Context, reservationID string) error
```

Patterns:

- Facade: checkout service
- Chain: validation pipeline
- Strategy: pricing/discount
- Adapter: payment gateway
- Observer: order created event

Edge cases:

- stock changes during checkout
- payment success but order save fails
- payment failure after reservation
- duplicate checkout retry
- cart item price changed

Interview explanation:

The key point is inventory reservation must be atomic. In SQL, update only if available quantity is enough. Use idempotency key for checkout retries.

---

## 7. Zepto Inventory Order Assignment

**Full step-by-step solution:** [[Inventory Order Assignment LLD in Go]]

### Question

Design a Zepto-like order assignment system that chooses a dark store and reserves inventory.

### Strong answer

Requirements:

- user orders multiple products
- find nearby stores
- choose store with full stock
- reserve inventory
- create order
- later assign delivery partner

Entities:

- `User`
- `Store`
- `Product`
- `InventoryItem`
- `Order`
- `OrderItem`
- `DeliveryPartner`

Core methods:

```go
PlaceOrder(ctx context.Context, req PlaceOrderRequest) (Order, error)
SelectStore(ctx context.Context, req PlaceOrderRequest) (Store, error)
ReserveStock(ctx context.Context, storeID string, items []OrderItem) error
```

Patterns:

- Strategy: store selection
- State: order lifecycle
- Repository: inventory/order storage
- Observer: order events

Edge cases:

- two users order last item
- nearest store has partial stock
- no delivery partner available
- store goes offline
- idempotent retry

Interview explanation:

I would start with single-store fulfillment for simplicity. If no single store has all items, reject or split order as a future extension. Stock reservation must be atomic to avoid overselling.

---

## 8. Delivery Partner Assignment

**Full step-by-step solution:** [[Delivery Partner Assignment LLD in Go]]

### Question

Design assignment of delivery partner to an order.

### Strong answer

Requirements:

- partner has location/status/capacity
- assign available nearby partner
- partner can accept/reject
- reassign on timeout

Entities:

- `DeliveryPartner`
- `Order`
- `Assignment`
- `Location`

Core methods:

```go
AssignPartner(ctx context.Context, orderID string) (Assignment, error)
AcceptAssignment(ctx context.Context, assignmentID string) error
RejectAssignment(ctx context.Context, assignmentID string) error
```

Patterns:

- Strategy: nearest/least-loaded/SLA-based assignment
- State: assignment pending/accepted/rejected/expired
- Command: retry assignment job

Edge cases:

- partner goes offline
- partner rejects
- assignment timeout
- multiple orders assigned to same partner
- location stale

Interview explanation:

The assignment algorithm should be Strategy because the business may change from nearest partner to SLA-aware partner. Assignment state prevents invalid transitions.

---

## 9. Notification System

**Full step-by-step solution:** [[Notification System LLD in Go]]

### Question

Design a notification system supporting email, SMS, push, and WhatsApp.

### Strong answer

Requirements:

- send notification through selected channel
- support templates
- retry failed sends
- track status
- add new channel easily

Entities:

- `Notification`
- `Template`
- `Channel`
- `Provider`
- `DeliveryAttempt`

Core methods:

```go
Send(ctx context.Context, req SendNotificationRequest) (Notification, error)
RenderTemplate(templateID string, data map[string]string) (string, error)
```

Patterns:

- Factory: create channel sender
- Strategy: send behavior per channel
- Adapter: external provider SDK
- Command: retry send job
- Observer: trigger from domain events

Edge cases:

- provider down
- duplicate event
- invalid template data
- user opted out
- rate limit provider

Interview explanation:

The domain should depend on a `Notifier` interface. Each external provider is wrapped using Adapter. Retry jobs must be idempotent.

---

## 10. Rate Limiter

**Full step-by-step solution:** [[Rate Limiter LLD in Go]]

### Question

Design a rate limiter.

### Strong answer

Requirements:

- limit requests per user/IP/API key
- support different algorithms
- return allowed/blocked
- support TTL/window

Entities:

- `RateLimitRule`
- `Bucket`
- `RequestIdentity`
- `Decision`

Core methods:

```go
Allow(ctx context.Context, key string) (bool, error)
```

Patterns:

- Strategy: fixed window/sliding window/token bucket
- Repository: Redis/in-memory counter store

Edge cases:

- clock skew
- burst traffic
- distributed instances
- Redis unavailable
- user vs IP key choice

Interview explanation:

For simple API limiting, token bucket is good because it supports bursts while controlling average rate. In distributed systems, use Redis atomic operations or Lua script.

---

## 11. Movie Ticket Booking

**Full step-by-step solution:** [[Movie Ticket Booking LLD in Go]]

### Question

Design movie ticket booking like BookMyShow.

### Strong answer

Requirements:

- list movies/shows
- view seats
- lock seats
- confirm booking after payment
- release expired locks

Entities:

- `Movie`
- `Theater`
- `Screen`
- `Seat`
- `Show`
- `SeatLock`
- `Booking`
- `Payment`

Core methods:

```go
LockSeats(ctx context.Context, showID, userID string, seatIDs []string) error
ConfirmBooking(ctx context.Context, lockID string, paymentID string) (Booking, error)
ReleaseExpiredLocks(ctx context.Context) error
```

Patterns:

- State: seat available/locked/booked
- Strategy: pricing
- Command: release expired locks job

Edge cases:

- same seat selected by two users
- lock expiry
- payment failure
- partial seat availability
- duplicate confirmation

Interview explanation:

Seat locking is the critical part. A seat should move from available to locked atomically with expiry. Booking only succeeds if lock belongs to the same user and has not expired.

---

## 12. Splitwise Expense Sharing

**Full step-by-step solution:** [[Splitwise Expense Sharing LLD in Go]]

### Question

Design Splitwise-like expense sharing.

### Strong answer

Requirements:

- users create group
- add expense
- split equally/exact/percentage
- show balances
- simplify debts

Entities:

- `User`
- `Group`
- `Expense`
- `Split`
- `Balance`

Core methods:

```go
AddExpense(ctx context.Context, req AddExpenseRequest) (Expense, error)
GetBalances(ctx context.Context, groupID string) ([]Balance, error)
SimplifyDebts(ctx context.Context, groupID string) ([]Settlement, error)
```

Patterns:

- Strategy: split calculation
- Repository: expense/balance storage

Edge cases:

- percentage does not sum to 100
- exact split does not sum to amount
- user not in group
- rounding errors
- deleting expense

Interview explanation:

Split strategy is the key abstraction because equal, exact, and percentage splits share the same flow but different calculations.

---

## 13. Logging System

**Full step-by-step solution:** [[Logging System LLD in Go]]

### Question

Design a logging system.

### Strong answer

Read full note: [[Logging System LLD in Go]]

Key points:

- log levels
- appenders
- formatters
- level filtering
- thread safety
- async logging optional

Patterns:

- Chain of Responsibility
- Strategy
- Factory
- Singleton carefully

Edge cases:

- remote sink slow/down
- log level filtering
- concurrent writes
- structured fields
- backpressure

Interview explanation:

I would expose a Logger facade, use handlers for filtering/formatting, and appender strategies for output destinations. In production, avoid blocking request path on slow remote logging.

---

## 14. File Search / Unix Find

**Full step-by-step solution:** [[File Search Unix Find LLD in Go]]

### Question

Design a file search system like Unix `find` that supports filters by name, size, extension, and AND/OR conditions.

### Strong answer

Requirements:

- traverse directory tree
- filter files
- combine filters
- return matching files

Entities:

- `File`
- `Directory`
- `Filter`
- `SearchService`

Core methods:

```go
Search(root Directory, filter Filter) []File
```

Patterns:

- Composite: file/directory tree
- Specification/Interpreter: filter expressions
- Strategy: traversal mode

Edge cases:

- permission denied
- symlink cycles
- huge directory tree
- invalid filter

Interview explanation:

Composite models file and directory uniformly. Interpreter/Specification models filters like `extension=.go AND size<1MB`.

---

## 15. Food Ordering System

**Full step-by-step solution:** [[Food Ordering System LLD in Go]]

### Question

Design food ordering app.

### Strong answer

Requirements:

- restaurant lists menu
- user adds items to cart
- place order
- restaurant accepts/rejects
- delivery assignment
- payment

Entities:

- `User`
- `Restaurant`
- `MenuItem`
- `Cart`
- `Order`
- `Payment`
- `DeliveryPartner`

Core methods:

```go
AddToCart(ctx context.Context, userID string, itemID string, qty int) error
PlaceOrder(ctx context.Context, userID string) (Order, error)
UpdateOrderStatus(ctx context.Context, orderID string, status OrderStatus) error
```

Patterns:

- State: order lifecycle
- Strategy: delivery assignment/pricing
- Observer: status notification
- Factory/Adapter: payment provider

Edge cases:

- restaurant closes after cart add
- item unavailable
- payment failure
- delivery unavailable
- duplicate order retry

Interview explanation:

The main design should keep order lifecycle explicit and payment/delivery integrations behind interfaces. This allows future providers without rewriting order logic.
