const mongoose = require('mongoose');

let newSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    address: {type: String, required: true},
    amount:{ type: String, required: true },
    to: {type: String, required: true},
    from: {type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model('transfer', newSchema);