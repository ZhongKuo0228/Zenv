import express from "express";
// import { createExpressProject } from "../controllers/runExpressServer.js";
import {
    createExpressProject,
    getFolderIndex,
    readFile,
    rewriteFile,
    fileOper,
    jsOper,
    dbOper,
} from "../controllers/tcpJob.js"; //TCP連線衝突問題尚未解決，先都放在runPLcode執行
import { logFormat } from "../models/logAgent/reviceLogAgent.js";
import { updateExpired } from "../controllers/webServices.js";
import { checkProjectName } from "../models/db-webServices.js";
import { sendToQueue } from "../models/queue.js";
const expressRouter = express.Router();
//---router----------------------------------------------
expressRouter.post("/checkInfo", async (req, res, next) => {
    const userId = req.user.userID;
    const projectName = req.body.data;
    const result = await checkProjectName(userId, projectName);
    console.log("check", result);
    if (result) {
        res.status(200).json({ data: result });
    } else {
        res.status(401).json({ data: "err" });
    }
});

expressRouter.post("/resetFile", async (req, res, next) => {
    const result = await createExpressProject(req);
    res.status(200).json({ data: result });
});

expressRouter.get("/get", async (req, res, next) => {
    const job = Object.keys(req.query);
    let result = "";
    if (job == "getFolderIndex") {
        result = await getFolderIndex(req);
        res.status(200).json({ data: result });
    } else if (job == "readFile") {
        result = await readFile(req);
        res.status(200).json({ data: result });
    } else {
        //TODO:其他功能
    }
});

expressRouter.post("/update", async (req, res, next) => {
    const result = await updateExpired(req);
    res.status(200).json({ data: result });
});

expressRouter.post("/rewriteFile", async (req, res, next) => {
    const result = await rewriteFile(req);
    res.status(200).json({ data: result });
});

expressRouter.post("/fileOper", async (req, res, next) => {
    const result = await fileOper(req);
    res.status(200).json({ data: result });
});

expressRouter.post("/jsOper", async (req, res, next) => {
    const result = await jsOper(req);
    console.log("JS", result);
    res.status(200).json({ data: result });
});

expressRouter.post("/dbOper", async (req, res, next) => {
    const result = await dbOper(req);
    console.log("DB", result);
    res.status(200).json({ data: result });
});

expressRouter.post("/reviceLog", async (req, res, next) => {
    const logs = req.body;
    // const result = await logFormat(req);
    console.log("log", logs);

    const queue = "logSort";
    sendToQueue(queue, logs);

    res.status(200).json({ message: "Log received successfully." });
});

//---export----------------------------------------------
export { expressRouter };
