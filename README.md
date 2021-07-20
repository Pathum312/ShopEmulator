# ShopEmulator

### APIs (http://localhost:4000) ###

### /api/customers ###

1. `GET /`: Gets all the customers.
2. `POST /`: Add a customer.
3. `PUT /`: Update a customer's data.
4. `DELETE /`: Delets a customer.
5. `POST /order`: Add a order.

### /api/items ###

1. `GET /`: Gets all the items.
2. `POST /`: Add a items.
3. `PUT /`: Update a items data.
4. `DELETE /`: Delets a item.

### /order rquest body json  ###

```
{
    "orderId": 3337,
    "customerId": 1111,
    "items": {
        "items1": {
            "itemId": 2221,
            "itemPrice": 120,
            "itemName": "Plain Biscuit",
            "itemQuantity": 1
        },
        "item2": {
            "itemId": 2222,
            "itemPrice": 300,
            "itemName": "Chocolate Biscuit",
            "itemQuantity": 1
        }
    }
}
```
