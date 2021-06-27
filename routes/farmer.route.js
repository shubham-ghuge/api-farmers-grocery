const express = require('express');
const { isFarmer, authHandler } = require('../middlewares/auth.middleware');
const Farmer = require('../models/farmer.model');
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

router.route('/order')
    .get(authHandler, isFarmer, async (req, res) => {
        const { userId } = req.user;
        try {
            const { customers } = await Farmer.findById(userId);
            if (customers.length !== 0) {
                const response = []
                for (let i = 0; i < customers.length; i++) {
                    const data = await Order.findOne({ customerId: customers[i] }).populate('customerId products.productId').exec();
                    response.push(data);
                }
                res.json({ success: true, response });
            } else {
                res.json({ success: true, message: 'no orders found' })
            }
        } catch (error) {
            console.log(error);
            res.status(412).json({ success: false, message: "error while retrieving order details" });
        }
    })

module.exports = router;