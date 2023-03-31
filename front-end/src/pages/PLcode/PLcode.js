import React, { useState } from "react";
import styled from "styled-components";
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = "http://localhost:3001/api/1.0/PLcode/nodejs";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();
            console.log("result", data);
            setResult(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (event) => {
        setCode(event.target.value);
    };

    return (
        <>
            <WorkArea>
                <h3>寫code工作區</h3>
                <form onSubmit={handleSubmit}>
                    <CodingArea rows={10} cols={50} value={code} onChange={handleChange} />
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
