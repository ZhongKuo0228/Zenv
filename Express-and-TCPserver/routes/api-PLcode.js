import express from "express";
import { sendCodeToTcpClient } from "../controllers/runCode.js";
// import { sendCodeToTcpClient } from "../app.js";
const plCodeRouter = express.Router();
//---router----------------------------------------------
plCodeRouter.get("/nodejs", async (req, res, next) => {
    res.status(200).json({ data: "good" });
});
plCodeRouter.post("/nodejs", async (req, res, next) => {
    // const code = req.body.code;
    const userId = "xxx";
    const executeId = "adfasdf";
    const code = 'console.log("hello tcp");';
    sendCodeToTcpClient(userId, executeId, code);
    console.log("api", code);
    res.status(200).json({ data: code });
});
//---export----------------------------------------------
export { plCodeRouter };
