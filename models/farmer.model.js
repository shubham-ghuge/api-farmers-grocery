const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmerProductSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    isInStock: Boolean
})

const farmerOrderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
})

const farmerSchema = new Schema({
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
    products: [farmerProductSchema],
    orders: [farmerOrderSchema]
});
const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;