const {sequelize, Customer, orders, order_item} = require('../models');

async function addOrder(customerId) {

    try {
        await orders.create({customerId});
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async function updateOrder(orderTotal, customerId) {

    try {
        const order = await orders.findOne({
            where: { customerId: customerId }
        });

        order.orderTotal = orderTotal;

        await order.save();
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async function getOrder(customerId) {
    try {
        const order = await orders.findOne({
            where: { customerId: customerId }
        });

        return order;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function addItemToOrder(itemId, itemName, itemPrice, itemQuantity, orderId) {
    try {
        await order_item.create({orderId, itemName, itemPrice, itemQuantity, itemId});
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

module.exports = {
    addOrder,
    updateOrder,
    getOrder,
    addItemToOrder
};