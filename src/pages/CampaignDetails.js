// src/CampaignDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Chip,
  Button,
  useMediaQuery,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Campaign,
  MonetizationOn,
  Link as LinkIcon,
  CheckCircle,
  PendingActions,
  Error as ErrorIcon,
  Edit,
  ArrowBack,
  BarChart,
  Person,
  Stars,
  TrendingUp,
  Public,
  Insights,
  Assignment,
  EventNote,
  CalendarToday,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { campaignId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://advertiserappnew.onrender.com/adv/campaign/get/${campaignId}`,
          { withCredentials: true }
        );
        if (response.data.status && response.data.data) {
          setCampaign(response.data.data);
          setNewName(response.data.data.name);
        } else {
          setError("Campaign data not found");
        }
      } catch (err) {
        setError("Failed to fetch campaign data");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignData();
  }, [campaignId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "active":
        return "success";
      case "completed":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <PendingActions />;
      case "active":
        return <CheckCircle />;
      case "completed":
        return <CheckCircle />;
      default:
        return <ErrorIcon />;
    }
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleUpdateCampaign = async () => {
    try {
      setUpdateLoading(true);
      const response = await axios.put(
        `https://advertiserappnew.onrender.com/adv/campaign/update/${campaignId}`,
        { name: newName },
        { withCredentials: true }
      );

      if (response.data.status) {
        setCampaign({ ...campaign, name: newName });
        setSnackbarMessage("Campaign name updated successfully!");
        setSnackbarSeverity("success");
        setEditOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update campaign");
      }
    } catch (err) {
      setSnackbarMessage(err.message || "Error updating campaign");
      setSnackbarSeverity("error");
    } finally {
      setUpdateLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const budgetPercentage = campaign
    ? Math.min(100, (campaign.budgetSpent / campaign.budgetTotal) * 100)
    : 0;

  const installsPercentage = campaign
    ? Math.min(100, (campaign.installsCount / campaign.target) * 100)
    : 0;

  // Loading Screen
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7ff 100%)",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={70} sx={{ color: "#5a67d8" }} />
        </motion.div>
      </Box>
    );
  }

  // Error Screen
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7ff 100%)",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 4,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
              textAlign: "center",
              maxWidth: 500,
            }}
          >
            <ErrorIcon sx={{ fontSize: 60, color: "#ef4444", mb: 2 }} />
            <Typography
              variant="h5"
              color="text.primary"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                fontWeight: 600,
                px: 4,
                background: "linear-gradient(90deg, #5a67d8 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 6px rgba(92, 107, 192, 0.3)",
                borderRadius: 3,
                mt: 2,
              }}
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Box>
        </motion.div>
      </Box>
    );
  }

  // Function to format currency in Indian Rupees
  const formatRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7ff 100%)",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: isMobile ? 2 : 4, pb: 3 }}>
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Campaign Details
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and track your campaign performance
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(campaign.status)}
              label={
                campaign.status.charAt(0).toUpperCase() +
                campaign.status.slice(1)
              }
              color={getStatusColor(campaign.status)}
              variant="filled"
              sx={{
                px: 2,
                py: 1,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                height: "auto",
                minHeight: 40,
              }}
            />
          </Box>
        </motion.div>

        {/* Main content: 2 Columns layout */}
        <Grid
          container
          spacing={isMobile ? 2 : 4}
          alignItems="stretch"
          sx={{
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
        >
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Campaign Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                sx={{
                  mb: isMobile ? 2 : 4,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "visible",
                  border: "none",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    background:
                      "linear-gradient(90deg, #5a67d8 0%, #8b5cf6 100%)",
                  },
                }}
              >
                <CardContent sx={{ pt: 4, pb: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item>
                      <Avatar
                        src={campaign.appLogo?.url || ""}
                        alt="App Logo"
                        sx={{
                          width: isMobile ? 64 : 80,
                          height: isMobile ? 64 : 80,
                          borderRadius: 2,
                          boxShadow: "0 8px 16px rgba(92, 107, 192, 0.25)",
                          border: "2px solid white",
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{ fontWeight: 800, color: "#1e293b" }}
                        >
                          {campaign.name}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1.2,
                          flexWrap: "wrap",
                        }}
                      >
                        <LinkIcon
                          sx={{ mr: 0.8, color: "#5a67d8", fontSize: 18 }}
                        />
                        <Tooltip
                          arrow
                          title={
                            <span style={{ wordBreak: "break-all" }}>
                              {campaign.packageName}
                            </span>
                          }
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 400 }}
                        >
                          <Typography
                            variant="body2"
                            component="a"
                            href={campaign.packageName}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              color: "#5a67d8",
                              wordBreak: "break-all",
                              textDecoration: "none",
                              fontWeight: 600,
                              transition: "color 0.2s",
                              "&:hover": {
                                textDecoration: "underline",
                                color: "#8b5cf6",
                              },
                            }}
                          >
                            {campaign.packageName}
                          </Typography>
                        </Tooltip>
                      </Box>

                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        <Grid item>
                          <Chip
                            icon={<Person sx={{ fontSize: 18 }} />}
                            label={`${campaign.installsCount} Installs`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "#e0f2fe",
                              color: "#0c4a6e",
                              px: 1.5,
                              py: 1,
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            icon={<Stars sx={{ fontSize: 18 }} />}
                            label={`${campaign.reviewCount} Reviews`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "#ede9fe",
                              color: "#5b21b6",
                              px: 1.5,
                              py: 1,
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            icon={<TrendingUp sx={{ fontSize: 18 }} />}
                            label={`CPI: ₹${campaign.costPerInstall}`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "#dbeafe",
                              color: "#1d4ed8",
                              px: 1.5,
                              py: 1,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <Grid
              container
              spacing={isMobile ? 2 : 3}
              sx={{ mb: isMobile ? 2 : 4 }}
            >
              <Grid item xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #8b5cf6 100%)",
                      color: "white",
                      height: "100%",
                      boxShadow: "0 10px 20px rgba(92, 107, 192, 0.3)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <MonetizationOn sx={{ mr: 1, color: "white" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "white" }}
                        >
                          Budget
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, mb: 1, color: "white" }}
                      >
                        {formatRupees(campaign.budgetTotal)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={budgetPercentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "rgba(255,255,255,0.3)",
                          mb: 1.5,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            bgcolor: "white",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        <Typography variant="body2">
                          Spent:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "white" }}
                          >
                            {formatRupees(campaign.budgetSpent)}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Remaining:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "white" }}
                          >
                            {formatRupees(
                              campaign.budgetTotal - campaign.budgetSpent
                            )}
                          </Box>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      background:
                        "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                      color: "white",
                      height: "100%",
                      boxShadow: "0 10px 20px rgba(14, 165, 233, 0.3)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <BarChart sx={{ mr: 1, color: "white" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "white" }}
                        >
                          Performance
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, mb: 1, color: "white" }}
                      >
                        {campaign.installsCount}/{campaign.target} Installs
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={installsPercentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "rgba(255,255,255,0.3)",
                          mb: 1.5,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            bgcolor: "white",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        <Typography variant="body2">
                          Target:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "white" }}
                          >
                            {campaign.target}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Progress:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "white" }}
                          >
                            {installsPercentage.toFixed(1)}%
                          </Box>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Campaign Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  mb: isMobile ? 2 : 4,
                  border: "none",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Assignment sx={{ mr: 1, color: "#5a67d8" }} />
                    Campaign Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", mb: 3 }}>
                        <Box
                          sx={{
                            minWidth: 120,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Public
                            sx={{ mr: 1, fontSize: 20, color: "#64748b" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Type
                          </Typography>
                        </Box>
                        <Chip
                          label={campaign.type?.toUpperCase() || "N/A"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: "#ede9fe",
                            color: "#7c3aed",
                            height: 28,
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Insights sx={{ mr: 1, color: "#5a67d8" }} />
                      Campaign Metrics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            bgcolor: "#f0fdfa",
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid #ccfbf1",
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#0d9488",
                              mb: 1,
                            }}
                          >
                            {campaign.installsCount || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Installs
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            bgcolor: "#f5f3ff",
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid #ede9fe",
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#7c3aed",
                              mb: 1,
                            }}
                          >
                            {campaign.reviewCount || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Reviews
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            bgcolor: "#eff6ff",
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid #dbeafe",
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#2563eb",
                              mb: 1,
                            }}
                          >
                            ₹{campaign.costPerInstall || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            CPI
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            bgcolor: "#f0f9ff",
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid #e0f2fe",
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#0284c7",
                              mb: 1,
                            }}
                          >
                            {campaign.target || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Target
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md="auto" sx={{ width: 360 }}>
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  mb: isMobile ? 2 : 4,
                  border: "none",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Campaign sx={{ mr: 1, color: "#5a67d8" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Campaign Status
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        campaign.status === "active"
                          ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                          : campaign.status === "pending"
                          ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                          : "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                      textAlign: "center",
                      mb: 3,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        mb: 2,
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      }}
                    >
                      {getStatusIcon(campaign.status)}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "white",
                        mb: 1,
                      }}
                    >
                      {campaign.status?.charAt(0).toUpperCase() +
                        campaign.status?.slice(1) || "Unknown"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "rgba(255,255,255,0.9)" }}
                    >
                      {campaign.status === "active"
                        ? "Campaign is currently active and running"
                        : campaign.status === "pending"
                        ? "Campaign is pending approval"
                        : campaign.status === "completed"
                        ? "Campaign has been completed"
                        : "Unknown campaign status"}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Edit />}
                    onClick={handleEditOpen}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      background:
                        "linear-gradient(90deg, #5a67d8 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 6px rgba(92, 107, 192, 0.3)",
                      "&:hover": {
                        boxShadow: "0 6px 8px rgba(92, 107, 192, 0.4)",
                      },
                    }}
                  >
                    Edit Campaign
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  border: "none",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <TrendingUp sx={{ mr: 1, color: "#5a67d8" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Performance Overview
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      Budget Utilization
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={budgetPercentage}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        mb: 1,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background:
                            "linear-gradient(90deg, #5a67d8 0%, #8b5cf6 100%)",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#5a67d8",
                      }}
                    >
                      {budgetPercentage.toFixed(1)}%
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      Install Target
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={installsPercentage}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        mb: 1,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background:
                            "linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%)",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#0ea5e9",
                      }}
                    >
                      {installsPercentage.toFixed(1)}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      backgroundColor: "#f8fafc",
                      borderRadius: 3,
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1, color: "#334155" }}
                    >
                      Performance Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {installsPercentage >= 75
                        ? "Excellent progress! Your campaign is exceeding expectations."
                        : installsPercentage >= 50
                        ? "Good results. Consider optimizing ad placements for better ROI."
                        : "Needs improvement. Review targeting and creative assets for better performance."}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Name Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: isMobile ? "90%" : "500px",
            overflow: "visible",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "background.paper",
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Edit sx={{ mr: 1, color: "#5a67d8" }} />
          Edit Campaign Name
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper", py: 3 }}>
          <DialogContentText sx={{ mb: 2, color: "#64748b" }}>
            Update the name of your campaign. This will be visible in all
            campaign reports.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Campaign Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={handleNameChange}
            disabled={updateLoading}
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            bgcolor: "background.paper",
            borderTop: `1px solid ${theme.palette.divider}`,
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={handleEditClose}
            color="inherit"
            disabled={updateLoading}
            sx={{
              fontWeight: 600,
              borderRadius: 3,
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCampaign}
            variant="contained"
            disabled={updateLoading || !newName.trim()}
            sx={{
              fontWeight: 600,
              borderRadius: 3,
              px: 4,
              py: 1,
              background: "linear-gradient(90deg, #5a67d8 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 6px rgba(92, 107, 192, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 8px rgba(92, 107, 192, 0.4)",
              },
            }}
          >
            {updateLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            fontWeight: 500,
            alignItems: "center",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignDetails;
