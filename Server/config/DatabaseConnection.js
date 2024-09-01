import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Db connected successfully..");
    } catch (error) {
        console.log(error.message);
    }
}