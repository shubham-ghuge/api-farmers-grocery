const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String,
    required: 'Product Name is missing'
  },
  description: {
    type: String,
    required: 'Product Description is missing',
    maxlength: 200
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  price: {
    type: Number,
    required: 'Product Price is missing'
  },
  discount: {
    type: Number
  },
  imgUrl: {
    type: String,
    required: 'Product ImageUrl is missing'
  },
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: 'Farmer'
  }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

module.exports = Product;