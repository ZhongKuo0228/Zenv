import { writeFile, unlink } from "node:fs/promises";
import path from "path";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
import { exec, spawn } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
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

export async function getOutPort(vPath, serviceName) {
    const command = `docker-compose -f ${vPath}/docker-compose.yml ps | grep ${serviceName}| awk '{print $NF}' | cut -d ':' -f 2 | cut -d '-' -f 1`;
    console.log("command", command);
    try {
        const { stdout } = await execAsync(command);
        console.log(`取得port: ${stdout}`);
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
                - REDIS_HOST=${serverName}-redis
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
            ports:
                - 6379

    networks:
       ${serverName}-network:`;

    //dockerfile檔案建立
    const fileName = `docker-compose.yml`;
    await writeFile(`${filePath}/${fileName}`, dockerComposeFile);
}

export async function createLogSH(logPath, folderName, newProjectPath) {
    const createLogSH = `docker-compose -f ${newProjectPath}/docker-compose.yml logs -f -t --no-log-prefix ${folderName}-express > ${logPath}/${folderName}.log`;

    //生成log的腳本檔案建立
    const fileName = `${folderName}-express.sh`;
    await writeFile(`${newProjectPath}/${fileName}`, createLogSH);
}

export async function chmodLogSH(folderName, newProjectPath) {
    return new Promise((resolve, reject) => {
        const command = `chmod +x ${newProjectPath}/${folderName}-express.sh`;
        console.log("chmodLogSH", command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export async function runLogSH(folderName, newProjectPath) {
    return new Promise((resolve, reject) => {
        const command = `${newProjectPath}/${folderName}-express.sh &`;
        console.log("runLogSH", command);
        //使用exec會需要等待回覆，但這個腳本會在後臺執行，所以會有卡住的感覺
        const childProcess = spawn(command, {
            detached: true,
            stdio: "ignore",
            shell: true,
        });

        childProcess.on("error", (error) => {
            reject(error);
        });

        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`子進程退出，退出碼：${code}`));
            } else {
                resolve();
            }
        });

        childProcess.unref();
    });
}

export async function stopLogSH(folderName, newProjectPath) {
    return new Promise((resolve, reject) => {
        const command = `pkill -f ${newProjectPath}/${folderName}-express.sh`;
        console.log("stopLogSH", command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export async function jsOperInit(job) {
    //node/npm-install → docker-compose up → 取得port(每次啓動port都不一樣，所以第一次初始化就不用抓) → docker-compose stop -t 1 <container>
    const folderPath = path.join(moduleDir, "../express_project/");
    const serverName = job.serverName;
    const ymlPath = `${folderPath}${serverName}`;
    const filePath = `${folderPath}${serverName}/gitFolder`;
    try {
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
    } catch (err) {
        console.log("初始化環境發生問題 : ", err.message);
        return err.message;
    }
}

export async function jsOperRun(job) {
    const folderPath = path.join(moduleDir, "../express_project/");
    const serverName = job.serverName;
    const ymlPath = `${folderPath}${serverName}`;
    try {
        await composeRun(ymlPath, `${serverName}-express`);
        const result = await getOutPort(ymlPath, `${serverName}-express`);
        //開啓log記錄
        await runLogSH(serverName, ymlPath);
        return result;

        //控制容器指令
    } catch (err) {
        console.log(`啓動 ${serverName}-express 發生問題: `, err.message);
        return err.message;
    }
}

export async function jsOperStop(job) {
    const folderPath = path.join(moduleDir, "../express_project/");
    const serverName = job.serverName;
    const ymlPath = `${folderPath}${serverName}`;
    try {
        await composeStop(ymlPath, `${serverName}-express`);
        const result = `伺服器停止 : ${serverName}`;
        // await stopLogSH(serverName, ymlPath);
        return result;

        //控制容器指令
    } catch (err) {
        console.log(`停止 ${serverName}-express 發生問題: `, err.message);
        return err.message;
    }
}

export async function jsOperNpm(job) {
    try {
        const folderPath = path.join(moduleDir, "../express_project/");
        const serverName = job.serverName;
        const filePath = `${folderPath}${serverName}/gitFolder`;
        const doJob = job.doJob;
        console.log("doJob", doJob);

        async function executeCommands() {
            //先安裝一次npm install、並刪除臨時產生的container
            await npmCommand(serverName, filePath, doJob);
            await stopPLContainer(serverName);
            await rmPLContainer(serverName);
        }
        await executeCommands();

        const result = `npm 指令完成 : ${doJob}`;
        return result;

        //控制容器指令
    } catch (e) {
        console.log("執行 npm 指令發生問題 : ", e);
        return e;
    }
}
