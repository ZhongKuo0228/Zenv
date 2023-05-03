import { exec, spawn } from "child_process";

export async function countRunningExpress() {
    const createCommand = `docker network ls --filter name=-network`;

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

    child.stderr.on("data", async (data) => {
        //回傳運行結果
        console.log("stderr", data);
        output += data;
    });

    child.stdout.on("close", async () => {
        const network = output.trim();
        console.log(`Total network lists: ${network}`);

        const networkCount = output.trim().split("\n").length - 1;
        console.log(`Total network count: ${networkCount}`);
    });
}

export async function runningServicesLists() {
    const cmd = spawn("docker", ["stats", "--no-stream"]);

    cmd.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    cmd.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
