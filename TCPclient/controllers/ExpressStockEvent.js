import { createFolder } from "./express_file.js";

export async function expressEvent(job) {
    const task = job.task;
    if (task == "createServer") {
        await createFolder(job);
    }
}
