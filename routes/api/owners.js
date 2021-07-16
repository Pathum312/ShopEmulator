const express = require('express');
const router = express.Router();
const db = require('../../database/shopDB');
const Owner = require('../../models/Owner');

// Gets all owners
router.get('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let sql = 'SELECT * FROM owner'
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });

    db.ShopDB.end();
});

// Adds a owner
router.post('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let owner = new Owner(req.body.ownerId, req.body.ownerName, req.body.ownerProfit, req.body.ownerLoss);

    let sql = 'INSERT INTO owner SET ?';
    db.ShopDB.query(sql, owner, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Owner ${owner.getId} added to owner table`});
    });

    db.ShopDB.end();
});

// Update a owner's details
router.put('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let owner = new Owner(req.body.ownerId, req.body.ownerName, req.body.ownerProfit, req.body.ownerLoss);
    let sql = `UPDATE owner SET ownerName = '${owner.getName}', ownerProfit = '${owner.getProfit}', ownerLoss = ${owner.getLoss} WHERE ownerId = ${owner.getId}`;
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json({msg: `Owner ${owner.getId} was updated`});
    });

    db.ShopDB.end();
});

// Delete a owner
router.delete('/', (req, res) => {
    db.startConnection(db.ShopDB, db.emptyDatabase);

    let sql = `DELETE FROM owner WHERE ownerID = ${req.body.ownerId}`;
    db.ShopDB.query(sql, (err, results) => {
        if(err) throw err;
        res.json({msg: `Owner ${req.body.ownerId} was deleted`});
    });

    db.ShopDB.end();
});

module.exports = router;