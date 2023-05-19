import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../util/api"; // 如果您的api文件在不同的文件夹中，请相应地更改路径

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");

        const checkTokenValidity = async () => {
            try {
                const result = await api.getUserProfile(jwt);
                if (result.name) {
                    navigate(`/profile/${result.name}`);
                } else {
                    navigate("/auth-page");
                }
            } catch (error) {
                navigate("/auth-page");
            }
        };

        if (jwt) {
            checkTokenValidity();
        } else {
            navigate("/auth-page");
        }
    }, [navigate]);

    return null; // 在检查期间不渲染任何内容
};

export default Home;
