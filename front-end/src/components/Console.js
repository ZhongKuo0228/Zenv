import React from "react";
import styled from "styled-components";

const ConsoleArea = styled.div`
    width: 50%;
    height: 500px;
    padding: 10px;
    border: solid 1px black;
`;
const ConsoleResult = styled.div`
    width: 80%;
    height: 400px;
    padding: 10px;
    border: solid 1px black;
`;
const Console = () => {
    return (
        <ConsoleArea>
            <h3>Console</h3>
            <ConsoleResult></ConsoleResult>
        </ConsoleArea>
    );
};

export default Console;
