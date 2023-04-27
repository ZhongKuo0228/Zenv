// File.js
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DiJsBadge, DiCss3Full, DiGit } from "react-icons/di";
import { AiOutlineFile, AiOutlineFileText, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import api from "../../../util/api";
import { FileContext } from "../../../context/fileContext";

const serverName = `testman_firstServer`; //TODO:後續要從localstorage取得${userName}_${projectName}

const FileIcon = ({ file }) => {
    const fileExtension = file.name.split(".").pop();

    switch (fileExtension) {
        case "js":
            return <DiJsBadge />;
        case "css":
            return <DiCss3Full />;
        case "git":
            return <DiGit />;
        // 其他檔案類型的圖標...
        default:
            return <AiOutlineFile />;
    }
};

const fileStyle = {
    paddingLeft: "33px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
    position: "relative",
};

const fileHoverStyle = {
    ...fileStyle,
    backgroundColor: "#f0f0f0",
    color: "#272727",
};

const buttonContainerStyle = {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: 0,
    paddingRight: "5px",
};

const File = ({ file, path, onFileClick }) => {
    const { username, projectName } = useParams();
    const [clonedFile, setClonedFile] = useState(file);
    const [isHovering, setIsHovering] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newFileName, setNewFileName] = useState(file.name);
    const fileContext = useContext(FileContext);
    const { setFolderData, folderData } = fileContext;

    const serverName = `${username}_${projectName}`;

    async function getServerData() {
        const data = await api.fetchData(serverName);
        setFolderData(data);
    }

    const handleFileClick = () => {
        if (onFileClick) {
            onFileClick(`${path}/${file.name}`);
        }
    };
    const handleDeleteFile = async (event) => {
        event.stopPropagation();
        // 顯示提示
        const confirmed = window.confirm(`確認是否要刪除？ : ${path}/${file.name}`);

        // 若用戶確定刪除
        if (confirmed) {
            const task = "operDel";
            const type = "file";
            const fileName = `${serverName}/${path}/${file.name}`;
            try {
                const result = await api.fileOper(task, type, fileName);
                if (result) {
                    await getServerData();
                }
            } catch (error) {
                console.error("Failed to delete file: ", error);
            }
        }
    };

    // const { newFileName, setNewFileName } = useContext(FileContext);
    const handleRenameFile = (event) => {
        event.stopPropagation();
        setIsRenaming(true);
        // 處理文件重命名的邏輯
    };

    const handleNameChange = (event) => {
        setNewFileName(event.target.value);
    };
    const handleNameBlur = () => {
        setIsRenaming(false);
        // 處理將修改後的檔名保存到後端的邏輯
    };
    const handleNameKeyDown = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setIsRenaming(false);
            // 處理將修改後的檔名保存到後端的邏輯
            const task = "operRename";
            const type = "file";
            const oldName = `${serverName}/${path}/${file.name}`;
            const newName = `${serverName}/${path}/${newFileName}`;
            const fileName = [oldName, newName];
            const result = await api.fileOper(task, type, fileName);
            if (result) {
                await getServerData();
            }
            setClonedFile({ ...clonedFile, newName: newFileName });
        }
    };

    return (
        <>
            <div
                style={isHovering ? fileHoverStyle : fileStyle}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleFileClick}
            >
                <AiOutlineFileText />
                {/* icon圖示設定 */}
                {/* <FileIcon file={file} /> */}
                {isRenaming ? (
                    <input
                        type='text'
                        value={newFileName}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        onKeyDown={handleNameKeyDown}
                        autoFocus
                        style={{ marginLeft: "5px" }}
                    />
                ) : (
                    <span style={{ marginLeft: "5px" }}>{clonedFile.newName ?? clonedFile.name}</span>
                )}

                {isHovering && (
                    <div style={buttonContainerStyle}>
                        {" "}
                        <button onClick={handleRenameFile}>
                            <AiOutlineEdit />
                        </button>
                        <button onClick={handleDeleteFile}>
                            <AiOutlineDelete />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default File;
