import { User } from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const CreateChannel = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Admin user not found."
            });
        }
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).json({
                success: false,
                message: "One or more members not found."
            });
        }
        const newChannel = new Channel({
            name,
            members,
            admin: userId
        });
        await newChannel.save();
        return res.status(201).json({
            success: true,
            channel: newChannel,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getUserChannelDetails = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [
                { admin: userId }, { members: userId }
            ]
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            channel: channels,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getChannelMessage = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId).populate({
            path: "messages", populate: {
                path: "sender",
                select: "firstName lastName email _id color image",
                model: "User"
            }
        });

        if (!channel) {
            return response.status(404).json({
                success: false,
                message: "Channel not found"
            })
        }

        return res.status(200).json({
            success: true,
            messages: channel.messages
        })

    } catch (error) {

    }
}