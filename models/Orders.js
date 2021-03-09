const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    checkout: {
        country: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true
        },
        shippingOption: {
            type: String,
            required: true,
            trim: true
        }
    },
    date: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Order', orderSchema);