const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({
        error: null,
        user: req.user,
        token: req.token,
    });
});

module.exports = router;
