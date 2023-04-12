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

    //Express------------------------------------------------------------------------------------------
    //NodeJS操作
    async getFolderIndex(serverName) {
        try {
            const response = await fetch(`${this.hostname}/express/get?getFolderIndex=${serverName}`);
            const responseData = await response.json();
            return JSON.parse(responseData.data); // 解析資料
        } catch (error) {
            console.error(error);
        }
    },

    async fileOper(task, type, fileName) {
        const data = {
            task: task,
            type: type,
            fileName: fileName,
        };
        try {
            const response = await fetch(`${this.hostname}/express/fileOper`, {
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
    async jsOper(task, serverName, doJob) {
        const data = {
            task: task,
            serverName: serverName,
            doJob: doJob,
        };
        try {
            const response = await fetch(`${this.hostname}/express/jsOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
            const response = await fetch(`${this.hostname}/express/dbOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
            const response = await fetch(`${this.hostname}/express/dbOper`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
