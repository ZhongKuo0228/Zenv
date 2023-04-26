import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FileContextProvider } from "./context/fileContext";
import images from "./images/image";
import api from "./util/api";

import styled from "styled-components";

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
`;

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #000;
    color: #fff;
    height: 50px;
    padding: 0 1rem;
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    font-size: 1.5rem;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1rem;
`;

const LogoImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
`;

const Button = styled.button`
    background-color: transparent;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin-left: 1rem;

    &:hover {
        text-decoration: underline;
    }
`;

const App = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // 在此檢查JWT是否正確
        const jwt = localStorage.getItem("jwt");

        const checkTokenValidity = async () => {
            try {
                const result = await api.getUserProfile(jwt);
                if (result.name) {
                    setUsername(result.name);
                    setIsValidToken(true);
                } else {
                    window.location.href = "/AuthPage";
                }
            } catch (error) {
                window.location.href = "/AuthPage";
            }
        };

        if (jwt) {
            checkTokenValidity();
        } else {
            window.location.href = "/AuthPage";
        }
    }, []);

    const handleProfileClick = () => {
        window.location.href = `/profile/${username}`;
    };
    const handleLogOut = () => {
        localStorage.clear();
        window.location.href = "/AuthPage";
    };
    return (
        <>
            <Wrap>
                <HeaderContainer>
                    <Title>
                        <Logo>
                            <LogoImage src={images.iconLogo} alt='Logo' />
                        </Logo>
                        Zenv
                    </Title>
                    <div>
                        <Button onClick={handleProfileClick}>個人頁面</Button>
                        <Button onClick={handleLogOut}>登出</Button>
                    </div>
                </HeaderContainer>
                <FileContextProvider>
                    <Outlet />
                </FileContextProvider>
            </Wrap>
        </>
    );
};

export default App;
