const mongoose = require('mongoose');
const { Schema } = mongoose;

const productOrderSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer'
    },
    quantity: { type: Number, default: 1 }
})

const orderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [productOrderSchema],
    addressId: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;