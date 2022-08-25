const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({
        error: null,
        title: "mi ruta protegida",
        user: req.user,
        token: req.token,
    });
});

module.exports = router;
