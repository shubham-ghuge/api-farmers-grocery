const mongoose = require('mongoose');
const { Schema } = mongoose;


const addressSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    address: String
});
const Address = mongoose.model('Address', addressSchema);
module.exports = Address;