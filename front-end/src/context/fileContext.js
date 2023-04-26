import React from "react";

export const FileContext = React.createContext({
    file: {},
    setFile: ()=>{},
    fileName: '',
    setFileName: ()=>{},
    folderData: {},
    setFolderData: ()=>{}
});
export const FileContextProvider = ({ children }) => {
    const [file, setFile] = React.useState(null);
    const [fileName, setFileName] = React.useState("未選擇檔案");
    const [folderData, setFolderData] = React.useState(null);
    return (
        <FileContext.Provider value={{ file, setFile, fileName, setFileName, folderData, setFolderData }}>
            {children}
        </FileContext.Provider>
    );
};
