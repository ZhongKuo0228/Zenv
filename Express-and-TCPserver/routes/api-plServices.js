import express from "express";
import { getInfo, runCode, saveCodeFile } from "../controllers/plServices.js";
import wrapAsync from "../util/wrapAsync.js";
const plServicesRouter = express.Router();
//---router----------------------------------------------
plServicesRouter.post("/getInfo", wrapAsync(getInfo));
plServicesRouter.post("/run", wrapAsync(runCode));
plServicesRouter.post("/save", wrapAsync(saveCodeFile));

//---export----------------------------------------------
export { plServicesRouter };
