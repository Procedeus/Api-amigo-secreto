const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    name: String,
    users: []
});

module.exports = mongoose.model('Tables', TableSchema);