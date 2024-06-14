const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/users', require("./users"));
router.use('/posts', require("./posts"));
router.use('/follow', require("./follow"));
router.use('/messages', require("./messages"));
router.use('/story', require("./story"))

module.exports = router;
