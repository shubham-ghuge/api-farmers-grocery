const Farmer = require("../models/farmer.model");
const express = require('express');
const router = express.Router();
const { errorHandler } = require("../utils");
const Product = require("../models/product.model");

const isFarmer = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const checkfarmer = await Farmer.findById(userId);
        if (checkfarmer) {
            return next();
        } else {
            res.json({ success: false, message: "unauthorized access" });
        }
    } catch (error) {
        errorHandler(error, "unauthorized access", 412);
    }
}

const getProductById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(400).json({ success: false, message: "product not found" });
        }
        else {
            req.product = product;
            next();
        }
    } catch (error) {
        errorHandler(error, "could not retrieve product", 400)
    }
}

module.exports = { isFarmer, getProductById }