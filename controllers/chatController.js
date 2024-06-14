const Chat = require('../models/chat');

exports.createChat = async (req, res) => {
    try {
        const { userIds, isGroupChat, name } = req.body;
        const chat = new Chat({
            users: userIds,
            isGroupChat,
            name
        });
        await chat.save();
        res.status(201).json({ chat });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create chat' });
    }
};

exports.getChats = async (req, res) => {
    try {
        // console.log(req.body.userId)
        // console.log("dfndfkdfnkdf")
        const chats = await Chat.find({ users: { $in: [req.body.userId] } })
            .populate('users', '_id username userImgUrl fullName lastActive')
            .populate('latestMessage');
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
};
