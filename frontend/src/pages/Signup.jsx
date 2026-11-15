import { useState } from "react";

import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert
} from "@mui/material";

import { registerUser } from "../api/authApi";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Check empty fields
        if (!name.trim() || !email.trim() || !password) {
            setError("All fields are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        // Password validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            setMessage(response.data.message);

            // Clear input fields
            setName("");
            setEmail("");
            setPassword("");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
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
                    Create Account
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mb={3}
                >
                    Sign up to start managing your todos
                </Typography>

                <Box component="form" onSubmit={handleSignup}>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {message && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>

                </Box>

            </Paper>

        </Container>
    );
}

export default Signup;
