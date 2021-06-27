const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;