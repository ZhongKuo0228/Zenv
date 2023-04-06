import express from "express";
// import { createExpressProject } from "../controllers/runExpressServer.js";
import { createExpressProject, getFolderIndex } from "../controllers/tcpJob.js"; //TCP連線衝突問題尚未解決，先都放在runPLcode執行
const expressRouter = express.Router();
//---router----------------------------------------------
expressRouter.post("/create", async (req, res, next) => {
    console.log("api", req.body);
    const result = await createExpressProject(req);
    res.status(200).json({ data: result });
});

expressRouter.get("/get", async (req, res, next) => {
    const job = Object.keys(req.query);
    let result = "";
    if (job == "getFolderIndex") {
        result = await getFolderIndex(req);
    } else {
        //TODO:其他功能
    }

    // const runResult = await createExpressProject(req);
    // const result = JSON.parse(runResult.toString()); //buffer轉成JSON格式
    // console.log("result", result);

    // res.status(200).json({ data: result });
});

//---export----------------------------------------------
export { expressRouter };
