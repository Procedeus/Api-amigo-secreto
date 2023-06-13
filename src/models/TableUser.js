const mongoose = require('mongoose');

const TableUserSchema = new mongoose.Schema({
        name: String,
        email: String,
        tableId: String,
        gift: String
});

module.exports = mongoose.model('TableUsers', TableUserSchema);