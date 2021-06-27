const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsInCart = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: { type: Number, default: 1 }
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