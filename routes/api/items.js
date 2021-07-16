const express = require('express');
const router = express.Router();
const db = require('../../database/shopDB');
const Item = require('../../models/Item');

// Gets all items
router.get('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let sql = 'SELECT * FROM item'
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });

    db.ShopDB.end();
});

// Adds a item
router.post('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let item = new Item(req.body.itemId, req.body.itemName, req.body.itemPrice, req.body.itemQuantity, req.body.ownerId);

    let sql = 'INSERT INTO item SET ?';
    db.ShopDB.query(sql, item, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Item ${item.getId} added to item table`});
    });

    db.ShopDB.end();
});

// Update a item's details
router.put('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let item = new Item(req.body.itemId, req.body.itemName, req.body.itemPrice, req.body.itemQuantity, req.body.ownerId);
    let sql = `UPDATE item SET itemName = '${item.getName}', itemPrice = '${item.getPrice}', itemQuantity = ${item.getQuantity}, ownerId = ${item.getOwnerId} WHERE itemId = ${item.getId}`;
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Item ${item.getId} was updated`});
    });

    db.ShopDB.end();
});

// Delete a item
router.delete('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let sql = `DELETE FROM item WHERE itemId = ${req.body.itemId}`;
    db.ShopDB.query(sql, (err, results) => {
        if(err) throw err;
        res.json({msg: `Item ${req.body.itemId} was deleted`});
    });

    db.ShopDB.end();
});

module.exports = router;