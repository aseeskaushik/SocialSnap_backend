const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { isNewUser, register, login, getUserDetails } = require('../controllers/usersController');

router.post('/isnewuser', isNewUser);
router.post('/register', register);
router.post('/login', login);
router.post('/getuser', verifyToken, getUserDetails);

module.exports = router;
