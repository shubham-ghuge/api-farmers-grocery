const express = require('express');
const Customer = require('../models/customer.model');
const router = express.Router();
const { authHandler, isCustomer } = require('../middlewares/auth.middleware')
const { registerUser, loginUser } = require('../services/auth.service');
const Address = require('../models/address.model');

router.route('/register')
    .post(async (req, res) => {
        registerUser(req, res, Customer, 'Customer');
    })
router.route('/login')
    .post(async (req, res) => {
        loginUser(req, res, Customer);
    })
router.route('/address')
    .get(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Address.findOne({ customerId: userId });
            res.status(201).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve address" });
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { addressData } = req.body;
        try {
            const isExistingUser = await Address.findOne({ customerId: userId });
            if (isExistingUser) {
                await Address.findOneAndUpdate({ customerId: userId }, { $push: { address: addressData } })
                res.status(201).json({ success: true, message: "address successfully added" });
            } else {
                await Address.create({ customerId: userId, address: [addressData] });
                res.status(201).json({ success: true, message: "address successfully added" });
            }
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't retrieve address" });
        }
    })
    .delete(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { addressData } = req.body;
        try {
            await Address.findOneAndUpdate({ customerId: userId }, { $pull: { address: addressData } });
            res.status(201).json({ success: true, message: "address deleted" });
        } catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: "can't remove address" });
        }
    })
module.exports = router;