const express = require('express');
const router = express.Router();

const userService = require('../services/users');

/* GET users listing. */
router.get('/', userService.getAllUsers);

router.post('/login', userService.userLogin);

module.exports = router;
