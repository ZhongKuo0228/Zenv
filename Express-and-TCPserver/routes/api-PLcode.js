import express from "express";
import { sendCodeToTcpClient } from "../controllers/tcpJob.js";
import { getPLInfo, updateExecTime, saveCode } from "../models/db-PLcode.js";
// import { sendCodeToTcpClient } from "../app.js";
const plCodeRouter = express.Router();
//---router----------------------------------------------

plCodeRouter.post("/getInfo", async (req, res, next) => {
    // console.log(req.body);
    const result = await getPLInfo(req);
    if (result) {
        res.status(200).json({ data: result });
    } else {
        res.status(401).json({ data: "err" });
    }
});

plCodeRouter.post("/run", async (req, res, next) => {
    // console.log(req.body);
    await updateExecTime(req);
    await saveCode(req);
    const result = await sendCodeToTcpClient(req);
    res.status(200).json({ data: result.result });
});

plCodeRouter.post("/save", async (req, res, next) => {
    console.log("save", req.body);
    await saveCode(req);
    res.status(200).json({ data: "存檔成功" });
});
//---export----------------------------------------------
export { plCodeRouter };
