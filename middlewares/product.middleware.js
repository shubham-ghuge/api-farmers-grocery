const Farmer = require("../models/farmer.model");
const { errorHandler } = require("../utils");

const isFarmer = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const checkfarmer = await Farmer.findById(userId);
        if (checkfarmer) {
            return next();
        } else {
            res.json({ success: false, message: "unauthorized access" });
        }
    } catch (error) {
        errorHandler(error, "unauthorized access", 412);
    }
}
module.exports = { isFarmer }