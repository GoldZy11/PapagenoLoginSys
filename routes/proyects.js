const router = require("express").Router();
const Proyect = require("../models/Proyect");
const Student = require("../models/Student");
const Joi = require("@hapi/joi");
const User = require("../models/User");
const School = require("../models/School");
const Instrument = require("../models/Instrument");

const schemaProyect = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    location: Joi.string().min(6).max(255).required(),
    teacherManager: Joi.string().min(2).max(255).required(),
    teacherAttendee: Joi.string().min(2).max(255),
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
        let {
            _id,
            name,
            location,
            teacherManager,
            id_school,
            teacherAttendee,
        } = await Proyect.findOne({ _id: id });
        let teacherManagerName = await User.findOne({ _id: teacherManager });
        let teacherAttendeeName = await User.findOne({ _id: teacherAttendee });

        let studentsInProyect = await Student.find({ proyect_id: id });
        let students = [];
        for (const studentReq of studentsInProyect) {
            let schoolInStudent = await School.findOne({
                _id: studentReq.school_id,
            });
            if (studentReq.instrument_id != undefined) {
                let instrumentInStudent = await Instrument.findOne({
                    _id: studentReq.instrument_id,
                });
                var studentObj = {
                    name: studentReq.name,
                    rut: studentReq.rut,
                    direction: studentReq.direction,
                    _id: studentReq._id,
                    instrument: instrumentInStudent,
                    school: schoolInStudent,
                };
                students.push(studentObj);
            } else {
                var studentObj = {
                    name: studentReq.name,
                    rut: studentReq.rut,
                    direction: studentReq.direction,
                    _id: studentReq._id,
                    instrument: "No tiene instrumento",
                    school: schoolInStudent,
                };
                students.push(studentObj);
            }
        }

        if (teacherAttendeeName != null) {
            res.json({
                _id,
                name,
                location,
                teacherManager: teacherManagerName.name,
                teacherAttendee: teacherAttendeeName.name,
                id_school,
                students: students,
            });
        }
        res.json({
            _id,
            name,
            location,
            teacherManager: teacherManagerName.name,
            // teacherAttendee: teacherAttendeeName.name,
            id_school,
            students: students,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

router.get("/get/all", async (req, res) => {
    try {
        let allProyects = await Proyect.find();
        let allResponse = [];
        for (const proyect of allProyects) {
            let {
                _id,
                name,
                location,
                teacherManager,
                id_school,
                teacherAttendee,
            } = proyect;

            let studentsInProyect = await Student.find({ proyect_id: _id });

            let teacherManagerName = await User.findOne({
                _id: teacherManager,
            });
            let teacherAsisName = await User.findOne({
                _id: teacherAttendee,
            });

            if (teacherAsisName != null) {
                allResponse.push({
                    _id,
                    name,
                    location,
                    teacherManager: teacherManagerName.name,
                    teacherAttendee: teacherAsisName.name,
                    id_school,
                    students: studentsInProyect,
                });
            }
            allResponse.push({
                _id,
                name,
                location,
                teacherManager: teacherManagerName.name,
                // teacherAttendee: teacherAsisName.name,
                id_school,
                students: studentsInProyect,
            });
        }

        res.json(allResponse);
    } catch (error) {
        console.log(error);
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
