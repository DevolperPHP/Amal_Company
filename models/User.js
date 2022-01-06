const mongoose = require('mongoose');
const userSchame = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    number: {
        type: Number,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isAdmin: {
        type: Number,
        default: 0,
    },

    isAccept: {
        type: Number,
        default: 0,
    },

    cart:{
        type: Array,
        default: [],
    },

    score: {
        type: Number,
        default: 0,
    },

    beenSold: {
        type: Array,
        default: [],
    },

    soldScore: {
        type: Array,
        default: [],
    },

    Date: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model('User', userSchame, 'User');
module.exports = User;