import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import Userrouter from "./routes/AuthRoute.js";
import Contactrouter from "./routes/ContactRoutes.js"
dotenv.config();

const app = express();

app.use("/uploads/profile", express.static("uploads/profile"));

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50Mb' }));
app.use(cookieParser());
app.use("/api/v1/auth", Userrouter);
app.use("/api/v1/contact", Contactrouter);


export default app;