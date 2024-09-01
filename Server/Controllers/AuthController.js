import { response } from "express";
import { User } from "../models/UserModel.js";
import { renameSync, unlinkSync } from "fs";
export const registerUser = async (req, res, next) => {

    try {
        const { email, password, confirmPassword } = req.body
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                sucess: false,
                message: "All fields are required"
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                sucess: false,
                message: "Passwords do not match"
            });
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                sucess: false,
                message: "User already exists"
            });
        }
        const user = await User.create({
            email,
            password
        });
        return res
            .status(201)
            .json({
                success: true,
                content: {
                    data: {
                        id: user._id,
                        email: user.email,
                        profileSetUp: user.profileSetUp
                    },
                }
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const loginUser = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const existUser = await User.findOne({ email }).select("+password");
        if (!existUser) {
            return res.status(400).json({
                success: false,
                message: "User not exist with this email"
            });
        }

        const isMatch = await existUser.isPasswordMatched(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password or email is Incorrect"
            })
        }
        const token = existUser.generateAccessToken();

        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }).json({
            success: true,
            message: `Welcome back ${existUser?.firstName?.charAt(0)?.toUpperCase() + existUser?.firstName?.slice(1)}!`,
            content: {
                data: {
                    id: existUser._id,
                    email: existUser.email,
                    profileSetUp: existUser.profileSetUp,
                    firstName: existUser.firstName,
                    lastName: existUser.lastName,
                    color: existUser.color,
                    image: existUser.image
                },
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getUserInfo = async (req, res, next) => {
    try {

        const user = await User.findById(req.userId).select("-password -__v");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            content: {
                data: user
            }

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetUp: true }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            content: {
                data: user
            }

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return response.status(400).json({
                success: false,
                message: "File not found"
            })
        }
        const date = Date.now();
        let fileName = "uploads/profile/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);
        const updatedUser = await User.findByIdAndUpdate(req.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );
        return res.status(200).json({
            image: updatedUser.image
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.image) {
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile image removed successfully"

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const logout = async (req, res, next) => {
    try {
        res
            .status(200) // Set status code to 200
            .cookie("token", "", { // Clear token cookie
                expires: new Date(Date.now()), // Set expiry date to now
                httpOnly: false, // Enable cookie to be accessible from JS
                secure: false, // Disable secure cookie
            })
            .json({ // Send json response
                success: true, // Set success to true
                message: "Logout Successfully....", // Set message
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}