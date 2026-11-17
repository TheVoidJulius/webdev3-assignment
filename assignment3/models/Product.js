const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    reorderLevel: {
        type: Number,
        required: true,
        min: 0
    },

    supplier: {
        type: String,
        required: true
    }

}, { timestamps: true });

productSchema.virtual("stockValue").get(function () {
    return this.price * this.quantity;
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);