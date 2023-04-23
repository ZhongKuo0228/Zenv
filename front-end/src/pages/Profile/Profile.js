import React, { useState, useEffect, useRef } from "react";
import styles from "./modal.module.css";
import api from "../../util/api";
import styled from "styled-components";

const Container_all = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    width: 100%;
    height: 90vh;
    justify-content: center;
    color: #fff;
    background-color: #272727;
`;
//----
const UserData = styled.div`
    display: flex;
    width: 40%;
    flex-direction: column;
    height: 100%;
`;
//---
const UserProfile = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    height: 40%;
`;

const UserPhoto = styled.div`
    display: flex;
    margin: auto;
    &:hover {
        animation: shake 1s;
        animation-iteration-count: 1;
    }

    @keyframes shake {
        0% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-5px, 0);
        }
        50% {
            transform: translate(0, 0);
        }
        75% {
            transform: translate(5px, 0);
        }
        100% {
            transform: translate(0, 0);
        }
    }
`;
const UserName = styled.div`
    display: flex;
    margin: auto;
    font-size: 30px;
    height: 20%;

    &:hover {
        animation: shake 1s;
        animation-iteration-count: 1;
    }

    @keyframes shake {
        0% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-5px, 0);
        }
        50% {
            transform: translate(0, 0);
        }
        75% {
            transform: translate(5px, 0);
        }
        100% {
            transform: translate(0, 0);
        }
    }
`;
const UserProject = styled.div`
    display: flex;
    flex-direction: column;
    height: 60%;
`;
const UserProjectTitle = styled.div`
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
`;
const ToolBar = styled.div`
    display: flex;
    align-items: center;
    height: 70px;
    width: 90%;
    padding: 0 20px;
    background-color: #375a7f;
    color: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
        background-color: #3498db;
    }
`;

const Icon = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

const ProjectInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProjectNameWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const ProjectName = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-right: 5px;
`;

const ProjectType = styled.div`
    font-size: 14px;
    margin-right: 10px;
    color: #999;
`;

const CreateTime = styled.div`
    font-size: 14px;
    color: #ccc;
`;

const RenameButton = styled.button`
    margin-right: 10px;
    color: #fff;
    background-color: #444;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
        background-color: #555;
    }
`;

const DeleteButton = styled.button`
    color: #fff;
    background-color: #444;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
        background-color: #555;
    }
`;

//---
const CreateProject = styled.div`
    display: flex;
    width: 40%;
    flex-direction: column;
    height: 100%;
    margin-left: 40px;
`;
const PLItems = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60%;
`;
const PLItemTitle = styled.div`
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
`;

const LanguageBar = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    height: 70px;
    width: 80%;
    padding: 0 20px;
    background-color: #444444;
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    & > *:not(:last-child) {
        margin-right: 10px;
    }

    &:hover {
        transform: scale(1.05);
    }
`;

const Language = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

const Description = styled.div`
    font-size: 14px;
    color: #ccc;
    margin-top: 5px;
`;

const Version = styled.div`
    font-size: 18px;
    color: #ccc;
    margin-left: auto;
`;
//---
const WebItems = styled.div`
    display: flex;
    flex-direction: column;
    height: 40%;
`;
const WebItemTitle = styled.div`
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const FrameworkBar = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    height: 150px;
    width: 80%;
    padding: 0 20px;
    background-color: #444444;
    border-radius: 8px;
    transform-origin: center;
    transform: scale(1);
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }
`;

const FrameworkName = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-right: 20px;
`;

const Specs = styled.ul`
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Spec = styled.li`
    font-size: 14px;
    color: #ccc;
    margin-right: 20px;
`;

const Profile = () => {
    const [userName, setUserName] = useState([]);
    const [projectName, setProjectName] = useState([]);
    const [languageData, setLanguageData] = useState([]);
    const [frameworkData, setFrameworkData] = useState([]);
    const [userProjects, setUserProjects] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedItemsType, setSelectedItemsType] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const data = await api.getUserProfile();
                setUserName(data.name);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserProfile();
    }, []);

    useEffect(() => {
        async function fetchUserProjects() {
            try {
                const data = await api.getUserProjects();
                setUserProjects(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserProjects();
    }, []);
    useEffect(() => {
        async function allPLServiceItems() {
            try {
                const data = await api.getPLServiceItems();
                const newLanguageData = data.map((lang) => ({
                    icon: process.env.PUBLIC_URL + `/images/icon_${lang.items.toLowerCase()}.webp`,
                    language: lang.items,
                    service_type: lang.service_type,
                    description: lang.info,
                    version: lang.ver,
                }));
                setLanguageData(newLanguageData);
            } catch (error) {
                console.error(error);
            }
        }
        allPLServiceItems();
    }, []);
    useEffect(() => {
        async function allWebFrameworkItems() {
            try {
                const data = await api.getWebServiceItems();
                const newFrameworkData = data.map((fw) => ({
                    icon: process.env.PUBLIC_URL + `/images/icon_${fw.items.toLowerCase()}.webp`,
                    framework: fw.items,
                    service_type: fw.service_type,
                    description: fw.info,
                    version: fw.ver,
                    specs: [
                        { label: "DB", value: "sqlite 3" },
                        { label: "Cache", value: "redis 7" },
                    ],
                }));
                setFrameworkData(newFrameworkData);
            } catch (error) {
                console.error(error);
            }
        }
        allWebFrameworkItems();
    }, []);

    const handleCreateProject = async () => {
        // 獲取專案名稱
        const projectName = document.querySelector('input[type="text"]').value;
        try {
            const result = await api.createPLProject(projectName, selectedLanguage, selectedItemsType);
            if (result) {
                if (selectedItemsType === "prog_lang") {
                    window.location.href = `/PLpage/${userName}/${projectName}`;
                } else {
                    window.location.href = `/webServices/${userName}/${projectName}`;
                }
            } else {
                //跳出錯誤，提示專案名稱重複
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleEditProject = async () => {
        try {
            if (selectedItemsType === "prog_lang") {
                window.location.href = `/PLpage/${userName}/${projectName}`;
            } else {
                window.location.href = `/webServices/${userName}/${projectName}`;
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (projectName && selectedItemsType) {
            handleEditProject();
        }
    }, [projectName, selectedItemsType]);
    const modalStyle = show ? { display: "block" } : { display: "none" };
    return (
        <>
            <Container_all>
                <UserData>
                    <UserProfile>
                        <UserPhoto>
                            <img
                                src={process.env.PUBLIC_URL + "/images/user-icon.jpg"}
                                alt='icon'
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    backgroundColor: "#FFF",
                                }}
                            />
                        </UserPhoto>
                        <UserName>{userName}</UserName>
                    </UserProfile>
                    <UserProject>
                        <UserProjectTitle>你的專案</UserProjectTitle>
                        {userProjects.map((project) => (
                            <ToolBar
                                key={project.project_name}
                                onClick={() => {
                                    setProjectName(project.project_name);
                                    setSelectedItemsType(project.itemType);
                                }}
                            >
                                <Icon
                                    src={process.env.PUBLIC_URL + `/images/icon_${project.items.toLowerCase()}.webp`}
                                    alt='icon'
                                />
                                <ProjectInfo>
                                    <ProjectNameWrapper>
                                        <ProjectName>{project.project_name}</ProjectName>
                                        <ProjectType>({project.items})</ProjectType>
                                    </ProjectNameWrapper>
                                    <CreateTime>建立時間 {project.create_time}</CreateTime>
                                </ProjectInfo>
                                <div style={{ marginLeft: "auto" }}>
                                    <RenameButton>Rename</RenameButton>
                                    <DeleteButton>Delete</DeleteButton>
                                </div>
                            </ToolBar>
                        ))}
                    </UserProject>
                </UserData>
                <CreateProject>
                    <PLItems>
                        <PLItemTitle>開始撰寫 ProgramLanguage</PLItemTitle>
                        {languageData.map((lang) => (
                            <LanguageBar
                                key={lang.language}
                                onClick={() => {
                                    setSelectedLanguage(lang.language);
                                    setSelectedItemsType(lang.service_type);
                                    handleShow();
                                }}
                            >
                                <Icon src={lang.icon} alt='icon' />
                                <div>
                                    <Language>{lang.language}</Language>
                                    <Description>{lang.description}</Description>
                                </div>
                                <Version>ver. {lang.version}</Version>
                            </LanguageBar>
                        ))}
                    </PLItems>
                    <WebItems>
                        <WebItemTitle>架設專屬伺服器（WebFramework）</WebItemTitle>
                        {frameworkData.map((fw) => (
                            <FrameworkBar
                                key={fw.framework}
                                onClick={() => {
                                    setSelectedLanguage(fw.framework);
                                    setSelectedItemsType(fw.service_type);
                                    handleShow();
                                }}
                            >
                                <Icon src={fw.icon} alt='icon' />
                                <div>
                                    <FrameworkName>{fw.framework}</FrameworkName>
                                    <Description>{fw.description}</Description>
                                    <Version>ver. {fw.version}</Version>
                                    <hr />
                                    <Specs>
                                        {fw.specs.map((spec) => (
                                            <Spec key={spec.label}>
                                                {spec.label}：{spec.value}
                                            </Spec>
                                        ))}
                                    </Specs>
                                </div>
                            </FrameworkBar>
                        ))}
                    </WebItems>
                </CreateProject>
            </Container_all>
            <div className={styles["modal-container"]} style={modalStyle}>
                <div className={styles["modal-content"]}>
                    <span className={styles.close} onClick={handleClose}>
                        &times;
                    </span>
                    <h2>新建的 {selectedLanguage} 專案名稱</h2>
                    <input type='text' placeholder='請輸入專案名稱' />

                    <div>
                        <button onClick={handleClose}>取消</button>
                        <button onClick={handleCreateProject}>新增專案</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
