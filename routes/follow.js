const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getSuggestions, addFollowing, getFollowers, getFollowings, removeFollowing } = require('../controllers/followController');

router.post('/addfollowing', verifyToken, addFollowing);
router.delete('/removefollowing/:followingId', verifyToken, removeFollowing);
router.get('/getfollowings/:Id', getFollowings);
router.get('/getfollowers/:Id', getFollowers);

// suggestions route
router.get('/getsuggestions', verifyToken, getSuggestions);

module.exports = router;
