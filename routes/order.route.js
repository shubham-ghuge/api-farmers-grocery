const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');
const { errorHandler } = require('../utils');
const { authHandler, isCustomer } = require('../middlewares/auth.middleware');

router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Order.findOne({ customerId: userId }).populate('products.productId').exec();
            res.json({ success: true, response });
        } catch (error) {
            errorHandler(error, "can't retrieve orders at this moment", 400);
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { products } = req.body;
        try {
            const isExistingUser = await Order.findOne({ customerId: userId })
            if (!isExistingUser) {
                const response = await Order.create({ customerId: userId, products });
                res.status(201).json({ success: true, message: 'order successfully placed' });
            } else {
                const response = await Order.findOneAndUpdate({ customerId: userId }, { $push: { products } });
                res.json({ success: true, message: 'order successfully placed' });
            }
        } catch (error) {
            errorHandler(error, "can't place order, try again", 400)
        }
    })

module.exports = router;