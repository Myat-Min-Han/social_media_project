const express = require('express');
const router = express.Router();
const notisController = require('../controller/notisController');
const { auth } = require('../middleware/auth')

//api/notis
router.get('', auth, notisController.getNotis);
router.put('/read', auth, notisController.readNotis);
router.put('/read/:id', auth,  notisController.readNotiWithId);

module.exports = { notisRouter: router}