import express from "express";
import { plServiceItems, createPLProjects, delPLProjects } from "../models/db-PLcode.js";
import { webServiceItems, createWebProjects, delWebProjects } from "../models/db-webServices.js";
import { delProject, checkWorkerStats } from "../controllers/tcpJob.js";
const serviceItemsRouter = express.Router();
//---router----------------------------------------------
serviceItemsRouter.get("/plServices", async (req, res, next) => {
    const result = await plServiceItems();
    res.status(200).json({ data: result });
});

serviceItemsRouter.get("/webServices", async (req, res, next) => {
    const result = await webServiceItems();
    res.status(200).json({ data: result });
});

serviceItemsRouter.post("/createProject", async (req, res, next) => {
    // console.log(req.body);

    let result;
    if (req.body.data.itemsType == "prog_lang") {
        result = await createPLProjects(req);
    } else {
        const workersStats = await checkWorkerStats();
        console.log("workersStats", workersStats);
        // result = await createWebProjects(req);
    }

    // if (result) {
    //     return res.status(200).json({ data: result });
    // } else {
    //     return res.status(401).json({ data: false });
    // }
});
serviceItemsRouter.delete("/delProject", async (req, res, next) => {
    // console.log(req.body);
    let result;
    if (req.body.data.itemsType == "prog_lang") {
        result = await delPLProjects(req);
    } else {
        await delProject(req);
        result = await delWebProjects(req);
    }

    if (result) {
        return res.status(200).json({ data: result });
    } else {
        return res.status(401).json({ data: false });
    }
});
//---export----------------------------------------------
export { serviceItemsRouter };
