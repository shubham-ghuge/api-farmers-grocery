const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowerCase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    wishlistId: {
        type: Schema.Types.ObjectId,
        ref: 'Wishlist'
    },
    addressId: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;