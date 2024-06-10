const socketIo = require('socket.io');
const Message = require('./models/message');
const Chat = require('./models/chat');

const socketHandler = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173',
        },
    });

    io.on('connection', (socket) => {
        // console.log('New client connected:', socket.id);

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            // console.log(`User joined chat: ${chatId}`);
        });

        socket.on('leaveChat', (chatId) => {
            socket.leave(chatId);
            // console.log(`User left chat: ${chatId}`);
        });

        socket.on('messages/sendmessage', async ({ chatId, message }) => {
            try {
                const newMessage = new Message(message);
                await newMessage.save();

                const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username userImgUrl');
                io.to(chatId).emit('receiveMessage', populatedMessage);

                await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on('disconnect', () => {
            // console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;
