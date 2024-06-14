const Message = require('../models/message');
const Chat = require('../models/chat');

module.exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chat: chatId }).populate('sender', 'username userImgUrl');
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


