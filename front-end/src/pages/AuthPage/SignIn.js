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
            if (result) {
                localStorage.setItem("jwt", result.data.access_token);
                window.location.href = `/profile/${result.data.user.name}`;
            } else {
                setError(result.errorMessage);
            }
        } catch (error) {
            console.error(error);
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
            </Form>
        </>
    );
};

export default SignIn;
