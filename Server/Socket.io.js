import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModal.js";
import Channel from "./models/ChannelModel.js";
const setUpSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    const userSocketMap = new Map();
    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    };

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl
        });
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender",
                "id email firstName lastName image color")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: {
                messages: createdMessage._id
            }
        });
        const channel = await Channel.findById(channelId)
            .populate("members", "id email firstName lastName image color")
            .exec();

        const finalData = { ...messageData._doc, channelId: channel._id };
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memeberSocketId = userSocketMap.get(member._id.toString());
                if (memeberSocketId) {
                    io.to(memeberSocketId).emit("recieve-channel-message", finalData);
                }
            })

        }
        const adminSocket = userSocketMap.get(channel.admin._id.toString());
        if (adminSocket) {
            io.to(adminSocket).emit("recieve-channel-message", finalData);
        }
        io.to(channelId).emit("recieve-channel-message", messageData);

    }



    io.on("connection", (socket) => {
        const { userInfo } = socket.handshake.query;
        userSocketMap.set(userInfo, socket.id); +
            console.log(`User  ${userInfo} connected with socket id ${socket.id}`);
        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("disconnect", () => {
            console.log('User Disconnected with Id : ', socket.id);
            userSocketMap.delete(userInfo);
        });
    });
};

export default setUpSocket;