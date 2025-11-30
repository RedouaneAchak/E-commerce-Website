import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const BASE_URL = "http://localhost:5000/api/v1";

    // 🔵 AUTO-LOAD USER IF TOKEN EXISTS (persistent login)
    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/auth/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error();

                const data = await res.json();
                setUser(data.user);  // backend returns { user: {...} }

            } catch (err) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }
        };

        loadUser();
    }, [token]);

    // REGISTER
    const register = async (name, email, password) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);

            return { success: true };

        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // LOGIN
    const login = async (email, password) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);

            return { success: true };

        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}