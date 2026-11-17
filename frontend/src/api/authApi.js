import api from "./api";

export const registerUser = (userData) => {
    return api.post("/auth/register", userData);
};

export const loginUser = (userData) => {
    return api.post("/auth/login", userData);
};

export const verifyEmail = (token) => {
    return api.get("/auth/verify-email", {
        params: { token }
    });
};

export const resendVerificationEmail = (email) => {
    return api.post("/auth/resend-verification", {
        email
    });
};
