import { User } from "../models/UserModel.js";
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