const mongoose = require('mongoose');

const billsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    cart: {
        type: Array,
    },

    total: {
        type: String,
    },

    seller: {
        type: String,
    },

    seller_id: {
        type: String,
    },

    Date: {
        type: String,
        required: true,
    }
})

const Bills = mongoose.model('Bills', billsSchema, 'Bills')
module.exports = Bills