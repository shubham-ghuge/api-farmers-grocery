const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsInWishlist = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
    },
    quantity: Number
});

const wishlistSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [productsInWishlist]
});
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;