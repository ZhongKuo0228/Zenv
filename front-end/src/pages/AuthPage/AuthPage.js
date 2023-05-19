import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Container = styled.div`
    position: relative;
    flex-direction: column;
    background-color: black;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
`;

const Tab = styled.button`
    background-color: ${(props) => (props.active ? "#555" : "transparent")};
    color: white;
    border: none;
    margin: 0 10px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 18px;
`;

const FormContainer = styled.div`
    border: 1px solid #888;
    padding: 20px;
    background-color: #222;
    border-radius: 10px;
    width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
`;

const SiteTitle = styled.h1`
    color: white;
    font-size: 40px;
    position: relative;
    z-index: 1;
`;
const Info = styled.h3`
    color: white;
    font-size: 20px;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
`;

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [typedText, setTypedText] = useState("");
    const infoText = "> ";
    const fullText = infoText + "Started coding and easily set up your own server with a lightweight framework.";
    //瀑布背景
    useEffect(() => {
        // 在這個 useEffect 中編寫 Matrix Rain 程式碼
        const canvas = document.getElementById("matrixCanvas");
        const ctx = canvas.getContext("2d");

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("");
        const drops = [];
        const font_size = 10;
        const columns = canvas.width / font_size;

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * canvas.height;
        }

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#00DB00";
            ctx.font = font_size + "px arial";

            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);

                if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        const interval = setInterval(draw, 35);

        return () => {
            clearInterval(interval);
        };
    }, []);
    //打字效果
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i <= fullText.length) {
                setTypedText(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 80);
    }, []);

    return (
        <Container id='matrixContainer'>
            <canvas id='matrixCanvas' style={{ position: "absolute", top: 0, left: 0 }} />
            <SiteTitle>Welcome to Zenv</SiteTitle>
            <Info>
                {typedText.split("").map((char, index) => (
                    <span key={index} style={{ animationDelay: `${index * 30}ms` }}>
                        {char}
                    </span>
                ))}
            </Info>
            <FormContainer>
                <TabContainer>
                    <Tab active={activeTab === "login"} onClick={() => setActiveTab("login")}>
                        登入
                    </Tab>
                    <Tab active={activeTab === "register"} onClick={() => setActiveTab("register")}>
                        註冊
                    </Tab>
                </TabContainer>
                {activeTab === "login" ? <SignIn /> : <SignUp />}
            </FormContainer>
        </Container>
    );
};

export default AuthPage;
