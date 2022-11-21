const router = require("express").Router();
const Student = require("../models/Student");
const Joi = require("@hapi/joi");
const Instrument = require("../models/Instrument");

const schemaStudent = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    contactNumber: Joi.string().min(6).max(255).required(),
    nameAttorney: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required(),
    rut: Joi.string().min(8).max(9).required(),
    direction: Joi.string().min(6).max(255).required(),
    school_id: Joi.string().min(6).max(255).required(),
    instrument_id: Joi.string(),
    proyect_id: Joi.string().min(0).max(255).required(),
});

router.post("/add", async (req, res) => {
    // validate user
    console.log(req.body);

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
        console.log(await Student.findOne({ _id: id }));
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
router.get("/get/all/withoutProyect", async (req, res) => {
    try {
        res.json(await Student.find({ proyect_id: "" }));
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
    console.log(req.body.instrument_id);
    if (req.body.instrument_id) {
        const exInstrument = await Instrument.findOne({
            _id: isIdExist.instrument_id,
        });
        const instrument = await Instrument.findOne({
            _id: req.body.instrument_id,
        });
        if (!instrument) {
            return res.status(400).json({ error: "Instrumento inexistente" });
        }

        try {
            let { _id, name, type, id_student, __v, description } = instrument;
            let rest = await Instrument.findOneAndUpdate(
                { _id: exInstrument.instrument_id },
                {
                    _id: exInstrument._id,
                    name: exInstrument.name,
                    type: exInstrument.type,
                    id_student: exInstrument.id_student,
                    __v: exInstrument.__v,
                    description: exInstrument.description,
                    state: "Libre",
                }
            );
            let ex = await Instrument.findOneAndUpdate(
                { _id: req.body.instrument_id },
                {
                    _id,
                    name,
                    type,
                    id_student,
                    __v,
                    description,
                    state: "Prestado",
                }
            );
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
    try {
        let reponse = await Student.findOneAndUpdate({ _id: id }, req.body);
        return res.json(reponse);
    } catch (error) {
        return res.status(400).json({ error });
    }
});
module.exports = router;
