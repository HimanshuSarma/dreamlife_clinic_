const express = require("express");

const router = express.Router();
const Auth = require("../Auth/Auth");

const {createPatient, getPatient, getSinglePatient, updatePatient, deletePatient}= require("../Controlers/PatientController");

router.post("/patient/create", Auth, createPatient);

router.get("/patient/all", Auth, getPatient);

router.get("/patient/single/:id", Auth, getSinglePatient);

router.put("/patient/update/:id", Auth, updatePatient);

router.delete("/patient/delete/:id", Auth, deletePatient);

module.exports = router;