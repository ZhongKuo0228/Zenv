import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    background-color: #272727;
    color: #ccc;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Fira Mono", monospace;
`;

const GlitchText = styled.div`
    margin-top: 100px;
    font-size: 96px;
    letter-spacing: -7px;
    animation: glitch 1s linear infinite;
    position: relative;

    &:before,
    &:after {
        content: attr(title);
        position: absolute;
        left: 0;
    }

    &:before {
        animation: glitchTop 1s linear infinite;
        clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
        -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    }

    &:after {
        animation: glitchBotom 1.5s linear infinite;
        clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
        -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
    }

    @keyframes glitch {
        2%,
        64% {
            transform: translate(2px, 0) skew(0deg);
        }
        4%,
        60% {
            transform: translate(-2px, 0) skew(0deg);
        }
        62% {
            transform: translate(0, 0) skew(5deg);
        }
    }

    @keyframes glitchTop {
        2%,
        64% {
            transform: translate(2px, -2px);
        }
        4%,
        60% {
            transform: translate(-2px, 2px);
        }
        62% {
            transform: translate(13px, -1px) skew(-13deg);
        }
    }

    @keyframes glitchBotom {
        2%,
        64% {
            transform: translate(-2px, 0);
        }
        4%,
        60% {
            transform: translate(-2px, 0);
        }
        62% {
            transform: translate(-22px, 5px) skew(21deg);
        }
    }
`;

const Description = styled.p`
    font-size: 24px;
    margin-top: 20px;
`;

const Button = styled.button`
    background-color: #2ecc71;
    border: none;
    color: white;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 4px;
`;

const NotFound = () => {
    return (
        <Container>
            <GlitchText title='404'>404</GlitchText>
            <Description>Page Not Found</Description>
            <Description>抱歉，您訪問的頁面並不存在</Description>
            <Link to='/AuthPage'>
                <Button>返回首頁</Button>
            </Link>
        </Container>
    );
};

export default NotFound;
