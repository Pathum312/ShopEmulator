const express = require('express');
const router = express.Router();
const async = require('async');
const db = require('../../database/shopDB');
const Customer = require('../../models/Customer');
const Order = require('../../models/Order');

// Gets all customers
router.get('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let sql = 'SELECT * FROM customer'
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });

    db.ShopDB.end();
});

// Adds a customer
router.post('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let customer = new Customer(req.body.customerId, req.body.customerName, req.body.customerEmail);

    let sql = 'INSERT INTO customer SET ?';
    db.ShopDB.query(sql, customer, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Customer ${customer.getId} added to customer table`});
    });

    db.ShopDB.end();
});

// Update a customer's details
router.put('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let customer = new Customer(req.body.customerId, req.body.customerName, req.body.customerEmail);
    let sql = `UPDATE customer SET customerName = '${customer.getName}', customerEmail = '${customer.getEmail}' WHERE customerId = ${customer.getId}`;
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Customer ${customer.getId} was updated`});
    });

    db.ShopDB.end();
});

// Delete a customer
router.delete('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let sql = `DELETE FROM customer WHERE customerID = ${req.body.customerId}`;
    db.ShopDB.query(sql, (err, results) => {
        if(err) throw err;
        res.json({msg: `Customer ${req.body.customerId} was deleted`});
    });

    db.ShopDB.end();
});

// Place an order
router.post('/order', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    // Items array
    let itemList = req.body;
    console.log(itemList);

    async.forEach(itemList, (item) => {
        console.log(item.itemQuantity);
    });

    let orderId = 0;
    let orderItems = '';
    let orderTotal = 0;
    let customerId = 0;
    let ownerId = 0;

    async.forEach(itemList, (itemClient) => {

        // Update each item
        let itemSQL = `UPDATE item SET itemQuantity = (itemQuantity - ${itemClient.itemQuantity}) WHERE itemId = ${itemClient.itemId}`;
        db.ShopDB.query(itemSQL, (err, result) => {
            if(err) throw err;
            console.log(result);
        });

        // Update owner
        let sql = `UPDATE owner SET ownerProfit = ( ownerProfit + (${itemClient.itemPrice * itemClient.itemQuantity})) WHERE ownerId = ${itemClient.ownerId}`;
        db.ShopDB.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
        });

        // Gets itemName
        let s = `SELECT itemName FROM item WHERE itemId = ${itemClient.itemId}`;
        let itemName = db.ShopDB.query(s, (err, result) => {
            if(err) throw err;
            console.log(result);
        });

        orderId = itemClient.orderId;
        orderItems = orderItems.concat(`${itemClient.itemQuantity} ${itemName}s,`);
        orderTotal = orderTotal + (itemClient.itemPrice * itemClient.itemQuantity);
        customerId = itemClient.customerId;
        ownerId = itemClient.ownerId;

    });

    console.log(orderItems);

    let order = new Order(orderId, orderItems, orderTotal, customerId, ownerId);

    // Adds order
    let sql = 'INSERT INTO orders SET ?';
    db.ShopDB.query(sql, order, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Order ${orderId} added to order table`});
    });


    db.ShopDB.end();

});

module.exports = router;