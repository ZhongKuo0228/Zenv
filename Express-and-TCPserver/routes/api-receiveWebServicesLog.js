import express from "express";
import { receiveWebServicesLog } from "../controllers/receiveWebServicesLog.js";
import wrapAsync from "../util/wrapAsync.js";
const receiveWebServicesLogRouter = express.Router();
//---router----------------------------------------------
receiveWebServicesLogRouter.post("/receive-log", wrapAsync(receiveWebServicesLog));

//---export----------------------------------------------
export { receiveWebServicesLogRouter };
