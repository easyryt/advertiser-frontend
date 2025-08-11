import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  Slide,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Grow,
  Fade
} from '@mui/material';
import {
  Person as PersonIcon,
  Badge,
  Phone,
  AccountBalanceWallet as WalletIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  MonetizationOn,
  Edit,
  Error as ErrorIcon,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Utility for date formatting
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [walletValue, setWalletValue] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://advertiserappnew.onrender.com/adv/auth/profile', { withCredentials: true });
      setProfile(response.data.message);
      setNameValue(response.data.message?.name || '');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Wallet recharge
  const handleRecharge = async (e) => {
    e.preventDefault();
    setWalletLoading(true);
    try {
      const amt = parseFloat(walletValue);
      if (isNaN(amt) || amt <= 0) throw new Error('Please enter a valid amount');
      await axios.put('https://advertiserappnew.onrender.com/adv/auth/wallet/recharge', { amount: amt }, { withCredentials: true });
      setSnack({ open: true, message: 'Wallet recharged!', type: 'success' });
      setWalletValue('');
      fetchProfile();
    } catch (err) {
      setSnack({
        open: true,
        message: err.response?.data?.message || err.message || 'Could not recharge wallet',
        type: 'error'
      });
    } finally {
      setWalletLoading(false);
    }
  };

  // Name update
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    try {
      if (nameValue.length < 3) throw new Error('Name too short');
      await axios.put('https://advertiserappnew.onrender.com/adv/auth/profile/update', { name: nameValue }, { withCredentials: true });
      setSnack({ open: true, message: 'Name updated successfully', type: 'success' });
      fetchProfile();
    } catch (err) {
      setSnack({
        open: true,
        message: err.response?.data?.message || err.message || 'Could not update name',
        type: 'error'
      });
    } finally {
      setNameLoading(false);
    }
  };

  const handleSnackClose = () => setSnack({ ...snack, open: false });

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        bgcolor: '#f9fbfd',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={80} thickness={4} sx={{ color: '#3f51b5' }} />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#f9fbfd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert
            severity="error"
            icon={<ErrorIcon fontSize="large" />}
            sx={{
              fontSize: 22,
              p: 4,
              width: '100%',
              maxWidth: 500,
              borderRadius: 3,
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h5" mb={1} fontWeight="bold">
              Error loading profile
            </Typography>
            <Typography>{error}</Typography>
          </Alert>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f9fbfd',
        width: '100%',
        overflowX: 'hidden',
        py: 4,
        backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, md: 4 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1800 }}>
          {/* Left Profile Section */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #ffffff, #f5f7ff)',
                  boxShadow: '0 20px 50px rgba(0,0,100,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4, flexShrink: 0, position: 'relative' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        bgcolor: '#f0f4ff',
                        boxShadow: '0 8px 32px rgba(79,70,229,0.18)',
                        border: '2px solid #e0e7ff',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 64, color: '#4f46e5' }} />
                    </Avatar>
                  </motion.div>
                  
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color="#1e293b"
                    sx={{
                      letterSpacing: 0.5,
                      wordBreak: 'break-word',
                      fontSize: { xs: 28, sm: 34 },
                      mb: 1,
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {profile?.name || 'Your Name'}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="#64748b"
                    mb={2}
                    sx={{ fontWeight: 600 }}
                  >
                    {profile?.role || 'User'} Profile
                  </Typography>
                  <Divider
                    sx={{
                      width: 80,
                      mx: 'auto',
                      height: 4,
                      bgcolor: '#4f46e5',
                      borderRadius: 2,
                      my: 2,
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </Box>

                <List dense sx={{ width: '100%', overflow: 'auto', flexGrow: 1, position: 'relative', zIndex: 1 }}>
                  <ListItem sx={{ py: 2, px: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <Phone sx={{ color: '#4f46e5', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={700} color="#475569">
                          Phone Number
                        </Typography>
                      }
                      secondary={
                        <Typography variant="h6" fontWeight={600} color="#1e293b">
                          {profile?.phone || 'N/A'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ py: 2, px: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <WalletIcon sx={{ color: '#10b981', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={700} color="#475569">
                          Wallet Balance
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" fontWeight={800} fontSize={22} color="#059669">
                          {`₹${(profile?.wallet || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`}
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ py: 2, px: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <Badge sx={{ color: '#6366f1', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={700} color="#475569">
                          Account Role
                        </Typography>
                      }
                      secondary={
                        <Typography variant="h6" fontWeight={700} color="#4f46e5">
                          {profile?.role || 'N/A'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ py: 2, px: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <EventIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={700} color="#475569">
                          Account Created
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight={600} color="#1e293b">
                          {formatDate(profile?.createdAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ py: 2, px: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <UpdateIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={700} color="#475569">
                          Last Updated
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight={600} color="#1e293b">
                          {formatDate(profile?.updatedAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right Actions Section */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #ffffff, #f5f7ff)',
                  boxShadow: '0 20px 50px rgba(0,0,100,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: 'linear-gradient(90deg, #7c3aed, #ec4899)'
                  }
                }}
              >
                {/* Wallet Recharge Section */}
                <Box 
                  component="form" 
                  onSubmit={handleRecharge} 
                  sx={{ mb: 4, position: 'relative', zIndex: 1 }}
                >
                  <motion.div whileHover={{ y: -3 }}>
                    <Typography variant="h3" fontWeight={800} color="#1e293b" gutterBottom sx={{ fontSize: { xs: 28, sm: 34 } }}>
                      Wallet Recharge
                    </Typography>
                  </motion.div>
                  <Typography variant="subtitle1" color="#64748b" mb={3} fontWeight={500}>
                    Add funds to your advertising wallet
                  </Typography>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="flex-start">
                    <TextField
                      type="number"
                      label="Amount (₹)"
                      size="medium"
                      value={walletValue}
                      required
                      disabled={walletLoading}
                      onChange={e => setWalletValue(e.target.value)}
                      sx={{
                        flexGrow: 1,
                        bgcolor: '#f8fafc',
                        borderRadius: 3,
                        '& .MuiInputBase-input': { 
                          fontWeight: 700,
                          color: '#1e293b',
                          fontSize: 18
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#a5b4fc',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: 2
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600
                        }
                      }}
                      inputProps={{ min: 1, max: 1000000, step: 1 }}
                    />
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <Button
                        variant="contained"
                        startIcon={<WalletIcon />}
                        type="submit"
                        size="large"
                        sx={{
                          minWidth: 160,
                          fontWeight: 800,
                          textTransform: 'capitalize',
                          borderRadius: 3,
                          letterSpacing: 0.5,
                          boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                          transition: '0.3s',
                          height: 60,
                          fontSize: 18,
                          background: 'linear-gradient(45deg, #4f46e5 0%, #7c3aed 100%)',
                          '&:hover': {
                            boxShadow: '0 12px 28px rgba(79, 70, 229, 0.35)',
                            background: 'linear-gradient(45deg, #4338ca 0%, #6d28d9 100%)'
                          }
                        }}
                        disabled={walletLoading || !walletValue}
                      >
                        {walletLoading ? <CircularProgress size={24} color="inherit" /> : "Recharge Now"}
                      </Button>
                    </motion.div>
                  </Stack>
                </Box>

                <Divider sx={{ 
                  my: 4, 
                  borderColor: '#e2e8f0',
                  borderWidth: 2,
                  backgroundImage: 'linear-gradient(to right, transparent, #e2e8f0, transparent)',
                  height: 2
                }} />

                {/* Name Update Section */}
                <Box 
                  component="form" 
                  onSubmit={handleNameUpdate} 
                  sx={{ mt: 2, position: 'relative', zIndex: 1 }}
                >
                  <motion.div whileHover={{ y: -3 }}>
                    <Typography variant="h3" fontWeight={800} color="#1e293b" gutterBottom sx={{ fontSize: { xs: 28, sm: 34 } }}>
                      Update Profile
                    </Typography>
                  </motion.div>
                  <Typography variant="subtitle1" color="#64748b" mb={3} fontWeight={500}>
                    Change your display name
                  </Typography>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="flex-start">
                    <TextField
                      size="medium"
                      label="Your Name"
                      value={nameValue}
                      required
                      disabled={nameLoading}
                      onChange={e => setNameValue(e.target.value)}
                      sx={{
                        flexGrow: 1,
                        bgcolor: '#f8fafc',
                        borderRadius: 3,
                        '& .MuiInputBase-input': { 
                          fontWeight: 700,
                          color: '#1e293b',
                          fontSize: 18
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#a5b4fc',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: 2
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600
                        }
                      }}
                      inputProps={{ maxLength: 30 }}
                    />
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        type="submit"
                        size="large"
                        sx={{
                          minWidth: 160,
                          fontWeight: 800,
                          borderRadius: 3,
                          textTransform: 'capitalize',
                          letterSpacing: 0.5,
                          borderWidth: 3,
                          borderColor: '#4f46e5',
                          color: '#4f46e5',
                          height: 60,
                          fontSize: 18,
                          transition: '0.3s',
                          '&:hover': {
                            bgcolor: '#f0f4ff',
                            borderWidth: 3,
                            borderColor: '#4338ca',
                            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.15)'
                          }
                        }}
                        disabled={nameLoading || !nameValue || nameValue === profile?.name}
                      >
                        {nameLoading ? <CircularProgress size={24} color="inherit" /> : "Update Name"}
                      </Button>
                    </motion.div>
                  </Stack>
                </Box>

                {/* Decorative elements */}
                <Box sx={{
                  position: 'absolute',
                  bottom: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0) 70%)',
                  zIndex: 0
                }} />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snack.open}
          onClose={handleSnackClose}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Slide}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Alert
              onClose={handleSnackClose}
              severity={snack.type}
              variant="filled"
              sx={{ 
                fontWeight: 700, 
                fontSize: 16,
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                minWidth: 300,
                alignItems: 'center',
                py: 1.5
              }}
              iconMapping={{
                success: <CheckCircle sx={{ fontSize: 28 }} />,
                error: <ErrorIcon sx={{ fontSize: 28 }} />
              }}
            >
              {snack.message}
            </Alert>
          </motion.div>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProfilePage;