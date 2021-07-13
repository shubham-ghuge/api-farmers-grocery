const express = require('express');
const { isFarmer, authHandler } = require('../middlewares/auth.middleware');
const Farmer = require('../models/farmer.model');
const Product = require('../models/product.model');
const Order = require('../models/orders.model');
const router = express.Router();
const { registerUser, loginUser } = require('../services/auth.service');

router.route('/register')
    .post(async (req, res) => {
        registerUser(req, res, Farmer);
    })
router.route('/login')
    .post(async (req, res) => {
        loginUser(req, res, Farmer);
    })
router.route('/products')
    .get(authHandler, isFarmer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Product.find({ farmerId: userId })
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve products" });
        }
    })
router.route('/order')
    .get(authHandler, isFarmer, async (req, res) => {
        const { userId } = req.user;
        try {
            const { orders } = await Farmer.findById(userId).populate({
                path: 'orders', populate: {
                    path: 'addressId'
                }
            });
            res.json({ success: true, orders })
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "error while retrieving order details" });
        }
    })

module.exports = router;