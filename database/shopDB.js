const mySQl = require('mysql');
const async = require('async');

// create connection with Shop database
const pool = mySQl.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Shop'
});

// create connection
const emptyDatabase = mySQl.createPool({
    host: 'localhost',
    user: 'root',
    password: ''
});

function checkTable(tableName, sql, connection) {

    // Checking if the table exist
    let checkCustomerTableSQL = `SELECT COUNT(*) AS count FROM information_schema.TABLES WHERE table_schema = "shop" AND table_name = "${tableName}"`;
    connection.query(checkCustomerTableSQL, (err, result) => {
        if(err) throw err;
        async.forEach(result, (table, callback) => {
            if(table.count === 1) {
                console.log(`${tableName} Table exists...`);
            }else {
                // Creates table
                connection.query(sql, (err, result) => {
                    if(err) throw err;
                    console.log(`${tableName} Table created...`);
                });
            }
            callback();
        }, (err) => {
            if(err) {
                console.log(err);
            }
            console.log(`${tableName} found...`);
        });
    });
}

function startConnection(pool, emptyDatabase) {

    // Connecting to empty database
    emptyDatabase.getConnection((err, connection) => {

        // Checking if the shop database exist
        let checkDatabase = 'CREATE DATABASE IF NOT EXISTS shop';
        connection.query(checkDatabase, (err, result) => {
            if(err) {
                console.log(err.message);
            }

            console.log('Shop database exists..')
            connection.release();
        });
    });



    pool.getConnection((err, connection) => {
        // Check if Customer table exist
        checkTable('Customer', 'CREATE TABLE customer(customerId int(4) AUTO_INCREMENT, customerName varchar(255), customerEmail varchar(255),isDeleted BIT NOT NULL DEFAULT 0 , PRIMARY KEY (customerId))', connection);

        // Check if Item table exits
        checkTable('Item', 'CREATE TABLE item(itemId int(4) AUTO_INCREMENT, itemName varchar(255), itemPrice int(8), itemQuantity int(8),isDeleted BIT NOT NULL DEFAULT 0 , PRIMARY KEY (itemId))', connection)

        // Check if Order table exists
        checkTable('Orders', 'CREATE TABLE orders(orderId int(4) AUTO_INCREMENT, orderTotal int(8), customerId int(4) NOT NULL,isDeleted BIT NOT NULL DEFAULT 0 , PRIMARY KEY (orderId), FOREIGN KEY (customerId) REFERENCES customer(customerId))', connection);

        // Check if Order_Item table exists
        checkTable('Order_Item', 'CREATE TABLE order_item(orderId int(4) NOT NULL, itemName varchar(255), itemPrice int(8), itemQuantity int(8), itemId int(4) NOT NULL,isDeleted BIT NOT NULL DEFAULT 0 , FOREIGN KEY (orderId) REFERENCES orders(orderId), FOREIGN KEY (itemId) REFERENCES item(itemId))', connection);

        connection.release();
    });



}
module.exports = {
    startConnection,
    emptyDatabase,
    pool
};