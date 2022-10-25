const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    rut: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    school_id: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    direction: {
        type: String,
        required: true,
        min: 0,
        max: 255,
    },
    proyect_id: {
        type: String,
        required: false,
        min: 0,
        max: 255,
    },
    instrument_id: {
        type: String,
        required: false,
        min: 0,
        max: 255,
    },
});

module.exports = mongoose.model("Student", studentSchema);
