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
        //TODO: 加入對應的image和執行指令
    } else if (programLanguage == "cpp") {
        //TODO: 加入對應的image和執行指令
    } else if (programLanguage == "java") {
        //TODO: 加入對應的image和執行指令
    } else {
        console.log("非預設程式語言");
    }
    return [ext, image];
}

export async function createPLContainer(executeId, programLanguage, code) {
    const prog_lang = programLanguageSelect(programLanguage);
    const ext = prog_lang[0];

    //臨時檔案建立
    const filePath = path.join("./controllers/tempFile");
    const fileName = `${executeId}.${ext}`;
    await writeFile(`${filePath}/${fileName}`, code);

    //控制容器指令
    const container = "docker";
    const action = "run --name";
    const containerName = executeId;
    const vPath = path.join(process.cwd(), "./controllers/tempFile");
    const imagesAndRun = prog_lang[1];

    const command = `${container} ${action} ${containerName} -v ${vPath}/${fileName}:/app/${fileName} ${imagesAndRun} /app/${fileName}`; //使用exec所以-it要拿掉
    return command;
}

export async function readResult(executeId) {
    //讀取容器的輸出結果
    const container = "docker";
    const action = "logs";
    const containerName = executeId;

    const command = `${container} ${action} ${containerName}`; //使用exec所以-it要拿掉
    console.log(command);
    return command;
}

export async function rmPLContainer(executeId) {
    //刪除已使用的容器
    const container = "docker";
    const action = "rm";
    const containerName = executeId;

    const command = `${container} ${action} ${containerName}`; //使用exec所以-it要拿掉
    exec(command);
}

export async function stopPLContainer(executeId) {
    //停止已使用的容器
    const container = "docker";
    const action = "stop";
    const containerName = executeId;

    const command = `${container} ${action} ${containerName}`; //使用exec所以-it要拿掉
    exec(command);
}

export async function delTempFile(executeId, programLanguage) {
    const prog_lang = programLanguageSelect(programLanguage);
    const ext = prog_lang[0];
    const filePath = path.join("./controllers/tempFile");
    const fileName = `${executeId}.${ext}`;
    await unlink(`${filePath}/${fileName}`);
}
