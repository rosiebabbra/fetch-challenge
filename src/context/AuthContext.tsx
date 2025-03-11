// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/dogApi";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (name: string, email: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(document.cookie.includes("fetch-access-token"));
    }, []);

    const login = async (name: string, email: string) => {
        const success = await apiLogin(name, email);
        if (success) {
            setIsAuthenticated(true);
        }
        return success;

    };

    const logout = async () => {
        await apiLogout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
