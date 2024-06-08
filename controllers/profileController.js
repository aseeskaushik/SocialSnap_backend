const User = require('../models/user');
const Follow = require('../models/follow');

// Fetch user profile by ID
exports.getUserProfile = async (req, res) => {
    const userId = req.params.userId;


    const authenticatedUserId = req.body.userId;

    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followData = await Follow.findOne({ user: userId });
        const authenticatedUserFollowData = await Follow.findOne({ user: authenticatedUserId });

        const isFollowing = authenticatedUserFollowData ? authenticatedUserFollowData.followings.includes(userId) : false;

        const profile = {
            username: user.username,
            fullName: user.fullName,
            bio: user.bio,
            website: user.website,
            gender: user.gender,
            profileImg: user.userImgUrl.url,
            postsCount: 0, // Assume a function to count posts, e.g., await countPosts(userId);
            followersCount: followData ? followData.followers.length : 0,
            followingCount: followData ? followData.followings.length : 0,
            isFollowing
        };

        res.json(profile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};