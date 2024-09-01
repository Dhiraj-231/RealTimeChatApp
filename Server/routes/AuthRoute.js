import express from "express";
import {
    addProfileImage,
    getUserInfo,
    loginUser,
    logout,
    registerUser,
    removeProfileImage,
    updateProfile
} from "../Controllers/AuthController.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/profile" });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userInfo", verifyToken, getUserInfo);
router.post("/updateProfile", verifyToken, updateProfile);
router.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
router.delete("/remove-profile-image", verifyToken, removeProfileImage);
router.get("/logout", verifyToken, logout);
export default router;