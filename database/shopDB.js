const mySQl = require('mysql');
const async = require('async');

// create connection with Item table
const ShopDB = mySQl.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Shop'
});

// create connection
const emptyDatabase = mySQl.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

function checkTable(tableName, sql, ShopDB) {

    // Checking if the table exist
    let checkCustomerTableSQL = `SELECT COUNT(*) AS count FROM information_schema.TABLES WHERE table_schema = "shop" AND table_name = "${tableName}"`;
    ShopDB.query(checkCustomerTableSQL, (err, result) => {
        if(err) throw err;
        async.forEach(result, (table) => {
            if(table.count === 1) {
                console.log(`${tableName} Table exists...`);
            }else {
                // Creates table
                ShopDB.query(sql, (err, result) => {
                    if(err) throw err;
                    console.log(`${tableName} Table created...`);
                });
            }
        });
    });
}

function startConnection(shopDB, emptyDatabase) {

    // connects to the Shop database
    ShopDB.connect((err) => {
        // error pops up, if the database doesn't exist
        if(err) {
            // Shop database created
            let sql = 'CREATE DATABASE Shop';
            emptyDatabase.query(sql, (err, result) => {
                if(err) throw err;
                console.log(result);
                console.log('Database created...');
            });
        }
        console.log('Database connected...')
    });

    // Check if Customer table exist
    checkTable('Customer', 'CREATE TABLE customer(customerId int(4), customerName varchar(255), customerEmail varchar(255), PRIMARY KEY (customerId))', ShopDB);

    // Check if Owner table exists
    checkTable('Owner', 'CREATE TABLE owner(ownerId int(4), ownerName varchar(255), ownerProfit int(8), ownerLoss int(8), PRIMARY KEY (ownerId))', ShopDB);

    // Check if Item table exits
    checkTable('Item', 'CREATE TABLE item(itemId int(4), itemName varchar(255), itemPrice int(8), itemQuantity int(8), ownerId int(4) NOT NULL, PRIMARY KEY (itemId), FOREIGN KEY (ownerId) REFERENCES owner(ownerId))', ShopDB)

    // Check if Order table exists
    checkTable('Orders', 'CREATE TABLE orders(orderId int(4), orderItems varchar(255), orderTotal int(8), customerId int(4) NOT NULL, ownerId int(4) NOT NULL, PRIMARY KEY (orderId), FOREIGN KEY (customerId) REFERENCES customer(customerId), FOREIGN KEY (ownerId) REFERENCES owner(ownerId))', ShopDB);
}

module.exports = {
    ShopDB,
    emptyDatabase,
    startConnection
};