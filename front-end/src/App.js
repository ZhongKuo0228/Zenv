import React from "react";
import WriteCode from "./pages/PLcode/PLcode";

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

            </Wrap>
        </>
    );
};

export default App;
