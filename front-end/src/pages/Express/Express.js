import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Folder from "./Folder";

//---
const Area = styled.div`
    width: 100%;
    border: solid 1px black;
    display: flex;
    flex-direction: column;
`;
//---
const ButtonArea = styled.div`
    width: 100%;
    height: 50px;
    border: solid 1px black;
    padding: 10px;
`;
//---
const WorkArea = styled.div`
    width: 100%;
    border: solid 1px black;
    display: flex;
    flex-direction: row;
`;

const FolderIndex = styled.div`
    width: 20%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;
const EditArea = styled.div`
    width: 59%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;
const ResultArea = styled.div`
    width: 20%;
    height: 500px;
    border: solid 1px black;
    padding: 10px;
`;

//---
const handleSubmit = async (event) => {
    event.preventDefault();
    const url = "http://localhost:3001/api/1.0/express/create";
    try {
        const userId = "testman";
        const task = "createServer";
        const projectName = "firstServer";
        const gitRepoUrl = "https://github.com/ZhongKuo0228/express-example.git";
        const projectData = {
            task: task,
            userId: userId,
            projectName: projectName,
            gitRepoUrl: gitRepoUrl,
        };
        console.log("projectData", projectData);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: projectData }),
        });

        const data = await response.json();
        console.log("result", data);
    } catch (error) {
        console.error(error);
    }
};

//---
const Express = () => {
    //---資料夾樹狀結構
    const [folderData, setFolderData] = useState(null);

    const getFolderIndex = async () => {
        const url = "http://localhost:3001/api/1.0/express/get?getFolderIndex";
        const folderName = "testman_firstServer";
        try {
            const response = await fetch(`${url}=${folderName}`);
            const responseData = await response.json();
            const data = JSON.parse(responseData.data); // 解析資料
            setFolderData(data); // 將獲取到的資料儲存在狀態中
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getFolderIndex(); // 在元件掛載時獲取資料
    }, []);

    return (
        <Area>
            <ButtonArea>
                <button onClick={handleSubmit}>創立專案</button>
                <div></div>
                <button>NodeJS</button>
                <button>Sqlite</button>
                <button>Redis</button>
            </ButtonArea>
            <WorkArea>
                <FolderIndex>
                    樹狀資料夾
                    {folderData && <Folder folder={folderData} />} {/* 如果資料存在，則渲染 Folder 元件 */}
                </FolderIndex>
                <EditArea>code edit</EditArea>
                <ResultArea>Console</ResultArea>
            </WorkArea>
        </Area>
    );
};

export default Express;
