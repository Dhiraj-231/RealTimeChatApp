import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import Userrouter from "./routes/AuthRoute.js";
import Contactrouter from "./routes/ContactRoutes.js"
import Messagerouter from "./routes/MessageRoutes.js"
import ChannelRouter from "./routes/ChannelRoutes.js"
dotenv.config();

const app = express();



app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization', "Accept"],
    credentials: true
}));
app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50Mb' }));
app.use(cookieParser());
app.use("/api/v1/auth", Userrouter);
app.use("/api/v1/contact", Contactrouter);
app.use("/api/v1/message", Messagerouter);
app.use("/api/v1/Channel", ChannelRouter);


export default app;