const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils');
const Farmer = require("../models/farmer.model");
const Customer = require('../models/customer.model');

const authHandler = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = { userId: decoded.userId };
        return next();
    } catch (error) {
        errorHandler(error, "unauthorized access please add the token", 401);
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
        errorHandler(error, "unauthorized access", 401);
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
        errorHandler(error, "unauthorized access", 401);
    }
}

module.exports = { isCustomer, isFarmer, authHandler };