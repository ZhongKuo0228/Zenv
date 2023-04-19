import React from "react";
import styled from "styled-components";

const Button = styled.button`
    width: ${(props) => props.w};
    height: ${(props) => props.h};
    background-color: ${(props) => props.bgColor};
    
`;

export default function Buttons({ bgColor, w, h }) {
    return <Button bgColor={bgColor} w={w} h={h}></Button>;
}
