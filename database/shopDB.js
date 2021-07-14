const mySQl = require('mysql');

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

module.exports = {
    ShopDB,
    emptyDatabase
};