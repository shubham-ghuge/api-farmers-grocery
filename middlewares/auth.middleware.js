const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils');

const authHandler = async (req, res, next) => {
    const token = req.headers.autherization;
    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = { userId: decoded.userId };
        return next();
    } catch (error) {
        errorHandler(error, "unauthorized access please add the token", 401);
    }
}
module.exports = { authHandler };