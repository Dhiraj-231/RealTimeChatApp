import express from "express";
import { SearchContacts } from "../Controllers/ContactController.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";


const router = express.Router();

router.post("/search", verifyToken, SearchContacts);



export default router;