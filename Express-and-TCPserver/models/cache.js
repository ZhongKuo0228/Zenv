import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME, //已經不是預設的
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB, //設定連線的資料庫編號
    enableReadyCheck: false, //關掉info提醒
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.error("Error connecting to Redis: ", err);
});

export default redis;
