// controllers/storyController.js
const Story = require('../models/story');
const Follow = require('../models/follow');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');


exports.getStories = async (req, res) => {
    const { userId } = req.query;
    console.log(userId)
    try {
        const following = await Follow.findOne({ user: userId }).populate('followings');
        const userStories = await Story.find({ user: userId }).populate('user', 'username userImgUrl');
        const followingStories = await Story.find({ user: { $in: following.followings } }).populate('user', 'username userImgUrl');

        // Combine user's stories and following users' stories
        const stories = [...userStories, ...followingStories];

        console.log(stories)
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.uploadStory = async (req, res) => {
    const { userId } = req.body;
    const { file: storyFile } = req.files;

    try {
        let mediaUrl;
        let mediaType;

        if (storyFile) {
            const tempDir = path.join(__dirname, '..', 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            const filePath = path.join(tempDir, storyFile.name);

            try {
                await storyFile.mv(filePath);

                const fileExtension = path.extname(storyFile.name).toLowerCase();
                const mimeType = storyFile.mimetype.toLowerCase();

                const videoExtensions = ['.mp4', '.mov', '.avi'];
                const videoMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

                if (videoExtensions.includes(fileExtension) || videoMimeTypes.includes(mimeType)) {
                    mediaType = 'video';
                } else {
                    mediaType = 'image';
                }

                const uploadedFile = await cloudinary.uploader.upload(filePath, {
                    folder: 'stories',
                    resource_type: mediaType === 'video' ? 'video' : 'auto',
                });

                fs.unlinkSync(filePath);

                mediaUrl = {
                    public_id: uploadedFile.public_id,
                    url: uploadedFile.url
                };
            } catch (error) {
                console.error("Error uploading file:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        }

        const newStory = new Story({
            user: userId,
            mediaUrl,
            mediaType
        });

        await newStory.save();

        await newStory.populate('user', 'username fullName');
        console.log(newStory);
        return res.status(201).json({ story: newStory });
    } catch (error) {
        console.error("Error uploading story:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};