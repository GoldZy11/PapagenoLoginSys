const { number } = require("@hapi/joi");
const mongoose = require("mongoose");

const instrumentSchema = mongoose.Schema({
    name: {
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
    date: {
        type: Date,
        // timestamps: true,
    },
    phone: {
        type: String,
        min: 9,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    ownerName: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    price: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    description: {
        type: String,
        required: true,
        min: 2,
        max: 2000,
    },
    finishDate: {
        type: Date,
        // timestamps: true,
    },
    instrumentId: {
        type: String,
        required: false,
        min: 2,
        max: 255,
    },
});

module.exports = mongoose.model("Luthier", instrumentSchema);
