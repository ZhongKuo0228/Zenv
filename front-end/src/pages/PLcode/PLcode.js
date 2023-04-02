import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { v4 as uuidv4 } from "uuid";
//---styled-------------------------------------------
const WorkArea = styled.div`
    width: 49%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;
const CodingArea = styled.textarea`
    width: 80%;
    height: 300px;
    border: solid 1px black;
`;

const ConsoleArea = styled.div`
    width: 50%;
    height: 500px;
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
    const [code, setCode] = React.useState(`function add(a, b) {\n  return a + b;\n}`);
    const [result, setResult] = useState("請RUN");

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

    const handleChange = (event) => {
        const value = event.target.value;
        setCode(value);
        localStorage.setItem("code", value);
    };

    useEffect(() => {
        const storedCode = localStorage.getItem("code");
        if (storedCode) {
            setCode(storedCode);
        }
    }, []);

    return (
        <>
            <WorkArea>
                <h3>寫code工作區</h3>
                <form onSubmit={handleSubmit}>
                    {/* <CodingArea rows={10} cols={50} value={code} onChange={handleChange} /> */}
                    <CodeEditor
                        value={code}
                        language='js'
                        placeholder='Please enter JS code.'
                        onChange={handleChange}
                        padding={15}
                        style={{
                            fontSize: 12,
                            backgroundColor: "#272727",
                            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                        }}
                    />
                    <button type='submit'>Run</button>
                </form>
            </WorkArea>
            <ConsoleArea>
                <h3>Console</h3>
                <ConsoleResult value={result} readOnly />
            </ConsoleArea>
        </>
    );
};

export default WriteCode;
