import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  Avatar,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  CalendarToday,
  MonetizationOn,
  CheckCircle,
  ArrowForward,
  ArrowBack
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";

const CampaignsPage = () => {
  const theme = useTheme();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "cpi",
    packageName: "",
    appLogo: null,
    campDay: 7,
  });
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [planError, setPlanError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Campaign Details', 'Select Plan'];

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        "https://advertiserappnew.onrender.com/adv/campaign/getAll",
        { withCredentials: true }
      );
      if (response.data.status && Array.isArray(response.data.data)) {
        setCampaigns(response.data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch campaigns"
      );
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      setPlanError("");
      const response = await axios.get(
        "https://advertiserappnew.onrender.com/adv/campaign/get/plans",
        { withCredentials: true }
      );
      if (response.data.status && Array.isArray(response.data.data)) {
        setPlans(response.data.data);
      } else {
        throw new Error("Invalid plans data format");
      }
    } catch (err) {
      setPlanError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch plans"
      );
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleRefresh = () => {
    setRefreshLoading(true);
    setError("");
    fetchCampaigns();
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
    setActiveStep(0);
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (validateCampaignDetails()) {
        setActiveStep(1);
        fetchPlans();
      }
    } else if (activeStep === 1) {
      if (selectedPlan) {
        handleCreateCampaign();
      }
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setPlanDialogOpen(false);
    setActiveStep(0);
    setFormData({
      name: "",
      type: "cpi",
      packageName: "",
      appLogo: null,
      campDay: 7,
    });
    setFormErrors({});
    setCreateError("");
    setSelectedPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      appLogo: e.target.files[0],
    });
  };

  const validateCampaignDetails = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Campaign name is required";
    if (!formData.packageName) errors.packageName = "Package Name is required";
    if (!formData.campDay || formData.campDay <= 0)
      errors.campDay = "Campaign days must be greater than 0";
    if (!formData.appLogo) errors.appLogo = "App logo is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCampaign = async () => {
    try {
      setCreateLoading(true);
      setCreateError("");
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("type", formData.type);
      formPayload.append("packageName", formData.packageName);
      formPayload.append("appLogo", formData.appLogo);
      formPayload.append("campDay", formData.campDay);
      
      const response = await axios.post(
        `https://advertiserappnew.onrender.com/adv/campaign/create/${selectedPlan._id}`,
        formPayload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.status) {
        fetchCampaigns();
        handleCreateDialogClose();
      } else {
        throw new Error(response.data.message || "Failed to create campaign");
      }
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create campaign"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "CAMPAIGN NAME",
      minWidth: 220,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "TYPE",
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase()}
          sx={{
            bgcolor: params.value === "cpi" ? "#e8f5e9" : "#e3f2fd",
            color: params.value === "cpi" ? "#2e7d32" : "#1976d2",
            fontWeight: 700,
            textTransform: "uppercase",
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        />
      ),
    },
    {
      field: "packageName",
      headerName: "PACKAGE NAME",
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <LinkIcon fontSize="small" color="primary" />
          <Typography
            variant="body2"
            sx={{
              textDecoration: "underline",
              color: "primary.main",
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 200,
            }}
          >
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "appLogo",
      headerName: "APP LOGO",
      minWidth: 140,
      renderCell: (params) =>
        params.row.appLogo?.url ? (
          <Avatar
            src={params.row.appLogo.url}
            alt="App logo"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <ImageIcon fontSize="small" color="disabled" />
          </Avatar>
        ),
    },
    {
      field: "status",
      headerName: "STATUS",
      minWidth: 130,
      renderCell: (params) => {
        const isActive = params.row.status === "active";
        return (
          <Chip
            label={params.row.status.toUpperCase()}
            sx={{
              bgcolor: isActive ? "#e8f5e9" : "#ffebee",
              color: isActive ? "#2e7d32" : "#d32f2f",
              fontWeight: 700,
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "ACTION",
      minWidth: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            navigate(`/dashboard/campaigns-details/${params.row._id}`)
          }
          sx={{
            whiteSpace: "nowrap",
            fontWeight: 600,
            boxShadow: theme.shadows[1],
            "&:hover": {
              boxShadow: theme.shadows[3],
            },
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert
          severity="error"
          icon={<ErrorIcon fontSize="large" />}
          sx={{ 
            fontSize: 16,
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            mb: 3
          }}
        >
          <Typography variant="h6" mb={1}>
            Error Loading Campaigns
          </Typography>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            px: 4,
            py: 1
          }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Typography variant="h4" fontWeight={800} color="primary" sx={{ 
            textTransform: 'uppercase',
            letterSpacing: 1,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            Campaign Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                boxShadow: theme.shadows[3],
                "&:hover": {
                  boxShadow: theme.shadows[5],
                }
              }}
            >
              New Campaign
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshLoading}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                }
              }}
            >
              {refreshLoading ? <CircularProgress size={24} /> : "Refresh"}
            </Button>
          </Stack>
        </Stack>
        {campaigns.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              background: "linear-gradient(to bottom right, #ffffff, #f8fbff)",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
            }}
          >
            <Box sx={{ maxWidth: 500, mx: 'auto' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <img 
                  src="/empty-campaign.svg" 
                  alt="No campaigns" 
                  style={{ width: '100%', maxWidth: 300, margin: '0 auto 30px' }}
                />
              </motion.div>
              <Typography variant="h5" color="textSecondary" mb={2} fontWeight={600}>
                No Campaigns Found
              </Typography>
              <Typography variant="body1" mb={4} color="text.secondary">
                Launch your first campaign to get started with user acquisition and growth.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                size="large"
                onClick={handleCreateClick}
                sx={{
                  borderRadius: 2,
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    boxShadow: theme.shadows[5],
                  }
                }}
              >
                Create First Campaign
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box sx={{ 
            width: "100%", 
            overflowX: "auto",
            borderRadius: 4,
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}>
            <DataGrid
              rows={campaigns}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
              getRowId={(row) => row._id || row.id}
              sx={{
                border: "none",
                minWidth: 1000,
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: theme.palette.mode === "light" ? "#f0f4f8" : "#121826",
                  borderRadius: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  borderBottom: `2px solid ${theme.palette.divider}`
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-footerContainer": {
                  bgcolor: theme.palette.mode === "light" ? "#f0f4f8" : "#121826",
                  borderRadius: 0,
                },
                "& .MuiDataGrid-row": {
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: theme.palette.background.default,
                }
              }}
            />
          </Box>
        )}

        {/* Create Campaign Dialog with Stepper */}
        <Dialog
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          fullWidth
          maxWidth={activeStep === 1 ? "md" : "sm"}
        >
          <DialogTitle sx={{ 
            bgcolor: "primary.main", 
            color: "white",
            py: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" fontWeight={700}>
              {activeStep === 0 ? "Create New Campaign" : "Select a Plan"}
            </Typography>
          </DialogTitle>
          
          <Box sx={{ px: 3, pt: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          <DialogContent sx={{ py: 4 }}>
            {activeStep === 0 ? (
              <form>
                <Stack spacing={3}>
                  {createError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {createError}
                    </Alert>
                  )}

                  <Box>
                    <input
                      type="file"
                      id="app-logo-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                    <label htmlFor="app-logo-upload">
                      <Button 
                        variant="outlined" 
                        component="span"
                        fullWidth
                        sx={{
                          py: 2,
                          borderStyle: 'dashed',
                          borderWidth: 2,
                          borderRadius: 3,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <ImageIcon fontSize="large" color="action" />
                          <Typography variant="body1" fontWeight={500}>
                            {formData.appLogo 
                              ? formData.appLogo.name 
                              : "Upload App Logo"
                            }
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Recommended: 512x512 PNG
                          </Typography>
                        </Stack>
                      </Button>
                    </label>
                    {formErrors.appLogo && (
                      <Typography variant="caption" color="error" mt={1}>
                        {formErrors.appLogo}
                      </Typography>
                    )}
                  </Box>

                  <TextField
                    name="name"
                    label="Campaign Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        fontSize: 16
                      }
                    }}
                  />

                  <FormControl fullWidth error={!!formErrors.type}>
                    <InputLabel>Campaign Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      label="Campaign Type"
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="cpi">Install</MenuItem>
                      <MenuItem value="review">Review</MenuItem>
                    </Select>
                    {formErrors.type && (
                      <FormHelperText>{formErrors.type}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    name="campDay"
                    label="Campaign Duration (Days)"
                    type="number"
                    value={formData.campDay}
                    onChange={handleInputChange}
                    error={!!formErrors.campDay}
                    helperText={formErrors.campDay}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="primary" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        fontSize: 16
                      }
                    }}
                  />

                  <TextField
                    name="packageName"
                    label="Package Name"
                    value={formData.packageName}
                    onChange={handleInputChange}
                    error={!!formErrors.packageName}
                    helperText={formErrors.packageName}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="primary" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        fontSize: 16
                      }
                    }}
                  />
                </Stack>
              </form>
            ) : (
              <Box>
                {loadingPlans ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
                  </Box>
                ) : planError ? (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {planError}
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {plans.map((plan) => (
                      <Grid item xs={12} md={6} key={plan._id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            boxShadow: theme.shadows[4],
                            border: selectedPlan?._id === plan._id 
                              ? `2px solid ${theme.palette.primary.main}` 
                              : `1px solid ${theme.palette.divider}`,
                            transition: 'transform 0.3s, border-color 0.3s',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            "&:hover": {
                              transform: 'translateY(-5px)',
                              boxShadow: theme.shadows[8],
                            }
                          }}
                        >
                          <CardActionArea 
                            onClick={() => setSelectedPlan(plan)}
                            sx={{ flexGrow: 1, p: 3 }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="h5" fontWeight={700}>
                                {plan.planType.toUpperCase()} Plan
                              </Typography>
                              <Chip 
                                label="Most Popular" 
                                color="primary" 
                                size="small"
                                sx={{ 
                                  display: plan.planType === 'cpi' ? 'flex' : 'none',
                                  fontWeight: 700 
                                }}
                              />
                            </Stack>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Stack direction="row" alignItems="flex-end" spacing={1} mb={3}>
                              <Typography variant="h3" fontWeight={800} color="primary">
                                ₹{plan.planAmount}
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary" mb={0.5}>
                                Budget
                              </Typography>
                            </Stack>
                            
                            <Stack spacing={1.5} mb={3}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <CheckCircle sx={{ color: theme.palette.success.main }} />
                                <Typography variant="body1">
                                  {plan.installs} Installs
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <CheckCircle sx={{ color: theme.palette.success.main }} />
                                <Typography variant="body1">
                                  Installation Model
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <CheckCircle sx={{ color: theme.palette.success.main }} />
                                <Typography variant="body1">
                                  Real-time Analytics
                                </Typography>
                              </Stack>
                            </Stack>
                            
                            <Button
                              variant={selectedPlan?._id === plan._id ? "contained" : "outlined"}
                              color="primary"
                              fullWidth
                              endIcon={<ArrowForward />}
                              sx={{
                                mt: 'auto',
                                py: 1.5,
                                fontWeight: 700,
                                borderRadius: 2
                              }}
                            >
                              {selectedPlan?._id === plan._id ? "Selected" : "Select Plan"}
                            </Button>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={activeStep === 0 ? handleCreateDialogClose : handleBackStep}
              color="secondary"
              disabled={createLoading}
              sx={{ 
                fontWeight: 700,
                px: 4,
                py: 1,
                borderRadius: 2
              }}
              startIcon={activeStep > 0 ? <ArrowBack /> : null}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              disabled={createLoading || (activeStep === 1 && !selectedPlan)}
              endIcon={activeStep === 1 ? null : <ArrowForward />}
              sx={{ 
                fontWeight: 700,
                px: 4,
                py: 1,
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                "&:hover": {
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              {createLoading 
                ? "Creating..." 
                : activeStep === 0 
                  ? "Next: Select Plan" 
                  : "Launch Campaign"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CampaignsPage;