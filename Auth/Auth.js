const jwt = require("jsonwebtoken");
const AdminUser = require("../Models/AdminUserModel");

const Auth = async(req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            res.status(400).json({ message: 'Unauthorised. Please login in.' });
        } else {
            const token = req.cookies.jwt;
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!user) {
                res.sendStatus(401);
            } else {
                const rootUser = await AdminUser.findOne({ _id: user._id });
                req.rootUser = rootUser;
                req.token = token;
                next();
            }
        }
    } catch (error) {
        res.status(422).send(`unauthorised ${error}`)
    }
}

module.exports = Auth;