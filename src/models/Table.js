const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    name: String,
    users: []
});

module.exports = mongoose.model('Tables', tableSchema);