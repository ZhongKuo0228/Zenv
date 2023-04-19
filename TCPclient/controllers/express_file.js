import { exec } from "child_process";
import util from "util";
const promisify = util.promisify;
import { writeFile, mkdir, unlink, readdir, stat, readFile } from "node:fs/promises";
import path from "path";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
import { createDockerComposeFile, createLogSH, chmodLogSH, runLogSH } from "./express_container.js";


//從github拉資料下來
function downloadRepo(path, gitUrl) {
    //下載到專案資料中
    const downloadCommend = `git clone ${gitUrl} ${path}`;
    const child = exec(downloadCommend);
    child.stdout.on("data", async (data) => {
        console.log(`git clone 結果: ${data}`);
    });
}

//忽略檔案名稱
async function listFiles(folderPath) {
    const files = await readdir(folderPath);
    const result = { name: path.basename(folderPath), isDirectory: true, children: [] };
    for (const file of files) {
        if (file === "node_modules") {
            continue;
        }

        if (file === ".git") {
            continue;
        }
        const filePath = path.join(folderPath, file);
        const stats = await stat(filePath);
        if (stats.isDirectory()) {
            result.children.push(await listFiles(filePath));
        } else {
            // 忽略檔案規則
            if (!file.includes("package-lock.json")) {
                result.children.push({ name: file, isDirectory: false });
            }
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
        const logPath = path.join(moduleDir, "../express_project/server_logs");
        const folderName = `${userId}_${projectName}`;
        const newProjectPath = `${folderPath}${folderName}`;
        const gitFolderPath = `${newProjectPath}/gitFolder`;

        await mkdir(newProjectPath);
        await mkdir(gitFolderPath);

        downloadRepo(gitFolderPath, gitUrl);
        console.log(`專案:${folderName}建立完成、git資料下載完成`);

        await createDockerComposeFile(folderName, newProjectPath);
        console.log(`docker-compose.yml建立完成`);

        await createLogSH(logPath, folderName, newProjectPath);
        console.log(`docker-compose-express log腳本建立完成`);

        await chmodLogSH(folderName, newProjectPath);
        // await runLogSH(folderName, newProjectPath);

        return "專案資料夾初始化完成";
    } catch (e) {
        console.log("創立專案資料及文件時發生錯誤 : ", e);
        return e;
    }
}

//確認資料夾目錄
export async function getFolderIndex(job) {
    try {
        //確認資料夾
        const folderPath = path.join(moduleDir, "../express_project/");
        const folderName = job.folderName;
        const newProjectPath = `${folderPath}${folderName}`;
        const gitFolderPath = `${newProjectPath}/gitFolder`;

        const folderTree = await listFiles(gitFolderPath);
        const json = JSON.stringify(folderTree);

        return json;
    } catch (e) {
        console.log("查詢專案目錄發生問題 : ", e);
        return e;
    }
}

//讀取資料內容
export async function toReadFile(job) {
    try {
        //確認資料夾
        const folderPath = path.join(moduleDir, "../express_project/");
        const fileName = job.fileName;
        const filePath = `${folderPath}${fileName}`;

        const file = await readFile(filePath);

        return file.toString();
    } catch (e) {
        console.log("讀取檔案發生問題 : ", e);
        return e;
    }
}

//讀取資料內容
export async function rewriteFile(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const fileName = job.fileName;
        const filePath = `${folderPath}${fileName}`;
        const editCode = job.editCode;

        await writeFile(filePath, editCode);
        const result = `覆寫完成 : ${fileName}`;
        return result;
    } catch (e) {
        console.log("覆寫檔案發生問題 : ", e);
        return e;
    }
}

//檔案操作：新增、刪除、重新命名
export async function operAdd(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const fileName = job.fileName;
        const filePath = `${folderPath}${fileName}`;
        const type = job.type;
        let result;
        if (type == "folder") {
            await mkdir(filePath);
            result = `新增資料夾完成 : ${fileName}`;
        } else {
            await writeFile(filePath, "");
            result = `新增文件完成 : ${fileName}`;
        }
        return result;
    } catch (e) {
        console.log("新增資料夾、檔案發生問題 : ", e);
        return e;
    }
}

export async function operDel(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const fileName = job.fileName;
        const filePath = `${folderPath}${fileName}`;
        const delCommand = `rm -rf "${filePath}"`;
        exec(delCommand);
        let result = `刪除檔案完成 : ${fileName}`;
        return result;
    } catch (e) {
        console.log("新增資料夾、檔案發生問題 : ", e);
        return e;
    }
}

export async function operRename(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const fileName = job.fileName[0];
        const newFileName = job.fileName[1];
        const renameCommand = `mv ${folderPath}${fileName} ${folderPath}${newFileName}`;
        exec(renameCommand);
        let result = `重新命名檔案完成 : ${folderPath}${newFileName}`;
        console.log(`${folderPath}${fileName}`, `${folderPath}${newFileName}`);
        return result;
    } catch (e) {
        console.log("重新命名檔案發生問題 : ", e);
        return e;
    }
}
