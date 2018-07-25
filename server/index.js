require('./config');
const port = process.env.PORT;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const apiUser = require('./routes/api/user');
const apiBusiness = require('./routes/api/business');

// Configure bodyParser middleware
app.use(bodyParser.json());
app.use('/api/v1/users',apiUser);
app.use('/api/v1/businesses',apiBusiness);

// Start the server
app.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};