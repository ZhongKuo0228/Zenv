// File.js
import React, { useState } from "react";
import { DiJsBadge, DiCss3Full, DiGit } from "react-icons/di";
import { AiOutlineFile, AiOutlineFileText } from "react-icons/ai";

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

const File = ({ file, path, onFileClick }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleFileClick = () => {
        if (onFileClick) {
            onFileClick(`${path}/${file.name}`);
        }
    };

    return (
        <div
            style={isHovering ? fileHoverStyle : fileStyle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleFileClick}
        >
            <AiOutlineFileText />
            {/* icon圖示設定 */}
            {/* <FileIcon file={file} /> */}
            <span style={{ marginLeft: "5px" }}>{file.name}</span>
        </div>
    );
};

export default File;
