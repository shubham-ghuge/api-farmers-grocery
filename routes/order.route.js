const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');
const Cart = require('../models/cart.model');
const { authHandler, isCustomer } = require('../middlewares/auth.middleware');
const { checkFarmer } = require('../middlewares/order.middleware');
const Farmer = require('../models/farmer.model');
const Customer = require('../models/customer.model');

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Order.find({ customerId: userId }).populate('addressId');
            response.forEach((i) => {
                i.customerId = undefined;
                i.__v = undefined;
            })
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve orders at this moment" });
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { _id, cartId } = req.userData;
        const { addressId } = req.body;
        try {
            const { products } = await Cart.findById(cartId);
            const response = await Order.create({ customerId: _id, products, addressId, paymentStatus:true, deliveryStatus: false });
            await Customer.findByIdAndUpdate(_id, { $push: { orders: response._id } }); 
            const farmerIds = new Set(products.map(i => i.farmerId));
            farmerIds.forEach(async (i) => {
                await Farmer.findByIdAndUpdate(i, { $push: { orders: response._id } })
            });
            await Cart.findByIdAndUpdate(cartId, { $set: { products: [] } });
            res.status(201).json({ success: true, message: 'order successfully placed', orderId: response._id });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't place order, try again" })
        }
    });

router.route('/:orderId')
    .get(authHandler, async (req, res) => {
        const { orderId } = req.params;
        try {
            const response = await Order.findById(orderId).populate('products.productId').exec();
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "error while placing order" })
        }
    })

router.param('farmerId', checkFarmer);
router.route('/:farmerId')
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { farmerId } = req.params;
        try {
            const response = await Farmer.findByIdAndUpdate({ _id: farmerId }, { $push: { customers: userId } });
            res.status(201).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "error while placing order" })
        }
    })

module.exports = router;