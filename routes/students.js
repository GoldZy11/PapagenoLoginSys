const router = require("express").Router();
const Student = require("../models/Student");
const Joi = require("@hapi/joi");

const schemaStudent = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    rut: Joi.string().min(8).max(9).required(),
    direction: Joi.string().min(6).max(255).required(),
    school_id: Joi.string().min(6).max(255).required(),
    instrument_id: Joi.string(),
    proyect_id: Joi.string(),
});

router.post("/add", async (req, res) => {
    // validate user
    // console.log(req.body);

    const { error } = schemaStudent.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // hash contraseña
    const newStudent = new Student(req.body);
    try {
        const savedStudent = await newStudent.save();
        res.json({
            error: null,
            data: savedStudent,
        });
    } catch (error) {
        res.status(400).json({ error });
    }
});
router.delete("/remove/:id", async (req, res) => {
    // validate user
    let id = req.params.id;
    const isIdExist = await Student.findOne({ _id: id });
    if (isIdExist === null)
        return res.status(400).json({ error: "Alumno inexistente" });
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
        res.json(await Student.findOne({ _id: id }));
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/get/all", async (req, res) => {
    try {
        res.json(await Student.find());
    } catch (error) {
        res.status(400).json({ error });
    }
});
router.put("/edit", async (req, res) => {
    // validate user
    const id = req.body._id;
    const isIdExist = await Student.findOne({ _id: id });
    if (!isIdExist) {
        return res.status(400).json({ error: "Estudiante inexistente" });
    }
    try {
        let reponse = await Student.findOneAndUpdate({ _id: id }, req.body);
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
});
module.exports = router;
