import { exec } from "child_process";
import { writeFile, mkdir, unlink, readdir, stat } from "node:fs/promises";
import path from "path";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
import { createNodeJSDockerfile, createDockerComposeFile } from "./express_container.js";
import socket from "../tcp-client.js";

//從github拉資料下來
function downloadRepo(path, gitUrl) {
    //下載到專案資料中
    const downloadCommend = `git clone ${gitUrl} ${path}`;
    const child = exec(downloadCommend);
    child.stdout.on("data", async (data) => {
        console.log(`git clone 結果: ${data}`);
    });
}

async function listFiles(folderPath) {
    const files = await readdir(folderPath);
    const result = { name: path.basename(folderPath), isDirectory: true, children: [] };
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await stat(filePath);
        if (stats.isDirectory()) {
            result.children.push(await listFiles(filePath));
        } else {
            result.children.push({ name: file, isDirectory: false });
        }
    }
    return result;
}

//創立專案後，創立資料夾
export async function createFolder(job) {
    try {
        const userId = job.userId;
        const projectName = job.projectName;
        const gitUrl = job.gitRepoUrl;
        //專案資料夾創立
        const folderPath = path.join(moduleDir, "../express_project/");
        const folderName = `${userId}_${projectName}`;
        const newProjectPath = `${folderPath}${folderName}`;
        const gitFolderPath = `${newProjectPath}/gitFolder`;

        await mkdir(newProjectPath);
        await mkdir(gitFolderPath);

        downloadRepo(gitFolderPath, gitUrl);
        console.log(`專案:${folderName}建立完成、git資料下載完成`);

        await createNodeJSDockerfile(newProjectPath);
        await createDockerComposeFile(newProjectPath);
        console.log(`dockerfile及docker-compose.yml建立完成`);

        return "專案資料夾初始化完成";
    } catch (e) {
        console.log("創立專案資料及文件時發生錯誤 : ", e);
        return e;
    }
}

//確認資料夾目錄
export async function getFolderIndex(job) {
    const userId = job.userId;
    const projectName = job.projectName;
    try {
        //確認資料夾
        const folderPath = path.join(moduleDir, "../express_project/");
        const folderName = `${userId}_${projectName}`;
        const newProjectPath = `${folderPath}${folderName}`;
        const gitFolderPath = `${newProjectPath}/gitFolder`;

        const folderTree = await listFiles(gitFolderPath);
        const json = JSON.stringify(folderTree);

        return json;
    } catch (e) {
        console.log("建立專案目錄發生問題 : ", e);
        return e;
    }
}

//