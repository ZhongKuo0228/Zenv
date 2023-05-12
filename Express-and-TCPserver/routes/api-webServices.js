import express from "express";
// import { createExpressProject } from "../controllers/runExpressServer.js";
import {
    checkInfo,
    resetFile,
    getFilesData,
    updateData,
    rewriteFileData,
    allFileOperate,
    allJSOperate,
    allDBOperate,
    receiveLog,
} from "../controllers/webServices.js";
import wrapAsync from "../util/wrapAsync.js";
const expressRouter = express.Router();
//---router----------------------------------------------
expressRouter.post("/checkInfo", wrapAsync(checkInfo));
expressRouter.post("/resetFile", wrapAsync(resetFile));
expressRouter.get("/get", wrapAsync(getFilesData));
expressRouter.post("/update", wrapAsync(updateData));
expressRouter.post("/rewriteFile", wrapAsync(rewriteFileData));
expressRouter.post("/fileOperate", wrapAsync(allFileOperate));
expressRouter.post("/jsOperate", wrapAsync(allJSOperate));
expressRouter.post("/dbOperate", wrapAsync(allDBOperate));
expressRouter.post("/reviceLog", wrapAsync(receiveLog));

//---export----------------------------------------------
export { expressRouter };
