require('dotenv').config();

const sales = require('../Data/sales');
const ConnectDB = require('../DB/connection');
const SaleSchema = require('../Models/SaleModel');

const seedData = async() => {
    for (let i = 0; i < sales.length; i++) {
        const newSale = new SaleSchema(sales[i]);
        await newSale.save();
    }

    console.log('Data uploaded');
}

try {
    ConnectDB()
        .then(() => {
            console.log('Connected to database');
            seedData();
        })
} catch (err) {
    console.log(err);
}