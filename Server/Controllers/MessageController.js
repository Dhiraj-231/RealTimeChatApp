import Message from "../models/MessageModal.js";

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