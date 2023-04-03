import React from "react";
import { Outlet } from "react-router-dom";

import styled from "styled-components";

const Wrap = styled.div`
    display: flex;
    height: 600px;
    border: solid 1px black;
`;

const App = () => {
    return (
        <>
            <header>我是header</header>
            <li>
                <a href='/PLpage'>單一語言編譯</a>
            </li>
            <li>
                <a href='/Express'>Express伺服器</a>
            </li>
            <Wrap>
                <Outlet />
            </Wrap>
            <header>我是footer</header>
        </>
    );
};

export default App;
