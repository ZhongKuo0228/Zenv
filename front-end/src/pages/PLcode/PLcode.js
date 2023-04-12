import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CodeEditor from "@uiw/react-textarea-code-editor";
import webSocket from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { commitPLpage } from "../../util/commitResult.js";
//使用者頁面後自動存檔------------------------
commitPLpage();
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

    // webSocket---
    // const [ws, setWs] = useState(null);
    // const socketRef = useRef(null);

    // useEffect(() => {
    //     const socket = webSocket("http://localhost:3001");
    //     socket.on("connect", () => {
    //         console.log("Successfully connected to server!");
    //     });
    //     socketRef.current = socket;
    //     setWs(socketRef.current);
    //     return () => {
    //         socketRef.current.disconnect();
    //     };
    // }, []);

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
                            height: "400px",
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
