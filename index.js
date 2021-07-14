const express = require('express');

// Init express
const app = express();

// Body parser
app.use(express.json());

// Api shop route
app.use('/api/shop', require('./routes/api/shop'));

// Init port
const PORT = process.env.PORT || 4000;

// Listen on PORT
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));


