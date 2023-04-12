import Redis from "ioredis";

export async function redisCommand(job) {
    const serverName = job.serverName;
    // 建立 Redis 連線
    const redis = new Redis({
        host: `${serverName}-redis`, // Docker Compose 內部的 Redis 位置
        port: 6379, // Redis 預設埠號
    });
    // 設定 Express 路由

    return await redis.send_command(command.split(" "));
}
