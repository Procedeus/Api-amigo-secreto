const mongoose = require('mongoose');

const usersTableSchema = new mongoose.Schema({
        name: String,
        email: String,
        tableId: String,
        gift: String
});

module.exports = mongoose.model('usersTable', usersTableSchema);