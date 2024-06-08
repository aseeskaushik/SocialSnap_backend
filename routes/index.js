const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/users', require("./users"));
router.use('/posts', require("./posts"));
// router.use('/reels', require("./reels"));
router.use('/follow', require("./follow"));
// router.use('/messages', require("./messages"));


module.exports = router;
