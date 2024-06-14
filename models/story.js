const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaUrl: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;