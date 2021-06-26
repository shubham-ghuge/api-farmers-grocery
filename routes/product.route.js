const express = require('express');
const router = express.Router();
const { extend } = require('lodash');
const Category = require('../models/category.model');
const Farmer = require('../models/farmer.model');
const Product = require('../models/product.model');
const { authHandler } = require('../middlewares/auth.middleware');
const { isFarmer, getProductById } = require('../middlewares/product.middleware');
const { errorHandler } = require('../utils');

router.route('/')
  .get(async (req, res) => {
    const response = await Product.find({}).lean();
    res.json({ status: true, response });
  })
  .post(authHandler, isFarmer, async (req, res) => {
    const { userId } = req.user;
    const data = req.body;
    data.farmerId = userId;
    try {
      const product = await Product.create(data);
      await Farmer.findOneAndUpdate({ _id: userId }, { $push: { products: { productId: product._id, isInStock: true } } }).exec();
      res.json({ success: true, message: "product added" });
    }
    catch (error) {
      errorHandler(error, "error while adding product in db", 412)
    }
  });


router.param('productId', getProductById)

router.route('/:productId')
  .get(async (req, res) => {
    const response = req.product;
    res.status(201).json({ success: true, response });
  })
  .post(authHandler, isFarmer, async (req, res) => {
    const updatedProduct = req.body;
    let { product } = req; /* coming from middleware  */
    try {
      product = extend(product, updatedProduct);
      const response = await product.save()
      res.status(201).json({ success: true, message: "product updated", response });
    } catch (error) {
      errorHandler(error, "error while updating the product data", 409);
    }
  })
  .delete(authHandler, isFarmer, async (req, res) => {
    let { product } = req;
    await product.remove();
    product.deleted = true;
    res.status(201).json({ success: true, product });
  });

router.route('/category')
  .get(async (req, res) => {
    const response = await Category.find({});
    res.status(201).json({ success: true, response });
  })
  .post(authHandler, isFarmer, async (req, res) => {
    const { name } = req.body;
    try {
      const response = await Category.create({ name });
      res.status(201).json({ success: true, message: "category added" });
    } catch (error) {
      errorHandler(error, "error while inserting category", 412);
    }
  });

module.exports = router;