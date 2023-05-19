import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { FaPlay, FaPause, FaChrome, FaSync, FaSave } from "react-icons/fa";
import Loading from "react-loading";
import { createTheme } from "@uiw/codemirror-themes";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import api from "../../util/api";
import webSocket from "socket.io-client";
import { timestamp, timeFormat } from "../../util/timestamp";
import images from "../../images/image";
// 使用者頁面後自動存檔------------------------
function commitPLpage() {
    //使用者關閉頁面後
    window.addEventListener("beforeunload", async function (event) {
        try {
            await api.PLcodeSave();
        } catch (error) {
            console.error(error);
        }
        event.preventDefault(); // 阻止默認行為，讓瀏覽器不跳出提示
        event.returnValue = ""; // 回傳空字串，讓瀏覽器不跳出提示
    });
}

commitPLpage();
//---styled-------------------------------------------
const HeaderHeight = "50px";
const Container_all = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - ${HeaderHeight});
    color: #fff;
    background-color: #272727;
`;
const ProjectInfo = styled.div`
    border: solid 1px #6c6c6c;
    padding: 5px;
    display: flex;
`;
const Container_work = styled.div`
    display: flex;
`;
const WorkArea = styled.div`
    width: 70%;
    border: solid 1px #6c6c6c;
    padding: 10px;
`;

const BarTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2px;
`;
//---
const ProjectContainer = styled.div`
    display: flex;
    margin-left: 50px;
    width: 300px;
`;

const ProjectName = styled.div`
    font-size: 30px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #333;
    color: #83cd29;
    margin-left: 30px;
    transition: all 0.3s ease-in-out;
    &:hover {
        transform: scale(1.1);
        text-shadow: 2px 2px 3px #333;
    }
`;

const ActionButton = styled.div`
    display: flex;
    align-items: flex-end;
    margin-left: 30px;
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
        margin-right: 5px;
    }
`;
const TimeStamp = styled.div`
    color: #adadad;
    margin-left: 10px;
`;

const ConsoleArea = styled.div`
    width: 30%;
    padding: 10px;
    border: solid 1px #6c6c6c;
`;
const ConsoleResult = styled.textarea`
    width: 95%;
    font-size: 16px;
    height: 70vh;
    padding: 10px;
    background-color: #272727;
    color: #fff;
`;
const CenteredLoading = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const LoadingTips = styled.div`
    color: #fff;
`;
//---
const WriteCode = () => {
    //---
    const { username, projectName } = useParams();
    const [code, setCode] = useState("");
    const [progLang, setProgLang] = useState("");
    const [execTime, setExecTime] = useState("");
    const [saveTime, setSaveTime] = useState("");
    const [isCodeRun, setIsCodeRun] = useState(false);
    const [icon, setIcon] = useState("");
    const [extensions, setExtensions] = useState();
    const [result, setResult] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    //fetch api---

    const getProjectInfo = async () => {
        try {
            const data = await api.getPLInfo(username, projectName);
            if (data.data === "err") {
                window.location.href = `/profile/${username}`;
            } else {
                localStorage.setItem("editor", data.data.user_id);
                const usePL = data.data.service_item;
                localStorage.setItem("prog_lang", usePL);
                setProgLang(usePL);
                //非第一次創立專案進入時
                if (data.data.save_time != null && data.data.last_execution != null) {
                    setExecTime(timeFormat(data.data.last_execution));
                    setSaveTime(timeFormat(data.data.save_time));
                }
                if (data.data.edit_code == null) {
                    setCode("");
                } else {
                    localStorage.setItem("code", data.data.edit_code);
                    setCode(data.data.edit_code);
                }

                if (usePL === "JavaScript") {
                    setExtensions([javascript({ jsx: true })]);
                    setIcon(images.iconJs);
                } else if (usePL === "Python") {
                    setExtensions([python()]);
                    setIcon(images.iconPython);
                } else if (usePL === "Java") {
                    setExtensions([java()]);
                    setIcon(images.iconJava);
                } else if (usePL === "C++") {
                    setExtensions([cpp()]);
                    setIcon(images.iconCpp);
                }
                const projectID = data.data.id;
                localStorage.setItem("PLprojectID", projectID);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        // 在頁面首次加載時自動執行 getProjectInfo 函數
        getProjectInfo();
    }, []);

    const handleRunCodeSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsActionLoading(true);
            setIsCodeRun(true);
            const data = await api.PLcodeRun();
            setIsActionLoading(false);
            setIsCodeRun(false);
            setResult(data.data);
            setExecTime(timestamp());
            setSaveTime(timestamp());
        } catch (error) {
            console.error(error);
        }
    };

    const handleRunCodeStop = async (event) => {
        event.preventDefault();
        try {
            setIsActionLoading(false);
            setIsCodeRun(false);
            setResult("停止程式執行");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveCodeSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await api.PLcodeSave();
            setResult(data.data);
            setSaveTime(timestamp());
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = React.useCallback((value, viewUpdate) => {
        setCode(value);
        localStorage.setItem("code", value);
    }, []);

    useEffect(() => {
        const storedCode = localStorage.getItem("code");
        if (storedCode) {
            setCode(storedCode);
        }
    }, []);

    return (
        <>
            <div>
                {isActionLoading && (
                    <CenteredLoading>
                        <Loading type='spin' color='#00BFFF' height={100} width={100} />
                        <LoadingTips>提示：執行編譯超過1分鐘無回應將停止當次執行</LoadingTips>
                    </CenteredLoading>
                )}
            </div>
            <Container_all>
                <ProjectInfo>
                    <ProjectContainer>
                        <div>
                            <img src={icon} alt='icon' style={{ width: "40px", height: "40px" }} />
                        </div>
                        <ProjectName>{projectName}</ProjectName>
                    </ProjectContainer>
                    <ActionButton>
                        {!isCodeRun ? (
                            <StyledButton type='run' onClick={handleRunCodeSubmit}>
                                <FaPlay />
                                運行 RUN
                            </StyledButton>
                        ) : (
                            <StyledButton onClick={handleRunCodeStop}>
                                <FaPause />
                                停止 STOP
                            </StyledButton>
                        )}
                        <TimeStamp>上次執行時間 {execTime}</TimeStamp>
                    </ActionButton>
                    <ActionButton>
                        <StyledButton type='save' onClick={handleSaveCodeSubmit}>
                            <FaSave />
                            存檔 SAVE
                        </StyledButton>
                        <TimeStamp>上次存檔時間 {saveTime}</TimeStamp>
                    </ActionButton>
                </ProjectInfo>
                <Container_work>
                    <WorkArea>
                        <BarTitle>{progLang}</BarTitle>
                        <hr />
                        <div style={{ fontSize: "1.3em" }}>
                            <CodeMirror
                                value={code}
                                height='75vh'
                                theme={okaidia}
                                extensions={extensions}
                                onChange={handleChange}
                            />
                        </div>
                    </WorkArea>
                    <ConsoleArea>
                        <BarTitle>Console</BarTitle>
                        <hr />
                        <ConsoleResult value={result} readOnly />
                    </ConsoleArea>
                </Container_work>
            </Container_all>
        </>
    );
};

export default WriteCode;
