import React, { useEffect, useState, useContext } from "react";
import api from "../../../util/api";
import {
    AiOutlineFolder,
    AiOutlineFolderOpen,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlineFileAdd,
    AiOutlineFolderAdd,
} from "react-icons/ai";
import File from "./File";
import { FileContext } from "../../../context/fileContext";

const serverName = `testman_firstServer`; //TODO:後續要從localstorage取得${userName}_${projectName}

const folderStyle = {
    paddingLeft: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
    position: "relative",
};

const folderHoverStyle = {
    ...folderStyle,
    backgroundColor: "#FFFFCE",
};

const buttonContainerStyle = {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: 0,
    paddingRight: "5px",
};

const Folder = ({ folder, path = "" }) => {
    const [clonedFolder, setClonedFolder] = useState(folder);
    const { setFile, setFileName } = useContext(FileContext);
    const [isHovering, setIsHovering] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openedFolders, setOpenedFolders] = useState(() => {
        const savedData = localStorage.getItem("openedFolders");
        return savedData ? JSON.parse(savedData) : {};
    });
    const [isRenaming, setIsRenaming] = useState(false);
    const [newFolderName, setNewFolderName] = useState(folder.name);
    const [isAddingFolder, setIsAddingFolder] = useState(false);
    const [newSubfolderName, setNewSubfolderName] = useState("");
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [newSubfileName, setNewSubfileName] = useState("");

    //取得檔案的完整路徑
    const fullPath = path ? `${path}/${folder.name}` : folder.name;

    //資料夾的點擊狀態確認
    const handleClick = () => {
        setIsOpen(!isOpen);
        setOpenedFolders({ ...openedFolders, [fullPath]: !isOpen });
        localStorage.setItem("openedFolders", JSON.stringify({ ...openedFolders, [fullPath]: !isOpen }));
    };

    useEffect(() => {
        const savedData = localStorage.getItem("openedFolders");
        const openedFolders = savedData ? JSON.parse(savedData) : {};
        setIsOpen(!!openedFolders[fullPath]);
    }, [fullPath]);

    const FolderIcon = ({ isOpen }) => {
        return (
            <span>
                {isOpen ? <span style={{ marginRight: "5px" }}>∨</span> : <span style={{ marginRight: "5px" }}>❯</span>}
                {isOpen ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
            </span>
        );
    };

    // 點擊資料文件同時觸發取得檔案和將檔案存檔的功能
    const handleFileClick = async (filePath) => {
        //確認有更新程式碼才去覆寫檔案
        const editCode = localStorage.getItem("editedFileData");
        if (editCode != null) {
            await handlePostRewrite();
        }
        //讀取檔案內容
        const apiUrl = "http://localhost:3001/api/1.0/express/get";
        try {
            const response = await fetch(`${apiUrl}?readFile=${serverName}/${filePath}`);
            const data = await response.json();
            setFile(data.data);
            localStorage.setItem("fileData", JSON.stringify(data.data));
            const trimmedStr = filePath.replace(/^"|"$/g, "");
            localStorage.setItem("nowChoiceFile", trimmedStr);
            setFileName(trimmedStr);
        } catch (error) {
            console.error("Error fetching file data:", error);
        }
    };

    const handlePostRewrite = async () => {
        const url = "http://localhost:3001/api/1.0/express/rewriteFile";
        try {
            const fileName = localStorage.getItem("nowChoiceFile");
            const editCode = localStorage.getItem("editedFileData");
            const codeData = {
                task: "rewriteFile",
                fileName: `${serverName}/${fileName}`,
                editCode: editCode,
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
            localStorage.removeItem("nowChoiceFile");
            localStorage.removeItem("editedFileData");
        } catch (error) {
            console.error("Error fetching POST event data:", error);
        }
    };

    //資料夾的文件操作

    const handleDeleteFolder = (event) => {
        event.stopPropagation();
        // 顯示提示
        const confirmed = window.confirm(`確認是否要刪除？ : ${path}/${folder.name}`);

        // 若用戶確定刪除
        if (confirmed) {
            const task = "operDel";
            const type = "folder";
            const fileName = `${serverName}/${path}/${folder.name}/${newSubfileName}`;
            console.log(task, type, fileName);
            api.fileOper(task, type, fileName);
        }
    };

    const handleRenameFolder = (event) => {
        event.stopPropagation();
        setIsRenaming(true);
        // 處理資料夾重命名的邏輯
        // 處理將修改後的檔名保存到後端的邏輯
    };
    const handleNameChange = (event) => {
        setNewFolderName(event.target.value);
    };

    const handleBlur = () => {
        setIsRenaming(false);
        setIsAddingFolder(false);
        setIsAddingFile(false);
        // 處理將修改後的檔名保存到後端的邏輯
    };
    const handleNameKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setIsRenaming(false);
            // 處理將修改後的檔名保存到後端的邏輯
            const task = "operRename";
            const type = "file";
            const oldName = `${serverName}/${path}/${folder.name}`;
            const newName = `${serverName}/${path}/${newFolderName}`;
            const fileName = [oldName, newName];
            api.fileOper(task, type, fileName);
            setClonedFolder({ ...clonedFolder, newName: newFolderName });
        }
    };

    const handleAddFolder = (event) => {
        event.stopPropagation();
        setIsAddingFolder(true);
    };

    const handleSubfolderNameChange = (event) => {
        setNewSubfolderName(event.target.value);
    };

    const handleSubfolderNameKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setIsAddingFolder(false);
            // 處理新增資料夾的邏輯
            const task = "operAdd";
            const type = "folder";
            const fileName = `${serverName}/${path}/${folder.name}/${newSubfolderName}`;
            api.fileOper(task, type, fileName);
            setNewSubfolderName("");
        }
    };

    const handleAddFile = (event) => {
        event.stopPropagation();
        setIsAddingFile(true);
    };

    const handleSubfileNameChange = (event) => {
        setNewSubfileName(event.target.value);
    };

    const handleSubfileNameKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setIsAddingFile(false);
            // 處理新增資料夾的邏輯
            const task = "operAdd";
            const type = "file";
            const fileName = `${serverName}/${path}/${folder.name}/${newSubfileName}`;
            api.fileOper(task, type, fileName);
            setNewSubfileName("");
        }
    };

    return (
        <div>
            <div
                style={isHovering ? folderHoverStyle : folderStyle}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleClick}
            >
                <FolderIcon isOpen={isOpen} />
                {isRenaming ? (
                    <input
                        type='text'
                        value={newFolderName}
                        onChange={handleNameChange}
                        onBlur={handleBlur}
                        onKeyDown={handleNameKeyDown}
                        autoFocus
                        style={{ marginLeft: "5px" }}
                    />
                ) : (
                    <span style={{ marginLeft: "5px" }}>{clonedFolder.newName ?? clonedFolder.name}</span>
                )}
                {isHovering && (
                    <div style={buttonContainerStyle}>
                        <button onClick={handleAddFolder}>
                            <AiOutlineFolderAdd />
                        </button>
                        <button onClick={handleAddFile}>
                            <AiOutlineFileAdd />
                        </button>
                        <button onClick={handleRenameFolder}>
                            <AiOutlineEdit />
                        </button>
                        <button onClick={handleDeleteFolder}>
                            <AiOutlineDelete />
                        </button>
                    </div>
                )}
            </div>
            {isOpen && folder.children && Array.isArray(folder.children) && (
                <div style={{ marginLeft: "20px" }}>
                    {folder.children.map((child) =>
                        child.isDirectory ? (
                            <Folder key={child.name} folder={child} path={fullPath} />
                        ) : (
                            <File key={child.name} file={child} path={fullPath} onFileClick={handleFileClick} />
                        )
                    )}
                    {isAddingFolder && (
                        <input
                            type='text'
                            value={newSubfolderName}
                            onChange={handleSubfolderNameChange}
                            onBlur={handleBlur}
                            onKeyDown={handleSubfolderNameKeyDown}
                            autoFocus
                            style={{ marginLeft: "20px" }}
                        />
                    )}
                    {isAddingFile && (
                        <input
                            type='text'
                            value={newSubfileName}
                            onChange={handleSubfileNameChange}
                            onBlur={handleBlur}
                            onKeyDown={handleSubfileNameKeyDown}
                            autoFocus
                            style={{ marginLeft: "20px" }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Folder;