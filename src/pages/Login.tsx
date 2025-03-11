import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

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
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-orange-200 to-yellow-100">

            <div className="bg-white shadow-lg rounded-[29px] p-8 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="Fetch Logo" className="h-16 w-16" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome to Fetch!</h2>
                <p className="text-gray-600 text-center mb-6">Sign in to browse available dogs</p>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg p-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg p-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-500 text-white font-semibold p-2 rounded-lg hover:bg-orange-600 transition duration-200 disabled:bg-gray-300 mb-6"
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
