const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());

const Product = require('../models/products.models')

router.route('/')
  .get(async (req, res) => {
    const data = await Product.find()
    res.json({status:true,data});
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      data.isInCart = false;
      data.isInBag = false;
      data.quantity = 1;
      const newProduct = new Product(data);
      const savedData = await newProduct.save();
      res.send(savedData);
    }
    catch (err) {
      res.send(err);
    }
  })

module.exports = router;