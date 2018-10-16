const express = require('express');
const router = express.Router();

const messageService = require('../services/messages');


router.get('/order', messageService.orderMessage);
router.get('/notification', messageService.notificationMessage);

module.exports = router;