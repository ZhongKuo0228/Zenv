import { exec } from "child_process";
import { sendToServer } from "../tcp-client.js";
import { createPLContainer, rmPLContainer, stopPLContainer, delTempFile } from "./PLcontainer.js";

const timers = {}; //放置定時器

export async function PLevent(job) {
    try {
        console.log("job", job);
        const executeId = job.executeId;
        const programLanguage = job.programLanguage;
        const code = job.code;

        const createCommand = await createPLContainer(executeId, programLanguage, code);
        const child = exec(createCommand);

        let output = "";

        timers[executeId] = setTimeout(async () => {
            await stopPLContainer(executeId);
            await rmPLContainer(executeId);
            await delTempFile(executeId, programLanguage);
            delete timers[executeId];
            console.log(`${executeId}執行時間超過1分鐘`);
        }, 1 * 60 * 1000);

        child.stdin.on("exit", (code) => {
            console.log(`Child process exited with code ${code}`);
        });

        child.stdout.on("data", (data) => {
            // console.log(`stdout: ${data}`);
            //將結果串在一起
            output += data;
        });

        child.stderr.on("data", async (data) => {
            //回傳運行結果
            console.log("stderr", data);
            output += data;
        });

        child.stdout.on("close", async () => {
            // console.log(`Final output: ${output}`);
            const result = {
                socketId: job.socketId,
                executeId: executeId,
                result: output,
            };
            //回傳運行結果
            await sendToServer(JSON.stringify(result));

            //處理臨時容器及檔案
            await stopPLContainer(executeId);
            await rmPLContainer(executeId);
            await delTempFile(executeId, programLanguage);
        });
    } catch (e) {
        console.error("運行程式碼工作時失敗", e);
    }
}
