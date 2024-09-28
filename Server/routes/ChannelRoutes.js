import express from "express";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import {
    CreateChannel,
    getChannelMessage,
    getUserChannelDetails
} from "../Controllers/ChannelController.js";

const router = express.Router();
router.post("/create-channel", verifyToken, CreateChannel);
router.get("/get-user-channels", verifyToken, getUserChannelDetails);
router.get("/get-channel-message/:channelId", verifyToken, getChannelMessage);




export default router