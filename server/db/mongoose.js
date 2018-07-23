const mongoose = require('mongoose');

// Setup mongoose to use the default Promise
mongoose.Promise = global.Promise;
// Connect mongoose to my mongodb server
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/BusinessQueues',{ useNewUrlParser: true } );

module.exports.mongoose = mongoose;