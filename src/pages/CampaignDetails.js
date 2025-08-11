// src/CampaignDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
} from "@mui/material";
import {
  Campaign,
  MonetizationOn,
  Download,
  Reviews,
  CalendarToday,
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
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";

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
    ? (campaign.budgetSpent / campaign.budgetTotal) * 100
    : 0;
  const installsPercentage = campaign
    ? (campaign.installsCount / campaign.target) * 100
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
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={70} color="primary" />
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
          bgcolor: "background.default",
        }}
      >
        <ErrorIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontWeight: 600, px: 4 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: isMobile ? 2 : 6, pb: 3 }}>
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  color: "text.primary",
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
                borderRadius: 2,
                boxShadow: theme.shadows[1],
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
                elevation={0}
                sx={{
                  mb: isMobile ? 2 : 4,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  position: "relative",
                  overflow: "visible",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    background: theme.palette.primary.main,
                  },
                }}
              >
                <CardContent sx={{ pt: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        src={campaign.appLogo.url}
                        alt="App Logo"
                        sx={{
                          width: isMobile ? 64 : 80,
                          height: isMobile ? 64 : 80,
                          borderRadius: 2,
                          boxShadow: theme.shadows[4],
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
                        }}
                      >
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{ fontWeight: 800 }}
                        >
                          {campaign.name}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit fontSize="small" />}
                          onClick={handleEditOpen}
                          sx={{
                            ml: 1,
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 2,
                            borderWidth: 1,
                            "&:hover": {
                              borderWidth: 1,
                            },
                          }}
                        >
                          Edit
                        </Button>
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
                          sx={{ mr: 0.8, color: "primary.main", fontSize: 18 }}
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
                              color: "primary.main",
                              wordBreak: "break-all",
                              textDecoration: "none",
                              fontWeight: 600,
                              transition: "color 0.2s",
                              "&:hover": {
                                textDecoration: "underline",
                                color: "secondary.main",
                              },
                            }}
                          >
                            {campaign.packageName}
                          </Typography>
                        </Tooltip>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
                          gap: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Person
                            sx={{
                              fontSize: 20,
                              color: "text.secondary",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            <Box
                              component="span"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {campaign.installsCount}
                            </Box>{" "}
                            Installs
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Stars
                            sx={{
                              fontSize: 20,
                              color: "text.secondary",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            <Box
                              component="span"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {campaign.reviewCount}
                            </Box>{" "}
                            Reviews
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TrendingUp
                            sx={{
                              fontSize: 20,
                              color: "text.secondary",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            CPI:{" "}
                            <Box
                              component="span"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              ${campaign.costPerInstall}
                            </Box>
                          </Typography>
                        </Box>
                      </Box>
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
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      bgcolor: theme.palette.primary.light,
                      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.lighter} 100%)`,
                      border: `1px solid ${theme.palette.divider}`,
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <MonetizationOn sx={{ mr: 1, color: "primary.dark" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "primary.dark" }}
                        >
                          Budget
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        ${campaign.budgetTotal.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={budgetPercentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: theme.palette.primary[100],
                          mb: 1,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Spent:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "text.primary" }}
                          >
                            ${campaign.budgetSpent.toLocaleString()}
                          </Box>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Remaining:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "text.primary" }}
                          >
                            $
                            {(
                              campaign.budgetTotal - campaign.budgetSpent
                            ).toLocaleString()}
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
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      bgcolor: theme.palette.secondary.light,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.lighter} 100%)`,
                      border: `1px solid ${theme.palette.divider}`,
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <BarChart sx={{ mr: 1, color: "secondary.dark" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "secondary.dark" }}
                        >
                          Performance
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        {campaign.installsCount}/{campaign.target} Installs
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={installsPercentage}
                        color="secondary"
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: theme.palette.secondary[100],
                          mb: 1,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Target:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "text.primary" }}
                          >
                            {campaign.target}
                          </Box>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Progress:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 600, color: "text.primary" }}
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
                elevation={0}
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  mb: isMobile ? 2 : 4,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Campaign Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", mb: 2 }}>
                        <Box sx={{ minWidth: 120 }}>
                          <Typography variant="body2" color="text.secondary">
                            Type
                          </Typography>
                        </Box>
                        <Chip
                          label={campaign.type.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.info.light,
                            color: theme.palette.info.dark,
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", mb: 2 }}>
                        <Box sx={{ minWidth: 120 }}>
                          <Typography variant="body2" color="text.secondary">
                            Created
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {format(new Date(), "MMM d, yyyy")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", mb: 2 }}>
                        <Box sx={{ minWidth: 120 }}>
                          <Typography variant="body2" color="text.secondary">
                            Last Updated
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {format(new Date(), "MMM d, yyyy")}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Campaign Metrics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: theme.palette.primary.main,
                            }}
                          >
                            {campaign.installsCount}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Installs
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: theme.palette.secondary.main,
                            }}
                          >
                            {campaign.reviewCount}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Reviews
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: theme.palette.warning.main,
                            }}
                          >
                            ${campaign.costPerInstall}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            CPI
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: theme.palette.success.main,
                            }}
                          >
                            {campaign.target}
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
          <Grid item xs={12} md={4}>
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  mb: isMobile ? 2 : 4,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Campaign sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Campaign Status
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor:
                        campaign.status === "active"
                          ? theme.palette.success.light
                          : campaign.status === "pending"
                          ? theme.palette.warning.light
                          : theme.palette.primary.light,
                      textAlign: "center",
                      mb: 2,
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
                        backgroundColor:
                          campaign.status === "active"
                            ? theme.palette.success.main
                            : campaign.status === "pending"
                            ? theme.palette.warning.main
                            : theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      {getStatusIcon(campaign.status)}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color:
                          campaign.status === "active"
                            ? theme.palette.success.dark
                            : campaign.status === "pending"
                            ? theme.palette.warning.dark
                            : theme.palette.primary.dark,
                      }}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      {campaign.status === "active"
                        ? "Campaign is currently active and running"
                        : campaign.status === "pending"
                        ? "Campaign is pending approval"
                        : "Campaign has been completed"}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    startIcon={<Edit />}
                    onClick={handleEditOpen}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: theme.shadows[2],
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
                elevation={0}
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TrendingUp sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Performance Overview
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
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
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "right", fontWeight: 500 }}
                    >
                      {budgetPercentage.toFixed(1)}%
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Install Target
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={installsPercentage}
                      color="secondary"
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        mb: 1,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "right", fontWeight: 500 }}
                    >
                      {installsPercentage.toFixed(1)}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: theme.palette.grey[100],
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Performance Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {installsPercentage >= 75
                        ? "Great progress! Your campaign is performing well above average."
                        : installsPercentage >= 50
                        ? "Good progress. Consider optimizing your ad placements."
                        : "Needs improvement. Review your targeting and creatives."}
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
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "background.paper",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Edit sx={{ mr: 1, color: "primary.main" }} />
            Edit Campaign Name
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper", py: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
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
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCampaign}
            color="primary"
            variant="contained"
            disabled={updateLoading || !newName.trim()}
            sx={{ fontWeight: 600, borderRadius: 2, boxShadow: "none", px: 3 }}
          >
            {updateLoading ? <CircularProgress size={24} /> : "Save Changes"}
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
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            fontWeight: 500,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignDetails;
