const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;