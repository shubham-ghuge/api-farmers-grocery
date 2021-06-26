const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');
const { authHandler, isCustomer } = require('../middlewares/auth.middleware');
const { checkFarmer } = require('../middlewares/order.middleware');
const Farmer = require('../models/farmer.model');

router.route('/')
    .get(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Order.findOne({ customerId: userId }).populate('products.productId').exec();
            res.json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(412).json({ success: false, message: "can't retrieve orders at this moment" });
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
            console.log(error);
            res.status(412).json({ success: false, message: "can't place order, try again" })
        }
    })

router.param('farmerId', checkFarmer);
router.route('/:farmerId')
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { farmerId } = req.params;
        try {
            const response = await Farmer.findByIdAndUpdate({ _id: farmerId }, { $push: { customers: userId } });
            res.json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(412).json({ success: false, message: "error while placing order" })
        }
    })

module.exports = router;