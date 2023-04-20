//---Modules Setting----------------------------------
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { plCodeRouter } from "./routes/api-PLcode.js";
import { expressRouter } from "./routes/api-express.js";
import { userApiRouter } from "./routes/api-user.js";
import dotenv from "dotenv";
import { websStock } from "./models/webSocket.js";
import { sendLogToWeb } from "./controllers/consumerLogSort.js";
import { userCheck } from "./middleware/userCheck.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
//---router----------------------------------------

app.use("/api/1.0/PLcode", userCheck, plCodeRouter);
app.use("/api/1.0/express", userCheck, expressRouter);
app.use("/api/1.0/user", userApiRouter);

//---listen-----------------------------------------
dotenv.config();

httpServer.listen(process.env.EXPRESS_SERVER_PORT, async () => {
    console.log("Express Server with Socket.io is running!");
    await websStock(httpServer);
});

//---view-------------------------------------------
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", function (req, res, next) {
    res.render("index.ejs");
});

//---other-----------------------------------------
await sendLogToWeb();
