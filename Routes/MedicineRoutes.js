const express = require("express");
const Auth = require("../Auth/Auth");

const router = express.Router();

const {
    createMedicineController,
    getMedicine,
    getSingleMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicinesByName,
    getMedicinesWithGivenStocks
} = require("../Controlers/MedicineController");
const { route } = require("./AdminUserRoutes");

router.post(
    "/medicine/create", 
    Auth, 
    createMedicineController.validation,
    createMedicineController.handler
);

router.get("/medicine/all", Auth, getMedicine);

router.get('/medicine/stocks/:stock', Auth, getMedicinesWithGivenStocks);

router.get("/medicine/:name", Auth, getMedicinesByName);

router.get("/medicine/single/:id", Auth, getSingleMedicine);

router.put("/medicine/update/:id", Auth, updateMedicine);

router.delete("/medicine/delete/:id", Auth, deleteMedicine);

module.exports = router