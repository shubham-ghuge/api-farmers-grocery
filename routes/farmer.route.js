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
            const { customers } = await Farmer.findById(userId);
            if (customers.length !== 0) {
                const response = []
                for (let i = 0; i < customers.length; i++) {
                    const data = await Order.findOne({ customerId: customers[i] }).populate('customerId products.productId').exec();
                    data.customerId.password = undefined;
                    data.customerId.__v = undefined;
                    response.push(data);
                }
                res.status(200).json({ success: true, response });
            } else {
                res.status(204).json({ success: true, message: 'no orders found' })
            }
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "error while retrieving order details" });
        }
    })

module.exports = router;