import Message from "../models/MessageModal.js";
import { mkdirSync, renameSync } from "fs";
export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId
        const user2 = req.body.id;
        if (!user1 || !user2) {
            res.status(400).json({
                success: false,
                message: "Both user ID's are required..."
            })
        }
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 }, { sender: user2, recipient: user1 }
            ]
        }).sort({ timeStamp: 1 });
        res.status(200).json({
            success: true,
            messages
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}

export const uploadFile = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file found"
            })
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`
        mkdirSync(fileDir, { recursive: true });
        renameSync(req.file.path, fileName);
        res.status(200).json({
            success: true,
            filePath: fileName
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}