const express = require('express');
const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        res.json({ success: true })
    })

module.exports = router;