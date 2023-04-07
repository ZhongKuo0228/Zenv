// File.js
import React, { useState } from "react";
import { DiJsBadge, DiCss3Full, DiGit } from "react-icons/di";
import { AiOutlineFile } from "react-icons/ai";

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
//滑鼠移到檔案上，有灰底的效果
const fileStyle = {
    paddingLeft: "40px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
};
const fileHoverStyle = {
    ...fileStyle,
    backgroundColor: "#f0f0f0",
};

const handleFileClick = async (fileName) => {
    const url = "http://localhost:3001/api/1.0/express/getFileContent";
    try {
        const response = await fetch(`${url}?fileName=${fileName}`);
        const data = await response.json();
        console.log("File content:", data);
        // 在此處處理檔案內容，例如將其顯示在編輯器中
    } catch (error) {
        console.error(error);
    }
};

const File = ({ file }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            style={isHovering ? fileHoverStyle : fileStyle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => handleFileClick(file.name)}
        >
            <FileIcon file={file} />
            <span style={{ marginLeft: "5px" }}>{file.name}</span>
        </div>
    );
};

export default File;
