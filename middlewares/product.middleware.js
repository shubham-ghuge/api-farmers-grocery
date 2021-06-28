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
        console.log(error)
        res.status(409).json({ success: false, message: "could not retrieve product" });
    }
}

module.exports = { getProductById }