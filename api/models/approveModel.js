const mongoose = require('mongoose');

let newSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    address: {type: String, required: true},
    owner: {type: String, required: true},
    spender:{ type: String, required: true }
});

module.exports = mongoose.model('approve', newSchema);