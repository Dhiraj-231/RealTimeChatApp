import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModal.js";
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
    io.on("connection", (socket) => {
        const { userInfo } = socket.handshake.query;
        userSocketMap.set(userInfo, socket.id); +
            console.log(`User  ${userInfo} connected with socket id ${socket.id}`);
        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => {
            console.log('User Disconnected with Id : ', socket.id);
            userSocketMap.delete(userInfo);
        });
    });
};

export default setUpSocket;