import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import api from "../../util/api";
import { timestamp, timeFormat } from "../../util/timestamp";
//使用者頁面後自動存檔------------------------
function commitPLpage() {
    //使用者關閉頁面後
    window.onbeforeunload = async function () {
        try {
            await api.PLcodeSave();
        } catch (error) {
            console.error(error);
        }
    };
}

commitPLpage();
//---styled-------------------------------------------

const Container_all = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    width: 100vw;
    flex-direction: column;
    height: 90vh;
    color: #fff;
    background-color: #272727;
`;
const ProjectInfo = styled.div`
    height: 30px;
    border: solid 1px #6c6c6c;
    padding: 10px;
    display: flex;
    justify-content: space-around;
`;
const Container_work = styled.div`
    display: flex;
    height: 100%;
`;
const WorkArea = styled.div`
    width: 70%;
    height: 100%;
    border: solid 1px #6c6c6c;
    padding: 10px;
`;
const BarTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2px;
`;

const ProjectName = styled.div`
    font-size: 30px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #333;
    color: #83cd29;
    transition: all 0.3s ease-in-out;
    &:hover {
        transform: scale(1.1);
        text-shadow: 2px 2px 3px #333;
    }
`;

const ConsoleArea = styled.div`
    width: 30%;
    height: 100%;
    padding: 10px;
    border: solid 1px #6c6c6c;
`;
const ConsoleResult = styled.textarea`
    width: 95%;
    font-size: 16px;
    height: 73vh;
    padding: 10px;
    background-color: #272727;
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
    const [permissions, setPermissions] = useState("");
    const [shareBtn, setShareBtn] = useState("");
    const [icon, setIcon] = useState("");
    const [extensions, setExtensions] = useState();
    const [result, setResult] = useState("");

    //fetch api---

    const getProjectInfo = async () => {
        try {
            const data = await api.getPLInfo(username, projectName);
            localStorage.setItem("editor", data.data.user_id);
            const usePL = data.data.service_item;
            localStorage.setItem("prog_lang", usePL);
            setProgLang(usePL);
            setExecTime(timeFormat(data.data.last_execution));
            setSaveTime(timeFormat(data.data.save_time));

            if (usePL === "JavaScript") {
                setExtensions([javascript({ jsx: true })]);
                setIcon(`${process.env.PUBLIC_URL}/images/icon_js.webp`);
            }
            const projectID = data.data.id;
            localStorage.setItem("PLprojectID", projectID);

            if (data.data.permissions === "private") {
                setPermissions("private");
                setShareBtn("分享專案");
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
            const data = await api.PLcodeRun();
            setResult(data.data);
            setExecTime(timestamp());
            setSaveTime(timestamp());
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

    const handleShareBtn = async (event) => {
        event.preventDefault();
        alert("預計 Sprint 4 開放分享功能，敬請期待");
    };

    return (
        <Container_all>
            <ProjectInfo>
                <div>
                    <img src={icon} alt='icon' style={{ width: "40px", height: "40px" }} />
                </div>
                <ProjectName>{projectName}</ProjectName>
                <button onClick={handleRunCodeSubmit}>
                    執行按鈕，啓動時會顯示停止，會跑倒數1分鐘的的進度條，然後改回停止
                </button>
                <div>上次執行時間 {execTime}</div>
                <button onClick={handleSaveCodeSubmit}>存檔</button>
                <div>上次存檔時間 {saveTime}</div>
                {permissions === "private" ? null : (
                    <>
                        <div>分享連結：.........</div>
                        <button>複製按鈕</button>
                    </>
                )}
                <button onClick={handleShareBtn}>{shareBtn}</button>
            </ProjectInfo>
            <Container_work>
                <WorkArea>
                    <BarTitle>{progLang}</BarTitle>
                    <hr />
                    <CodeMirror
                        value={code}
                        height='75vh'
                        theme={okaidia}
                        extensions={extensions}
                        onChange={handleChange}
                    />
                </WorkArea>
                <ConsoleArea>
                    <BarTitle>Console</BarTitle>
                    <hr />
                    <ConsoleResult value={result} readOnly />
                </ConsoleArea>
            </Container_work>
        </Container_all>
    );
};

export default WriteCode;
