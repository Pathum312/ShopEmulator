const express = require('express');
const router = express.Router();
const itemFunctions = require('../../utils/itemFunctions');

// Get all customers
router.get('/', async (req, res) => {

    try {

        const item = await itemFunctions.getAllItems();
        return res.json(item);

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Get one customer
router.get('/:uuid', async (req, res) => {

    try {

        const item = await itemFunctions.getOneItem(req.params.uuid);
        return res.json(item);

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Create a customer
router.post('/', async (req, res) => {

    const { itemName, itemPrice, itemQuantity } = req.body;

    try {

        const item = await itemFunctions.addItem(itemName, itemPrice, itemQuantity);
        return res.json(item);

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Update customer details
router.put('/:uuid', async (req, res) => {

    const { itemName, itemPrice, itemQuantity } = req.body;

    try {

        const exists = await itemFunctions.checkIfItemExists(itemName);

        if(exists !== null) {

            const item = await itemFunctions.getOneItem(req.params.uuid);

            item.itemName = itemName;
            item.itemPrice = itemPrice;
            item.itemQuantity = itemQuantity;

            await item.save();
            return res.json({Success: `Item ${itemName} updated`});

        } else {
            return  res.status(400).json({Error: `Item ${itemName} doesn't exist`});
        }

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Delete a customer
router.delete('/:uuid', async (req, res) => {

    try {

        const exists = await itemFunctions.checkIfItemExistsByUUID(req.params.uuid);

        if(exists !== null) {

            await itemFunctions.deleteItem(req.params.uuid);
            return res.json({Success: `Item ${req.params.uuid} deleted`});

        } else {
            return  res.status(400).json({Error: `Item ${req.params.uuid} doesn't exist`});
        }

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }
});

module.exports = router;