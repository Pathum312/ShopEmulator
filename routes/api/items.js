const express = require('express');
const router = express.Router();
const db = require('../../database/shopDB');
const Item = require('../../models/Item');
const async = require("async");

// Gets all items
router.get('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(`Error when connecting: ${err.message}`);
            connection.release();
        }

        let sql = 'SELECT * FROM item'
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

// Adds a item
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

                connection.query(`SELECT (CASE WHEN EXISTS (SELECT * FROM item WHERE itemName = '${req.body.itemName}') THEN 'True' ELSE 'False' END) AS Item_Exists`, (err, result) => {

                    if(err) {
                        return rollback('Email_check', connection, err);
                    }

                    async.forEach(result, (ans, callback) => {

                        if(ans.Item_Exists === 'False') {

                            let item = new Item(req.body.itemName, req.body.itemPrice, req.body.itemQuantity);

                            // Add item
                            let sql = 'INSERT INTO item SET ?';
                            connection.query(sql, item, (err, result) => {
                                if(err) {
                                    callback('Add_Item', err);
                                } else {
                                    console.log(`Item ${item.getName} added to item table`);
                                    res.json({Success: `Item ${item.getName} added to item table`});
                                    callback();
                                }
                            });

                        } else {
                            console.log(`Item ${req.body.itemName} already exists`);
                            res.status(400).json({Error: `Item ${req.body.itemName} already exists`});
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

// Update a item's details
router.put('/', (req, res) => {
    db.pool.getConnection((err, connection) => {
        console.log(req.body);
        if(err) {
            console.log(err.message);
        }

        let sql = "UPDATE item SET " + Object.keys(req.body).map(key => `${key} = ?`).join(", ") +" WHERE itemId = ?";
        let parameters = [...Object.values(req.body), req.body.itemId];
        connection.query(sql, parameters, (err, result) => {
            if(err) {
                res.status(400).json({Error: `Item ${req.body.itemId} does not exist !!!`});
            }
            console.log(result);
            res.json({Success: `Item ${req.body.itemId} was updated...`});
            connection.release();
        });
    });
});

// Delete a item
router.delete('/', (req, res) => {
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

                let sql = `Update item SET isDeleted = 1 WHERE itemId = ${req.body.itemId}`;
                connection.query(sql, (err, results) => {
                    if(err) {
                        rollback('Delete_Item', connection, err);
                    }
                    res.json({Success: `Item ${req.body.itemId} was deleted`});

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
            return res.status(400).json({Error: 'Item Delete Failed'});
        }

    });
});

module.exports = router;