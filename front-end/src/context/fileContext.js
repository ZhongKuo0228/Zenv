import React from "react";

export const FileContext = React.createContext({
    file: {},
    setFile: () => {},
    fileName: "",
    setFileName: () => {},
    folderData: {},
    feature: "NodeJs",
    setFolderData: () => {},
    selectedFeature: {},
    setSelectedFeature: () => {},
    setFeature: () => {},
});
export const FileContextProvider = ({ children }) => {
    const [file, setFile] = React.useState(null);
    const [fileName, setFileName] = React.useState("未選擇檔案");
    const [folderData, setFolderData] = React.useState(null);
    const [selectedFeature, setSelectedFeature] = React.useState("NodeJs");
    const [feature, setFeature] = React.useState("NodeJs");
    return (
        <FileContext.Provider
            value={{
                file,
                setFile,
                fileName,
                setFileName,
                folderData,
                setFolderData,
                selectedFeature,
                setSelectedFeature,
                feature,
                setFeature,
            }}
        >
            {children}
        </FileContext.Provider>
    );
};
