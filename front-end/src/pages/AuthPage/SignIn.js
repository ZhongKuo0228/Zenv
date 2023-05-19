import React, { useState } from "react";
import styled from "styled-components";
import api from "../../util/api";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled.input`
    background-color: #333;
    border: 1px solid #888;
    color: white;
    margin-bottom: 15px;
    padding: 10px 15px;
    font-size: 16px;
    width: 300px;
`;

const Button = styled.button`
    background-color: #555;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
`;

const Hint = styled.div`
    color: white;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 10px 15px;
    font-size: 14px;
    width: 300px;
`;
const PS = styled.div`
    font-size: 14px;
`;
const ErrorMessage = styled.p`
    color: red;
`;
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await api.userSignIn(email, password);
            if (result.data) {
                localStorage.setItem("jwt", result.data.access_token);
                window.location.href = `/profile/${result.data.user.name}`;
            } else {
                setError(result.errorMessage);
            }
        } catch (error) {
            setError("An error occurred while creating the user. Please try again later.");
        }
    };
    return (
        <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleSubmit}>
                <Input
                    type='email'
                    placeholder='Email'
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                    type='password'
                    placeholder='Password'
                    minLength='8'
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button type='submit'>確認登入</Button>
                <Hint>
                    測試帳號：
                    <br />
                    E-mail : guest@test.com
                    <br />
                    Password : guest1234
                    <br />
                    <hr />
                    <PS>測試帳號屬於共用帳號，每日會定期清除資料，若想要有較完整體驗，可以註冊自己的專屬帳號。</PS>
                </Hint>
            </Form>
        </>
    );
};

export default SignIn;
