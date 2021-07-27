const {sequelize, Item} = require('../models');

async function checkIfItemExists(itemName) {
    try {

        const item = await Item.findOne({
            where: { itemName: itemName },
            where: { deletedAt: null }
        });
        return item;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function checkIfItemExistsByUUID(uuid) {
    try {

        const item = await Item.findOne({
            where: { uuid: uuid },
            where: { deletedAt: null }
        });
        return item;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function addItem(itemName, itemPrice, itemQuantity) {

    try {
        const [item, created] = await Item.findOrCreate({
            where: { itemName: itemName },
            defaults: {
                itemPrice: itemPrice,
                itemQuantity: itemQuantity
            }
        });

        if(created) {
            return item;
        }else {
            return {Error: `Customer ${itemName} already exists`}
        }
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async function getAllItems() {

    try {
        const item = await Item.findAll({
            where: { deletedAt: null }
        });
        return item;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async function updateItemQuantity(itemId, itemQuantity) {
    try {
        const item = await Item.findOne({
            where: { id: itemId }
        });

        item.itemQuantity = item.itemQuantity - itemQuantity;

        await item.save();
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function getOneItem(uuid) {

    try {
        const item = await Item.findOne({
            where: { uuid: uuid },
            where: { deletedAt: null }
        });
        return item;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async  function deleteItem(uuid) {
    try {
        await Item.destroy({
            where: { uuid:uuid }
        });
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

module.exports = {
    checkIfItemExists,
    checkIfItemExistsByUUID,
    updateItemQuantity,
    deleteItem,
    addItem,
    getAllItems,
    getOneItem
};