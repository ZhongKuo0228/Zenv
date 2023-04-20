//---MySQL Connect------------------------------------
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

let pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: 3306,
    })
    .promise();

pool.getConnection((err) => {
    if (err) {
        console.log("SQL connecting error");
    } else {
        console.log("SQL connecting success");
    }
});

export default pool;
