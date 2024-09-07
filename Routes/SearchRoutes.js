const express = require('express');

const router = express.Router();
const Auth = require('../Auth/Auth');

const { search } = require('../Controlers/SearchController');

router.post('/search', Auth, search);

module.exports = router;