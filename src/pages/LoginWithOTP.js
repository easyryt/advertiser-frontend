// pages/LoginWithOTP.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Grid,
  CssBaseline,
  IconButton,
  InputAdornment,
  Fade,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { SnackbarProvider, useSnackbar } from "notistack";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Smartphone,
  VisibilityOff,
  Visibility,
  ArrowBack,
} from "@mui/icons-material";

const premiumQuotes = [
  {
    text: "Your next successful campaign is just one login away",
    author: "AdExpert Pro",
    company: "Premium Advertising Platform",
  },
  {
    text: "Transform app visibility into revenue with strategic campaigns",
    author: "AdExpert Pro",
    company: "Performance Marketing",
  },
  {
    text: "Get installments that grow with your app's success",
    author: "AdExpert Pro",
    company: "Financial Solutions",
  },
];

const LoginWithOTPInner = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [quoteIndex] = useState(
    Math.floor(Math.random() * premiumQuotes.length)
  );
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const phoneRegex = /^[0-9]{10}$/;
  const otpRegex = /^[0-9]{6}$/;

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  const sendOTP = async () => {
    if (!phoneRegex.test(phone)) {
      enqueueSnackbar("Please enter a valid 10-digit phone number", {
        variant: "warning",
      });
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
        setCountdown(30);
        enqueueSnackbar("OTP sent successfully!", { variant: "success" });
        return true;
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpRegex.test(otp)) {
      enqueueSnackbar("Please enter a valid 6-digit OTP", {
        variant: "warning",
      });
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
        enqueueSnackbar("Login successful! Redirecting...", {
          variant: "success",
        });
        login(response.data.user);
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (loading || countdown > 0) return;
    const success = await sendOTP();
    if (success) setOtp("");
  };

  return (
    <Grid
      container
      component="main"
      sx={{ 
        minHeight: "100vh",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#f8fafc"
      }}
    >
      <CssBaseline />

      {/* Left Panel - Premium Branding */}
      <Grid 
        item 
        xs={false} 
        md={6} 
        sx={{ 
          display: { xs: "none", md: "flex" },
          background: "linear-gradient(135deg, #0f1b31 0%, #1d2b50 100%)",
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(41, 128, 185, 0.15) 0%, transparent 70%)",
            animation: "rotate 20s linear infinite",
            zIndex: 1,
          },
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        {/* Floating Elements */}
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3498db 0%, #8e44ad 100%)",
              opacity: 0.3,
              zIndex: 1,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: item * 2,
            }}
          />
        ))}

        <Box 
          sx={{ 
            position: "relative", 
            zIndex: 2, 
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ mb: 6, textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: "#fff",
                  mb: 1,
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "-0.5px",
                  background: "linear-gradient(to right, #fff 0%, #a1c4fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AdExpert Pro
              </Typography>
              <Divider
                sx={{
                  width: 80,
                  height: 4,
                  background: "linear-gradient(90deg, #3498db 0%, #8e44ad 100%)",
                  mb: 3,
                  mx: "auto"
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: "#d6e4ff",
                  fontWeight: 300,
                  maxWidth: 500,
                  lineHeight: 1.6,
                }}
              >
                Enterprise-grade advertising platform for professionals
              </Typography>
            </Box>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  p: 4,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                  maxWidth: 600
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 400,
                    color: "#fff",
                    mb: 2,
                    fontStyle: "italic",
                    lineHeight: 1.5,
                  }}
                >
                  "{premiumQuotes[quoteIndex].text}"
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                  <Box
                    sx={{
                      width: 5,
                      height: 50,
                      background: "linear-gradient(180deg, #3498db 0%, #8e44ad 100%)",
                      mr: 2,
                      borderRadius: 2,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", fontWeight: 600 }}
                    >
                      {premiumQuotes[quoteIndex].author}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#bb86fc", fontWeight: 300 }}
                    >
                      {premiumQuotes[quoteIndex].company}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        </Box>
      </Grid>

      {/* Right Panel - Login Form */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: isMobile ? 2 : 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 550,
            py: 6,
            px: isSmallScreen ? 3 : 6,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #3498db 0%, #8e44ad 100%)",
            },
          }}
        >
          {/* Back Button for OTP Step */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <IconButton
                onClick={() => setStep(1)}
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  color: "primary.main",
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.2)",
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
            </motion.div>
          )}

          <Box sx={{ textAlign: "center", mb: 6, mt: step === 2 ? 4 : 0 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 2,
                    mb: 3,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Lock
                    sx={{
                      fontSize: 40,
                      color: theme.palette.primary.main,
                      opacity: 0.9,
                    }}
                  />
                </Box>
              </motion.div>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontFamily: "'Montserrat', sans-serif",
                  background: "linear-gradient(90deg, #2c3e50 0%, #3498db 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {step === 1 ? "Secure Login" : "Verify Identity"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  maxWidth: 300,
                  mx: "auto",
                  fontWeight: 300,
                }}
              >
                {step === 1
                  ? "Enter your phone number to continue"
                  : "Enter verification code sent to your phone"}
              </Typography>
            </motion.div>
          </Box>

          {/* App Features Grid - Mobile Only */}
          {isMobile && (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                      mb: 1,
                    }}
                  >
                    <Smartphone sx={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    App Campaigns
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                      mb: 1,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4CAF50" />
                    </svg>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Installments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                      mb: 1,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 15.08L12.5 12.25V7Z" fill="#FF9800" />
                    </svg>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    App Reviews
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendOTP();
                  }}
                  sx={{ maxWidth: 500, mx: "auto" }}
                >
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    value={phone}
                    onChange={(e) =>
                      /^\d{0,10}$/.test(e.target.value) &&
                      setPhone(e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Smartphone sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary.light,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                          boxShadow: "0 0 0 4px rgba(52, 152, 219, 0.2)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        transform: "translate(14px, 18px) scale(1)",
                      },
                      "& .MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: "100%" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading || phone.length !== 10}
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.8,
                        borderRadius: "14px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        letterSpacing: 1.05,
                        background: "linear-gradient(90deg, #2c3e50 0%, #3498db 100%)",
                        boxShadow: "0 8px 20px rgba(52, 152, 219, 0.4)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 12px 25px rgba(52, 152, 219, 0.6)",
                          background: "linear-gradient(90deg, #2c3e50 0%, #2980b9 100%)",
                        },
                        "&:disabled": {
                          background: "#eef2f7",
                          color: "#b0bec5",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={26} sx={{ color: "white" }} />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span>Continue with OTP</span>
                          <Box sx={{ width: 8 }} />
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            →
                          </motion.div>
                        </Box>
                      )}
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyOTP();
                  }}
                  sx={{ maxWidth: 500, mx: "auto" }}
                >
                  <TextField
                    fullWidth
                    label="Verification Code"
                    variant="outlined"
                    value={otp}
                    onChange={(e) =>
                      /^\d{0,6}$/.test(e.target.value) && setOtp(e.target.value)
                    }
                    type={showOtp ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowOtp(!showOtp)}
                            edge="end"
                          >
                            {showOtp ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary.light,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                          boxShadow: "0 0 0 4px rgba(52, 152, 219, 0.2)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        transform: "translate(14px, 18px) scale(1)",
                      },
                      "& .MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: "100%" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.8,
                        borderRadius: "14px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        letterSpacing: 1.05,
                        background: "linear-gradient(90deg, #8e44ad 0%, #3498db 100%)",
                        boxShadow: "0 8px 20px rgba(142, 68, 173, 0.4)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 12px 25px rgba(142, 68, 173, 0.6)",
                          background: "linear-gradient(90deg, #8e44ad 0%, #2980b9 100%)",
                        },
                        "&:disabled": {
                          background: "#f5f5f5",
                          color: "#b0bec5",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={26} sx={{ color: "white" }} />
                      ) : (
                        "Verify & Sign In"
                      )}
                    </Button>
                  </motion.div>

                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        onClick={handleResendOTP}
                        disabled={loading || countdown > 0}
                        sx={{
                          color:
                            countdown > 0 ? "text.disabled" : "primary.main",
                          fontWeight: 500,
                          textTransform: "none",
                          fontSize: "0.9rem",
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "primary.dark",
                          },
                        }}
                      >
                        {countdown > 0
                          ? `Resend OTP in ${countdown}s`
                          : "Resend Verification Code"}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* App Value Proposition */}
          <Box sx={{ mt: 6, textAlign: "center", maxWidth: 600, mx: "auto" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mb: 2,
                color: theme.palette.primary.dark,
              }}
            >
              Why choose AdExpert Pro?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    App Campaign Management
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    Flexible Installments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">App Review Analytics</Typography>
                </Box>
              </Grid>
            </Grid>

            <Fade in timeout={1000}>
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    fontWeight: 300,
                  }}
                >
                  © 2023 AdExpert Pro. All rights reserved.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mt: 1,
                    fontWeight: 300,
                  }}
                >
                  By signing in, you agree to our Terms and Privacy Policy
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const LoginWithOTP = () => (
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={3500}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    style={{
      fontSize: "0.9rem",
      borderRadius: 12,
      fontFamily: "'Montserrat', sans-serif",
    }}
  >
    <LoginWithOTPInner />
  </SnackbarProvider>
);

export default LoginWithOTP;