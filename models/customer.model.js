const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowerCase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;