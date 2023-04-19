import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CodeEditor from "@uiw/react-textarea-code-editor";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import { v4 as uuidv4 } from "uuid";
import { commitPLpage } from "../../util/commitResult.js";
//使用者頁面後自動存檔------------------------
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
    height: 400px;
    padding: 10px;
    border: solid 1px black;
`;

//---
const WriteCode = () => {
    //---
    const [code, setCode] = useState("");
    const [result, setResult] = useState("請RUN");

    //fetch api---
    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = "http://localhost:3001/api/1.0/PLcode/run";
        try {
            const userId = "abc@gmail.com";
            const socketId = "abc1234";
            const executeId = uuidv4();
            const code = localStorage.getItem("code");
            const programLanguage = "js";
            const codeData = {
                userId: userId,
                socketId: socketId,
                executeId: executeId,
                code: code,
                programLanguage: programLanguage,
            };
            console.log("codeData", codeData);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: codeData }),
            });

            const data = await response.json();
            console.log("result", data);
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
            <ProjectInfo></ProjectInfo>
            <Container_work>
                <WorkArea>
                    <h3>寫code工作區</h3>
                    <form onSubmit={handleSubmit}>
                        <CodeMirror
                            value={code}
                            height='400px'
                            theme={okaidia}
                            extensions={[javascript({ jsx: true })]}
                            onChange={handleChange}
                        />
                        <button type='submit'>Run</button>
                    </form>
                </WorkArea>
                <ConsoleArea>
                    <h3>Console</h3>
                    <ConsoleResult value={result} readOnly />
                </ConsoleArea>
            </Container_work>
        </Container_all>
    );
};

export default WriteCode;
