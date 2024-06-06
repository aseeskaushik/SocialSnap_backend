const User = require('../models/user');
const Follow = require('../models/follow');

module.exports.addFollowing = async function (req, res) {
    const { userId, followingId } = req.body;

    try {
        // Find the Follow document for the current user
        let userFollowDoc = await Follow.findOne({ user: userId });
        if (!userFollowDoc) {
            userFollowDoc = new Follow({ user: userId });
        }

        // Add followingId to the followings array if not already added
        if (!userFollowDoc.followings.includes(followingId)) {
            userFollowDoc.followings.push(followingId);
            await userFollowDoc.save();
        }

        // Find the Follow document for the user being followed
        let followingUserDoc = await Follow.findOne({ user: followingId });
        if (!followingUserDoc) {
            followingUserDoc = new Follow({ user: followingId });
        }

        // Add userId to the followers array if not already added
        if (!followingUserDoc.followers.includes(userId)) {
            followingUserDoc.followers.push(userId);
            await followingUserDoc.save();
        }

        res.status(200).json({
            success: true,
            message: 'Successfully followed the user.'
        });
    } catch (error) {
        console.error('Error adding following:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports.removeFollowing = async function (req, res) {
    const { userId } = req.body;
    const { followingId } = req.params;

    try {
        // Find the Follow document for the current user
        let userFollowDoc = await Follow.findOne({ user: userId });
        if (userFollowDoc) {
            // Remove followingId from the followings array
            userFollowDoc.followings = userFollowDoc.followings.filter(id => id.toString() !== followingId);
            await userFollowDoc.save();
        }

        // Find the Follow document for the user being unfollowed
        let followingUserDoc = await Follow.findOne({ user: followingId });
        if (followingUserDoc) {
            // Remove userId from the followers array
            followingUserDoc.followers = followingUserDoc.followers.filter(id => id.toString() !== userId);
            await followingUserDoc.save();
        }

        res.status(200).json({
            success: true,
            message: 'Successfully unfollowed the user.'
        });
    } catch (error) {
        console.error('Error removing following:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports.getFollowings = async function (req, res) {
    const { userId } = req.body;

    try {
        // Find the Follow document for the current user and populate the followings array
        const followDoc = await Follow.findOne({ user: userId }).populate({
            path: 'followings',
            select: '_id username fullName userImgUrl'
        });

        // Check if the follow document exists
        if (!followDoc) {
            return res.status(404).json({
                success: false,
                message: 'Follow document not found'
            });
        }

        res.status(200).json({
            success: true,
            followings: followDoc.followings
        });
    } catch (error) {
        console.error('Error getting followings:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


module.exports.getFollowers = async function (req, res) {
    const { userId } = req.body;

    try {
        // Find the Follow document for the current user and populate the followers array
        const followDoc = await Follow.findOne({ user: userId }).populate({
            path: 'followers',
            select: '_id username fullName userImgUrl' // Select the fields you need from the User model
        });

        // Check if the follow document exists
        if (!followDoc) {
            return res.status(404).json({
                success: false,
                message: 'Follow document not found'
            });
        }

        res.status(200).json({
            success: true,
            followers: followDoc.followers
        });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// get suggestions controller
module.exports.getSuggestions = async function (req, res) {
    try {
        const { userId } = req.body;
        const followDoc = await Follow.findOne({ user: userId }).populate('followings');

        const followings = followDoc ? followDoc.followings.map(f => f._id) : [];

        followings.push(userId);

        const suggestedUsers = await User.find({
            _id: { $nin: followings }
        }).limit(6);

        res.status(200).json({
            success: true,
            suggestedUsers: suggestedUsers
        });
    } catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
