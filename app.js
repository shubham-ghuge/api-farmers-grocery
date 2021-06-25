const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;
const { initialiseDbConnection } = require('./db/connect.db.js');
const productRouter = require('./routes/product.route');
const customerRouter = require('./routes/customer.route');

app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
initialiseDbConnection();

app.use('/customers', customerRouter);
app.use('/products', productRouter);

app.get('/', (req, res) => {
  res.json({ 'Hello From Farmers Grocery!': 'API' })
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Invalid Route" });
})

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});