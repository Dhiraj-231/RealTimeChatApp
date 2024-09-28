import express from "express";
import { getAllContacts, getContactsForDmList, SearchContacts } from "../Controllers/ContactController.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";


const router = express.Router();

router.post("/search", verifyToken, SearchContacts);
router.get("/get-contacts-for-dm", verifyToken, getContactsForDmList);
router.get("/get-all-contacts", verifyToken, getAllContacts);



export default router;