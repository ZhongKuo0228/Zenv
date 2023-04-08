import React, { useEffect, useState, useContext } from "react";
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import File from "./File";
import { FileContext } from "../../../context/fileContext";

const serverName = `testman_firstServer`; //TODO:後續要從localstorage取得${userName}_${projectName}

const folderStyle = {
    paddingLeft: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
};

const folderHoverStyle = {
    ...folderStyle,
    backgroundColor: "#FFFFCE",
};

const Folder = ({ folder, path = "" }) => {
    const { setFile, setFileName } = useContext(FileContext);
    const [isHovering, setIsHovering] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    //資料夾的點擊狀態確認
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const FolderIcon = ({ isOpen }) => {
        return (
            <span>
                {isOpen ? <span style={{ marginRight: "5px" }}>∨</span> : <span style={{ marginRight: "5px" }}>❯</span>}
                {isOpen ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
            </span>
        );
    };

    //取得檔案的完整路徑
    const fullPath = path ? `${path}/${folder.name}` : folder.name;
    // 點擊資料文件同時觸發取得檔案和將檔案存檔的功能
    const handleFileClick = async (filePath) => {
        await handlePostRewrite();
        const apiUrl = "http://localhost:3001/api/1.0/express/get";
        try {
            const response = await fetch(`${apiUrl}?readFile=${serverName}/${filePath}`);
            const data = await response.json();
            setFile(data.data);
            localStorage.setItem("fileData", JSON.stringify(data.data));
            const trimmedStr = filePath.replace(/^"|"$/g, "");
            localStorage.setItem("nowChoiceFile", trimmedStr);
            setFileName(trimmedStr);
            //覆寫檔案做到即時存檔效果
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

    return (
        <div>
            <div
                style={isHovering ? folderHoverStyle : folderStyle}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleClick}
            >
                <FolderIcon isOpen={isOpen} />
                <span style={{ marginLeft: "5px" }}>{folder.name}</span>
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
                </div>
            )}
        </div>
    );
};

export default Folder;
