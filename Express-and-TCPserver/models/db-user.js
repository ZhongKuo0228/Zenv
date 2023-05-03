//---MySQL Connect------------------------------------
import pool from "../models/DBpool.js";
//sql用的async------------------------------------------
export async function checkEmail(email) {
    try {
        const [rows] = await pool.query(`SELECT provider FROM users WHERE email = ?`, [email]);
        // console.log(rows[0].provider);
        if (rows.length == 0) {
            return;
        } else if (rows[0].provider == "native") {
            const err = "nativeExisted";
            return err;
        }
    } catch (e) {
        console.error(e);
    }
}
export async function checkName(name) {
    try {
        const [rows] = await pool.query(`SELECT provider FROM users WHERE user_name = ?`, [name]);
        // console.log(rows[0].provider);
        if (rows.length == 0) {
            return;
        } else if (rows[0].provider == "native") {
            const err = "nativeExisted";
            return err;
        }
    } catch (e) {
        console.error(e);
    }
}

export async function getUserID(userName) {
    try {
        const [rows] = await pool.query(`SELECT id FROM users WHERE user_name = ?`, [userName]);
        return rows[0];
    } catch (e) {
        console.error(e);
    }
}

export async function checkUserTable(email) {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return rows[0];
        // console.log(rows.length);
    } catch (e) {
        console.error(e);
    }
}

export async function searchEmail(email) {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return rows;
        // console.log(rows.length);
    } catch (e) {
        console.error(e);
    }
}

export async function searchPassword(email) {
    try {
        const [rows] = await pool.query(`SELECT password FROM users WHERE email = ?`, [email]);
        // console.log(rows[0].password);
        return rows[0].password;
    } catch (e) {
        console.error(e);
    }
}

export async function createUserData(email, password, name, time) {
    try {
        const [result] = await pool.query(
            `INSERT INTO users(email,password,user_name,provider,role,create_time) VALUES(?,?,?,"native","user",?)`,
            [email, password, name, time]
        );
        return result.insertID;
    } catch (e) {
        console.error(e);
    }
}

export async function checkSignIn(email, password) {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ? AND password = ? `, [email, password]);
        return rows;
    } catch (e) {
        console.error(e);
    }
}

// export async function checkRole(roleID) {
//     const [rows] = await pool.query(`SELECT * FROM roles WHERE id = ?`, [role]);
//     return rows[0];
//     // console.log(rows.length);
// }
