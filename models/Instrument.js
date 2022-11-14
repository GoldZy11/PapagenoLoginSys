const mongoose = require("mongoose");

const instrumentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    type: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    state: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    id_client: {
        type: String,
        required: false,
        min: 0,
        max: 255,
    },
    id_student: {
        type: String,
        required: false,
        min: 0,
        max: 255,
    },
});

module.exports = mongoose.model("Instrument", instrumentSchema);
