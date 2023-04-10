import { writeFile, unlink } from "node:fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
import { stopPLContainer, rmPLContainer } from "../controllers/PLcontainer.js";

async function npmCommand(serverName, vPath, doJob) {
    return new Promise(async (resolve, reject) => {
        const container = "docker";
        const action = "run --name";
        const containerName = serverName;
        const images = "node/npm";
        const command = `${container} ${action} ${containerName} -v ${vPath}:/usr/src/app ${images} ${doJob}`; //使用exec所以-it要拿掉
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function composeUp(vPath) {
    return new Promise(async (resolve, reject) => {
        const container = "docker-compose";
        const action = "up -d";
        const command = `${container} -f ${vPath}/docker-compose.yml ${action}`; //使用exec所以-it要拿掉
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function composeStop(vPath, service) {
    return new Promise(async (resolve, reject) => {
        const container = "docker-compose";
        const action = "stop";
        const time = "-t 1";
        const command = `${container} -f ${vPath}/docker-compose.yml ${action} ${time} ${service}`; //使用exec所以-it要拿掉
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function composeRun(vPath, service) {
    return new Promise(async (resolve, reject) => {
        const container = "docker-compose";
        const action = "start";
        const command = `${container} -f ${vPath}/docker-compose.yml ${action} ${service}`; //使用exec所以-it要拿掉
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function getOutPort(vPath, serviceName) {
    const command = `docker-compose -f ${vPath}/docker-compose.yml ps | grep ${serviceName}| awk '{print $NF}' | cut -d ':' -f 2 | cut -d '-' -f 1`;
    console.log("command", command);
    try {
        const { stdout } = await execAsync(command);
        console.log(`回傳程式碼執行結果: ${stdout}`);
        return stdout;
    } catch (error) {
        console.error(`執行命令時出錯: ${error}`);
    }
}

export async function createDockerComposeFile(serverName, filePath) {
    const dockerComposeFile = `
    version: "3.8"

    services:
        ${serverName}-express:
            image: node/node-express
            environment:
                - REDIS_HOST=redis-server
            networks:
                - ${serverName}-network
            #不指定外部訪問的port，讓系統自動分配
            ports:
                - 3000
            volumes:
                - "./gitFolder:/usr/src/app"

        ${serverName}-redis:
            image: redis:7-alpine
            networks:
                - ${serverName}-network

    networks:
       ${serverName}-network:`;

    //dockerfile檔案建立
    const fileName = `docker-compose.yml`;
    await writeFile(`${filePath}/${fileName}`, dockerComposeFile);
}

//TODO:使用docker執行npm install指令
//TODO:使用docker執行node app.js指令
//TODO:使用docker-compose 重新啓動 node app.js指令
//jsOperInit, jsOperRun, jsOperStop, jsOperNpm

export async function jsOperInit(job) {
    //node/npm-install → docker-compose up → 取得port(每次啓動port都不一樣，所以第一次初始化就不用抓) → docker-compose stop -t 1 <container>
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const serverName = job.serverName;
        const ymlPath = `${folderPath}${serverName}`;
        const filePath = `${folderPath}${serverName}/gitFolder`;

        async function executeCommands() {
            //先安裝一次npm install、並刪除臨時產生的container
            await npmCommand(serverName, filePath, "install");
            await stopPLContainer(serverName);
            await rmPLContainer(serverName);

            // 起compose，並關掉express，redis維持
            await composeUp(ymlPath);
            await composeStop(ymlPath, `${serverName}-express`);
        }
        await executeCommands();

        const result = `初始化完成 : ${serverName}`;
        return result;

        //控制容器指令
    } catch (e) {
        console.log("初始化環境發生問題 : ", e);
        return e;
    }
}

export async function jsOperRun(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const serverName = job.serverName;
        const ymlPath = `${folderPath}${serverName}`;

        await composeRun(ymlPath, `${serverName}-express`);
        const result = await getOutPort(ymlPath, `${serverName}-express`);
        console.log("result", result);
        return result;

        //控制容器指令
    } catch (e) {
        console.log("覆寫檔案發生問題 : ", e);
        return e;
    }
}

export async function jsOperStop(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const serverName = job.serverName;
        const ymlPath = `${folderPath}${serverName}`;

        await composeStop(ymlPath, `${serverName}-express`);
        const result = `伺服器停止 : ${serverName}`;
        return result;

        //控制容器指令
    } catch (e) {
        console.log("覆寫檔案發生問題 : ", e);
        return e;
    }
}
