import Redis from "ioredis";
import { getOutPort } from "../controllers/express_container.js";
import path from "path";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);

export async function redisCommand(job) {
    const folderPath = path.join(moduleDir, "../express_project/");
    const serverName = job.serverName;
    const ymlPath = `${folderPath}${serverName}`;

    const redisPort = await getOutPort(ymlPath, `${serverName}-redis`);

    const command = job.command.split(" ");

    // 建立 Redis 連線
    const redis = new Redis({
        host: "localhost", //
        port: redisPort, //
    });

    redis.ping((err, res) => {
        if (err) {
            console.error("Failed to connect to Redis:", err);
        } else {
            console.log("Connected to Redis:", res);
        }
    });

    try {
        const result = await redis.send_command(...command);
        return result.toString();
    } catch (err) {
        console.error("Redis error:", err);
        return err.message;
    }
}
