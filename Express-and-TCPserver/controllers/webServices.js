import { updateExpiredTime, updateExecTime } from "../models/db-webServices.js";
import { checkProjectName } from "../models/db-webServices.js";
import { sendToQueue } from "../models/queue.js";
import {
    createExpressProject,
    getFolderIndex,
    readFile,
    rewriteFile,
    fileOperate,
    jsOperate,
    dbOperate,
} from "../controllers/tcpJob.js";

export async function updateExpired(req) {
    try {
        const projectName = req.body.data.projectName;
        const userID = req.user.userID;
        await updateExpiredTime(userID, projectName);
        await updateExecTime(userID, projectName);
    } catch (e) {
        console.error(e);
    }
}
//---For API---------------------------------------------------
export async function checkInfo(req, res) {
    const userId = req.user.userID;
    const projectName = req.body.data;
    const result = await checkProjectName(userId, projectName);
    return res.status(200).json({ data: result });
}

export async function resetFile(req, res) {
    const result = await createExpressProject(req);
    return res.status(200).json({ data: result });
}

export async function getFilesData(req, res) {
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

export async function updateData(req, res) {
    const result = await updateExpired(req);
    return res.status(200).json({ data: result });
}

export async function rewriteFileData(req, res) {
    const result = await rewriteFile(req);
    return res.status(200).json({ data: result });
}

export async function allFileOperate(req, res) {
    const result = await fileOperate(req);
    return res.status(200).json({ data: result });
}

export async function allJSOperate(req, res) {
    const result = await jsOperate(req);
    return res.status(200).json({ data: result });
}

export async function allDBOperate(req, res) {
    const result = await dbOperate(req);
    return res.status(200).json({ data: result });
}

export async function receiveLog(req, res) {
    const logs = req.body;
    const queue = "logSort";
    sendToQueue(queue, logs);
    return res.status(200).json({ message: "Log received successfully." });
}
