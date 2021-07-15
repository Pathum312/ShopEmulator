const express = require('express');
const router = express.Router();
const db = require('../../database/shopDB');

// connects to the Shop database
db.ShopDB.connect((err) => {
    // error pops up, if the database doesn't exist
    if(err) {
        // Shop database created
        let sql = 'CREATE DATABASE Shop';
        db.emptyDatabase.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            console.log('Database created...');
        });
    }
    console.log('Database connected...')
});

// Create Items table
router.get('/createItemTable', (req, res) => {
    let sql = 'CREATE TABLE Item(itemID int(4), itemName varchar(255), itemStock int(4), itemPrice int(4), PRIMARY KEY (itemID))'
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log('Item table created...')
        res.status(200).json({ msg: 'Item table created' });
    });
});

// Create Shop_Owner table
router.get('/createShopOwnerTable', (req, res) => {
    let sql = 'CREATE TABLE Shop_Owner(name varchar(255), profit int(8), loss int(8))'
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log('Shop_Owner table created...')
        res.status(200).json({ msg: 'Shop_Owner table created' });
    });
});

// Add owner to the Shop_Owner table
router.post('/addOwner', (req, res) => {
    let newOwner = {
        name: req.body.name,
        profit: req.body.profit,
        loss: req.body.loss
    };

    let sql = 'INSERT INTO shop_owner SET ?';
    db.ShopDB.query(sql, newOwner, (err, result) => {
    if(err) throw err;
    console.log(result);
        res.json(newOwner);
    });


});

// Add an item to the Item table
router.post('/addItem', (req, res) => {
    let newItem = {
        itemID: req.body.id,
        itemName: req.body.name,
        itemStock: req.body.stock,
        itemPrice: req.body.price
    };

    let checkSQL = 'SELECT * FROM Item';

    // Getting the array of items
    db.ShopDB.query(checkSQL, (err, result) => {

        if(err) {

            // if no records are in the table this will add them without checking
            let sql = 'INSERT INTO Item SET ?';
            db.ShopDB.query(sql, newItem, (err, result) => {
                if(err) throw err;
                console.log(result);
                res.json(newItem);
            });
        }

        var same = false;
        result.every(item => {

            // Checking if the new name and ids are the same
            if(newItem.itemName === item.itemName || newItem.itemID === item.itemID) {
                same = true;
                return false;
            }

            return true;

        });

        if(same) {

            // if same name and id, error msg is sent
            res.status(400).json({msg: 'Please enter a Item Id, Item name and Item stock'});
        } else {

            // if not same name and id, it's add to the item table
            let sql = 'INSERT INTO Item SET ?';
            db.ShopDB.query(sql, newItem, (err, result) => {
                if(err) throw err;
                console.log(result);
                res.json(newItem);
            });
        }
    });
});

// Get all the items in the shop
router.get('/getItems', (req, res) => {
    let sql = 'SELECT * FROM Item';
    db.ShopDB.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
});

// Buy item
router.post('/buyItem', (req, res) => {
    let Item = {
        itemID: req.body.id,
        itemStock: req.body.stock
    };

    let checkSQL = 'SELECT * FROM Item';

    // Getting the array of items
    db.ShopDB.query(checkSQL, (err, result) => {

        if(err) throw err;

        result.every(item => {

            // Checking if the new name and ids are the same
            if(Item.itemID === item.itemID) {

                // Updating the Item table
                var stockNew = item.itemStock - Item.itemStock;
                let sql = `UPDATE item SET itemStock = ${stockNew} WHERE itemID = ${Item.itemID}`
                db.ShopDB.query(sql, (err, result) => {
                    if(err) throw err;
                    res.json({msg: `${Item.itemStock} ${item.itemName} was bought and the Item table was updated.`});

                    
                    var profits = Item.itemStock * item.itemPrice

                    // Updating the Shop_Owner table
                    let ownerSQL = 'SELECT profit FROM shop_owner WHERE name = "Pathum Senanayake"';
                    db.ShopDB.query(ownerSQL, (err, result) => {
                        if(err) throw err;
                        result.forEach(owner => {
                            profits = profits + owner.profit;
                        });

                        let shopSQL = `UPDATE shop_owner SET profit = ${profits} WHERE name = "Pathum Senanayake"`;
                        db.ShopDB.query(shopSQL, (err, result) => {
                            if(err) throw err;
                            console.log(`Pathum Senanayake made Rs.${profits}`);
                        });
                    });

                    
                });
                return false;
            }

            return true;

        });

    });
});


module.exports = router;

