const AdminUser = require("../Models/AdminUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    const expiry = parseInt(process.env.JWT_EXPIRY);
    try {
        const user = await AdminUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, user);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        } else {
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY)
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + expiry),
                maxAge: expiry,
                sameSite: 'none',
                secure: true,
                httpOnly: true
            }).status(200).json({ message: 'Login successfull', expiresIn: expiry });
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

exports.logoutUser = async(req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).send("user logged out")
    } catch (error) {
        res.status(500).send(error)
    }
}