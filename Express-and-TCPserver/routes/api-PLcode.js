import express from "express";
import { sendCodeToTcpClient } from "../controllers/tcpJob.js";
// import { sendCodeToTcpClient } from "../app.js";
const plCodeRouter = express.Router();
//---router----------------------------------------------
plCodeRouter.get("/nodejs", async (req, res, next) => {
    res.status(200).json({ data: "good" });
});
plCodeRouter.post("/run", async (req, res, next) => {
    // console.log(req.body);
    const result = await sendCodeToTcpClient(req);
    res.status(200).json({ data: result.result });
});

plCodeRouter.post("/save", async (req, res, next) => {
    const commit = req.body;
    console.log(commit);
});
//---export----------------------------------------------
export { plCodeRouter };
