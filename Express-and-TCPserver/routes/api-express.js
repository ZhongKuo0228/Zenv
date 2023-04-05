import express from "express";
import { createExpressProject } from "../controllers/runExpressServer.js";
const expressRouter = express.Router();
//---router----------------------------------------------
expressRouter.post("/create", async (req, res, next) => {
    console.log("api", req.body);
    const runResult = await createExpressProject(req);
    // const result = JSON.parse(runResult.toString()); //buffer轉成JSON格式
    // console.log("result", result);

    // res.status(200).json({ data: result.result });
});
//---export----------------------------------------------
export { expressRouter };
