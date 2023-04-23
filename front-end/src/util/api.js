import { v4 as uuidv4 } from "uuid";
const JWT = localStorage.getItem("jwt");
const api = {
    hostname: "http://localhost:3001/api/1.0",

    //一些範例：
    async createProduct(data, jwtToken) {
        const response = await fetch(`${this.hostname}/admin/product`, {
            body: data,
            headers: new Headers({
                Authorization: `Bearer ${jwtToken}`,
            }),
            method: "POST",
        });
        return await response.json();
    },
    async updateVariant(data, jwtToken) {
        const response = await fetch(`${this.hostname}/admin/product`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    async getRevenue() {
        const response = await fetch(`${this.hostname}/reports/revenue`);
        return await response.json();
    },
    //登入及註冊--------------------------------------------------------------------------------------
    async userSignUp(username, email, password) {
        const data = {
            username: username,
            email: email,
            password: password,
        };
        try {
            const response = await fetch(`${this.hostname}/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    async userSignIn(email, password) {
        const data = {
            provider: "native",
            email: email,
            password: password,
        };
        try {
            const response = await fetch(`${this.hostname}/user/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    //Profile----------------------------------------------------------------------------------------
    async getUserProfile() {
        try {
            const response = await fetch(`${this.hostname}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            });
            const responseData = await response.json();
            return responseData.data;
        } catch (error) {
            console.error(error);
        }
    },
    async getUserProjects() {
        try {
            const response = await fetch(`${this.hostname}/user/userProjects`, {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            });
            const responseData = await response.json();
            return responseData.data;
        } catch (error) {
            console.error(error);
        }
    },
    async createPLProject(projectName, serviceItem, selectedItemsType) {
        const data = {
            projectName: projectName,
            serviceItem: serviceItem,
            itemsType: selectedItemsType,
        };

        console.log("data", data);
        try {
            const response = await fetch(`${this.hostname}/serviceItems/createProject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    async getPLServiceItems() {
        try {
            const response = await fetch(`${this.hostname}/serviceItems/plServices`, {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            });
            const responseData = await response.json();
            return responseData.data;
        } catch (error) {
            console.error(error);
        }
    },
    async getWebServiceItems() {
        try {
            const response = await fetch(`${this.hostname}/serviceItems/webServices`, {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            });
            const responseData = await response.json();
            return responseData.data;
        } catch (error) {
            console.error(error);
        }
    },
    async editProject(serviceItem, projectId) {
        const data = {
            serviceItem: serviceItem,
            projectId: projectId,
        };
        try {
            const response = await fetch(`${this.hostname}/serviceItems/createPLProject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    //PL----------------------------------------------------------------------------------------------
    async getPLInfo(userName, projectName) {
        const data = {
            userName: userName,
            projectName: projectName,
        };
        try {
            const response = await fetch(`${this.hostname}/PLcode/getInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    async PLcodeRun() {
        const JWT = localStorage.getItem("jwt");
        try {
            const codeData = {
                task: "runCode",
                executeId: uuidv4(),
                code: localStorage.getItem("code"),
                programLanguage: localStorage.getItem("prog_lang"),
                projectID: localStorage.getItem("PLprojectID"),
                editorID: localStorage.getItem("editor"),
            };
            const response = await fetch(`${this.hostname}/PLcode/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: codeData }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    async PLcodeSave() {
        const JWT = localStorage.getItem("jwt");
        try {
            const codeData = {
                task: "saveCode",
                code: localStorage.getItem("code"),
                projectID: localStorage.getItem("PLprojectID"),
                editorID: localStorage.getItem("editor"),
            };
            const response = await fetch(`${this.hostname}/PLcode/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: codeData }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },

    //Express------------------------------------------------------------------------------------------
    //創建專案
    async checkInfo(projectName) {
        try {
            const response = await fetch(`${this.hostname}/webServices/checkInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: projectName }),
            });
            return response.json();
        } catch (error) {
            console.error(error);
        }
    },

    async resetFile(task, serverName) {
        try {
            const gitRepoUrl = "https://github.com/ZhongKuo0228/express-example.git";
            const projectData = {
                task: task,
                serverName: serverName,
                gitRepoUrl: gitRepoUrl,
            };
            const response = await fetch(`${this.hostname}/webServices/resetFile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: projectData }),
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    },
    //刷新封存期限
    async updateExpiredTime(userName, projectName) {
        const JWT = localStorage.getItem("jwt");
        try {
            const serverName = {
                userName: userName,
                projectName: projectName,
            };
            const response = await fetch(`${this.hostname}/WebServices/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: serverName }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    //NodeJS操作
    async getFolderIndex(serverName) {
        try {
            const response = await fetch(`${this.hostname}/webServices/get?getFolderIndex=${serverName}`, {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            });
            const responseData = await response.json();
            return JSON.parse(responseData.data); // 解析資料
        } catch (error) {
            console.error(error);
        }
    },
    async readFile(serverName, filePath) {
        try {
            const response = await fetch(`${this.hostname}/webServices/get?readFile=${serverName}/${filePath}`, {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            });
            const responseData = await response.json();
            return responseData.data; // 解析資料
        } catch (error) {
            console.error(error);
        }
    },
    async rewriteFile(task, serverName, fileName, editCode) {
        const data = {
            task: task,
            fileName: `${serverName}/${fileName}`,
            editCode: editCode,
        };
        try {
            const response = await fetch(`${this.hostname}/webServices/rewriteFile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    async fileOper(task, type, fileName) {
        const data = {
            task: task,
            type: type,
            fileName: fileName,
        };
        try {
            const response = await fetch(`${this.hostname}/webServices/fileOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fileOper fetching POST event data:", error);
        }
    },
    async jsOper(task, serverName, doJob, projectName) {
        const data = {
            task: task,
            userId: localStorage.getItem("editor"),
            projectName: projectName,
            serverName: serverName,
            doJob: doJob,
        };
        try {
            const response = await fetch(`${this.hostname}/webServices/jsOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error jsOper fetching POST event data:", error);
        }
    },
    //Sqlite操作
    async sqliteCommand(task, serverName, command) {
        const data = {
            task: task,
            serverName: serverName,
            command: command,
        };
        try {
            const response = await fetch(`${this.hostname}/webServices/dbOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error jsOper fetching POST event data:", error);
        }
    },
    //redis操作
    async redisCommand(task, serverName, command) {
        const data = {
            task: task,
            serverName: serverName,
            command: command,
        };
        try {
            const response = await fetch(`${this.hostname}/webServices/dbOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
                body: JSON.stringify({ data: data }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error jsOper fetching POST event data:", error);
        }
    },
};

export default api;
