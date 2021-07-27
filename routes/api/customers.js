const express = require('express');
const router = express.Router();
const customerFunctions = require('../../utils/customerFunctions');
const orderFunctions = require('../../utils/orderFunctions');
const itemFunctions = require('../../utils/itemFunctions');
const async = require('async');

// Get all customers
router.get('/', async (req, res) => {

    try {

        const customer = await customerFunctions.getAllCustomers();
        return res.json(customer);

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Get one customer
router.get('/:uuid', async (req, res) => {

    try {

        const customer = await customerFunctions.getOneCustomer(req.params.uuid);
        return res.json(customer);

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Create a customer
router.post('/', async (req, res) => {

    const { customerName, customerEmail } = req.body;

    try {

        const customer = await customerFunctions.addCustomer(customerName, customerEmail);
        return res.json(customer);

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Update customer details
router.put('/:uuid', async (req, res) => {

    const { customerName, customerEmail } = req.body;

    try {

        const exists = await customerFunctions.checkIfCustomerExists(customerEmail);

        if(exists !== null) {

            const customer = await customerFunctions.getOneCustomer(req.params.uuid);

            customer.customerEmail = customerEmail;
            customer.customerName = customerName;

            await customer.save();
            return res.json({Success: `Customer ${customerEmail} updated`});

        } else {
            return  res.status(400).json({Error: `Customer ${customerEmail} doesn't exist`});
        }

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

// Delete a customer
router.delete('/:uuid', async (req, res) => {

    try {

        const exists = await customerFunctions.checkIfCustomerExistsByUUID(req.params.uuid);

        if(exists !== null) {

            await customerFunctions.deleteCustomer(req.params.uuid);
            return res.json({Success: `Customer ${req.params.uuid} deleted`});

        } else {
            return  res.status(400).json({Error: `Customer ${req.params.uuid} doesn't exist`});
        }

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }
});

// Place a order
router.post('/orders', async (req, res) => {

    try {

        await orderFunctions.addOrder(req.body.customerId);

        const order = await orderFunctions.getOrder(req.body.customerId);

        let orderTotal = 0;

        await async.forEach(req.body.items, async (item, callback) => {

            console.log(order);
            try {
                await orderFunctions.addItemToOrder(item.itemId, item.itemName, item.itemPrice, item.itemQuantity, order.id);
                orderTotal = orderTotal + (item.itemPrice * item.itemQuantity);
                await itemFunctions.updateItemQuantity(item.itemId, item.itemQuantity);
            } catch (err) {
                console.log(err.message);
                return res.status(500).json(err.message);
            }


        });

        await orderFunctions.updateOrder(orderTotal, req.body.customerId);

        return res.json('Order added')

    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }

});

module.exports = router;