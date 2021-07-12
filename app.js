const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;
const { initialiseDbConnection } = require('./db/connect.db.js');
const productRouter = require('./routes/product.route');
const customerRouter = require('./routes/customer.route');
const farmerRoute = require('./routes/farmer.route');
const orderRoute = require('./routes/order.route');
const cartRoute = require('./routes/cart.route');
const wishlistRoute = require('./routes/wishlist.route');
const addressRoute = require('./routes/address.route');

require('dotenv').config();

app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
initialiseDbConnection();

app.use('/customers', customerRouter);
app.use('/farmers', farmerRoute);
app.use('/products', productRouter);
app.use('/orders', orderRoute);
app.use('/cart', cartRoute);
app.use('/wishlist', wishlistRoute);
app.use('/address', addressRoute);

app.get('/', (req, res) => {
  res.status(200).json({ 'Hello From Farmers Grocery!': 'API' })
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Invalid Route" });
})

app.listen(process.env.PORT || port, () => {
  console.log(`server started at port ${port}`);
});