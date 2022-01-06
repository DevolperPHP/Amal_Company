const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    
    des: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
    },

    cat:{
        type: String,
        required: true,
    },

    image:{
        type: String,
        default: '/images/no_image.png',
    },

    score:{
        type: Number,
        default: 0,
    },

    analysis_date:{
        type: String,
        required: true,
    },

    isStock: {
        type: Number,
        default: 0,
    },

    scoreAnalysis:{
        type: Array,
        default: []
    },

    soldDate:{
        type: Array,
        default: [],
    },

    Date:{
        type: String,
        required: true,
    }
})

const Product = mongoose.model('Product', productSchema, 'Product')
module.exports = Product