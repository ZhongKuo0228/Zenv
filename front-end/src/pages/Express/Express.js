import React from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { FaPlay, FaPause, FaChrome } from "react-icons/fa";
import styled from "styled-components";
import { useState, useEffect, useContext, useRef, CSSProperties } from "react";
import Folder from "./FileTree/Folder";
import Table from "./SqlTable/SqlTable";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { FileContext } from "../../context/fileContext";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";
import api from "../../util/api";
import { timestampWithDaysOffset } from "../../util/timestamp";
import webSocket from "socket.io-client";
import images from "../../images/image";

//---
const Area = styled.div`
    width: 100%;
    border: solid 1px black;
    display: flex;

    flex-direction: column;
`;
//---初始化
const ButtonArea1 = styled.div`
    width: 100%;
    height: 50px;
    border: solid 1px black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
`;

const StyledButtonInit = styled.button`
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        background-color: #444;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-left: 15px;

    &:not(:last-child) {
        margin-right: 15px;
    }
`;

const StepNumber = styled.span`
    color: black;
    font-weight: bold;
    margin-right: 5px;
`;

const Arrow = styled.span`
    color: black;
    font-weight: bold;
    font-size: 40px;
    margin: 0 10px;
`;
//--功能選單
const ButtonArea = styled.div`
    width: 100%;
    height: 50px;
    border: solid 1px black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
`;

const LargeText = styled.div`
    font-size: 50px;
    font-weight: bold;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;

    & > *:not(:last-child) {
        margin-right: 10px;
    }
`;
const StyledButton = styled.button`
    background-color: ${(props) => (props.type === "run" ? "#2ecc71" : "#95a5a6")};
    color: #fff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 18px;
    border-radius: 5px;

    & > *:first-child {
        margin-right: 5px;
    }
`;
const WebPageButton = styled.button`
    background-color: #000;
    color: #fff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 18px;
    border-radius: 5px;

    & > *:first-child {
        margin-right: 5px;
    }
`;

const SmallText = styled.div`
    font-size: 12px;
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
    const [remainingTime, setRemainingTime] = useState(null);
    const [shouldFetchData, setShouldFetchData] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [initLoading, setInitLoading] = useState(false);
    const [initProgress, setInitProgress] = useState(0);
    const [runPort, setRunPort] = useState(false);
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
    //確認使用者是否有此專案----------------------------------------------------
    const checkInfo = async () => {
        const data = await api.checkInfo(projectName);
        if (data.data === "err") {
            window.location.href = `/profile/${username}`;
        } else {
            localStorage.setItem("execTime", data.data[0].start_execution);
        }
    };
    useEffect(() => {
        checkInfo();
    }, []);

    const checkRemainingTime = () => {
        const storedTime = localStorage.getItem("execTime");
        const port = localStorage.getItem("port");
        if (storedTime && port) {
            const currentTime = new Date();
            const execTime = new Date(storedTime);
            const timeDifference = currentTime - execTime;
            const timeThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

            if (timeDifference > timeThreshold) {
                localStorage.removeItem("port");
                setRemainingTime(null);
            } else {
                const remaining = timeThreshold - timeDifference;
                setRemainingTime(remaining);
                setTimeout(() => {
                    checkRemainingTime();
                }, 1000);
            }
        }
    };
    useEffect(() => {
        checkRemainingTime();
    }, []);
    const formatRemainingTime = (time) => {
        if (time === null) return "";
        const minutes = Math.floor(time / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        return `${minutes}分${seconds}秒`;
    };
    //讀取資料夾目錄------------------------------------------------------------
    const fetchData = async () => {
        const data = await api.getFolderIndex(serverName);
        setFolderData(data);
        setShouldFetchData(false);
    };
    useEffect(() => {
        if (shouldFetchData) {
            fetchData();
            setIsInit(true);
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
        setIsInit(true);

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
        //使用者進入網頁後自動刷新過期時間------------------------
        await api.updateExpiredTime(username, projectName);
        setExpiredTime(timestampWithDaysOffset(7));
        setRunPort(`${api.tcpClientIp}:${result.data}`);
        // Set the remaining time to 30 minutes (1800 seconds)
        checkRemainingTime();
    };
    useEffect(() => {
        const port = localStorage.getItem("port");
        fetchData();
        if (port) {
            setRunPort(`${api.tcpClientIp}:${port}`);
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
        setRemainingTime(null);
        setRunPort(false);
    };
    const handleWebPageOpen = () => {
        const port = localStorage.getItem("port");
        if (port) {
            window.open(`${api.tcpClientIp}:${port}`);
        } else {
            handleRunSubmit();
        }
    };
    const handleInitOptionOpen = async (event) => {
        setIsInit(false);
    };
    const handleInitOptionClose = async (event) => {
        setIsInit(true);
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
    // const handleSqliteChange = (event) => {
    //     const value = event.target.value;
    //     setSqliteCommand(value);
    //     localStorage.setItem("sqliteCommand", value);
    // };

    const handleSqliteChange = React.useCallback((value, viewUpdate, event) => {
        setSqliteCommand(value);
        localStorage.setItem("sqliteCommand", value);
    }, []);
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
    // const handleRedisChange = (event) => {
    //     const value = event.target.value;
    //     setRedisCommand(value);
    //     localStorage.setItem("redisCommand", value);
    // };
    const handleRedisChange = React.useCallback((value, viewUpdate, event) => {
        setRedisCommand(value);
        localStorage.setItem("redisCommand", value);
    }, []);
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
        const socket = webSocket(`${api.hostname}`);
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
            {!isInit ? (
                <ButtonArea1>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={images.iconExpressBar} alt='Logo' width='150px' />
                        <LargeText>{projectName}</LargeText>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ButtonWrapper>
                            <StepNumber>1</StepNumber>
                            <StyledButtonInit onClick={handleCreateSubmit}>創立專案</StyledButtonInit>
                        </ButtonWrapper>
                        <Arrow>➡</Arrow>
                        <ButtonWrapper>
                            <StepNumber>2</StepNumber>
                            <StyledButtonInit onClick={handleInitSubmit}>初始化 INIT</StyledButtonInit>
                        </ButtonWrapper>
                    </div>
                    <StyledButtonInit onClick={handleInitOptionClose}>關閉初始化選單</StyledButtonInit>
                </ButtonArea1>
            ) : (
                <ButtonArea>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={images.iconExpressBar} alt='Logo' width='150px' />
                        <LargeText>{projectName}</LargeText>
                    </div>
                    <ButtonContainer>
                        {!runPort ? (
                            <StyledButton type='run' onClick={handleRunSubmit}>
                                <FaPlay />
                                運行 RUN
                            </StyledButton>
                        ) : (
                            <StyledButton type='stop' onClick={handleStopSubmit}>
                                <FaPause />
                                暫停 STOP
                            </StyledButton>
                        )}
                        {runPort && (
                            <WebPageButton onClick={handleWebPageOpen}>
                                <FaChrome />
                                開啓網頁
                            </WebPageButton>
                        )}
                    </ButtonContainer>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {remainingTime && remainingTime > 0 && (
                                <SmallText>倒數{formatRemainingTime(remainingTime)}停止伺服器</SmallText>
                            )}
                            <SmallText>伺服器資料{expiredTime}後進行封存</SmallText>
                        </div>
                        <StyledButtonInit onClick={handleInitOptionOpen}>開啓初始化選單</StyledButtonInit>
                    </div>
                </ButtonArea>
            )}
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
                                    height='70vh'
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
                                            <CodeMirror
                                                value={sqliteCommand}
                                                height='50vh'
                                                theme={okaidia}
                                                extensions={sql()}
                                                onChange={handleSqliteChange}
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
                                            <CodeMirror
                                                value={redisCommand}
                                                height='50vh'
                                                theme={okaidia}
                                                extensions={sql()}
                                                onChange={handleRedisChange}
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
