const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmerProduct = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    isInStock: Boolean
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
    products: [farmerProduct]
});
const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;