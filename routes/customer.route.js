const express = require('express');
const Customer = require('../models/customer.model');
const router = express.Router();
const { registerUser } = require('../services/auth.service');

router.route('/register')
    .post(async (req, res) => {
        registerUser(req, res, Customer);
    })


module.exports = router;