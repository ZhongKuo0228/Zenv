import { promisify } from "util";
import { exec, spawn } from "child_process";

export async function countRunningExpress() {
    // const createCommand = `docker network ls --filter name=-Znetwork`;

    // const child = exec(createCommand);

    // child.stdin.on("exit", (code) => {
    //     console.log(`Child process exited with code ${code}`);
    // });

    // let output = "";

    // child.stdout.on("data", (data) => {
    //     // console.log(`stdout: ${data}`);
    //     //將結果串在一起
    //     output += data;
    // });

    // child.stderr.on("data", async (data) => {
    //     //回傳運行結果
    //     console.log("stderr", data);
    //     output += data;
    // });

    // child.stdout.on("close", async () => {
    //     const network = output.trim();
    //     console.log(`Total network lists: ${network}`);

    //     const networkCount = output.trim().split("\n").length - 1;
    //     console.log(`Total network count: ${networkCount}`);

    //     output += networkCount;
    //     console.log("output", output);
    // });
    // return output;

    const command = `docker network ls --filter name=-Znetwork`;

    const promiseExec = promisify(exec);
    const { stdout, stderr } = await promiseExec(command);

    if (stderr) {
        console.error(`Command ${command} failed with error: ${stderr}`);
        return null;
    }

    const networkCount = stdout.trim().split("\n").length - 1;
    console.log(`Total network count: ${networkCount}`);

    return networkCount;
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
