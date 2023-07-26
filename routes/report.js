const express = require('express');
const {auth1, auth2, analytics} = require('../controller/drive');
const router = express.Router();

router.get('/auth/google', auth1);

router.get('/report', auth2);

router.get('/drive', analytics);

module.exports = router;