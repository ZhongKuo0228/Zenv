import { sendCodeToTcpClient } from "./tcpJob.js";
import { getPLInfo, updateExecTime, saveCode } from "../models/db-PLcode.js";

export async function getInfo(req, res, next) {
    const result = await getPLInfo(req);
    res.status(200).json({ data: result });
}

export async function runCode(req, res, next) {
    await updateExecTime(req);
    await saveCode(req);
    const result = await sendCodeToTcpClient(req);
    if (result.result) {
        res.status(200).json({ data: result.result });
    } else {
        res.status(200).json({ data: result.error });
    }
}

export async function saveCodeFile(req, res, next) {
    await saveCode(req);
    res.status(200).json({ data: "存檔成功" });
}
