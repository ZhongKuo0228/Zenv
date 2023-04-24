import express from "express";
import { sendToQueue } from "../models/queue.js";
const logRouter = express.Router();
//---router----------------------------------------------
logRouter.post("/reviceLog", async (req, res, next) => {
    const logs = req.body;
    // const result = await logFormat(req);
    console.log("log", logs);

    const queue = "logSort";
    sendToQueue(queue, logs);

    res.status(200).json({ message: "Log received successfully." });
});
//---export----------------------------------------------
export { logRouter };
