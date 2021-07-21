const express = require('express');
const router = express.Router();
const async = require('async');
const db = require('../../database/shopDB');
const Customer = require('../../models/Customer');

// Gets all customers
router.get('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(`Error when connecting: ${err.message}`);
            connection.release();
        }

        let sql = 'SELECT * FROM customer'
        connection.query(sql, (err, result) => {
            if(err) {
                console.log('Error: ' + err.message);
                connection.release();
            }
            res.json(result);
            connection.release();
        });

    });
});

// Adds a customer
router.post('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(`Error when connecting: ${err.message}`);
            connection.release();
        }

        console.log(`Connected as id: ${connection.threadId}`);

        try {
            // Error logging
            let rollback = (location, connection, err) => {
                console.log("Error location: " + location + ", Error: " + err.message);
                connection.rollback(() => {
                    connection.release();
                });
            }

            // Starting transaction
            connection.beginTransaction((err) => {

                if(err) {
                    return rollback('Start_transaction', connection, err);
                }

                connection.query(`SELECT (CASE WHEN EXISTS (SELECT * FROM customer WHERE customerEmail = '${req.body.customerEmail}') THEN 'True' ELSE 'False' END) AS Customer_Exists`, (err, result) => {

                    if(err) {
                        return rollback('Email_check', connection, err);
                    }

                    async.forEach(result, (ans, callback) => {

                        if(ans.Customer_Exists === 'False') {

                            let customer = new Customer(req.body.customerName, req.body.customerEmail);

                            // Add customer
                            let sql = 'INSERT INTO customer SET ?';
                            connection.query(sql, customer, (err, result) => {
                                if(err) {
                                    callback('Add_Customer', err);
                                } else {
                                    console.log(`Customer ${customer.getEmail} added to customer table`);
                                    res.json({Success: `Customer ${customer.getEmail} added to customer table`});
                                    callback();
                                }

                            });

                        } else {
                            res.status(400).json({Error: `Customer ${req.body.customerEmail} already exists`});
                        }

                    }, (location, err) => {
                        if(err) {
                            return rollback(location, connection, err);
                        }
                    });

                    connection.commit(function(err) {
                        if (err) {
                            return rollback('Committing', connection, err);
                        }
                        console.log('Transaction Complete.');
                        connection.release();
                    });

                });

            });

        } catch (e) {
            return res.status(400).json({Error: 'Customer Save Failed'});
        }

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
            } else {
                console.log(result);
                res.json({Success: `Customer ${req.body.customerId} was updated...`});
                connection.release();
            }
        });
    });
});

// Delete a customer
router.delete('/', (req, res, next) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(`Error when connecting: ${err.message}`);
            connection.release();
        }

        try {
            // Error logging
            let rollback = (location, connection, err) => {
                console.log("Error location: " + location + ", Error: " + err.message);
                connection.rollback(() => {
                    connection.release();
                });
            }

            // Start transaction
            connection.beginTransaction((err) => {

                if(err) {
                    return rollback('Start_transaction', connection, err);
                }

                let sql = `Update customer SET isDeleted = 1 WHERE customerId = ${req.body.customerId}`;
                connection.query(sql, (err, results) => {
                    if(err) {
                        rollback('Delete_Customer', connection, err);
                    }
                    res.json({Success: `Customer ${req.body.customerId} was deleted`});

                });

                connection.commit(function(err) {
                    if (err) {
                        return rollback('Committing', connection, err);
                    }
                    console.log('Transaction Complete.');
                    connection.release();
                });
            });
        } catch (e) {
            return res.status(400).json({Error: 'Customer Delete Failed'});
        }




    });
});

// Place an order
router.post('/order', (req, res, next) => {

    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(`Error when connecting: ${err.message}`);
            connection.release();
        }

        console.log(`Connected as id: ${connection.threadId}`);

        try {

            // Error logging
            let rollback = (location, connection, err) => {
                console.log("Error location: " + location + ", Error: " + err.message);
                connection.rollback(() => {
                    connection.release();
                });
            }

            // Starting transaction
            connection.beginTransaction((err) => {
                if(err) {
                    return rollback('Start_transaction', connection, err);
                }

                let customerId = req.body.customerId;
                let items = req.body.items;
                let orderPrice = 0;

                let order = {
                    orderTotal: orderPrice,
                    customerId: customerId
                };

                // Add order details to orders table
                let sql = 'INSERT INTO orders SET ?';
                connection.query(sql, order, (err, result) => {
                    if(err) {
                        res.status(400).json({Error: `Order already exists !!!`});
                        return rollback('Order_add', connection, err);
                    } else {
                        console.log(`Order added to orders table`);
                        res.json({Success: `Order added to orders table`});

                        connection.query(`SELECT orderId FROM orders WHERE customerId = ${customerId}`, (err, result) => {

                            if(err) {
                                return rollback('Get_OrderId', connection, err);
                            }

                            let orderId = 0;

                            async.forEach(result, (order, callback) => {
                                console.log('orderId: ' + order.orderId);
                                orderId = order.orderId;
                                async.forEach(items, (item, callback) => {

                                    let orderItem = {
                                        orderId: orderId,
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
                                            res.status(400).json({Error: `Order ${orderId} already exists !!!`});
                                            callback('Add_Order', err);
                                        };
                                        console.log(`Item ${item.itemId} was added to Order ${orderId}`);

                                        // Update the item table
                                        let updateQuery = `UPDATE item SET itemQuantity = itemQuantity - ${item.itemQuantity} WHERE itemId = ${item.itemId}`;
                                        connection.query(updateQuery, (err, result) => {
                                            if(err) {
                                                res.status(400).json({Error: `Item ${item.itemId} does not exist !!!`});
                                                callback('Update_Item', err);
                                            }
                                            console.log(`Item ${item.itemId} was updated`);
                                            callback();
                                        });

                                    });

                                }, (location, err) => {
                                    if(err) {
                                        return rollback(location, connection, err);
                                    }
                                });
                                callback();

                            });

                            // Update the order table
                            let updateQuery = `UPDATE orders SET orderTotal = ${orderPrice} WHERE orderId = ${orderId}`;
                            connection.query(updateQuery, (err, result) => {
                                if(err) {
                                    res.status(400).json({Error: `Order ${orderId} does not exist !!!`});
                                    return rollback('Update_Order', connection, err);
                                }
                                console.log(`Order ${orderId} was updated`);

                                connection.commit(function(err) {
                                    if (err) {
                                        return rollback('Committing', connection, err);
                                    }
                                    console.log('Transaction Complete.');
                                    connection.release();
                                });
                            });

                        });
                    }


                });
            });

        } catch (e) {
            return res.status(400).json({Error: 'Order Save Failed'});
        }
    });
});

module.exports = router;