import { writeFile, unlink } from "node:fs/promises";
import path from "path";
import { exec } from "child_process";

// export async function createNodeJSDockerfile(filePath) {
//     const nodejsDockerfile = `
//     FROM node:18-slim

//     # Create app directory
//     WORKDIR /usr/src/app

//     # Install app dependencies
//     # A wildcard is used to ensure both package.json AND package-lock.json are copied
//     # where available (npm@5+)
//      COPY gitFolder/ ./

//      RUN npm install
//     # If you are building your code for production
//     # RUN npm ci --omit=dev

//     EXPOSE 3000

//     CMD [ "node", "app.js"]`;

//     //dockerfile檔案建立
//     const fileName = `dockerfile`;
//     await writeFile(`${filePath}/${fileName}`, nodejsDockerfile);
// }

export async function createDockerComposeFile(filePath) {
    const dockerComposeFile = `
    version: "3.8"

    services:
        zenv-express:
            image: node/node-express
            environment:
                - REDIS_HOST=redis-server
            networks:
                - Zenv-network
            #不指定外部訪問的port，讓系統自動分配
            ports:
                - 3000
            volumes:
                - "./gitFolder:/usr/src/app"

        redis-server:
            image: redis:7-alpine
            networks:
                - Zenv-network

    networks:
        Zenv-network:`;

    //dockerfile檔案建立
    const fileName = `docker-compose.yml`;
    await writeFile(`${filePath}/${fileName}`, dockerComposeFile);
}

//TODO:使用docker執行npm install指令
//TODO:使用docker執行node app.js指令
//TODO:使用docker-compose 重新啓動 node app.js指令
