package main

import "fmt"

// Access pattern -> key. Every read is one Query on one partition key.
func main() {
	ws, inv, client := "acme", "inv_812", "c_1"
	fmt.Println("AP2 Query PK =", "WS#"+ws, "SK begins_with", "INV#2026-11")
	fmt.Println("AP1 Query PK =", "INVOICE#"+inv) // META, ITEM#001.., PAY#...
	fmt.Println("AP3 Query GSI1PK =", "CLIENT#"+client)
	// Item key of the invoice summary: entity # month # id, sortable by prefix.
	fmt.Println("item:", "WS#"+ws, "/", "INV#2026-11#"+inv)
	// Next page: send LastEvaluatedKey back as ExclusiveStartKey.
}
