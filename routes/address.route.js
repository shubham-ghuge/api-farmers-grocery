const express = require('express');
const { authHandler, isCustomer } = require('../middlewares/auth.middleware');
const Address = require('../models/address.model');
const router = express.Router();

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Address.find({ customerId: userId }).lean();
            response.forEach((i) => {
                i.customerId = undefined;
                i.__v = undefined;
            })
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log('error in fetching address data', error);
            res.status(500).json({ success: false, message: 'error in fetching address data' })
        }
    })
    .post(authHandler, isCustomer, async (req, res) => {
        const { userId } = req.user;
        const { address, pincode } = req.body;
        try {
            const response = await Address.create({ address, pincode, customerId: userId });
            console.log(response);
            res.status(201).json({ success: true, message: "address added" });
        } catch (error) {
            console.log('error in adding address data', error);
            res.status(500).json({ success: false, message: 'error in adding address data' })
        }
    })
module.exports = router;