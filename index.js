const express = require('express');
const { sequelize } = require('./models');

// Express init
const app = express();

// Json body parser middleware
app.use(express.json());

// Api Routes
app.use('/api/customers', require('./routes/api/customers'));
app.use('/api/items', require('./routes/api/items'));

// Listing on port 5000
app.listen({ port: 5000 }, async () => {
    console.log('Server up on http://localhost:5000');
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ force: true });
    console.log('Tables created')
})



