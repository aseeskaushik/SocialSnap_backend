const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getMessages, sendMessage } = require('../controllers/messageController');
const { getChats, createChat } = require('../controllers/chatController');

// message routes
router.get('/getmessages/:chatId', verifyToken, getMessages);

// chat routes routes
router.get('/getchats', verifyToken, getChats);
router.post('/createchat', verifyToken, createChat);

module.exports = router;
