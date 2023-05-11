import express from "express";
import { sendToQueue } from "../models/queue.js";
const logRouter = express.Router();
//---router----------------------------------------------
export async function receiveWebServicesLog(req, res, next) {
    const logs = req.body;
    const queue = "logSort";
    sendToQueue(queue, logs);

    res.status(200).json({ message: "Log received successfully." });
}
