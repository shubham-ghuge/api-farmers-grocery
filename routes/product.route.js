const express = require('express');
const router = express.Router();
const { extend } = require('lodash');
const Category = require('../models/category.model');
const Farmer = require('../models/farmer.model');
const Product = require('../models/product.model');
const { authHandler, isFarmer } = require('../middlewares/auth.middleware');
const { getProductById } = require('../middlewares/product.middleware');

router.route('/')
  .get(async (req, res) => {
    const response = await Product.find({}).lean();
    res.status(200).json({ status: true, response });
  })
  .post(authHandler, isFarmer, async (req, res) => {
    const { userId } = req.user;
    const data = req.body;
    data.farmerId = userId;
    try {
      const product = await Product.create(data);
      await Farmer.findOneAndUpdate({ _id: userId }, { $push: { products: { productId: product._id, isInStock: true } } }).exec();
      res.status(201).json({ success: true, message: "product added" });
    }
    catch (error) {
      console.log(error);
      res.status(409).json({ success: false, message: "error while adding product in db" })
    }
  });

router.route('/category')
  .get(async (req, res) => {
    try {
      const response = await Category.find({});
      res.status(200).json({ success: true, response });
    } catch (error) {
      console.log(error);
      res.status(409).json({ success: false, message: "can't retrieve categories" });
    }
  })
  .post(authHandler, isFarmer, async (req, res) => {
    const { name } = req.body;
    try {
      await Category.create({ name });
      res.status(201).json({ success: true, message: "category added" });
    } catch (error) {
      console.log(error);
      res.status(409).json({ success: false, message: "error while inserting category" });
    }
  });

router.param('productId', getProductById)

router.route('/:productId')
  .get(async (req, res) => {
    const response = req.product;
    res.status(200).json({ success: true, response });
  })
  .post(authHandler, isFarmer, async (req, res) => {
    const updatedProduct = req.body;
    let { product } = req; /* coming from middleware  */
    try {
      product = extend(product, updatedProduct);
      const response = await product.save();
      res.status(201).json({ success: true, message: "product updated", response });
    } catch (error) {
      console.log(error);
      res.status(409).json({ success: false, message: "error while updating the product data" });
    }
  })
  .delete(authHandler, isFarmer, async (req, res) => {
    let { product } = req;
    await product.remove();
    product.deleted = true;
    res.status(201).json({ success: true, product });
  });


module.exports = router;