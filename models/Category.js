const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    score: {
        type: Number,
        default: 0
    },

    Date: {
        type: Date,
        default: Date.now()
    }
})

const Category = mongoose.model("Category", categorySchema, "Category")
module.exports = Category