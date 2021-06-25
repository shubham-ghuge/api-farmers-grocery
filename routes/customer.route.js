const express = require('express');
const Customer = require('../models/customer.model');
const router = express.Router();
const { registerUser, loginUser } = require('../services/auth.service');

router.route('/register')
    .post(async (req, res) => {
        registerUser(req, res, Customer);
    })
router.route('/login')
    .post(async (req, res) => {
        loginUser(req, res, Customer);
    })

module.exports = router;