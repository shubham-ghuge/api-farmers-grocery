const { errorHandler } = require('../utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(8);

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
        errorHandler(error, 'error while registration in', 412);
    }
}

const loginUser = async (req, res, model) => {
    const { email, password } = req.body;
    if (email && password) {
        try {
            const user = await model.findOne({ email });
            if (user) {
                const checkPassword = bcrypt.compareSync(password, user.password);
                if (checkPassword) {
                    const token = jwt.sign({ userId: user._id }, process.env.secret_key, { expiresIn: '24h' });
                    res.status(200).json({ success: true, message: "login successful", token, user: user.name })
                } else {
                    res.status(409).json({ success: false, message: "Invalid credentials" })
                }
            } else {
                res.json({ success: false, message: "User Not Found, please register" });
            }
        } catch (error) {
            errorHandler(error, "error while logging in", 412)
        }
    } else {
        res.status(412).json({ success: false, message: "insufficient data" })
    }
}

module.exports = { registerUser, loginUser }