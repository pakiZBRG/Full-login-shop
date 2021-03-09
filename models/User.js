const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    resetPasswordLink: {
        type: String,
        default: ""
    },
    cart: {
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
        }]
    }
}, {timestamp: true});


module.exports = mongoose.model('User', userSchema);