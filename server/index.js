require('./config');
const port = process.env.PORT;

// Require and configure express
const express = require('express');
const app = express();

// Require and configure bodyParser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Require and configure the routes
const apiUser = require('./routes/api/user');
const apiBusiness = require('./routes/api/business');
app.use('/api/v1/users',apiUser);
app.use('/api/v1/businesses',apiBusiness);


// Start the server
app.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};