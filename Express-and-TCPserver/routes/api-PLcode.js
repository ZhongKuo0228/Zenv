import express from "express";
import { sendCodeToTcpClient } from "../controllers/runCode.js";
// import { sendCodeToTcpClient } from "../app.js";
const plCodeRouter = express.Router();
//---router----------------------------------------------
plCodeRouter.get("/nodejs", async (req, res, next) => {
    res.status(200).json({ data: "good" });
});
plCodeRouter.post("/nodejs", async (req, res, next) => {
    const code = req.body.code;
    const userId = "xxx";
    const executeId = "1234567";
    // const code = 'console.log("hello tcp");';
    const runResult = await sendCodeToTcpClient(userId, executeId, code);
    const result = JSON.parse(runResult.toString()); //buffer轉成JSON格式
    console.log("result", result);

    res.status(200).json({ data: result.result });
});
//---export----------------------------------------------
export { plCodeRouter };
