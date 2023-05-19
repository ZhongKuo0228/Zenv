import { plServiceItems, createPLProjects, delPLProjects } from "../models/db-PLcode.js";
import { webServiceItems, createWebProjects, delWebProjects } from "../models/db-webServices.js";
import { delProject } from "./tcpJob.js";

export async function getPlServices(req, res) {
    const result = await plServiceItems();
    res.status(200).json({ data: result });
}

export async function getWebServices(req, res) {
    const result = await webServiceItems();
    res.status(200).json({ data: result });
}

export async function createProject(req, res) {
    let result;
    if (req.body.data.itemsType == "prog_lang") {
        result = await createPLProjects(req);
    } else {
        result = await createWebProjects(req);
    }

    if (result) {
        return res.status(200).json({ data: result });
    } else {
        return res.status(401).json({ data: false });
    }
}
export async function deleteProject(req, res) {
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
}
