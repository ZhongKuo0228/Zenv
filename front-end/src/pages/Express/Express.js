import React from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import styled from "styled-components";
import { useState, useEffect, useContext, useRef, CSSProperties } from "react";
import Folder from "./FileTree/Folder";
import Table from "./SqlTable/SqlTable";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { FileContext } from "../../context/fileContext";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
// import TerminalComponent from "./Terminal";
import api from "../../util/api";
import { timestampWithDaysOffset } from "../../util/timestamp";
import webSocket from "socket.io-client";

//---
const Area = styled.div`
    width: 100%;
    border: solid 1px black;
    display: flex;

    flex-direction: column;
`;
//---
const ButtonArea1 = styled.div`
    width: 100%;
    height: 50px;
    border: solid 1px black;
    justify-content: space-around;
    padding: 10px;
`;
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
    height: 90vh;
    flex-direction: row;
`;

const FolderIndex = styled.div`
    width: 20%;
    border: solid 1px black;
    padding: 10px;
`;
const MainArea = styled.div`
    width: 59%;
    border: solid 1px black;
    padding: 10px;
`;
const EditArea = styled.div`
    width: 100%;
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
    height: 600px;
    overflow-y: scroll;
    white-space: nowrap;
`;

//---
const Express = () => {
    const { username, projectName } = useParams();
    const { file } = useContext(FileContext);
    const { fileName } = useContext(FileContext);
    const [expiredTime, setExpiredTime] = useState("");
    const [shouldFetchData, setShouldFetchData] = useState(true);
    const [initLoading, setInitLoading] = useState(false);
    const [initProgress, setInitProgress] = useState(0);
    const [runPort, setRunPort] = useState("伺服器未啓動");
    const [npmCommand, setNpmCommand] = useState("");
    const [sqliteCommand, setSqliteCommand] = useState("SELECT name FROM sqlite_master WHERE type='table'");
    const [sqliteResult, setSqliteResult] = useState("sqlite執行結果");
    const [redisCommand, setRedisCommand] = useState("");
    const [redisResult, setRedisResult] = useState("redis執行結果");
    const [expressLog, setExpressLog] = useState([]);
    const logEndRef = useRef(null);

    const serverName = `${username}_${projectName}`;

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
        //使用者進入網頁後自動刷新過期時間------------------------
        await api.updateExpiredTime(username, projectName);
        setExpiredTime(timestampWithDaysOffset(7));
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
    const handleCodeChange = React.useCallback((value, viewUpdate, event) => {
        setCode(value);
        localStorage.setItem("editedFileData", value);
    }, []);

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
        const task = "createServer";
        await api.resetFile(task, serverName);
    };

    const handleInitSubmit = async (event) => {
        event.preventDefault();
        setInitLoading(true);
        setInitProgress(0);

        // 模擬進度條
        const simulateProgress = () => {
            return new Promise((resolve) => {
                let progress = 0;
                let decimalPlaces = 0;
                const intervalId = setInterval(() => {
                    if (progress < 99) {
                        const remainingProgress = 99 - progress;
                        const randomIncrement = Math.floor(Math.random() * 20);

                        // 確保進度值不超過 99
                        progress += Math.min(randomIncrement, remainingProgress);
                    } else {
                        // 每秒添加一個小數位的 9
                        decimalPlaces += 1;
                        progress = parseFloat((progress + 9 * Math.pow(10, -decimalPlaces)).toFixed(decimalPlaces));
                    }
                    setInitProgress(progress);

                    if (decimalPlaces >= 99) {
                        clearInterval(intervalId);
                        resolve();
                    }
                }, 300); // 每秒更新一次
            });
        };

        // 調用 API
        const callApi = async () => {
            const task = "jsOperInit";
            const result = await api.jsOper(task, serverName);
            if (result) {
                setInitProgress(100);
                alert("初始化完成");
            }
            setInitLoading(false); // 隱藏動畫
        };

        // 同時運行進度條模擬和 API 調用
        await Promise.all([simulateProgress(), callApi()]);
    };
    const spinnerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
    };

    const progressBarStyle = {
        width: "150px",
        height: "5px",
        backgroundColor: "#ccc",
        marginTop: "10px",
    };

    const progressStyle = {
        width: `${initProgress}%`,
        height: "100%",
        backgroundColor: "#f11946",
    };

    const progressTextStyle = {
        color: "#fff",
        marginTop: "10px",
    };
    //---

    const handleRunSubmit = async (event) => {
        event.preventDefault();

        const task = "jsOperRun";
        const result = await api.jsOper(task, serverName, projectName);
        if (result) {
            alert(`express running on port : ${result.data}`);
            localStorage.setItem("port", result.data);
        }
        setRunPort(`http://localhost:${result.data}`);
    };
    useEffect(() => {
        const port = localStorage.getItem("port");
        fetchData();
        if (port) {
            setRunPort(`http://localhost:${port}`);
        } else {
            setRunPort("伺服器未啓動");
            localStorage.removeItem("port");
        }
    }, []);

    const handleStopSubmit = async (event) => {
        event.preventDefault();
        const task = "jsOperStop";
        const result = await api.jsOper(task, serverName);
        if (result) {
            alert("伺服器已停止");
        }
        localStorage.removeItem("port");
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
            {initLoading && (
                <div style={spinnerStyle}>
                    <ClipLoader size={150} color='#fff' />
                    <div style={progressBarStyle}>
                        <div style={progressStyle} />
                    </div>
                    <p style={progressTextStyle}>{`${initProgress}%`}</p>
                </div>
            )}
            <ButtonArea1>
                <button onClick={handleCreateSubmit}>創立專案</button>
                <button onClick={handleInitSubmit}>初始化 INIT</button>
            </ButtonArea1>
            <ButtonArea>
                <div>icon</div>
                <div>{projectName}</div>
                <button onClick={handleRunSubmit}>運行 RUN</button>
                <button onClick={handleStopSubmit}>暫停 STOP</button>
                <div>上次執行時間</div>
                <div>倒數30分鐘停止伺服器</div>
                <div>
                    開啓網頁按鈕
                    <a href={`${runPort}`} target='_blank' onChange={handleRunSubmit}>
                        {runPort}
                    </a>
                </div>
                <div>伺服器資料{expiredTime}後進行封存</div>
            </ButtonArea>
            <WorkArea>
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
                    <MainArea>
                        <div>
                            {features.map((feature, index) => (
                                <button
                                    style={{ background: "#3630a3", color: "white" }}
                                    onClick={(e) => handleFeature(feature)}
                                    key={index}
                                >
                                    {feature}
                                </button>
                            ))}
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
                        </div>
                        {feature === "NodeJs" ? (
                            <EditArea>
                                <FileName value={fileName} onChange={choiceFileChange} readOnly />
                                <CodeMirror
                                    value={code}
                                    height='80vh'
                                    theme={okaidia}
                                    extensions={[javascript({ jsx: true })]}
                                    onChange={handleCodeChange}
                                />
                            </EditArea>
                        ) : feature === "Sqlite" ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                {" "}
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
                            </>
                        )}
                    </MainArea>
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
            </WorkArea>
        </Area>
    );
};

export default Express;
