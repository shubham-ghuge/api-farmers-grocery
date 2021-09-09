const express = require('express');
const Farmer = require('../models/farmer.model');
const Product = require('../models/product.model');
const router = express.Router();
const { extend } = require('lodash');
const { isFarmer, authHandler } = require('../middlewares/auth.middleware');
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
function removeFields(data, params) {
    params.forEach(i => data[i] = undefined)
    return data;
}
router.route('/profile')
    .get(authHandler, isFarmer, (req, res) => {
        try {
            const { userData } = req;
            removeFields(userData, ['password', 'customers', 'orders', '__v', 'products'])
            res.json({ success: true, response: userData });
        } catch (error) {
            console.log(error)
            res.status(409).json({ success: false, message: "error fetching data" });
        }
    })
    .post(authHandler, isFarmer, async (req, res) => {
        const { userData } = req;
        const data = req.body;
        try {
            const farmer = extend(userData, data)
            await farmer.save();
            res.status(201).json({ success: true, message: "profile updated" });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't update profile" });
        }
    });

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