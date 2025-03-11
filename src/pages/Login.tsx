// src/pages/Login.tsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { TextField, Button, Stack } from '@mui/material';


const Login: React.FC = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) return;

        setLoading(true);

        try {
            const success = await auth.login(name, email);
            if (success) {
                setTimeout(() => navigate("/dogs"), 1000);
            }
        } catch (error) {
            console.error("Login request failed:", error);
            alert("An error occurred while logging in. Please try again.");
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} justifyContent="center"
                    alignItems="center" >
                    <TextField
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={loading}>Go</Button>
                    {loading && <CircularProgress />}
                </Stack>
            </form>
        </div>
    );
};

export default Login;
