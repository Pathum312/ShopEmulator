const express = require('express');
const db = require('./database/shopDB');

// Init express
const app = express();

// Init database
db.startConnection(db.pool, db.emptyDatabase);

// Body parser
app.use(express.json());

// Api routes
app.use('/api/customers', require('./routes/api/customers'));
app.use('/api/items', require('./routes/api/items'));

// Init port
const PORT = process.env.PORT || 4000;

// Listen on PORT
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));


