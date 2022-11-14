const mongoose = require("mongoose");

const proyectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    location: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    teacherManager: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    students: {
        type: Array,
        required: true,
    },
    id_school: {
        type: String,
        required: false,
        min: 6,
        max: 255,
    },
});

module.exports = mongoose.model("Proyect", proyectSchema);
