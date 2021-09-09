const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env['stripe_key']);
const router = express.Router();
const { authHandler } = require('../middlewares/auth.middleware')

router.route('/')
    .post(authHandler, async (req, res) => {
        try {
            const { token, amount } = req.body;
            const customer = await stripe.customers.create({ email: token.email, source: token.id });
            const idempotencyKey = Date.now();
            console.log(token,amount)
            const charge = await stripe.charges.create(
                {
                    amount:1000,
                    currency: "inr",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `Purchased the new item`,
                },
                {
                    idempotencyKey
                }
            );
            status = "success";
        } catch (error) {
            console.error("Error:", error);
            status = "failure";
        }

        res.json({ status });
    });
module.exports = router;