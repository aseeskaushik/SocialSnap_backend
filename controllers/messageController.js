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

module.exports.sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const message = new Message({
            sender: req.user._id,
            content,
            chat: chatId
        });
        await message.save();

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(201).json({ message: await message.populate('sender', 'username userImgUrl').execPopulate() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};
