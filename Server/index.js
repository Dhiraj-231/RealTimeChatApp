import app from "./app.js";
import dotenv from "dotenv";
import { databaseConnection } from "./config/DatabaseConnection.js";
import setUpSocket from "./Socket.io.js";

dotenv.config();

databaseConnection();
const server = app.listen(process.env.PORT || 8500, () => {
    console.log(`server is running on port ${process.env.PORT}`)
});

setUpSocket(server);