const Farmer = require("../models/farmer.model")

const checkFarmer = async (req, res, next, id) => {
    try {
        const isValidId = await Farmer.findById(id);
        if (isValidId) {
            return next();
        } else {
            res.json({ success: false, message: "not valid farmer id" })
        }
    } catch (error) {
        console.log(error)
        res.status(412).json({ success: false, message: "error in validating farmer" });
    }
}
module.exports = { checkFarmer };