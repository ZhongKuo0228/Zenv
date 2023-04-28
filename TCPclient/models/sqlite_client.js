import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import Table from "cli-table3";
import stripAnsi from "strip-ansi";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);

async function runSql(dbPath, sql) {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
    try {
        const result = await db.all(sql);
        return result;
    } catch (error) {
        throw error;
    } finally {
        db.close();
    }
}

export async function sqliteCommand(job) {
    const serverName = job.serverName;
    const command = job.command;
    console.log("command", command);

    const folderPath = path.join(moduleDir, "../express_project/");
    const folderName = serverName;
    const newProjectPath = `${folderPath}${folderName}`;
    const dbPath = `${newProjectPath}/gitFolder/models/default_db.db`;
    console.log("dbPath", dbPath);

    try {
        const result = await runSql(dbPath, command);
        if (result.length === 0) {
            return "Success: Query returned no results.";
        } else {
            const data = [];
            const columns = Object.keys(result[0]);
            data.push(columns);
            for (const row of result) {
                data.push(columns.map((column) => row[column]));
            }
            return data;
        }
    } catch (error) {
        console.error("Error:", error.message);
        return error.message;
    }
}
