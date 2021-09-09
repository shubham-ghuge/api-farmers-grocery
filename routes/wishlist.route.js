const express = require('express');
const Wishlist = require('../models/wishlist.model');
const router = express.Router();
const { authHandler, isCustomer } = require('../middlewares/auth.middleware')

router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { wishlistId } = req.userData;
        try {
            const response = await Wishlist.findById(wishlistId);
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve wishlist data" });
        }
    });

router.route('/:productId')
    .post(authHandler, isCustomer, async (req, res) => {
        const { productId } = req.params;
        const { wishlistId } = req.userData;
        try {
            const { products } = await Wishlist.findById(wishlistId);
            if (products.includes(productId)) {
                res.status(409).json({ success: true, message: "product already exist" });
            } else {
                await Wishlist.findByIdAndUpdate(wishlistId, { $push: { products: productId } })
                res.status(201).json({ success: true, message: "product added in wishlist", productId });
            }
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't add data in wishlist" });
        }
    })
    .delete(authHandler, isCustomer, async (req, res) => {
        const { productId } = req.params;
        const { wishlistId } = req.userData;
        try {
            await Wishlist.findByIdAndUpdate(wishlistId, { $pull: { products: productId } });
            res.status(201).json({ success: true, message: "product removed from wishlist", productId });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't remove data from wishlist" });
        }
    })
module.exports = router;