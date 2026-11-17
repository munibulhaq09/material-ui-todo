
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    TextField
} from "@mui/material";

import {
    verifyEmail,
    resendVerificationEmail
} from "../api/authApi";

function VerifyEmail() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const verificationStarted = useRef(false);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const [email, setEmail] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState(false);

    useEffect(() => {

        const token = searchParams.get("token");
        
        if (verificationStarted.current) {
            return;
        }
        verificationStarted.current = true;

        const verify = async () => {

            if (!token) {
                setMessage("Verification token is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await verifyEmail(token);

                setMessage(response.data);
                setSuccess(true);

            } catch (error) {

                setMessage(
                    error.response?.data ||
                    "Email verification failed. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };

        verify();

    }, [searchParams]);

    // Resend verification email
    const handleResend = async () => {

        if (!email.trim()) {
            setResendMessage("Please enter your email address.");
            setResendError(true);
            return;
        }

        try {
            setResendLoading(true);
            setResendMessage("");
            setResendError(false);

            const response = await resendVerificationEmail(email);

            setResendMessage(response.data.message);

        } catch (error) {

            setResendMessage(
                error.response?.data?.message ||
                "Could not send verification email."
            );

            setResendError(true);

        } finally {
            setResendLoading(false);
        }
    };

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

                <Typography variant="h4" fontWeight="bold">
                    Email Verification
                </Typography>

                {loading ? (
                    <>
                        <CircularProgress />

                        <Typography color="text.secondary">
                            Verifying your email...
                        </Typography>
                    </>
                ) : (
                    <>
                        <Alert
                            severity={success ? "success" : "error"}
                            sx={{ width: "100%" }}
                        >
                            {message}
                        </Alert>

                        {success ? (
                            <Button
                                variant="contained"
                                onClick={() => navigate("/login")}
                            >
                                Go to Login
                            </Button>
                        ) : (
                            <>
                                <Typography>
                                    Enter your registered email to receive a new verification link.
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                >
                                    {resendLoading
                                        ? "Sending..."
                                        : "Resend Verification Email"}
                                </Button>

                                {resendMessage && (
                                    <Alert
                                        severity={resendError ? "error" : "success"}
                                        sx={{ width: "100%" }}
                                    >
                                        {resendMessage}
                                    </Alert>
                                )}
                            </>
                        )}
                    </>
                )}

            </Box>

        </Container>
    );
}

export default VerifyEmail;
