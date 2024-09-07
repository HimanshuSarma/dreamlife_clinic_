const express = require('express');
const Auth = require("../Auth/Auth");

const { sendEmail } = require('../Controlers/EmailController');

const router = express.Router();

router.get('/mail', Auth, sendEmail);

module.exports = router;