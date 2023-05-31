const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    name: String,
    users: [{
        name: String,
        email: String,
        gift: String
      }]
});

module.exports = mongoose.model('Tables', TableSchema);