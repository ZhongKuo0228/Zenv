import { sendToQueue } from "../models/queue.js";

//---router----------------------------------------------
export async function receiveWebServicesLog(req, res) {
    const logs = req.body;
    const queue = "logSort";
    sendToQueue(queue, logs);

    res.status(200).json({ message: "Log received successfully." });
}
