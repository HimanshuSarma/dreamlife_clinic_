const mongoose = require("mongoose");

const dateModel = {
    date: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
}

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    complain: {
        type: String,
        required: true
    },
    visitDate:  {
        type: dateModel,
        required: true,
    },
    medPrescribed: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false,
        default: null,
        unique: true
    }
});

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;