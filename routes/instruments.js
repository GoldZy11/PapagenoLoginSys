const router = require("express").Router();
const Instrument = require("../models/Instrument");
const Joi = require("@hapi/joi");

const schemaCreateInstrument = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    type: Joi.string().min(2).max(255).required(),
    state: Joi.string().min(2).max(1024).required(),
    description: Joi.string().min(2).max(1024).required(),
    id_student: Joi.string().min(0).max(1024),
    date: Joi.date(),
});

router.post("/add", async (req, res) => {
    // validate user
    // console.log(req.body);

    const { error } = schemaCreateInstrument.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // hash contraseña
    const instrument = new Instrument({
        name: req.body.name,
        type: req.body.type,
        state: req.body.state,
        description: req.body.description,
        id_student: "",
        id_client: "",
    });
    try {
        const savedInstrument = await instrument.save();
        res.json({
            error: null,
            data: savedInstrument,
        });
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.delete("/remove/:id", async (req, res) => {
    // validate user
    let id = req.params.id;
    const isIdExist = await Instrument.findOne({ _id: id });
    if (isIdExist === null)
        return res.status(400).json({ error: "Id inexistente" });
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
        res.json(await Instrument.findOne({ _id: id }));
    } catch (error) {
        res.status(400).json({ error });
    }
});
router.get("/get/all", async (req, res) => {
    try {
        res.json(await Instrument.find());
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/get/free", async (req, res) => {
    try {
        res.json(
            await (
                await Instrument.find()
            ).filter((instrument) => instrument.state === "Libre")
        );
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put("/edit", async (req, res) => {
    // const { error } = schemaCreateInstrument.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ error: error.details[0].message });
    // }
    // validate user
    const id = req.body._id;
    console.log(req.body);
    const isIdExist = await Instrument.findOne({ _id: id });
    if (!isIdExist) {
        return res.status(400).json({ error: "Instrumento inexistente" });
    }
    try {
        let reponse = await Instrument.findOneAndUpdate({ _id: id }, req.body);
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
});
module.exports = router;
