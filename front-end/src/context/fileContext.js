import React from "react";

export const FileContext = React.createContext();
export const FileContextProvider = ({ children }) => {
    const [file, setFile] = React.useState(null);
    return <FileContext.Provider value={{ file, setFile }}>{children}</FileContext.Provider>;
};
