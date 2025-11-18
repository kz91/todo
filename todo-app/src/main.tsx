// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./Login";
import { AuthProvider, useAuth } from "./AuthContext";

const AppWrapper = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl text-gray-600">読み込み中...</div>
            </div>
        );
    }

    return user ? <App /> : <Login />;
};

const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <AuthProvider>
                <AppWrapper />
            </AuthProvider>
        </StrictMode>
    );
} else {
    console.error("Root element not found");
}