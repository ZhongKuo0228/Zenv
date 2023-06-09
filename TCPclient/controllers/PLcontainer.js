import { writeFile, unlink } from "node:fs/promises";
import path from "path";
import { exec } from "child_process";

function programLanguageSelect(programLanguage) {
    let ext;
    let image;
    if (programLanguage == "JavaScript") {
        ext = "js";
        image = "node:18-alpine node";
    } else if (programLanguage == "Python") {
        ext = "py";
        image = "python:3.11-alpine3.17 python3";
    } else if (programLanguage == "C++") {
        ext = "cpp";
        image = "gcc:12 sh -c";
    } else if (programLanguage == "Java") {
        ext = "java";
        image = " openjdk:21-ea-15-slim-buster java";
    } else {
        console.log("非預設程式語言");
    }
    return [ext, image];
}

export async function createPLContainer(executeId, programLanguage, code) {
    try {
        const prog_lang = programLanguageSelect(programLanguage);
        console.log(programLanguage);
        const ext = prog_lang[0];
        const filePath = path.join("./controllers/tempFile");
        const fileName = `${executeId}.${ext}`;
        await writeFile(`${filePath}/${fileName}`, code);

        //控制容器指令
        const cpuLimit = "--cpus 0.5";
        const memLimit = "--memory=192m";
        const container = "docker";
        const action = "run --rm --name ";
        const containerName = executeId;
        const vPath = path.join(process.cwd(), "./controllers/tempFile");
        const imagesAndRun = prog_lang[1];
        //臨時檔案建立
        if (programLanguage == "C++") {
            const command = `${container} ${action} ${containerName} ${cpuLimit} ${memLimit} -v ${vPath}:/app ${imagesAndRun} "g++ /app/${fileName} -o /app/cpp && /app/cpp"`; //使用exec所以-it要拿掉
            return command;
        } else {
            const command = `${container} ${action} ${containerName}  ${cpuLimit} ${memLimit} -v ${vPath}/${fileName}:/app/${fileName} ${imagesAndRun} /app/${fileName}`; //使用exec所以-it要拿掉
            return command;
        }
    } catch (e) {
        console.error("建立容器時失敗", e);
    }
}

export async function readResult(executeId) {
    try {
        //讀取容器的輸出結果
        const container = "docker";
        const action = "logs";
        const containerName = executeId;

        const command = `${container} ${action} ${containerName}`; //使用exec所以-it要拿掉
        console.log(command);
        return command;
    } catch (e) {
        console.error(e);
    }
}

export async function rmPLContainer(executeId) {
    try {
        //刪除已使用的容器
        const container = "docker";
        const action = "rm";
        const containerName = executeId;

        const command = `${container} ${action} ${containerName}`; //使用exec所以-it要拿掉
        exec(command);
    } catch (e) {
        console.error(e);
    }
}

export async function stopPLContainer(executeId) {
    try {
        //停止已使用的容器
        const container = "docker";
        const action = "stop";
        const containerName = executeId;

        const command = `${container} ${action} ${containerName}`; //使用exec所以-it要拿掉
        exec(command);
    } catch (e) {
        console.error(e);
    }
}

export async function delTempFile(executeId, programLanguage) {
    try {
        const prog_lang = programLanguageSelect(programLanguage);
        const ext = prog_lang[0];
        const filePath = path.join("./controllers/tempFile");
        const fileName = `${executeId}.${ext}`;
        const command = `rm ${filePath}/${fileName}`;
        exec(command);
        // await unlink(`${filePath}/${fileName}`);
    } catch (e) {
        console.error("刪除檔案錯誤", e);
    }
}
