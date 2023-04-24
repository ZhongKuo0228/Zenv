//---MySQL Connect------------------------------------
import pool from "../models/DBpool.js";
import { timestamp } from "../util/timestamp.js";
//sql用的async------------------------------------------

export async function webServiceItems() {
    const [rows] = await pool.query(`SELECT * FROM service_items WHERE service_type = "web" `);
    return rows;
}

export async function getUserName(userId) {
    const [rows] = await pool.query(`SELECT user_name FROM users WHERE id = ?`, [userId]);
    return rows[0];
}
export async function getServiceID(item) {
    const [rows] = await pool.query(`SELECT id FROM service_items WHERE items  = ?`, [item]);
    return rows[0];
}
// export async function DBcreateService(userId, webServices, projectName) {
//     const userName = await getUserName(userId);
//     const serviceID = await getServiceID(webServices);
//     const createTime = timestamp();
//     const expired_time = new Date(new Date(createTime).getTime() + 7 * 24 * 60 * 60 * 1000);
//     const [rows] = await pool.query(``, [id]);
//     return rows[0].items;
// }

// export async function getWebInfo(userId, webServices, projectName) {
//     const userName = await getUserName(userId);
//     const serviceID = await getServiceID(webServices);
//     const createTime = timestamp();
//     const expired_time = new Date(new Date(createTime).getTime() + 7 * 24 * 60 * 60 * 1000);
//     const [rows] = await pool.query(``, [id]);
//     return rows[0].items;
// }

export async function updateExpiredTime(userId, projectName) {
    const nowTime = timestamp();
    const expired_time = new Date(new Date(nowTime).getTime() + 7 * 24 * 60 * 60 * 1000);
    const [rows] = await pool.query(
        `UPDATE web_services SET expired_time  = ? WHERE user_id = ? AND project_name = ?`,
        [expired_time, userId, projectName]
    );
    return rows[0];
}

export async function updateExecTime(userId, projectName) {
    const nowTime = timestamp();
    const [rows] = await pool.query(
        `UPDATE web_services SET start_execution  = ? WHERE user_id = ? AND project_name = ?`,
        [nowTime, userId, projectName]
    );
    console.log("nowTime", rows);
    return rows[0];
}

export async function getUserWebProjects(userId) {
    const [rows] = await pool.query(
        `SELECT ws.*, si.items
    FROM web_services ws
    JOIN service_items si ON ws.service_item = si.id
    WHERE ws.user_id = ?`,
        [userId]
    );
    return rows;
}

async function getServiceItemID(items) {
    const [rows] = await pool.query(`SELECT * FROM service_items WHERE items  = ?`, [items]);
    return rows[0].id;
}

export async function checkProjectName(userId, projectName) {
    try {
        const [rows] = await pool.query(`SELECT * FROM web_services WHERE user_id = ? AND project_name = ?`, [
            userId,
            projectName,
        ]);
        return rows;
    } catch {
        return false;
    }
}
export async function createWebProjects(req) {
    const userID = req.user.userID;
    const serviceItem = req.body.data.serviceItem;
    const projectName = req.body.data.projectName;
    const checkProject = await checkProjectName(userID, projectName);

    if (checkProject.length === 0) {
        const createTime = timestamp();
        const itemsID = await getServiceItemID(serviceItem);
        const expired_time = new Date(new Date(createTime).getTime() + 7 * 24 * 60 * 60 * 1000);
        const [rows] = await pool.query(
            `INSERT INTO web_services (user_id, project_name, service_item,  create_time,expired_time ) VALUES (?, ?, ?, ?,?)`,
            [userID, projectName, itemsID, createTime, expired_time]
        );
        return rows.insertId;
    } else {
        return false;
    }
}
