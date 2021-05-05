const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const { initialiseDbConnection } = require('./db/connect.db.js');

const productRouter = require('./routes/products.routes.js');

// to open requests from around
app.use(cors())

initialiseDbConnection();

app.use('/products', productRouter);

app.get('/', (req, res) => {
  res.json({ 'Hello From Farmers Grocery!': 'API' })
});

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});