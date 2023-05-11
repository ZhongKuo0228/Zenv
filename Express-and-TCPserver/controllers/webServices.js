import { updateExpiredTime, updateExecTime } from "../models/db-webServices.js";
import { checkProjectName } from "../models/db-webServices.js";
import { sendToQueue } from "../models/queue.js";
import {
    createExpressProject,
    getFolderIndex,
    readFile,
    rewriteFile,
    fileOper,
    jsOper,
    dbOper,
} from "../controllers/tcpJob.js";

export async function updateExpired(req) {
    try {
        const projectName = req.body.data.projectName;
        const userID = req.user.userI;
        await updateExpiredTime(userID, projectName);
        await updateExecTime(userID, projectName);
    } catch (e) {
        console.error(e);
    }
}
//---For API---------------------------------------------------
export async function checkInfo(req, res, next) {
    const userId = req.user.userID;
    const projectName = req.body.data;
    const result = await checkProjectName(userId, projectName);
    return res.status(200).json({ data: result });
}

export async function resetFile(req, res, next) {
    const result = await createExpressProject(req);
    return res.status(200).json({ data: result });
}

export async function getFilesData(req, res, next) {
    const job = Object.keys(req.query);
    let result = "";
    if (job == "getFolderIndex") {
        result = await getFolderIndex(req);
        return res.status(200).json({ data: result });
    }

    if (job == "readFile") {
        result = await readFile(req);
        return res.status(200).json({ data: result });
    }
}

export async function updateData(req, res, next) {
    const result = await updateExpired(req);
    return res.status(200).json({ data: result });
}

export async function rewriteFileData(req, res, next) {
    const result = await rewriteFile(req);
    return res.status(200).json({ data: result });
}

export async function fileOperate(req, res, next) {
    const result = await fileOper(req);
    return res.status(200).json({ data: result });
}

export async function jsOperate(req, res, next) {
    const result = await jsOper(req);
    return res.status(200).json({ data: result });
}

export async function dbOperate(req, res, next) {
    const result = await dbOper(req);
    return res.status(200).json({ data: result });
}

export async function receiveLog(req, res, next) {
    const logs = req.body;
    const queue = "logSort";
    sendToQueue(queue, logs);
    return res.status(200).json({ message: "Log received successfully." });
}
