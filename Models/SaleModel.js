const mongoose = require('mongoose');
const moment = require('moment');

const saleProduct = mongoose.Schema({
    name: {
        type: String,
        ref: 'Medicine',
        required: true
    },
    costPrice: { type: Number, required: false },
    sellingPrice: { type: Number, required: false },
    discount: { type: mongoose.Types.Decimal128, required: true },
    profit: { type: Number, required: true },
    qty: { type: Number, required: true }
})

const Sale = mongoose.Schema({
    products: [{type: saleProduct, required: true}],
    custPhone: { type: Number, required: false },
    createdAt: {
        year: { type: Number, required: true },
        month: { type: Number, required: true },
        date: { type: Number, required: true }
    }
})


const SaleSchema = mongoose.model('Sale', Sale);
module.exports = SaleSchema;