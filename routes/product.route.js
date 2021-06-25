const express = require('express');
const router = express.Router();

const Product = require('../models/product.model')

router.route('/')
  .get(async (req, res) => {
    const data = await Product.find()
    res.json({ status: true, data });
  })
  .post(async (req, res) => {
    const data = req.body;
    try {
      const newProduct = new Product(data);
      const savedData = await newProduct.save();
      res.send(savedData);
    }
    catch (err) {
      res.send(err);
    }
  })

module.exports = router;