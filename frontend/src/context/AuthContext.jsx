import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
    user: null,
    loading: true,
    signInWithGoogle: () => { },
    login: async () => ({ success: false }),
    signup: async () => ({ success: false }),
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/current_user", {
                credentials: "include"
            });
            if (res.ok) {
                const text = await res.text();
                const data = text ? JSON.parse(text) : null;
                setUser(data && data._id ? data : null);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const signInWithGoogle = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    const login = async (email, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                return { success: true };
            }
            return { success: false, message: data.message || "Login failed" };
        } catch (error) {
            return { success: false, message: "An error occurred during login" };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                return { success: true };
            }
            return { success: false, message: data.message || "Signup failed" };
        } catch (error) {
            return { success: false, message: "An error occurred during signup" };
        }
    };

    const logout = () => {
        window.location.href = "http://localhost:5000/api/auth/logout";
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
