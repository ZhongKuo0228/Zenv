import express from "express";
import { getPlServices, getWebServices, createProject, deleteProject } from "../controllers/serviceItems.js";
import wrapAsync from "../util/wrapAsync.js";
const serviceItemsRouter = express.Router();
//---router----------------------------------------------
serviceItemsRouter.get("/pl-services", wrapAsync(getPlServices));
serviceItemsRouter.get("/web-services", wrapAsync(getWebServices));
serviceItemsRouter.post("/create-project", wrapAsync(createProject));
serviceItemsRouter.delete("/del-project", wrapAsync(deleteProject));

//---export----------------------------------------------
export { serviceItemsRouter };
