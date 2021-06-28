const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(8);

const registerUser = async (req, res, model) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        try {
            const checkEmail = await model.findOne({ email })
            if (!checkEmail) {
                const hashedPassword = bcrypt.hashSync(password, salt);
                await model.create({ name, email, password: hashedPassword });
                res.status(201).json({ success: true, message: 'successfully registered' });
            }
            else {
                res.json({ success: false, message: "email id already exist" })
            }
        }

        catch (error) {
            console.log(error);
            res.status(409).json({ success: false, message: 'error while registration in' });
        }
    }
    else {
        res.status(412).json({ success: false, message: 'insufficient data' })
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
                    res.status(201).json({ success: true, message: "login successful", token, user: user.name })
                } else {
                    res.status(409).json({ success: false, message: "Invalid credentials" })
                }
            } else {
                res.status(401).json({ success: false, message: "User Not Found, please register" });
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({ success: false, message: "error while logging in" })
        }
    } else {
        res.status(412).json({ success: false, message: "insufficient data" })
    }
}

module.exports = { registerUser, loginUser }