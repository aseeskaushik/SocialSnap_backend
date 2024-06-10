const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const cloudinary = require('../config/cloudinary');

module.exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10; // Adjust as needed

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('user', 'username _id'); // Populate the 'user' field with 'fullName' only

        const totalPosts = await Post.countDocuments();
        const hasMore = totalPosts > page * perPage;

        res.status(200).json({ posts, hasMore, page });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.createPost = async (req, res) => {
    const { caption } = req.body;
    const { file: postFile } = req.files; // Change 'image' to 'file'
    console.log(postFile); // Log the extracted file
    const userId = req.body.userId; // Assuming you have user ID from the authenticated user

    try {
        let mediaUrl;
        let isReel = false;

        if (postFile) { // Change 'image' to 'postFile'
            // Create the temp directory if it doesn't exist
            const tempDir = path.join(__dirname, '..', 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            const filePath = path.join(tempDir, postFile.name); // Change 'imagePath' to 'filePath'

            try {
                // Write the buffer data to a temporary file
                await postFile.mv(filePath); // Change 'image' to 'postFile'

                // Check the file extension or MIME type
                const fileExtension = path.extname(postFile.name).toLowerCase(); // Change 'image' to 'postFile'
                const mimeType = postFile.mimetype.toLowerCase(); // Change 'image' to 'postFile'

                // Set isReel based on file type
                const videoExtensions = ['.mp4', '.mov', '.avi'];
                const videoMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

                if (videoExtensions.includes(fileExtension) || videoMimeTypes.includes(mimeType)) {
                    isReel = true;
                }

                // Upload the temporary file to Cloudinary
                const uploadedFile = await cloudinary.uploader.upload(filePath, {
                    folder: isReel ? 'reels' : 'posts', // Folder to store reels or posts files
                    resource_type: isReel ? 'video' : 'auto', // Type of resource being uploaded
                });

                // Delete the temporary file after uploading
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

        // Create new post
        const newPost = new Post({
            user: userId,
            mediaUrl,
            caption,
            isReel
        });

        // Save new post
        await newPost.save();

        // Populate user information
        await newPost.populate('user', 'username _id');

        // Return created post
        return res.status(201).json({ post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
