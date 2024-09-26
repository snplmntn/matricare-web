const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test } = require('../controller/functionController')

router.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PATCH', 'DELETE', 'POST'],
    credentials: true
}));

router.get('/test', test);

module.exports = router;