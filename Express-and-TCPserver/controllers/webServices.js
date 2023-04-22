import { updateExpiredTime } from "../models/db-webServices.js";
import { getUserID } from "../models/db-user.js";

export async function updateExpired(req) {
    const userName = req.body.data.userName;
    const projectName = req.body.data.projectName;
    const userID = await getUserID(userName);
    await updateExpiredTime(userID, projectName);
}
