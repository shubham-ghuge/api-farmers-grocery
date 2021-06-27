const express = require('express');
const Wishlist = require('../models/wishlist.model');
const router = express.Router();
const { authHandler, isCustomer } = require('../middlewares/auth.middleware')

router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Wishlist.findOne({ customerId: userId }).populate('products').exec();
            res.status(201).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "can't retrieve wishlist data" });
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { productId } = req.body;
        try {
            const isExistingUser = await Wishlist.findOne({ customerId: userId });
            if (isExistingUser) {
                const { products } = isExistingUser;
                if (products.includes(productId)) {
                    res.json({ success: true, message: "product already exist" });
                } else {
                    await Wishlist.findOneAndUpdate({ customerId: userId }, { $push: { products: productId } })
                    res.status(201).json({ success: true, message: "product added in wishlist" });
                }
            } else {
                await Wishlist.create({ customerId: userId, products: [productId] });
                res.status(201).json({ success: true, message: "product added in wishlist" });
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "can't add data in wishlist" });
        }
    })
    .delete(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { productId } = req.body;
        try {
            const response = await Wishlist.findOneAndUpdate({ customerId: userId }, { $pull: { products: productId } });
            res.json({ success: true, message: "removed product from wishlist", response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "can't remove data from wishlist" });
        }
    })
module.exports = router;