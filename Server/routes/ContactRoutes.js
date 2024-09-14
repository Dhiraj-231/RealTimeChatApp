import express from "express";
import { getContactsForDmList, SearchContacts } from "../Controllers/ContactController.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";


const router = express.Router();

router.post("/search", verifyToken, SearchContacts);
router.get("/get-contacts-for-dm", verifyToken, getContactsForDmList)



export default router;