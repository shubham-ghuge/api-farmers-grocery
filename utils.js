const errorHandler = (error, message = "no message defines", statusCode) => {
    console.log(message, error);
    res.status(statusCode).json({ success: false, message })
}

module.exports = { errorHandler }