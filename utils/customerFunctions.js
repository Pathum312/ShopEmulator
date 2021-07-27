const {sequelize, Customer} = require('../models');

async function checkIfCustomerExists(customerEmail) {
    try {

        const customer = await Customer.findOne({
            where: { customerEmail },
            where: { deletedAt: null }
        });
        return customer;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function checkIfCustomerExistsByUUID(uuid) {
    try {

        const customer = await Customer.findOne({
            where: { uuid: uuid },
            where: { deletedAt: null }
        });
        return customer;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function addCustomer(customerName, customerEmail) {

    try {
        const [customer, created] = await Customer.findOrCreate({
            where: { customerEmail: customerEmail },
            defaults: {
                customerName: customerName
            }
        });

        if(created) {
            return customer;
        }else {
            return {Error: `Customer ${customerName} already exists`}
        }
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async function getAllCustomers() {

    try {
        const customer = await Customer.findAll({
            where: { deletedAt: null }
        });
        return customer;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async function getOneCustomer(uuid) {

    try {
        const customer = await Customer.findOne({
            where: { uuid: uuid },
            where: { deletedAt: null }
        });
        return customer;
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }

}

async  function deleteCustomer(uuid) {
    try {
        await Customer.destroy({
            where: { uuid:uuid }
        });
    }
    catch (err) {
        console.log(err.message);
        return err.message;
    }
}

module.exports = {
    checkIfCustomerExists,
    checkIfCustomerExistsByUUID,
    deleteCustomer,
    addCustomer,
    getAllCustomers,
    getOneCustomer
};