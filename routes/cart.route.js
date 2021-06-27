const express = require('express');
const router = express.Router();
const { authHandler, isCustomer } = require('../middlewares/auth.middleware');
const Cart = require('../models/cart.model');
router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Cart.findOne({ customerId: userId }).populate('products.productId').exec();
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "can't retrieve products in cart" });
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { productDetails } = req.body;
        try {
            const isExistingUser = await Cart.findOne({ customerId: userId });
            if (isExistingUser) {
                const isExistingProduct = await Cart.find({ products: { $elemMatch: { productId: productDetails.productId } } });
                if (isExistingProduct.length !== 0) {
                    await Cart.updateOne({ customerId: userId, products: { $elemMatch: { productId: productDetails.productId } } }, { $set: { "products.$.quantity": productDetails.quantity } });
                    res.json({ success: true, message: "quantity updated" });
                } else {
                    await Cart.findOneAndUpdate({ customerId: userId }, { $push: { products: productDetails } });
                    res.json({ success: true, message: "product added to cart" });
                }
            } else {
                await Cart.create({ customerId: userId, products: [productDetails] });
                res.json({ success: true, message: "product added to cart" });
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while adding product into cart" })
        }
    })
    .delete(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { productId } = req.body;
        try {
            await Cart.findOneAndUpdate({ customerId: userId }, { $pull: { products: { productId } } }).exec();
            res.json({ success: true, message: "product removed from cart" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error in deleting products from cart" });
        }
    })
module.exports = router;