const mongoose = require("mongoose");

const schoolSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    phone: {
        type: String,
        required: true,
        min: 9,
        max: 9,
    },
    direction: {
        type: String,
        required: true,
        min: 0,
        max: 255,
    },
    students: {
        type: Array,
    },
});

module.exports = mongoose.model("School", schoolSchema);
