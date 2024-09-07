const mongoose = require("mongoose");

const ConnectDB = async() => {
    const url = process.env.MONGO_CONNECTION_URI;
    try {
        return await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(`cannot connect ${error}`);
    }
}

module.exports = ConnectDB;