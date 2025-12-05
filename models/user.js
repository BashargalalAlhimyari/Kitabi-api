const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        trim: true
    },

    user_email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, "Email must be correct"]
    },

    user_password: {
        type: String,
        required: true
    },

    street: String,
    apartment: String,
    postalCode: String,
    country: String,

    is_admin: { type: Boolean, default: false },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    reset_password_otp: Number,
    reset_password_otp_expire: Date,

    wish_list: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            product_name: { type: String, required: true },
            product_image: { type: String, required: true },
            product_price: { type: Number, required: true }
        }
    ],
});

module.exports = mongoose.model("User", userSchema);
