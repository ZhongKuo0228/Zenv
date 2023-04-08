import React, { useEffect, useState, useContext } from "react";
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import File from "./File";
import { FileContext } from "../../../context/fileContext";

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
    const { setFile } = useContext(FileContext);
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

    const handleFileClick = async (filePath) => {
        // console.log("File path:", filePath);
        const apiUrl = "http://localhost:3001/api/1.0/express/get";

        try {
            const response = await fetch(`${apiUrl}?readFile=testman_firstServer/${filePath}`);
            const data = await response.json();
            setFile(data.data);
            // 將取得的資料儲存到 localStorage
            localStorage.setItem("fileData", JSON.stringify(data.data));
            // console.log("file", data);
        } catch (error) {
            console.error("Error fetching file data:", error);
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
