import express from "express";
// import { createExpressProject } from "../controllers/runExpressServer.js";
import { createExpressProject, getFolderIndex, readFile } from "../controllers/tcpJob.js"; //TCP連線衝突問題尚未解決，先都放在runPLcode執行
const expressRouter = express.Router();
//---router----------------------------------------------
expressRouter.post("/create", async (req, res, next) => {
    const result = await createExpressProject(req);
    res.status(200).json({ data: result });
});

expressRouter.get("/get", async (req, res, next) => {
    console.log("api", req.query);
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

//---export----------------------------------------------
export { expressRouter };
