const express = require('express');
const Wishlist = require('../models/wishlist.model');
const router = express.Router();
const { authHandler, isCustomer } = require('../middlewares/auth.middleware')

router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Wishlist.findOne({ customerId: userId });
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve wishlist data" });
        }
    });

router.route('/:productId')
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { productId } = req.params;
        try {
            const { products } = await Wishlist.findOne({ customerId: userId });
            if (products.includes(productId)) {
                res.status(409).json({ success: true, message: "product already exist" });
            } else {
                await Wishlist.findOneAndUpdate({ customerId: userId }, { $push: { products: productId } })
                res.status(201).json({ success: true, message: "product added in wishlist", productId });
            }
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't add data in wishlist" });
        }
    })
    .delete(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { productId } = req.params;
        try {
            await Wishlist.findOneAndUpdate({ customerId: userId }, { $pull: { products: productId } });
            res.status(201).json({ success: true, message: "product removed from wishlist", productId });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't remove data from wishlist" });
        }
    })
module.exports = router;