const express = require('express');
const router = express.Router();
const db = require('../../database/shopDB');
const Item = require('../../models/Item');

// Gets all items
router.get('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(err.message);
        }

        let sql = 'SELECT * FROM item'
        connection.query(sql, (err, result) => {
            if(err) throw err;
            res.json(result);
            connection.release();
        });

    });
});

// Adds a item
router.post('/', (req, res) => {
    db.pool.getConnection((err, connection) => {

        if(err) {
            console.log(err.message);
        }

        let item = new Item(req.body.itemId, req.body.itemName, req.body.itemPrice, req.body.itemQuantity);

        let sql = 'INSERT INTO item SET ?';
        connection.query(sql, item, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(400).json({Error: `Item ${item.getId} already exists !!!`});
            };
            console.log(result);
            res.json({Success: `Item ${item.getId} added to item table`});
            connection.release();
        });

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
            console.log(err.message);
        }

        let sql = `DELETE FROM item WHERE itemID = ${req.body.itemId}`;
        connection.query(sql, (err, results) => {
            if(err) throw err;
            res.json({Success: `Item ${req.body.itemId} was deleted`});
            connection.release();
        });

    });
});

module.exports = router;