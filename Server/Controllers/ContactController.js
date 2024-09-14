import mongoose from "mongoose";
import { User } from "../models/UserModel.js";
import Message from "../models/MessageModal.js"
export const SearchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            res.status(400).json({
                success: false,
                message: "Search value must be Passed.."
            })
        }
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, 'i');
        const contacts = await User.find({
            $and: [
                {
                    _id: { $ne: req.userId }
                },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                }
            ],
        });
        res.status(200).json({
            success: true,
            contacts
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}

export const getContactsForDmList = async (req, res, next) => {
    try {
        let { userId } = req;
        if (!userId) return res.status(400).send("User Id not found in the request")
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: {
                    timestamp: -1
                }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: {
                                $eq: ["$sender", userId]
                            },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: {
                        $first: "$timestamp"
                    },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])
        res.status(200).json({
            success: true,
            contacts
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}