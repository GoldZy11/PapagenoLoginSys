const router = require("express").Router();
const Proyect = require("../models/Proyect");
const Joi = require("@hapi/joi");

const schemaProyect = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    location: Joi.string().min(6).max(255).required(),
    teacherManager: Joi.string().min(6).max(255).required(),
    id_school: Joi.string(),
    students: Joi.array(),
});

router.post("/add", async (req, res) => {
    // validate user
    // console.log(req.body);

    const { error } = schemaProyect.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // hash contraseña
    const newProyect = new Proyect(req.body);
    try {
        const savedProyect = await newProyect.save();
        res.json({
            error: null,
            data: savedProyect,
        });
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.delete("/remove/:id", async (req, res) => {
    // validate user
    let id = req.params.id;
    const isIdExist = await Proyect.findOne({ _id: id });
    if (isIdExist === null)
        return res.status(400).json({ error: "Proyecto inexistente" });
    // hash contraseña
    try {
        let reponse = await isIdExist.delete();
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/get/byId/:id", async (req, res) => {
    let id = req.params.id;
    try {
        res.json(await Proyect.findOne({ _id: id }));
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/get/all", async (req, res) => {
    try {
        res.json(await Proyect.find());
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put("/edit", async (req, res) => {
    // validate user
    const id = req.body._id;
    const isIdExist = await Proyect.findOne({ _id: id });
    if (!isIdExist) {
        return res.status(400).json({ error: "Proyecto inexistente" });
    }
    try {
        let reponse = await Proyect.findOneAndUpdate({ _id: id }, req.body);
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
});
module.exports = router;
