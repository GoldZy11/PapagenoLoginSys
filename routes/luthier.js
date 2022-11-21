const router = require("express").Router();
const Luthier = require("../models/Luthier");
const Instrument = require("../models/Instrument");

const Joi = require("@hapi/joi");

const schemaCreateInstrument = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    state: Joi.string().min(2).max(255).required(),
    date: Joi.date().required(),
    phone: Joi.string().min(9).max(255).required(),
    email: Joi.string().min(2).max(255).required(),
    ownerName: Joi.string().min(2).max(255).required(),
    finishDate: Joi.date().required(),
    price: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(2000).required(),
    id_instrument: Joi.string().allow(null, ""),
});

router.post("/add", async (req, res) => {
    // validate user
    const {
        name,
        state,
        date,
        phone,
        email,
        ownerName,
        finishDate,
        price,
        id_instrument,
        description,
    } = req.body;
    const { error } = schemaCreateInstrument.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // hash contraseña
    console.log(req.body);
    if (id_instrument.length == 0) {
        const instrument = new Luthier({
            name,
            state,
            date,
            phone,
            email,
            ownerName,
            finishDate,
            price,
            description,
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
    } else {
        await Instrument.findOneAndUpdate(
            { _id: id_instrument },
            { state: "Lutheria" }
        );
        const instrument = new Luthier({
            name,
            state,
            date,
            phone,
            email,
            ownerName,
            finishDate,
            price,
            id_instrument,
            description,
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
    }
});

router.delete("/remove/:id", async (req, res) => {
    // validate user
    let id = req.params.id;
    const isIdExist = await Luthier.findOne({ _id: id });
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
        res.json(await Luthier.findOne({ _id: id }));
    } catch (error) {
        res.status(400).json({ error });
    }
});
router.get("/get/all", async (req, res) => {
    try {
        res.json(await Luthier.find());
    } catch (error) {
        res.status(400).json({ error });
    }
});
router.get("/get/luthier", async (req, res) => {
    try {
        res.json(
            await (
                await Luthier.find()
            ).filter((instrument) => instrument.type === "Luthier")
        );
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put("/edit", async (req, res) => {
    const { error } = schemaCreateInstrument.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // validate user
    const id = req.body._id;
    console.log(req.body);
    const isIdExist = await Luthier.findOne({ _id: id });
    if (!isIdExist) {
        return res.status(400).json({ error: "Instrumento inexistente" });
    }
    try {
        let reponse = await Luthier.findOneAndUpdate({ _id: id }, req.body);
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
});
module.exports = router;
