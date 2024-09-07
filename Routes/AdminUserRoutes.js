const express = require("express");
const Auth = require("../Auth/Auth");

const router = express.Router();

const { loginUser, logoutUser } = require("../Controlers/UserController");

router.post("/user/login", loginUser);

router.get("/user/check-login", Auth, (req, res) => {
    res.sendStatus(200);
});

router.get("/user/logout", logoutUser);

module.exports = router;