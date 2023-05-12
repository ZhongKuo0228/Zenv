//---Modules Setting----------------------------------
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { plServicesRouter } from "./routes/api-plServices.js";
import { expressRouter } from "./routes/api-webServices.js";
import { userApiRouter } from "./routes/api-user.js";
import { receiveWebServicesLogRouter } from "./routes/api-receiveWebServicesLog.js";
import { serviceItemsRouter } from "./routes/api-serviceItems.js";
import dotenv from "dotenv";
import { websSocket } from "./models/webSocket.js";
import { sendLogToWeb } from "./controllers/consumerLogSort.js";
import { userCheck } from "./middleware/userCheck.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
//---router----------------------------------------

app.use("/api/1.0/PLcode", userCheck, plServicesRouter);
app.use("/api/1.0/webServices", userCheck, expressRouter);
app.use("/api/1.0/user", userApiRouter);
app.use("/api/1.0/serviceItems", userCheck, serviceItemsRouter);
app.use("/api/1.0/log", receiveWebServicesLogRouter);

//---listen-----------------------------------------
dotenv.config();

httpServer.listen(process.env.EXPRESS_SERVER_PORT, async () => {
    console.log("Express Server with Socket.io is running!");
    await websSocket(httpServer);
});

//---view-------------------------------------------
app.use("/healthCheck", function (req, res) {
    return res.status(200).json({ data: "OK" });
});

//---other-----------------------------------------
await sendLogToWeb();
