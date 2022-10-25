const router = require("express").Router();
const School = require("../models/School");
const Joi = require("@hapi/joi");
const schemaSchool = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    phone: Joi.string().min(9).max(9).required(),
    direction: Joi.string().min(0).max(255).required(),
    students: Joi.array(),
});

router.post("/add", async (req, res) => {
    // validate user
    // console.log(req.body);

    const { error } = schemaSchool.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // hash contraseña
    const newSchool = new School(req.body);
    try {
        const savedSchool = await newSchool.save();
        res.json({
            error: null,
            data: savedSchool,
        });
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/get/byId/:id", async (req, res) => {
    let id = req.params.id;
    try {
        res.json(await School.findOne({ _id: id }));
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/get/all", async (req, res) => {
    try {
        res.json(await School.find());
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put("/edit", async (req, res) => {
    // validate user
    const id = req.body._id;
    const isIdExist = await School.findOne({ _id: id });
    if (!isIdExist) {
        return res.status(400).json({ error: "Colegio inexistente" });
    }
    try {
        let reponse = await School.findOneAndUpdate({ _id: id }, req.body);
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;
