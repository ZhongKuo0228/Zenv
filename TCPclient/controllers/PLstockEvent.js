import { exec } from "child_process";
import { sendToServer } from "../tcp-client.js";
import { createPLContainer, rmPLContainer, stopPLContainer, delTempFile } from "./PLcontainer.js";

export async function PLevent(job) {
    console.log("job", job);
    const executeId = job.executeId;
    const programLanguage = job.programLanguage;
    const code = job.code;

    const createCommand = await createPLContainer(executeId, programLanguage, code);
    const child = exec(createCommand);

    child.stdin.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
    });

    let output = "";

    child.stdout.on("data", (data) => {
        // console.log(`stdout: ${data}`);
        //將結果串在一起
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

    child.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
    });
}
