import React from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaPlay, FaPause, FaChrome, FaSync, FaSave, FaCopy } from "react-icons/fa";
import styled from "styled-components";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import Folder from "./FileTree/Folder";
import Table from "./SqlTable/SqlTable";
import { FileContext } from "../../context/fileContext";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";
import Loading from "react-loading";
import api from "../../util/api";
import { timestampWithDaysOffset } from "../../util/timestamp";
import webSocket from "socket.io-client";
import images from "../../images/image";

//---
const HeaderHeight = "50px";

const CenteredLoading = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
const CreateHint = styled.div`
    color: #fff;
`;

const Area = styled.div`
    width: 100%;
    display: flex;
    background-color: #272727;
    color: #fff;
    flex-direction: column;
    height: calc(100vh - ${HeaderHeight});
`;
//---初始化
const ButtonArea1 = styled.div`
    border-top: solid 1px #ccc;
    border-bottom: solid 1px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ProjectIconAndTitle = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 50px;
    align-items: center;
`;

const StyledButtonInit = styled.button`
    background-color: #d9b300;
    color: #313638;
    border: none;
    font-weight: bold;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
        background-color: #e0dfd5;
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
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    margin-right: 15px;
`;

const Arrow = styled.span`
    color: #fff;
    font-weight: bold;
    font-size: 40px;
    margin: 0 10px;
`;
//--功能選單
const ButtonArea = styled.div`
    border-top: solid 1px #ccc;
    border-bottom: solid 1px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LargeText = styled.div`
    font-size: 40px;
    font-weight: bold;
    margin-left: 30px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%;
    & > *:not(:last-child) {
        margin-right: 10px;
    }
`;
const StyledButton = styled.button`
    background-color: ${(props) => (props.type === "run" ? "#73BF00" : "#95a5a6")};
    color: #fff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 18px;
    border-radius: 5px;
    & > *:first-child {
        margin-right: 15px;
    }
`;
const OpenWebContainer = styled.div`
    background-color: #bbb;
    display: flex;
    border-radius: 5px;
    margin-left: 30px;
    padding: 5px 10px;
`;

const WebPageButton = styled.button`
    color: #272727;
    background-color: #bbb;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 18px;
    & > *:first-child {
        margin-right: 15px;
    }
`;
const CopyURLButton = styled.button`
    background-color: #bbb;
    cursor: pointer;
    color: #272727;
    margin-left: 10px;
`;
const SmallText = styled.div`
    font-size: 12px;
`;

//---
const WorkArea = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;
//---檔案夾
const FileManager = styled.div`
    margin-bottom: 20px;
`;

const FileManagerHeader = styled.h3`
    margin: 0;
    text-align: center;
    letter-spacing: 8px;
`;

const FileManagerDivider = styled.hr`
    margin: 10px 0;
`;

const FileManagerDescription = styled.p`
    margin: 0;
`;
const FolderIndex = styled.div`
    width: 20%;
    border-right: solid 1px #ccc;
    padding: 10px;
`;

const ButtonFileContainer = styled.div`
    margin-right: 10px;
    margin-left: 90px;
    display: flex;
    gap: 20px;
`;

//功能分頁選單區
const FeatureTabsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const ButtonGroup = styled.div`
    display: flex;
`;

const FeatureButton = styled.button`
    background-color: ${({ selected }) => (selected ? "#ccc" : "#272727")};
    color: ${({ selected }) => (selected ? "#272727" : "#ccc")};
    border: none;
    border: 0.5px solid #e7e5df;
    border-bottom: 0.5px solid transparent;
    width: 120px;
    padding: 10px 0;
    font-size: ${({ selected }) => (selected ? "1.3em" : "1em")};
    font-weight: ${({ selected }) => (selected ? "bold" : "")};
    cursor: pointer;
    border-radius: 10px 10px 0 0;
    &:hover {
        background-color: ${({ selected }) => (selected ? "#ccc" : "#3C3C3C")};
        color: ${({ selected }) => (selected ? "#272727" : "#fff")};
    }
`;

const NpmForm = styled.form`
    border-left: 1px solid #fff;
    display: flex;
    padding: 0.25rem 1rem;
    align-items: center;
`;

const NpmLabel = styled.span`
    color: #fff;
    font-size: 1rem;
    margin-left: 0.5rem;
`;

const NpmInput = styled.input`
    width: 250px;
    background-color: #ccc;
    color: #272727;
    padding: 0.5rem;
    margin-left: 0.5rem;
    font-size: 1rem;
`;

//
const MainArea = styled.div`
    width: 59%;
`;
const EditArea = styled.div`
    width: 100%;
    border-top: 4px solid #ccc;
`;
const HintArea = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
`;
const FileName = styled.div`
    width: 60%;
    border: 0px;
    background-color: #272727;
    color: #fff;
    padding-left: 10px;
    font-size: 20px;
    display: flex;
    align-items: center;
`;
const ChangeHint = styled.div`
    display: flex;
    color: #ffaf60;
    font-size: 15px;
    width: 40%;
`;
const ResultArea = styled.div`
    border-left: solid 1px #ccc;
    width: 20%;
    padding: 10px;
`;
const ConsoleTitle = styled.div`
    letter-spacing: 3px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
`;
const SubmitButton = styled.button`
    background-color: #ccc;
    color: #000;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #000;
        color: #ccc;
    }
`;
const FeatureName = styled.div`
    width: 97.5%;
    border: 0px;
    background-color: #272727;
    color: #fff;
    padding: 5px 0 0 10px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const SqliteCommand = styled.div`
    width: 100%;
`;
const DBresultTitle = styled.div`
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    height: 3vh;
`;
const SqliteResult = styled.div`
    font-size: 18px;
    color: #ffffaa;
    padding: 10px;
    height: 30vh;
    overflow-y: auto;
    white-space: nowrap;
    background-color: #333;
`;

const RedisCommand = styled.div`
    width: 100%;
`;
const RedisResult = styled.div`
    font-size: 18px;
    color: #ffffaa;
    padding: 10px;
    height: 30vh;
    overflow-y: auto;
    white-space: nowrap;
    background-color: #333;
`;
const ExpressLog = styled.div`
    width: 90%;
    border: solid 1px #ccc;
    padding: 10px;
    height: 70vh;
    overflow-y: auto;
    white-space: nowrap;
`;

//---

//---
const Express = () => {
    const fileContext = useContext(FileContext);
    const {
        file,
        fileName,
        folderData,
        setFolderData,
        selectedFeature,
        setSelectedFeature,
        feature,
        setFeature,
        isEditedFileDataPresent,
        setIsEditedFileDataPresent,
    } = fileContext;
    const { username, projectName } = useParams();
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [expiredTime, setExpiredTime] = useState("");
    const [remainingTime, setRemainingTime] = useState(null);
    const [shouldFetchData, setShouldFetchData] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [initLoading, setInitLoading] = useState(false);
    const [initProgress, setInitProgress] = useState(0);
    const [initHint, setInitHint] = useState(0);
    const [runPort, setRunPort] = useState(false);
    const [npmCommand, setNpmCommand] = useState("");
    const [sqliteCommand, setSqliteCommand] = useState(
        "請輸入sqlite指令(例如：SELECT name FROM sqlite_master WHERE type='table';)"
    );
    const [sqliteResult, setSqliteResult] = useState("請先建立伺服器檔案 並 初始化環境");
    const [redisCommand, setRedisCommand] = useState("請輸入redis指令(例如：set foo bar)");
    const [redisResult, setRedisResult] = useState("請先建立伺服器檔案 並 初始化環境");
    const [expressLog, setExpressLog] = useState([]);
    const runPortRef = useRef(null);
    // const [selectedFeature, setSelectedFeature] = useState("NodeJs");

    const logEndRef = useRef(null);

    const serverName = `${username}_${projectName}`;

    //---功能選擇
    // const [feature, setFeature] = useState("NodeJs");
    const handleFeature = (data) => {
        setFeature(data);
        setSelectedFeature(data);
    };
    const features = ["NodeJs", "Sqlite", "Redis"];

    //---資料夾樹狀結構
    // const [folderData, setFolderData] = useState(null);
    const [code, setCode] = useState("//請從左邊檔案目錄選取檔案，可從app.js開始");
    const [choiceFile, setChoiceFile] = useState("檔名");
    //確認使用者是否有此專案----------------------------------------------------
    const checkInfo = async () => {
        const data = await api.checkInfo(projectName);

        if (data.data.length < 1) {
            window.location.href = `/profile/${username}`;
        } else if (data.data[0].start_execution === null) {
            await handleCreateSubmit(); // 等待 handleCreateSubmit 函數完成
            await new Promise((resolve) => setTimeout(resolve, 300)); // 等待 1 秒
            handleInitSubmit(); // 執行 handleInitSubmit 函數
            setIsInit(true);
            //記錄已經執行------------------------
            await api.updateExpiredTime(username, projectName);
        } else {
            localStorage.setItem("execTime", data.data[0].start_execution);
            localStorage.setItem("openedFolders", `{"gitFolder":true}`);
            setSqliteResult("sqlite執行結果");
            setRedisResult("redis執行結果");
            setIsInit(true);
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
    // const fetchData = async () => {
    //     const data = await api.getFolderIndex(serverName);
    //     setFolderData(data);
    //     setShouldFetchData(false);
    // };

    async function getServerData() {
        const data = await api.fetchData(serverName);
        setFolderData(data);
        setShouldFetchData(false);
    }

    useEffect(() => {
        if (shouldFetchData) {
            getServerData();
        }
    }, [shouldFetchData]);

    const handleIndexRefresh = () => {
        getServerData();
    };

    //處理檔案被點擊後，將編輯區更新內容------------------------------------------------------------
    const handleCodeChange = React.useCallback((value, viewUpdate, event) => {
        setCode(value);
        localStorage.setItem("editedFileData", value);
        setIsEditedFileDataPresent(true);
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
        if (ChoiceFile) {
            const pathFormat = ChoiceFile.replace(/\//g, " ❯ ");
            setChoiceFile(pathFormat);
        }

        //動態觀察
    }, [fileName]);

    // 模擬進度條-----
    let intervalId = null; // 在函數外部聲明 intervalId 變量
    const simulateProgress = () => {
        return new Promise((resolve) => {
            // 在執行新的 setInterval 之前，清除先前的 intervalId
            if (intervalId) {
                clearInterval(intervalId);
            }

            let progress = 0;
            let decimalPlaces = 0; // 重置 decimalPlaces
            intervalId = setInterval(() => {
                // 不再使用 const 聲明
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
            }, 500); // 更新間隔
        });
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
    //NodeJS按鈕動作---
    const handleCreateSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }
        setInitHint("第一階段：建立專案檔案，請稍候");
        setInitLoading(true);
        setInitProgress(0);
        simulateProgress();
        const task = "createServer";
        return new Promise(async (resolve, reject) => {
            try {
                const result = await api.resetFile(task, serverName);
                if (result) {
                    await getServerData();
                    setInitProgress(100);
                }
                setInitLoading(false); // 隱藏動畫
                localStorage.setItem("openedFolders", `{"gitFolder":true}`);
                // 在這裡使用 resolve() 方法，表示 handleCreateSubmit 函數已經完成
                resolve();
            } catch (error) {
                // 在這裡使用 reject() 方法，表示 handleCreateSubmit 函數遇到了錯誤
                reject(error);
            }
        });
    };

    const handleInitSubmit = async (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        setInitHint("第二階段：環境初始化中，請稍候");
        setInitLoading(true);
        setInitProgress(0);
        setSqliteResult("sqlite執行結果");
        setRedisResult("redis執行結果");
        setIsInit(true);

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

    //---

    const handleRunSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }
        await handlePostRewrite();
        const task = "jsOperRun";
        setIsActionLoading(true);
        const result = await api.jsOper(task, serverName, projectName);
        if (result) {
            alert(`express running on port : ${result.data}`);
            window.localStorage.setItem("port", result.data);
        }
        //使用者進入網頁後自動刷新過期時間------------------------
        await api.updateExpiredTime(username, projectName);
        setIsActionLoading(false);
        setExpiredTime(timestampWithDaysOffset(7));
        setRunPort(`${api.tcpClientIp}:${result.data}`);
        // Set the remaining time to 30 minutes (1800 seconds)
        checkRemainingTime();
    };
    useEffect(() => {
        const port = localStorage.getItem("port");
        getServerData();
        if (port) {
            setRunPort(`${api.tcpClientIp}:${port}`);
        } else {
            setRunPort(false);
        }
    }, []);

    const handleStopSubmit = async (event) => {
        event.preventDefault();
        setIsActionLoading(true);
        const task = "jsOperStop";
        const result = await api.jsOper(task, serverName);
        setIsActionLoading(false);
        if (result) {
            alert("伺服器已停止");
        }
        localStorage.removeItem("port");
        setRemainingTime(null);
        setRunPort(false);
    };
    const handleRestartSubmit = async (event) => {
        event.preventDefault();
        setIsActionLoading(true);
        const task = "jsOperStop";
        const result = await api.jsOper(task, serverName);
        if (result) {
            handleRunSubmit();
        }
    };
    const handleWebPageOpen = (event) => {
        event.stopPropagation();
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
    const handleNpmSubmit = useCallback(
        async (event) => {
            if (event) {
                event.preventDefault();
            }

            if (!npmCommand.startsWith("npm")) {
                alert("請輸入 npm 指令");
                return;
            }

            const command = npmCommand.slice(4).trim();
            if (!command) {
                alert("請輸入 npm 指令");
                return;
            }

            const task = "jsOperNpm";
            setIsActionLoading(true);
            const result = await api.jsOper(task, serverName, command);
            setIsActionLoading(false);
            if (result.data.code) {
                alert(`npm 指令 ${command} 輸入錯誤 或找不到此名稱套件`);
            } else {
                alert(`npm 指令 ${command} 完成`);
            }
        },
        [npmCommand, serverName]
    );
    const handleNpmSubmitKeyDown = useCallback(
        (event) => {
            if (event && event.key === "Enter") {
                event.preventDefault();
                handleNpmSubmit();
            }
        },
        [handleNpmSubmit]
    );
    //sqlite指令操作
    const handleSqliteCommand = async (event) => {
        event.preventDefault();
        const task = "sqliteCommand";
        const sqliteCommand = localStorage.getItem("sqliteCommand");
        const result = await api.sqliteCommand(task, serverName, sqliteCommand);
        if (Array.isArray(result.data)) {
            // 確認資料為陣列
            setSqliteResult(result.data);
        } else {
            setSqliteResult(result.data);
        }
    };

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
        setRedisResult(result.data);
    };
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
        const socket = webSocket(`${api.stockIO}`);
        socket.on("connect", () => {
            console.log("Successfully connected to server!");
        });
        socket.on(serverName, (data) => {
            setExpressLog((prevLogs) => [...prevLogs, data]); // 將接收到的資料設置為 expressLog 的新值
        });
        socketRef.current = socket;
        setWs(socketRef.current);
        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    //---
    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [expressLog]);

    const handlePostRewrite = async () => {
        const fileName = localStorage.getItem("nowChoiceFile");
        const editCode = localStorage.getItem("editedFileData");
        const task = "rewriteFile";
        try {
            await api.rewriteFile(task, serverName, fileName, editCode);
        } catch (error) {
            console.error("Error fetching POST event data:", error);
        }
        localStorage.removeItem("editedFileData");
        setIsEditedFileDataPresent(false);
    };
    const handleCopyClick = () => {
        const runPortContent = runPortRef.current.innerText;
        navigator.clipboard.writeText(runPortContent).then(() => {
            window.alert("已複製網址");
        });
    };

    //---------------------------------------------------------------------------
    return (
        <>
            <div>
                {isActionLoading && (
                    <CenteredLoading>
                        <Loading type='spin' color='#00BFFF' height={100} width={100} />
                    </CenteredLoading>
                )}
            </div>
            <Area>
                {initLoading && (
                    <div style={spinnerStyle}>
                        <ClipLoader size={150} color='#fff' />
                        <div style={progressBarStyle}>
                            <div style={progressStyle} />
                        </div>
                        <p style={progressTextStyle}>{`${initProgress}%`}</p>
                        <p style={progressTextStyle}>{initHint}</p>
                    </div>
                )}
                {!isInit ? (
                    <ButtonArea1>
                        <ProjectIconAndTitle>
                            <img src={images.iconExpressBar} alt='Logo' width='50px' height='50px' />
                            <LargeText>{projectName}</LargeText>
                        </ProjectIconAndTitle>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ButtonWrapper>
                                <StepNumber>1</StepNumber>
                                <StyledButtonInit onClick={handleCreateSubmit}>建立伺服器檔案 </StyledButtonInit>
                            </ButtonWrapper>
                            <Arrow>➡</Arrow>
                            <ButtonWrapper>
                                <StepNumber>2</StepNumber>
                                <StyledButtonInit onClick={handleInitSubmit}>初始化環境</StyledButtonInit>
                            </ButtonWrapper>
                        </div>
                        <StyledButtonInit onClick={handleInitOptionClose}>關閉初始化選單</StyledButtonInit>
                    </ButtonArea1>
                ) : (
                    <ButtonArea>
                        <ProjectIconAndTitle>
                            <img src={images.iconExpressBar} alt='Logo' width='50px' height='50px' />
                            <LargeText>{projectName}</LargeText>
                        </ProjectIconAndTitle>
                        <ButtonContainer>
                            {!runPort ? (
                                <StyledButton type='run' onClick={handleRunSubmit}>
                                    <FaPlay />
                                    RUN
                                </StyledButton>
                            ) : (
                                <>
                                    <StyledButton type='stop' onClick={handleStopSubmit}>
                                        <FaPause />
                                        STOP
                                    </StyledButton>
                                    <StyledButton type='run' onClick={handleRestartSubmit}>
                                        <FaSync />
                                        RESTART
                                    </StyledButton>
                                    <OpenWebContainer ref={runPortRef}>
                                        <WebPageButton onClick={handleWebPageOpen}>
                                            <FaChrome />
                                            {runPort}
                                        </WebPageButton>
                                        <CopyURLButton>
                                            <FaCopy onClick={handleCopyClick} />
                                        </CopyURLButton>
                                    </OpenWebContainer>
                                </>
                            )}
                        </ButtonContainer>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", width: "150px" }}>
                                {remainingTime && remainingTime > 0 && (
                                    <SmallText>倒數{formatRemainingTime(remainingTime)}停止伺服器</SmallText>
                                )}
                                {/* <SmallText>伺服器資料{expiredTime}後進行封存</SmallText> */}
                            </div>
                            <StyledButtonInit onClick={handleInitOptionOpen}>開啓初始化選單</StyledButtonInit>
                        </div>
                    </ButtonArea>
                )}
                <WorkArea>
                    <>
                        <FolderIndex>
                            <FileManager>
                                <FileManagerHeader>檔案總管</FileManagerHeader>
                                <FileManagerDivider />
                                <FileManagerDescription>忽略顯示檔案 :</FileManagerDescription>
                                <FileManagerDescription>node_modules、package-lock.json</FileManagerDescription>
                                <FileManagerDivider />
                            </FileManager>
                            <ButtonFileContainer>
                                <button onClick={handleIndexRefresh}>
                                    <FaSync /> 更新目錄
                                </button>
                                <button onClick={handlePostRewrite}>
                                    <FaSave /> 存檔
                                </button>
                            </ButtonFileContainer>
                            <hr />
                            {folderData && <Folder folder={folderData} />} {/* 如果資料存在，則渲染 Folder 元件 */}
                        </FolderIndex>
                        <MainArea>
                            <FeatureTabsContainer>
                                <ButtonGroup>
                                    {features.map((feature, index) => (
                                        <FeatureButton
                                            onClick={() => handleFeature(feature)}
                                            key={index}
                                            selected={selectedFeature === feature}
                                        >
                                            {feature}
                                        </FeatureButton>
                                    ))}
                                </ButtonGroup>
                                <NpmForm onSubmit={handleNpmSubmit}>
                                    <NpmLabel>npm 指令</NpmLabel>
                                    <NpmInput
                                        type='text'
                                        placeholder='npm install ... (按下ENTER送出)'
                                        value={npmCommand}
                                        onChange={(e) => setNpmCommand(e.target.value)}
                                        onKeyDown={handleNpmSubmitKeyDown}
                                    />
                                </NpmForm>
                            </FeatureTabsContainer>
                            {feature === "NodeJs" ? (
                                <EditArea>
                                    <HintArea>
                                        <FileName onChange={choiceFileChange}>{choiceFile}</FileName>
                                        {isEditedFileDataPresent && (
                                            <ChangeHint>
                                                <p>偵測檔案異動，可重新啓動伺服器載入最新資料</p>
                                            </ChangeHint>
                                        )}
                                    </HintArea>
                                    <hr />
                                    <div style={{ fontSize: "1.2em" }}>
                                        <CodeMirror
                                            value={code}
                                            width='100%'
                                            height='70vh'
                                            theme={okaidia}
                                            extensions={[javascript({ jsx: true })]}
                                            onChange={handleCodeChange}
                                        />
                                    </div>
                                </EditArea>
                            ) : feature === "Sqlite" ? (
                                <>
                                    <EditArea>
                                        <SqliteCommand>
                                            <form onSubmit={handleSqliteCommand}>
                                                <FeatureName>
                                                    Sqlite Commands<SubmitButton type='submit'>送出指令</SubmitButton>
                                                </FeatureName>
                                                <hr />
                                                <div style={{ fontSize: "1.2em" }}>
                                                    <CodeMirror
                                                        value={sqliteCommand}
                                                        height='30vh'
                                                        theme={okaidia}
                                                        extensions={sql()}
                                                        onChange={handleSqliteChange}
                                                    />
                                                </div>
                                            </form>
                                        </SqliteCommand>
                                        <hr />
                                        <DBresultTitle>Sqlite 執行結果</DBresultTitle>
                                        <hr />
                                        <SqliteResult>
                                            {typeof sqliteResult === "string" ? (
                                                <div>{sqliteResult}</div>
                                            ) : (
                                                <SqliteResult>
                                                    {sqliteResult && <Table data={sqliteResult} />}
                                                </SqliteResult>
                                            )}
                                        </SqliteResult>
                                    </EditArea>
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <EditArea>
                                        <RedisCommand>
                                            <form onSubmit={handleRedisCommand}>
                                                <FeatureName>
                                                    Redis Commands<SubmitButton type='submit'>送出指令</SubmitButton>
                                                </FeatureName>
                                                <hr />
                                                <div style={{ fontSize: "1.2em" }}>
                                                    <CodeMirror
                                                        value={redisCommand}
                                                        height='30vh'
                                                        theme={okaidia}
                                                        extensions={sql()}
                                                        onChange={handleRedisChange}
                                                    />
                                                </div>
                                            </form>
                                        </RedisCommand>
                                        <hr />
                                        <DBresultTitle>Redis 執行結果</DBresultTitle>
                                        <hr />
                                        <RedisResult>{redisResult}</RedisResult>
                                    </EditArea>
                                </>
                            )}
                        </MainArea>
                        <ResultArea>
                            <ConsoleTitle>Console</ConsoleTitle>
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
        </>
    );
};

export default Express;
