const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: String,
    password: String
    });

module.exports = mongoose.model('Accounts', accountSchema);