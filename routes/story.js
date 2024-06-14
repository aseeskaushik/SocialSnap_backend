const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getStories, uploadStory } = require('../controllers/storyController')

router.post('/uploadStory', verifyToken, uploadStory);
router.get('/getStories', getStories);

module.exports = router;