const express = require('express');
const { isFarmer, authHandler } = require('../middlewares/auth.middleware');
const Farmer = require('../models/farmer.model');
const router = express.Router();
const { registerUser, loginUser } = require('../services/auth.service');
const { errorHandler } = require('../utils');

router.route('/register')
    .post(async (req, res) => {
        registerUser(req, res, Farmer);
    })
router.route('/login')
    .post(async (req, res) => {
        loginUser(req, res, Farmer);
    })
router.route('/order')
    .get(authHandler, isFarmer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Farmer.findById(userId).populate('orders.customerId').populate('orders.productId').exec();
            res.json({ success: true, response });
        } catch (error) {
            errorHandler(error, "error while retrieving order details", 409);
        }
    })
    .post(authHandler, isFarmer, async (req, res) => {
        const { userId } = req.user;
        const { orderDetails } = req.body;
        try {
            const response = await Farmer.findOneAndUpdate({ _id: userId }, { $push: { orders: orderDetails } });
            res.json({ success: true, response });
        } catch (error) {
            errorHandler(error, "error while placing an order", 500);
        }
    })

module.exports = router;