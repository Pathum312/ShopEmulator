const express = require('express');
const router = express.Router();
const async = require('async');
const db = require('../../database/shopDB');
const Customer = require('../../models/Customer');

// Gets all customers
router.get('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(err.message);
            connection.release();
        }

        let sql = 'SELECT * FROM customer'
        connection.query(sql, (err, result) => {
            if(err) throw err;
            res.json(result);
            connection.release();
        });

    });
});

// Adds a customer
router.post('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(err.message);
            connection.release();
        }

        let customer = new Customer(req.body.customerId, req.body.customerName, req.body.customerEmail);

        let sql = 'INSERT INTO customer SET ?';
        connection.query(sql, customer, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(400).json({Error: `Customer ${customer.getId} already exists !!!`});
                connection.release();
            };
            console.log(result);
            res.json({Success: `Customer ${customer.getId} added to customer table`});
            connection.release();
        });

    });
});

// Update a customer's details
router.put('/', (req, res) => {
    db.pool.getConnection((err, connection) => {
        console.log(req.body);
        if(err) {
            console.log(err.message);
            connection.release();
        }

        let sql = "UPDATE customer SET " + Object.keys(req.body).map(key => `${key} = ?`).join(", ") +" WHERE customerId = ?";
        let parameters = [...Object.values(req.body), req.body.customerId];
        connection.query(sql, parameters, (err, result) => {
            if(err) {
                res.status(400).json({Error: `Customer ${req.body.customerId} does not exist !!!`});
                connection.release();
            }
            console.log(result);
            res.json({Success: `Customer ${req.body.customerId} was updated...`});
            connection.release();
        });
    });
});

// Delete a customer
router.delete('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(err.message);
            connection.release();
        }

        let sql = `DELETE FROM customer WHERE customerID = ${req.body.customerId}`;
        connection.query(sql, (err, results) => {
            if(err) throw err;
            res.json({Success: `Customer ${req.body.customerId} was deleted`});
            connection.release();
        });

    });
});

// Place an order
router.post('/order', (req, res) => {

    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(`Error when connecting: ${err.message}`);
        }

        console.log(`Connected as id: ${connection.threadId}`);

        // Starting transaction
        connection.beginTransaction((err) => {
            if(err) throw err;

            let orderId = req.body.orderId;
            let customerId = req.body.customerId;
            let items = req.body.items;
            let orderPrice = 0;

            let order = {
                orderId: orderId,
                orderTotal: orderPrice,
                customerId: customerId
            };

            // Add order details to orders table
            let sql = 'INSERT INTO orders SET ?';
            connection.query(sql, order, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(400).json({Error: `Order ${orderId} already exists !!!`});
                    connection.rollback(() => {
                        throw err;
                    });
                    connection.release();
                };
                console.log(`Order ${orderId} added to orders table`);
                res.json({Success: `Order ${orderId} added to orders table`});

                async.forEach(items, (item, callback) => {

                    let orderItem = {
                        orderId: req.body.orderId,
                        itemName: item.itemName,
                        itemPrice: item.itemPrice,
                        itemQuantity: item.itemQuantity,
                        itemId: item.itemId
                    };

                    orderPrice = orderPrice + (item.itemPrice * item.itemQuantity);

                    // Add items to order_item table
                    let sql = 'INSERT INTO order_item SET ?';
                    connection.query(sql, orderItem, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(400).json({Error: `Order ${orderId} already exists !!!`});
                            connection.rollback(() => {
                                throw err;
                            });
                            connection.release();
                        };
                        console.log(result);

                        // Update the item table
                        let updateQuery = `UPDATE item SET itemQuantity = itemQuantity - ${item.itemQuantity} WHERE itemId = ${item.itemId}`;
                        connection.query(updateQuery, (err, result) => {
                            if(err) {
                                res.status(400).json({Error: `Item ${item.itemId} does not exist !!!`});
                                connection.rollback(() => {
                                    throw err;
                                });
                                connection.release();
                            }
                            console.log(result);

                        });

                    });

                    callback();
                }, (err) => {
                    if(err) {
                        console.log(err.message);
                    }
                });

                // Update the item table
                let updateQuery = `UPDATE orders SET orderTotal = ${orderPrice} WHERE orderId = ${orderId}`;
                connection.query(updateQuery, (err, result) => {
                    if(err) {
                        res.status(400).json({Error: `Order ${orderId} does not exist !!!`});
                        connection.rollback(() => {
                            throw err;
                        });
                        connection.release();
                    }
                    console.log(result);

                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                throw err;
                            });
                            connection.release();
                        }
                        console.log('Transaction Complete.');
                        connection.release();
                    });
                });
            });
        });
    });
});

module.exports = router;