const jwt = require('jsonwebtoken');
const Farmer = require("../models/farmer.model");
const Customer = require('../models/customer.model');

const authHandler = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = { userId: decoded.userId };
        return next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "unauthorized access please add the token" });
    }
}

const isFarmer = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const checkfarmer = await Farmer.findById(userId);
        if (checkfarmer) {
            return next();
        } else {
            res.status(401).json({ success: false, message: "unauthorized access" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "unauthorized access" });
    }
}

const isCustomer = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const checkCustomer = await Customer.findById(userId);
        if (checkCustomer) {
            return next();
        }
        else {
            res.status(401).json({ success: false, message: "unauthorized access" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "unauthorized access" });
    }
}

module.exports = { isCustomer, isFarmer, authHandler };