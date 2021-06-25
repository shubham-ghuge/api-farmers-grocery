const express = require('express');
const Farmer = require('../models/farmer.model');
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

module.exports = router;