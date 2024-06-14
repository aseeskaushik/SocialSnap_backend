const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Nature lover 🌿 | Outdoor explorer 🏞️"
    },
    website: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'prefer not to say'],
        default: 'prefer not to say'
    },
    userImgUrl: {
        public_id: {
            type: String,
            //   required: true,
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/do9iye8wa/image/upload/v1717740281/avatars/bsab0qskwyfaruw6nqu7.jpg'
        },
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
