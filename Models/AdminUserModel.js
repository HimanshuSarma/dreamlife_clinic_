const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const adminUser = mongoose.model("Admin", adminUserSchema);

module.exports = adminUser;