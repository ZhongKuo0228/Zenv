import React from "react";

export const FileContext = React.createContext();
export const FileContextProvider = ({ children }) => {
    const [file, setFile] = React.useState(null);
    const [fileName, setFileName] = React.useState("未選擇檔案");
    return <FileContext.Provider value={{ file, setFile, fileName, setFileName }}>{children}</FileContext.Provider>;
};
