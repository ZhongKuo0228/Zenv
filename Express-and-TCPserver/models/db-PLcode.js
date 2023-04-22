//---MySQL Connect------------------------------------
import pool from "../models/DBpool.js";
import { timestamp } from "../util/timestamp.js";
//sql用的async------------------------------------------

async function getServiceItems(id) {
    const [rows] = await pool.query(`SELECT items FROM service_items WHERE id = ?`, [id]);
    return rows[0].items;
}

export async function getPLInfo(req) {
    const userName = req.body.data.userName;
    const projectName = req.body.data.projectName;
    const [rows] = await pool.query(
        `SELECT pls.*, u.id AS user_id
        FROM prog_lang_services pls
        JOIN users u ON pls.user_id = u.id
        WHERE u.user_name = ? AND pls.project_name = ?`,
        [userName, projectName]
    );
    const serviceItem = await getServiceItems(rows[0].service_item);
    rows[0].service_item = serviceItem;

    return rows[0];
}

export async function updateExecTime(req) {
    const projectID = req.body.data.projectID;
    const time = timestamp();
    const [rows] = await pool.query(`UPDATE prog_lang_services SET last_execution = ? WHERE id = ?`, [time, projectID]);
    return rows[0];
}

export async function saveCode(req) {
    const projectID = req.body.data.projectID;
    const editorID = req.body.data.editorID;
    const code = req.body.data.code;
    console.log("save", req.body.data.code);
    const time = timestamp();
    const [rows] = await pool.query(
        `UPDATE prog_lang_services SET edit_code = ? , save_time = ? ,editor = ? WHERE id = ?`,
        [code, time, editorID, projectID]
    );
    return rows[0];
}
