const express = require('express');

// Init express
const app = express();

// Body parser
app.use(express.json());

// Api routes
app.use('/api/customers', require('./routes/api/customers'));
app.use('/api/items', require('./routes/api/items'));
app.use('/api/owners', require('./routes/api/owners'));

// Init port
const PORT = process.env.PORT || 4000;

// Listen on PORT
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));


