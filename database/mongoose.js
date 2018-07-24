const mongoose = require('mongoose');

let uri = (process.env.MONGODB_URI) ? process.env.MONGODB_URI : 'mongodb://localhost:27017/ATW';

mongoose.connect(uri, { useNewUrlParser: true });
module.exports = {mongoose};