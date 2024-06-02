const express = require('express');
const router = express.Router();
const { isNewUser, register, login } = require('../controllers/usersController')


router.post('/isnewuser', isNewUser);
router.post('/register', register);
router.post('/isnewuser', login);

module.exports = router;
