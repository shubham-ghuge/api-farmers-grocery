const express = require('express');
const router = express.Router();
const { authHandler } = require('../middlewares/auth.middleware');
const { isFarmer } = require('../middlewares/product.middleware');
const Category = require('../models/category.model');
const Farmer = require('../models/farmer.model');
const Product = require('../models/product.model');
const { errorHandler } = require('../utils');

router.route('/')
  .get(async (req, res) => {
    const data = await Product.find()
    res.json({ status: true, data });
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
    catch (err) {
      res.send(err);
    }
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