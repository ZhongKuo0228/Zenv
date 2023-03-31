import React from "react";
import WriteCode from "./components/WriteCode";
import Console from "./components/Console";
import styled from "styled-components";

const Wrap = styled.div`
    display: flex;
`;

const App = () => {
    return (
        <>
            <header>我是標頭</header>
            <Wrap>
                <WriteCode />
                <Console />
            </Wrap>
        </>
    );
};

export default App;
