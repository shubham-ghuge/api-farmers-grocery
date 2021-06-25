const mongoose = require('mongoose');
async function initialiseDbConnection() {
  try {
    await mongoose.connect(
      process.env['mongodb_uri'], { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    console.log("DB connected")
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { initialiseDbConnection };