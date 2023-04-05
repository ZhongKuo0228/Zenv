//TODO:創立專案後，先創立資料夾，
//TODO:從github拉資料下來
import { exec } from "child_process";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "path";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
import socket from "../tcp-client.js";

function downloadRepo(path, gitUrl) {
    //下載到專案資料中
    const downloadCommend = `git clone ${gitUrl} ${path}`;
    const child = exec(downloadCommend);
    child.stdout.on("data", async (data) => {
        console.log(`git clone 結果: ${data}`);
    });
}

export async function createFolder(job) {
    const user = job.user;
    const projectName = job.projectName;
    const gitUrl = job.gitRepoUrl;
    //專案資料夾創立
    const folderPath = path.join(moduleDir, "../express_project/");
    const folderName = `${user}_${projectName}`;
    const newProjectPath = `${folderPath}${folderName}`;

    await mkdir(newProjectPath);

    downloadRepo(newProjectPath, gitUrl);
    console.log(`專案:${folderName}建立完成、git資料下載完成`);
}
