import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import api from "../../util/api";
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
    display: flex;
    width: 100vw;
    flex-direction: column;
    height: 90vh;
`;
const ProjectInfo = styled.div`
    height: 30px;
    border: solid 1px black;
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
    border: solid 1px black;
    padding: 10px;
`;

const ConsoleArea = styled.div`
    width: 30%;
    height: 100%;
    padding: 10px;
    border: solid 1px black;
`;
const ConsoleResult = styled.textarea`
    width: 80%;
    height: 80vh;
    padding: 10px;
    border: solid 1px black;
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
    const [icon, setIcon] = useState("");
    const [extensions, setExtensions] = useState();
    const [result, setResult] = useState("請RUN");

    //fetch api---

    const getProjectInfo = async () => {
        try {
            const data = await api.getPLInfo(username, projectName);
            localStorage.setItem("editor", data.data.user_id);
            const usePL = data.data.service_item;
            localStorage.setItem("prog_lang", usePL);
            setProgLang(usePL);
            setExecTime(data.data.last_execution);
            setSaveTime(data.data.save_time);

            if (usePL === "JavaScript") {
                setExtensions([javascript({ jsx: true })]);
                setIcon(`${process.env.PUBLIC_URL}/images/icon_js.webp`);
            }
            const projectID = data.data.id;
            localStorage.setItem("projectID", projectID);

            if (data.data.permissions === "private") {
                setPermissions("分享專案");
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
        } catch (error) {
            console.error(error);
        }
    };
    const handleSaveCodeSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await api.PLcodeSave();
            setResult(data.data);
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
        <Container_all>
            <ProjectInfo>
                <div>
                    <img src={icon} alt='icon' style={{ width: "40px", height: "40px" }} />
                </div>
                <div>{projectName}</div>
                <button onClick={handleRunCodeSubmit}>
                    執行按鈕，啓動時會顯示停止，會跑倒數1分鐘的的進度條，然後改回停止
                </button>
                <div>{execTime}</div>
                <button onClick={handleSaveCodeSubmit}>存檔</button>
                <div>{saveTime}</div>
                <button>{permissions}</button>
                <div>分享連結：.........</div>
                <button>複製按鈕</button>
            </ProjectInfo>
            <Container_work>
                <WorkArea>
                    <div>目前使用語言：{progLang}</div>
                    <CodeMirror
                        value={code}
                        height='80vh'
                        theme={okaidia}
                        extensions={extensions}
                        onChange={handleChange}
                    />
                </WorkArea>
                <ConsoleArea>
                    <div>Console</div>
                    <ConsoleResult value={result} readOnly />
                </ConsoleArea>
            </Container_work>
        </Container_all>
    );
};

export default WriteCode;
