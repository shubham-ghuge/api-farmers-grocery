const { errorHandler } = require("../utils");
const Product = require("../models/product.model");

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

module.exports = {  getProductById }