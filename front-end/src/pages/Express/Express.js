import React from "react";
import styled from "styled-components";
import { useState, useEffect, useContext, useRef } from "react";
import Folder from "./FileTree/Folder";
import Table from "./SqlTable/SqlTable";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { FileContext } from "../../context/fileContext";
// import TerminalComponent from "./Terminal";
import api from "../../util/api";
import webSocket from "socket.io-client";

const serverName = `testman_firstServer`; //TODO:後續要從localstorage取得${userName}_${projectName}
//---

//---
const Area = styled.div`
    width: 100%;
    border: solid 1px black;
    display: flex;
    flex-direction: column;
`;
//---
const ButtonArea = styled.div`
    width: 100%;
    height: 50px;
    border: solid 1px black;
    display: flex;
    justify-content: space-around;
    padding: 10px;
`;
//---
const WorkArea = styled.div`
    width: 100%;
    border: solid 1px black;
    display: flex;
    flex-direction: row;
`;

const FolderIndex = styled.div`
    width: 20%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;
const EditArea = styled.div`
    width: 59%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;
const FileName = styled.input`
    width: 95%;
    height: 30px;
    border: solid 1px black;
    padding: 10px;
`;
const ResultArea = styled.div`
    width: 20%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;

const SqliteCommand = styled.div`
    width: 90%;
    height: 300px;
    border: solid 1px black;
    padding: 10px;
`;
const SqliteResult = styled.div`
    width: 90%;
    height: 100px;
    border: solid 1px black;
    padding: 10px;
`;

const RedisCommand = styled.div`
    width: 90%;
    height: 300px;
    border: solid 1px black;
    padding: 10px;
`;
const RedisResult = styled.div`
    width: 90%;
    height: 100px;
    border: solid 1px black;
    padding: 10px;
`;
const ExpressLog = styled.div`
    width: 90%;
    border: solid 1px black;
    padding: 10px;
    height: 450px;
    overflow-y: scroll;
    white-space: nowrap;
`;
//---
const Express = () => {
    const { file } = useContext(FileContext);
    const { fileName } = useContext(FileContext);
    const [shouldFetchData, setShouldFetchData] = useState(true);
    const [runPort, setRunPort] = useState("伺服器未啓動");
    const [npmCommand, setNpmCommand] = useState("");
    const [sqliteCommand, setSqliteCommand] = useState("SELECT name FROM sqlite_master WHERE type='table'");
    const [sqliteResult, setSqliteResult] = useState("sqlite執行結果");
    const [redisCommand, setRedisCommand] = useState("");
    const [redisResult, setRedisResult] = useState("redis執行結果");
    const [expressLog, setExpressLog] = useState([]);
    const logEndRef = useRef(null);
    //---功能選擇
    const [feature, setFeature] = useState("NodeJs");
    const handleFeature = (data) => {
        setFeature(data);
    };
    const features = ["NodeJs", "Sqlite", "Redis"];

    //---資料夾樹狀結構
    const [folderData, setFolderData] = useState(null);
    const [code, setCode] = useState("");
    const [choiceFile, setChoiceFile] = useState("檔名");

    //讀取資料夾目錄------------------------------------------------------------
    const fetchData = async () => {
        const data = await api.getFolderIndex(serverName);
        setFolderData(data);
        setShouldFetchData(false);
    };
    useEffect(() => {
        if (shouldFetchData) {
            fetchData();
        }
    }, [shouldFetchData]);

    const handleIndexRefresh = () => {
        fetchData();
    };

    //處理檔案被點擊後，將編輯區更新內容------------------------------------------------------------
    const handleCodeChange = (event) => {
        const value = event.target.value;
        setCode(value);
        localStorage.setItem("editedFileData", value);
    };
    useEffect(() => {
        //從localstorage拿到資料並重新解析格式
        const storedCode = localStorage.getItem("fileData");
        if (storedCode) {
            const trimmedCode = decodeURIComponent(storedCode.replace(/^"(.*)"$/, "$1"));
            //處理換行的\n的問題
            const codeWithNewlines = trimmedCode.replace(/\\n/g, "\n");
            //處理空格的反斜線的問題
            const codeWithoutBackslashes = codeWithNewlines.replace(/\\/g, "");
            setCode(codeWithoutBackslashes);
        }
        //動態觀察
    }, [file]);

    //處理檔名顯示------------------------------------------------------------
    const choiceFileChange = (event) => {
        const value = event.target.value;
        setChoiceFile(value);
    };
    useEffect(() => {
        //從localstorage取得現在點擊檔案名稱
        const ChoiceFile = localStorage.getItem("nowChoiceFile");
        setChoiceFile(ChoiceFile);
        //動態觀察
    }, [fileName]);

    //NodeJS按鈕動作
    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        const url = "http://localhost:3001/api/1.0/express/create";
        try {
            const userId = "testman";
            const task = "createServer";
            const projectName = "firstServer";
            const gitRepoUrl = "https://github.com/ZhongKuo0228/express-example.git";
            const projectData = {
                task: task,
                userId: userId,
                projectName: projectName,
                gitRepoUrl: gitRepoUrl,
            };
            console.log("projectData", projectData);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: projectData }),
            });

            const data = await response.json();
            console.log("result", data);
            alert("建立完成");
        } catch (error) {
            console.error(error);
        }
    };
    const handleInitSubmit = async (event) => {
        event.preventDefault();
        const task = "jsOperInit";
        const result = await api.jsOper(task, serverName);
        if (result) {
            alert("初始化完成");
        }
    };

    const handleRunSubmit = async (event) => {
        event.preventDefault();
        const task = "jsOperRun";
        const result = await api.jsOper(task, serverName);
        if (result) {
            alert(`express running on port : ${result.data}`);
        }
        setRunPort(`http://localhost:${result.data}`);
    };

    const handleStopSubmit = async (event) => {
        event.preventDefault();
        const task = "jsOperStop";
        const result = await api.jsOper(task, serverName);
        if (result) {
            alert("伺服器已停止");
        }
        setRunPort("伺服器未啓動");
    };
    const handleNpmSubmit = async (event) => {
        event.preventDefault();
        const task = "jsOperNpm";
        const result = await api.jsOper(task, serverName, npmCommand);
        if (result) {
            alert(`npm 指令 ${npmCommand} 完成`);
        }
    };

    //sqlite指令操作
    const handleSqliteCommand = async (event) => {
        event.preventDefault();
        const task = "sqliteCommand";
        const sqliteCommand = localStorage.getItem("sqliteCommand");
        const result = await api.sqliteCommand(task, serverName, sqliteCommand);
        console.log("result", result.data);
        if (Array.isArray(result.data)) {
            // 確認資料為陣列
            console.log("result", result.data);
            setSqliteResult(result.data);
        } else {
            setSqliteResult(result.data);
        }
    };
    const handleSqliteChange = (event) => {
        const value = event.target.value;
        setSqliteCommand(value);
        localStorage.setItem("sqliteCommand", value);
    };
    useEffect(() => {
        const storedCode = localStorage.getItem("sqliteCommand");
        if (storedCode) {
            setSqliteCommand(storedCode);
        }
    }, []);

    //redis指令操作
    const handleRedisCommand = async (event) => {
        event.preventDefault();
        const task = "redisCommand";
        const redisCommand = localStorage.getItem("redisCommand");
        const result = await api.redisCommand(task, serverName, redisCommand);
        console.log("redis", result.data);
        setRedisResult(result.data);
    };
    const handleRedisChange = (event) => {
        const value = event.target.value;
        setRedisCommand(value);
        localStorage.setItem("redisCommand", value);
    };
    useEffect(() => {
        const storedCode = localStorage.getItem("redisCommand");
        if (storedCode) {
            setRedisCommand(storedCode);
        }
    }, []);
    //---
    // webSocket---
    const [ws, setWs] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = webSocket("http://localhost:3001");
        socket.on("connect", () => {
            console.log("Successfully connected to server!");
        });
        socket.on(serverName, (data) => {
            console.log("Received log data:", data);
            setExpressLog((prevLogs) => [...prevLogs, data]); // 將接收到的資料設置為 expressLog 的新值
        });
        socketRef.current = socket;
        setWs(socketRef.current);
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [expressLog]);

    //---------------------------------------------------------------------------
    return (
        <Area>
            <ButtonArea>
                <button onClick={handleCreateSubmit}>創立專案</button>
                <button onClick={handleInitSubmit}>初始化 INIT</button>
                <button onClick={handleRunSubmit}>運行 RUN</button>
                <a href={`${runPort}`} target='_blank' onChange={handleRunSubmit}>
                    {runPort}
                </a>
                <button onClick={handleStopSubmit}>暫停 STOP</button>
                <form onSubmit={handleNpmSubmit}>
                    npm
                    <input
                        type='text'
                        placeholder='npm指令'
                        value={npmCommand}
                        onChange={(e) => setNpmCommand(e.target.value)}
                    />
                    <button type='submit'>送出</button>
                </form>
                {features.map((feature, index) => (
                    <button
                        style={{ background: "#3630a3", color: "white" }}
                        onClick={(e) => handleFeature(feature)}
                        key={index}
                    >
                        {feature}
                    </button>
                ))}
            </ButtonArea>
            <WorkArea>
                {feature === "NodeJs" ? (
                    <>
                        <FolderIndex>
                            資料夾
                            <hr />
                            (忽略規則： .git 、 node_modules 、package-lock.json);
                            <hr />
                            <button onClick={handleIndexRefresh}>Refresh</button>
                            <hr />
                            {folderData && <Folder folder={folderData} />} {/* 如果資料存在，則渲染 Folder 元件 */}
                        </FolderIndex>
                        <EditArea>
                            <FileName value={fileName} onChange={choiceFileChange} readOnly />
                            <CodeEditor
                                data-color-mode='dark'
                                value={code}
                                language='js'
                                placeholder='Please enter code.'
                                onChange={handleCodeChange}
                                padding={15}
                                style={{
                                    fontSize: 12,
                                    backgroundColor: "#272727",
                                    fontFamily:
                                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                    height: "80%",
                                    border: "solid 1px black",
                                }}
                            />
                        </EditArea>
                        <ResultArea>
                            <div>Console</div>
                            <hr />
                            <ExpressLog>
                                {expressLog.map((log, index) => (
                                    <div key={index}>{log}</div>
                                ))}
                                <div ref={logEndRef} />
                            </ExpressLog>
                        </ResultArea>
                    </>
                ) : feature === "Sqlite" ? (
                    <>
                        <FolderIndex>DB資料區</FolderIndex>
                        <EditArea>
                            <SqliteCommand>
                                <div>Sqlite Commands</div>
                                <form onSubmit={handleSqliteCommand}>
                                    <CodeEditor
                                        data-color-mode='dark'
                                        value={sqliteCommand}
                                        language='sql'
                                        placeholder='Please enter code.'
                                        onChange={handleSqliteChange}
                                        padding={15}
                                        style={{
                                            fontSize: 12,
                                            backgroundColor: "#272727",
                                            fontFamily:
                                                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                            height: "250px",
                                            border: "solid 1px black",
                                        }}
                                    />
                                    <button type='submit'>送出指令</button>
                                </form>
                            </SqliteCommand>
                            <div>Sqlite Result（標題）</div>
                            <SqliteResult>
                                {typeof sqliteResult === "string" ? (
                                    <div>{sqliteResult}</div>
                                ) : (
                                    <SqliteResult>{sqliteResult && <Table data={sqliteResult} />}</SqliteResult>
                                )}
                            </SqliteResult>
                        </EditArea>
                        <ResultArea>Console</ResultArea>
                    </>
                ) : (
                    <>
                        {" "}
                        <FolderIndex>Redis沒有資料庫區</FolderIndex>
                        <EditArea>
                            <RedisCommand>
                                <div>Redis Commands</div>
                                <form onSubmit={handleRedisCommand}>
                                    <CodeEditor
                                        data-color-mode='dark'
                                        value={redisCommand}
                                        language='sql'
                                        placeholder='Please enter code.'
                                        onChange={handleRedisChange}
                                        padding={15}
                                        style={{
                                            fontSize: 12,
                                            backgroundColor: "#BB3D00",
                                            fontFamily:
                                                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                            height: "250px",
                                            border: "solid 1px black",
                                        }}
                                    />
                                    <button type='submit'>送出指令</button>
                                </form>
                            </RedisCommand>
                            <div>Redis Result（標題）</div>
                            <RedisResult>{redisResult}</RedisResult>
                        </EditArea>
                        <ResultArea>Console</ResultArea>
                    </>
                )}
            </WorkArea>
        </Area>
    );
};

export default Express;
