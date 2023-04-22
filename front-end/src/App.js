import React from "react";
import { Outlet } from "react-router-dom";
import { FileContextProvider } from "./context/fileContext";

import styled from "styled-components";

const Wrap = styled.div`
    display: flex;
    height: 100%;
`;

const App = () => {
    return (
        <>
            <header>我是header</header>
            <Wrap>
                <FileContextProvider>
                    <Outlet />
                </FileContextProvider>
            </Wrap>
            <header>我是footer</header>
        </>
    );
};

export default App;
