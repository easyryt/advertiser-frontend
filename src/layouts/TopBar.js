// TopBar.js
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Badge,
  styled,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import dp from "./dp.gif";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  borderBottom: "1px solid #eee",
  position: "fixed",
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
  color: "white",
  fontWeight: 600,
  borderRadius: "20px",
  padding: "6px 20px",
  boxShadow: "0 4px 6px rgba(37, 117, 252, 0.3)",
  transition: "all 0.3s ease",
  textTransform: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 8px rgba(37, 117, 252, 0.4)",
  },
}));

const BalanceChip = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8f9fe",
  borderRadius: "20px",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid #e0e7ff",
  color: "#4f46e5",
}));

export default function TopBar({
  toggleDrawer,
  activePage,
  handleMenuOpen,
  user,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  // Recharge states
  const [openRecharge, setOpenRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://advertiserappnew.onrender.com/adv/auth/profile",
        { withCredentials: true }
      );
      setNameValue(response.data.message?.name || "");
      setWalletBalance(response.data.message?.wallet || 0);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to fetch profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRecharge = async () => {
    if (!rechargeAmount || isNaN(rechargeAmount) || parseFloat(rechargeAmount) <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid amount",
        severity: "error",
      });
      return;
    }

    setIsRecharging(true);
    try {
      await axios.put(
        "https://advertiserappnew.onrender.com/adv/auth/wallet/recharge",
        { amount: parseFloat(rechargeAmount) },
        { withCredentials: true }
      );
      
      setSnackbar({
        open: true,
        message: "Wallet recharged successfully!",
        severity: "success",
      });
      setRechargeAmount("");
      setOpenRecharge(false);
      fetchProfile(); // Refresh balance
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Recharge failed",
        severity: "error",
      });
    } finally {
      setIsRecharging(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, sm: 2 },
            minHeight: "56px !important",
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton size="small" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              {activePage}
            </Typography>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1.5 },
              }}
            >
              {!isMobile && (
                <>
                  <BalanceChip>
                    <AccountBalanceWalletIcon fontSize="small" />
                    {formatCurrency(walletBalance)}
                  </BalanceChip>
                  
                  <PremiumButton 
                    variant="contained" 
                    onClick={() => setOpenRecharge(true)}
                  >
                    + Recharge
                  </PremiumButton>

                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#f8f9fe",
                      borderRadius: "20px",
                      px: 1.5,
                      py: 0.5,
                      fontWeight: 600,
                      fontSize: "14px",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Hi, {nameValue || "Advertiser"}
                  </Typography>
                </>
              )}

              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar
                  src={dp}
                  alt={nameValue ? nameValue : "Advertiser"}
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Recharge Dialog */}
      <Dialog
        open={openRecharge}
        onClose={() => !isRecharging && setOpenRecharge(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "450px",
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f8f9fe",
            borderBottom: "1px solid #eef2f7",
            fontWeight: 700,
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 1.5
          }}
        >
          <AccountBalanceWalletIcon color="primary" />
          Recharge Wallet
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Current Balance
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#4f46e5">
              {formatCurrency(walletBalance)}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            variant="outlined"
            label="Enter Amount"
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
              inputProps: { 
                min: 1,
                step: 100
              }
            }}
            sx={{ mb: 2 }}
            disabled={isRecharging}
          />
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            mb: 2
          }}>
            {[100, 500, 1000, 2000].map((amount) => (
              <Button
                key={amount}
                variant="outlined"
                onClick={() => setRechargeAmount(amount)}
                sx={{
                  borderRadius: '12px',
                  borderColor: rechargeAmount === String(amount) ? '#4f46e5' : '#e0e7ff',
                  bgcolor: rechargeAmount === String(amount) ? '#f1f5ff' : 'transparent',
                  color: rechargeAmount === String(amount) ? '#4f46e5' : 'inherit',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#4f46e5',
                    bgcolor: '#f1f5ff'
                  }
                }}
                disabled={isRecharging}
              >
                ₹{amount}
              </Button>
            ))}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Amount will be added to your wallet balance immediately
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #eef2f7" }}>
          <Button 
            onClick={() => setOpenRecharge(false)}
            disabled={isRecharging}
            sx={{ color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRecharge}
            disabled={isRecharging}
            startIcon={
              isRecharging ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckCircleOutlineIcon />
              )
            }
            sx={{
              bgcolor: "#4f46e5",
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#4338ca",
              },
            }}
          >
            {isRecharging ? "Processing..." : "Confirm Recharge"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}