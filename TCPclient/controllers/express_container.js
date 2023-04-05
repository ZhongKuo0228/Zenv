import { writeFile, unlink } from "node:fs/promises";
import path from "path";
import { exec } from "child_process";

export async function createNodeJSDockerfile(filePath) {
    const nodejsDockerfile = `
    FROM node:18-slim

    # Create app directory
    WORKDIR /usr/src/app
    
    # Install app dependencies
    # A wildcard is used to ensure both package.json AND package-lock.json are copied
    # where available (npm@5+)
     COPY gitFolder/ ./
    
     RUN npm install
    # If you are building your code for production
    # RUN npm ci --omit=dev
    
    
    EXPOSE 3000
    
    CMD [ "node", "app.js"]`;

    //dockerfile檔案建立
    const fileName = `dockerfile`;
    await writeFile(`${filePath}/${fileName}`, nodejsDockerfile);
}

export async function createDockerComposeFile(filePath) {
    const dockerComposeFile = `
    version: "3.8"

    services:
        zenv-express:
            build: ./
            image: zenv-express
            environment:
                - REDIS_HOST=redis-server
                - MYSQL_HOST=mysql-server
            networks:
                - Zenv-network
            ports:
                - 4321:3000
    
        redis-server:
            image: redis:7-alpine
            networks:
                - Zenv-network
    
        mysql-server:
            image: mysql:8
            restart: always
            environment:
                MYSQL_ROOT_PASSWORD: test
            networks:
                - Zenv-network
            volumes:
                - ./gitFolder/mysql:/docker-entrypoint-initdb.d
    networks:
        Zenv-network:`;

    //dockerfile檔案建立
    const fileName = `docker-compose.yml`;
    await writeFile(`${filePath}/${fileName}`, dockerComposeFile);
}
