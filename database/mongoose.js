const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ATW', { useNewUrlParser: true });
module.exports = {mongoose};