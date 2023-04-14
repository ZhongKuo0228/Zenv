import { exec } from "child_process";
import util from "util";
const promisify = util.promisify;
import { writeFile, mkdir, unlink, readdir, stat, readFile } from "node:fs/promises";
import path from "path";
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
import { createDockerComposeFile, createLogSH, chmodLogSH, runLogSH } from "./express_container.js";
import socket from "../../tcp-client.js";


