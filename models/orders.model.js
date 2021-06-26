const mongoose = require('mongoose');
const { Schema } = mongoose;

const productOrderSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number
})

const orderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [productOrderSchema],
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;