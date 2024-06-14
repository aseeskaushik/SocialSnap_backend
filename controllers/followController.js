const User = require('../models/user');
const Follow = require('../models/follow');

module.exports.addFollowing = async function (req, res) {
    const { followingId } = req.body;
    const userId = req.body.userId;

    try {
        if (!userId || !followingId) {
            return res.status(400).json({
                success: false,
                message: 'userId and followingId are required'
            });
        }

        let userFollowDoc = await Follow.findOne({ user: userId });
        if (!userFollowDoc) {
            userFollowDoc = new Follow({ user: userId, followers: [], followings: [] });
        }

        if (!userFollowDoc.followings.includes(followingId)) {
            userFollowDoc.followings.push(followingId);
        }
        await userFollowDoc.save();

        let followingUserDoc = await Follow.findOne({ user: followingId });
        if (!followingUserDoc) {
            followingUserDoc = new Follow({ user: followingId, followers: [], followings: [] });
        }

        if (!followingUserDoc.followers.includes(userId)) {
            followingUserDoc.followers.push(userId);
        }
        await followingUserDoc.save();

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
        let userFollowDoc = await Follow.findOne({ user: userId });
        if (userFollowDoc) {
            userFollowDoc.followings = userFollowDoc.followings.filter(id => id.toString() !== followingId);
            await userFollowDoc.save();
        }

        let followingUserDoc = await Follow.findOne({ user: followingId });
        if (followingUserDoc) {
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
    const { Id } = req.params;
    console.log('Props:', Id)

    try {
        const followDoc = await Follow.findOne({ user: Id }).populate('followings');
        if (!followDoc) {
            return res.status(404).json({
                success: false,
                message: 'No followings found for this user.'
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
    const { Id } = req.params;

    try {
        const followDoc = await Follow.findOne({ user: Id }).populate('followers');
        if (!followDoc) {
            return res.status(404).json({
                success: false,
                message: 'No followers found for this user.'
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

module.exports.getSuggestions = async function (req, res) {
    try {
        const { userId } = req.body;
        const followDoc = await Follow.findOne({ user: userId }).populate('followings');

        const followings = followDoc ? followDoc.followings.map(f => f._id) : [];

        followings.push(userId);

        const suggestedUsers = await User.find({
            _id: { $nin: followings }
        }).limit(5);

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