//---MySQL Connect------------------------------------
import pool from "../models/DBpool.js";
import { timestamp } from "../util/timestamp.js";
//sql用的async------------------------------------------

export async function plServiceItems() {
    //做unit test
    try {
        const [rows] = await pool.query(`SELECT * FROM service_items WHERE service_type = "prog_lang" `);
        return rows;
    } catch (e) {
        console.error(e);
    }
}

async function getServiceItems(id) {
    try {
        const [rows] = await pool.query(`SELECT items FROM service_items WHERE id = ?`, [id]);
        return rows[0].items;
    } catch (e) {
        console.error(e);
    }
}

async function getServiceItemID(items) {
    try {
        const [rows] = await pool.query(`SELECT * FROM service_items WHERE items  = ?`, [items]);
        return rows[0].id;
    } catch (e) {
        console.error(e);
    }
}

async function checkProjectName(userId, projectName) {
    try {
        const [rows] = await pool.query(`SELECT * FROM prog_lang_services WHERE user_id = ? AND project_name = ?`, [
            userId,
            projectName,
        ]);
        return rows;
    } catch (e) {
        console.error(e);
    }
}

export async function getPLInfo(req) {
    try {
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
    } catch (e) {
        return false;
    }
}

export async function updateExecTime(req) {
    try {
        const projectID = req.body.data.projectID;
        const time = timestamp();
        const [rows] = await pool.query(`UPDATE prog_lang_services SET last_execution = ? WHERE id = ?`, [
            time,
            projectID,
        ]);
        return rows[0];
    } catch (e) {
        console.error(e);
    }
}

export async function saveCode(req) {
    try {
        const projectID = req.body.data.projectID;
        const editorID = req.body.data.editorID;
        const code = req.body.data.code;
        const time = timestamp();
        const [rows] = await pool.query(
            `UPDATE prog_lang_services SET edit_code = ? , save_time = ? ,editor = ? WHERE id = ?`,
            [code, time, editorID, projectID]
        );
        return rows[0];
    } catch (e) {
        console.error(e);
    }
}

export async function getUserPLProjects(userId) {
    try {
        const [rows] = await pool.query(
            `SELECT pls.*, si.items
    FROM prog_lang_services pls
    JOIN service_items si ON pls.service_item = si.id
    WHERE pls.user_id = ?`,
            [userId]
        );
        return rows;
    } catch (e) {
        console.error(e);
    }
}

export async function createPLProjects(req) {
    try {
        const userID = req.user.userID;
        const serviceItem = req.body.data.serviceItem;
        const projectName = req.body.data.projectName;
        const checkProject = await checkProjectName(userID, projectName);
        if (checkProject.length === 0) {
            const createTime = timestamp();
            const itemsID = await getServiceItemID(serviceItem);
            const [rows] = await pool.query(
                `INSERT INTO prog_lang_services (user_id, project_name, service_item,  create_time ) VALUES (?, ?, ?, ?)`,
                [userID, projectName, itemsID, createTime]
            );
            return rows.insertId;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
    }
}
export async function delPLProjects(req) {
    try {
        const userID = req.user.userID;
        const projectName = req.body.data.projectName;
        const checkProject = await checkProjectName(userID, projectName);
        if (checkProject.length > 0) {
            const itemsID = checkProject[0].service_item;
            const [rows] = await pool.query(
                `DELETE FROM prog_lang_services WHERE user_id = ? AND project_name = ? AND service_item = ?`,
                [userID, projectName, itemsID]
            );
            return rows;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
    }
}
