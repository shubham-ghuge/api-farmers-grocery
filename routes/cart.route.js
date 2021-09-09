const express = require('express');
const router = express.Router();
const { authHandler, isCustomer } = require('../middlewares/auth.middleware');
const Cart = require('../models/cart.model');

router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { cartId } = req.userData;
        try {
            const response = await Cart.findById(cartId);
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve products in cart" });
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { cartId } = req.userData;
        const { userId } = req.user;
        const productDetails = req.body;
        try {
            const { products } = await Cart.findById(cartId);
            const isExistingProduct = products.filter(i => i.productId.toString() === productDetails.productId);
            if (isExistingProduct.length !== 0) {
                const data = await Cart.updateOne({ customerId: userId, products: { $elemMatch: { productId: productDetails.productId } } }, { $set: { "products.$.quantity": productDetails.quantity } });
                console.log(data);
                res.status(201).json({ success: true, message: "quantity updated", productDetails });
            } else {
                await Cart.findByIdAndUpdate(cartId, { $push: { products: productDetails } });
                res.status(201).json({ success: true, message: "product added to cart", productDetails });
            }
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "error while adding product into cart" })
        }
    });

router.route('/:productId')
    .delete(authHandler, isCustomer, async (req, res) => {
        const { cartId } = req.userData;
        const { productId } = req.params;
        try {
            await Cart.findByIdAndUpdate(cartId, { $pull: { products: { productId } } }).exec();
            res.status(201).json({ success: true, message: "product removed from cart", productId });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "error in deleting products from cart" });
        }
    });

module.exports = router;