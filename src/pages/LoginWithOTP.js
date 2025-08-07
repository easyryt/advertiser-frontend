// pages/LoginWithOTP.js
import React, { useState } from "react";
import axios from "axios";
import {
  Box, Button, Container, TextField, Typography, Paper, useTheme,
  useMediaQuery, CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { SnackbarProvider, useSnackbar } from "notistack";
import { motion } from "framer-motion";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80";

const LoginWithOTPInner = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const phoneRegex = /^[0-9]{10}$/;
  const otpRegex = /^[0-9]{6}$/;

  const sendOTP = async () => {
    if (!phoneRegex.test(phone)) {
      enqueueSnackbar("Please enter a valid 10-digit phone number", { variant: "warning" });
      return false;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://advertiserappnew.onrender.com/adv/auth/logIn",
        { phone },
        { withCredentials: true }
      );
      if (response.data.status) {
        setOtp(response.data.Otp || "");
        setStep(2);
        enqueueSnackbar("OTP sent successfully!", { variant: "success" });
        return true;
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpRegex.test(otp)) {
      enqueueSnackbar("Please enter a valid 6-digit OTP", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://advertiserappnew.onrender.com/adv/auth/verifyOtp",
        { phone, otp },
        { withCredentials: true }
      );
      if (response.data.status) {
        enqueueSnackbar("Login successful! Redirecting...", { variant: "success" });
        login(response.data.user); // <-- sets login cookie!
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (loading) return;
    const success = await sendOTP();
    if (success) setOtp("");
  };

  return (
    <Box sx={{
      height: "100vh", backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      display: "flex", alignItems: "center", justifyContent: "center", p: 2,
      position: "relative", overflow: "hidden",
    }}>
      <Box sx={{
        position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
        backgroundColor: "rgba(13, 38, 63, 0.75)", zIndex: 1,
      }} />
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 2, borderRadius: 3 }}>
        <motion.div initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }, },
          }}>
          <Paper
            elevation={12}
            sx={{
              p: isMobile ? 4 : 6,
              borderRadius: 3,
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 20px 0 rgba(31, 38, 135, 0.25)",
            }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              align="center"
              fontWeight="700"
              color="primary.dark"
              gutterBottom
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Advertiser Login
            </Typography>
            {step === 1 ? (
              <Box sx={{ mt: 3 }} component="form" noValidate autoComplete="off"
                onSubmit={e => { e.preventDefault(); sendOTP(); }}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  value={phone}
                  onChange={e => (/^\d{0,10}$/.test(e.target.value)) && setPhone(e.target.value)}
                  helperText="Enter 10-digit mobile number"
                  required fullWidth inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <Button variant="contained" color="primary" type="submit"
                  disabled={loading || phone.length !== 10} fullWidth
                  sx={{
                    mt: 4, py: 1.7, borderRadius: "12px", fontWeight: "600", fontSize: "1rem",
                    letterSpacing: 1.1, boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3), 0 3px 6px rgba(25, 118, 210, 0.2)",
                    transition: "all 0.35s ease-in-out",
                    "&:hover": { boxShadow: "0 10px 20px rgba(25, 118, 210, 0.6), 0 6px 10px rgba(25, 118, 210, 0.4)" },
                  }}
                >
                  {loading ? <CircularProgress size={26} /> : "Send OTP"}
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }} component="form"
                noValidate autoComplete="off"
                onSubmit={e => { e.preventDefault(); handleVerifyOTP(); }}>
                <TextField
                  label="OTP Code"
                  variant="outlined"
                  value={otp}
                  onChange={e => (/^\d{0,6}$/.test(e.target.value)) && setOtp(e.target.value)}
                  helperText="Enter 6-digit OTP"
                  required fullWidth inputProps={{ maxLength: 6, inputMode: "numeric" }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <Button variant="contained" color="primary" type="submit"
                  disabled={loading || otp.length !== 6} fullWidth
                  sx={{
                    mt: 4, py: 1.7, borderRadius: "12px", fontWeight: "600", fontSize: "1rem",
                    letterSpacing: 1.1, boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3), 0 3px 6px rgba(25, 118, 210, 0.2)",
                    transition: "all 0.35s ease-in-out",
                    "&:hover": { boxShadow: "0 10px 20px rgba(25, 118, 210, 0.6), 0 6px 10px rgba(25, 118, 210, 0.4)" },
                  }}>
                  {loading ? <CircularProgress size={26} /> : "Verify OTP"}
                </Button>
                <Button
                  onClick={handleResendOTP}
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 2,
                    color: theme.palette.primary.main,
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  Resend OTP
                </Button>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

const LoginWithOTP = () => (
  <SnackbarProvider maxSnack={3} autoHideDuration={3500}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}>
    <LoginWithOTPInner />
  </SnackbarProvider>
);

export default LoginWithOTP;
