const mongoose = require('mongoose');
require('dotenv').config();

async function initialiseDbConnection() {
  await mongoose.connect(
    process.env['mongodb_uri'], { useUnifiedTopology: true, useNewUrlParser: true })
    .then(console.log('Mongo DB connected'))
    .catch(err => console.log("error in mongodb connection", err));
}

module.exports = { initialiseDbConnection };