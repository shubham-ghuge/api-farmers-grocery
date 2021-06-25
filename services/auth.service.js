const { errorHandler } = require('../utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSalt(8);

const registerUser = async (req, res, model) => {
    const { name, email, password } = req.body;
    try {
        if (name && email && password) {
            const checkEmail = await model.findOne({ email })
            if (!checkEmail) {
                const hashedPassword = bcrypt.hashSync(password, salt);
                const response = await model.create({ name, email, password: hashedPassword });
                res.status(401).json({ success: true, message: 'successfully registered' });
            }
            else {
                res.json({ success: false, message: "email id already exist" })
            }
        }
        else {
            res.json({ success: false, message: 'insufficient data' })
        }

    } catch (error) {
        errorHandler(error, 'error while registration in', 500);
    }
}

module.exports = { registerUser }