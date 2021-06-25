const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsInCart = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
    },
    quantity: Number
});

const cartSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [productsInCart]
});
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;