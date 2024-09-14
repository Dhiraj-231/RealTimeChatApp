import express from "express";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import { getMessages } from "../Controllers/MessageController.js";

const router = express.Router();

router.post("/getAllMessages", verifyToken, getMessages);


export default router;