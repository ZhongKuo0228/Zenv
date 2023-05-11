import express from "express";
import { getPlServices, getWebServices, createProject, deleteProject } from "../controllers/serviceItems.js";
import wrapAsync from "../util/wrapAsync.js";
const serviceItemsRouter = express.Router();
//---router----------------------------------------------
serviceItemsRouter.get("/plServices", wrapAsync(getPlServices));
serviceItemsRouter.get("/webServices", wrapAsync(getWebServices));
serviceItemsRouter.post("/createProject", wrapAsync(createProject));
serviceItemsRouter.delete("/delProject", wrapAsync(deleteProject));

//---export----------------------------------------------
export { serviceItemsRouter };
