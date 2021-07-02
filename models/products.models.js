const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Product Name is missing"
  },
  description: {
    type: String,
    required: "Product Description is missing",
    maxlength: 200
  },
  category: {
    type: String,
    required: "Product Category is missing"
  },
  price: {
    type: Number,
    required: "Product Price is missing"
  },
  discount: {
    type: Number
  },
  imgUrl: {
    type: String,
    required: "Product ImageUrl is missing"
  },
  isInCart: Boolean,
  isInBag: Boolean,
  quantity: Number
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

module.exports = Product;