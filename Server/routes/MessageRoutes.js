import express from "express";
import multer from "multer"
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../Controllers/MessageController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/files" })
router.post("/getAllMessages", verifyToken, getMessages);
router.post("/upload-file",
    verifyToken,
    upload.single('file'),
    uploadFile);


export default router;