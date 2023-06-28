const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    name: String,
    accountId: String,
    users: []
});

module.exports = mongoose.model('Tables', tableSchema);