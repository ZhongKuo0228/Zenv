//---MySQL Connect------------------------------------
import pool from "../models/DBpool.js";
import { timestamp } from "../util/timestamp.js";
//sql用的async------------------------------------------
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
