import { updateExpiredTime, updateExecTime } from "../models/db-webServices.js";
import { getUserID } from "../models/db-user.js";

export async function updateExpired(req) {
    const projectName = req.body.data.projectName;
    const userID = req.user.userID;
    await updateExpiredTime(userID, projectName);
    await updateExecTime(userID, projectName);
}
