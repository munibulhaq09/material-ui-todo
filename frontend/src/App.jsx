import { useEffect, useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    Container,
    Box,
    Typography,
    Button
} from "@mui/material";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Todo from "./pages/Todo";
import VerifyEmail from "./pages/VerifyEmail";



// Landing Page
function Home() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3
                }}
            >
                <Typography variant="h2" fontWeight="bold">
                    TodoApp
                </Typography>

                <Typography color="text.secondary">
                    Manage your daily tasks easily
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

// Application Routes
function AppRoutes() {

    const navigate = useNavigate();

    // Restore logged-in user after page refresh
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    //for timer
    useEffect(()=>{
        if (!user) {
            return;
        }
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(()=>{
                handleLogout();
            }, 5*60*1000);
        };
        resetTimer();
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);
        window.addEventListener("touchstart", resetTimer);

        return ()=>{
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
            window.removeEventListener("touchstart", resetTimer);
        };
    },[user]);

    // Handle successful login
    const handleLogin = (data) => {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        setUser(data.user);

        navigate("/todos");
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        navigate("/");
    };

    return (
        <Routes>

            <Route path="/" element={<Home />} />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
            path="/verify-email"
            element={<VerifyEmail />}
            />

            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate to="/todos" replace />
                    ) : (
                        <Login onLogin={handleLogin} />
                    )
                }
            />

            {/* Protected Todo Page */}
            <Route
                path="/todos"
                element={
                    user && localStorage.getItem("token") ? (
                        <Todo
                            user={user}
                            onLogout={handleLogout}
                        />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

        </Routes>
    );
}

// Main App
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
