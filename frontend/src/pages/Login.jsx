import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert
} from "@mui/material";

import { loginUser } from "../api/authApi";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);

            const response = await loginUser({
                email: email.trim().toLowerCase(),
                password
            });

            // Send login information to App.jsx
            onLogin(response.data);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 8,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h4"
                    textAlign="center"
                    fontWeight="bold"
                    mb={1}
                >
                    Welcome Back
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mb={3}
                >
                    Sign in to manage your todos
                </Typography>

                <Box component="form" onSubmit={handleLogin}>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 3,
                            py: 1.3,
                            fontWeight: "bold"
                        }}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>

                </Box>
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
                >
                    <Typography variant="body2">
                        Don't have an account?
                    </Typography>
                    <Button variant="text"
                    onClick={()=>navigate("/signup")}>
                        Sign Up
                    </Button>
                </Box>

            </Paper>

        </Container>
    );
}

export default Login;
