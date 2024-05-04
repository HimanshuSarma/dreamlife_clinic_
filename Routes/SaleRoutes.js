const express = require('express');
const Auth = require('../Auth/Auth');
const { createSale, updateProductInSale, getSalesForReqdYear, getSalesForReqdYearAndMonth, deleteSale } = require('../Controlers/SaleController');

const router = express.Router();

router.post('/sales/create', Auth, createSale);
router.put('/sales/products/:saleID/:productID', Auth, updateProductInSale);
router.get('/sales/year/:year', Auth, getSalesForReqdYear);
router.get('/sales/year-month/:year/:month', Auth, getSalesForReqdYearAndMonth);
router.delete('/sales/delete/:id', Auth, deleteSale);

module.exports = router;