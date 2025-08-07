import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Card, CardContent, Typography, Grid,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  LinearProgress, useTheme, Fade, Grow, Slide,
  IconButton, Tooltip, Avatar, Tabs, Tab,
  Divider, Chip, Stack, alpha, Skeleton, Alert,
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Select,
  FormControl, InputLabel
} from "@mui/material";
import {
  ResponsiveContainer, 
  ComposedChart, Bar, Area, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from "recharts";
import {
  ArrowUpward, ArrowDownward, MoreVert, TrendingUp, TrendingDown, FilterList,
  Refresh, Campaign, MonetizationOn, AttachMoney,
  PieChart as PieChartIcon, BarChart as BarChartIcon,
  Settings, Notifications, Search, Dashboard as DashboardIcon,
  Close, Check
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// API URL
const API_URL = "https://advertiserappnew.onrender.com/adv/campaign/analytics";

// Initial filter values
const INITIAL_FILTERS = {
  startDate: new Date('2025-07-01'),
  endDate: new Date('2025-08-31'),
  status: ['approved', 'completed'],
  type: 'cpi',
  minBudget: 500,
  maxBudget: 1000,
  sortOrder: 'asc'
};

// ---------- UTILS ----------
const formatCurrency = value =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
  }).format(value);

const formatPercent = value =>
  value !== undefined ? `${(value * 100).toFixed(1)}%` : "0.0%";

const formatNumber = value => new Intl.NumberFormat("en-US").format(value);

// --------- STATUS COLOR ---------
const useStatusColor = () => {
  const theme = useTheme();
  return (status) => {
    const map = {
      active: theme.palette.success.main,
      completed: theme.palette.info.main,
      approved: theme.palette.success.dark,
      paused: theme.palette.warning.main,
      pending: theme.palette.grey[500],
    };
    return map[status.toLowerCase()] || theme.palette.primary.light;
  };
};

// ----------- FILTER DIALOG -----------
const FilterDialog = ({ open, onClose, filters, setFilters, applyFilters }) => {
  const handleStatusChange = (event) => {
    const { value } = event.target;
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleTypeChange = (event) => {
    setFilters(prev => ({ ...prev, type: event.target.value }));
  };

  const handleSortChange = (event) => {
    setFilters(prev => ({ ...prev, sortOrder: event.target.value }));
  };

  const handleMinBudgetChange = (event) => {
    setFilters(prev => ({ ...prev, minBudget: event.target.value }));
  };

  const handleMaxBudgetChange = (event) => {
    setFilters(prev => ({ ...prev, maxBudget: event.target.value }));
  };

  const handleStartDateChange = (date) => {
    setFilters(prev => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setFilters(prev => ({ ...prev, endDate: date }));
  };

  const handleApply = () => {
    applyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Filter Campaigns</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status}
                  onChange={handleStatusChange}
                  label="Status"
                  renderValue={(selected) => selected.join(', ')}
                >
                  {['active', 'completed', 'approved', 'paused', 'pending'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={handleTypeChange}
                  label="Campaign Type"
                >
                  {['cpi', 'cpa', 'cpc', 'cpm'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Min Budget ($)"
                type="number"
                value={filters.minBudget}
                onChange={handleMinBudgetChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Budget ($)"
                type="number"
                value={filters.maxBudget}
                onChange={handleMaxBudgetChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sort Order</InputLabel>
                <Select
                  value={filters.sortOrder}
                  onChange={handleSortChange}
                  label="Sort Order"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleReset} 
          variant="outlined" 
          color="secondary"
          startIcon={<Refresh />}
        >
          Reset
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained" 
          color="primary"
          startIcon={<Check />}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ----------- MAIN DASHBOARD -----------
const Dashboard = () => {
  const theme = useTheme();
  const getStatusColor = useStatusColor();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [tempFilters, setTempFilters] = useState({ ...INITIAL_FILTERS });

  useEffect(() => { 
    fetchData();
  }, []);

  const applyFilters = (filters) => {
    setAppliedFilters(filters);
    fetchData(filters);
  };

  const fetchData = async (filters = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let params = {};
      
      // Only add filters to params if they exist
      if (filters) {
        params = {
          startDate: filters.startDate.toISOString().split('T')[0],
          endDate: filters.endDate.toISOString().split('T')[0],
          'status[]': filters.status,
          type: filters.type,
          minBudget: filters.minBudget,
          maxBudget: filters.maxBudget,
          sortOrder: filters.sortOrder
        };
      }
      
      const response = await axios.get(API_URL, {
        params,
        withCredentials: true
      });
      
      if (response.data && response.data.status) {
        setDashboardData(response.data);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilterDialog = () => {
    setTempFilters(appliedFilters || { ...INITIAL_FILTERS });
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const getActiveFilters = () => {
    if (!appliedFilters) return [];
    
    return [
      `Date: ${appliedFilters.startDate.toLocaleDateString()} - ${appliedFilters.endDate.toLocaleDateString()}`,
      `Status: ${appliedFilters.status.join(', ')}`,
      `Type: ${appliedFilters.type.toUpperCase()}`,
      `Budget: $${appliedFilters.minBudget} - $${appliedFilters.maxBudget}`
    ];
  };

  if (loading) return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor="#f8fafd">
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Skeleton variant="text" width={250} height={40} />
        <Box display="flex" gap={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Box>
      
      <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {[1,2,3,4].map(item => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rounded" width="100%" height={140} />
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3} mt={0}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" width="100%" height={350} sx={{ mt: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" width="%100" height={350} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
        
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" width="100%" height={300} sx={{ mt: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" width="100%" height={300} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
        
        <Skeleton variant="rounded" width="100%" height={400} sx={{ mt: 3 }} />
      </Box>
    </Box>
  );

  if (error) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f8fafd">
        <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" fontWeight={700}>Data Loading Error</Typography>
          <Typography>{error}</Typography>
          <Box mt={2}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Refresh />}
              onClick={() => fetchData(appliedFilters)}
            >
              Try Again
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!dashboardData || !dashboardData.data) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f8fafd">
        <Typography variant="h5" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  const { summary, campaigns, performanceByType, monthlyPerformance, statusDistribution } = dashboardData.data;

  const statusData = statusDistribution.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: getStatusColor(item.status),
  }));

  const activeFilters = getActiveFilters();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor="#f8fafd">
      {/* Filter Dialog */}
      <FilterDialog 
        open={filterDialogOpen} 
        onClose={handleCloseFilterDialog}
        filters={tempFilters}
        setFilters={setTempFilters}
        applyFilters={applyFilters}
      />
      
      {/* Active Filters */}
      {appliedFilters && activeFilters.length > 0 && (
        <Box sx={{ p: 2, bgcolor: '#e8f4fd', borderBottom: '1px solid #d1e7f5' }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle2" fontWeight={600}>Active Filters:</Typography>
            {activeFilters.map((filter, index) => (
              <Chip 
                key={index} 
                label={filter} 
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.light, 0.2),
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  py: 0.5
                }}
              />
            ))}
            <Button 
              size="small" 
              onClick={handleOpenFilterDialog}
              sx={{ ml: 'auto', fontWeight: 700 }}
              startIcon={<FilterList fontSize="small" />}
            >
              Modify Filters
            </Button>
          </Stack>
        </Box>
      )}
      
      {/* Main Content */}
      <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Summary Grid */}
        <Fade in>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Total Campaigns" value={summary.totalCampaigns} icon={<Campaign />} color={theme.palette.primary.main} trend={+2} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Total Budget" value={formatCurrency(summary.totalBudget)} icon={<MonetizationOn />} color={theme.palette.success.main} trend={0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Total Spent" value={formatCurrency(summary.totalSpent)} icon={<AttachMoney />} color={theme.palette.warning.main} trend={8.5} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Budget Utilization" value={formatPercent(summary.budgetUtilization)} icon={<PieChartIcon />} color={theme.palette.info.main} trend={-2.1} />
            </Grid>
          </Grid>
        </Fade>
          <br/>
        {/* Premium Chart Section */}
        <Slide in direction="up" timeout={620}>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{
                p: 3, 
                borderRadius: 4, 
                minHeight: 320,
                display: "flex", 
                flexDirection: "column", 
                height: "100%",
                overflow: "visible",
                background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
                border: '1px solid rgba(224, 230, 255, 0.7)',
                boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700} color="text.primary">Monthly Performance</Typography>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Filter">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: '#f1f5fe', 
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#e6edfe' }
                        }}
                        onClick={handleOpenFilterDialog}
                      >
                        <FilterList fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh data">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: '#f1f5fe', 
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#e6edfe' }
                        }}
                        onClick={() => fetchData(appliedFilters)}
                      >
                        <Refresh fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box flex={1} minHeight={215} sx={{ mt: 2, pb: 1, width: '100%' }}>
                  <ResponsiveContainer width="99%" height={260}>
                    <ComposedChart
                      data={monthlyPerformance}
                      margin={{ top: 16, right: 20, left: 10, bottom: 30 }}
                    >
                      <defs>
                        <linearGradient id="premBarA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={.9} />
                          <stop offset="75%" stopColor={theme.palette.primary.light} stopOpacity={0.18} />
                        </linearGradient>
                        <linearGradient id="premBarS" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#39BF7D" stopOpacity={.94} />
                          <stop offset="100%" stopColor="#C3EEC6" stopOpacity={.08} />
                        </linearGradient>
                        <linearGradient id="premBarC" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffb62a" stopOpacity={.9} />
                          <stop offset="100%" stopColor="#FFF5CA" stopOpacity={.06} />
                        </linearGradient>
                        <filter id="shadow-premium" x="-40%" y="-20%" width="180%" height="170%">
                          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#003A7B" floodOpacity="0.07" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(m) => m.includes('-') ? `M${m.split('-')[1]}` : m}
                        style={{ fontWeight: 600, fontSize: '0.85rem' }}
                        dy={10}
                      />
                      <YAxis style={{ fontWeight: 600 }} />
                      <ChartTooltip
                        formatter={formatNumber}
                        labelFormatter={label => `Month: ${label}`}
                        contentStyle={{
                          borderRadius: 12, border: 'none', minWidth: 58,
                          boxShadow: theme.shadows[4], background: theme.palette.background.paper,
                          fontWeight: 600
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar
                        dataKey="totalSpent"
                        name="Spent"
                        fill="url(#premBarA)"
                        barSize={28}
                        radius={[6, 6, 0, 0]}
                        style={{ filter: "url(#shadow-premium)" }}
                      />
                      <Bar
                        dataKey="totalInstalls"
                        name="Installs"
                        fill="url(#premBarS)"
                        barSize={28}
                        radius={[6, 6, 0, 0]}
                        style={{ filter: "url(#shadow-premium)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalClicks"
                        name="Clicks"
                        stroke="#FFA726"
                        fill="url(#premBarC)"
                        strokeWidth={3}
                        dot={{ r: 5, fill: theme.palette.warning.main }}
                        activeDot={{ r: 7 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{
                p: 3, 
                borderRadius: 4, 
                minHeight: 320,
                display: "flex", 
                flexDirection: "column", 
                height: "100%",
                overflow: "visible",
                background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
                border: '1px solid rgba(224, 230, 255, 0.7)',
                boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700} color="text.primary">Status Distribution</Typography>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Filter">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: '#f1f5fe', 
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#e6edfe' }
                        }}
                        onClick={handleOpenFilterDialog}
                      >
                        <FilterList fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh data">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: '#f1f5fe', 
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#e6edfe' }
                        }}
                        onClick={() => fetchData(appliedFilters)}
                      >
                        <Refresh fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box flex={1} minHeight={220} sx={{ mt: 1.5, width: '100%' }}>
                  <ResponsiveContainer width="99%" height={230}>
                    <PieChart>
                      <defs>
                        <filter id="pie-glow" x="0" y="0" width="200%" height="200%">
                          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#4f57ef" floodOpacity="0.13" />
                        </filter>
                      </defs>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={70}
                        labelLine={false}
                        stroke="#fff"
                        strokeWidth={3}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1300}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        style={{ filter: "url(#pie-glow)" }}
                      >
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        formatter={v => [`${v} campaigns`]}
                        contentStyle={{
                          borderRadius: 10, border: 'none',
                          fontWeight: 600, background: "#fafcff", boxShadow: theme.shadows[2]
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Slide>

        {/* Campaign Performance & Metrics */}
        <Fade in timeout={800}>
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12} md={8}>
              <Box mb={1} mt={4}>
                <Typography variant="h5" fontWeight={800} display="flex" alignItems="center" letterSpacing="-0.5px">
                  <BarChartIcon fontSize="inherit" sx={{ mr: 1, verticalAlign: "middle" }} />
                  Campaign Performance
                </Typography>
              </Box>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4,
                background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
                border: '1px solid rgba(224, 230, 255, 0.7)',
                boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
              }}>
                <Grid container spacing={2} mb={2}>
                  {[
                    { label: "Active", value: summary.activeCampaigns, trend: 1, icon: <TrendingUp /> },
                    { label: "Completed", value: summary.completedCampaigns, trend: 0, icon: <TrendingUp /> },
                    { label: "Paused", value: summary.pausedCampaigns, trend: -1, icon: <TrendingDown /> },
                    { label: "Pending", value: summary.pendingCampaigns, trend: 0, icon: <TrendingUp /> },
                  ].map((item, i) => (
                    <Grid item xs={6} sm={3} key={item.label}>
                      <StatusCard
                        status={item.label}
                        count={item.value}
                        color={getStatusColor(item.label)}
                        icon={item.icon}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <MetricCard
                      title="Total Installs"
                      value={formatNumber(summary.totalInstalls)}
                      icon={<ArrowUpward fontSize="small" />}
                      trend="+12%"
                      color={theme.palette.success.main}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MetricCard
                      title="Average CTR"
                      value={formatPercent(summary.averageCTR)}
                      icon={<ArrowUpward fontSize="small" />}
                      trend="+2.3%"
                      color={theme.palette.success.main}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MetricCard
                      title="Average CPC"
                      value={formatCurrency(summary.averageCPC)}
                      icon={<ArrowDownward fontSize="small" />}
                      trend="-0.5%"
                      color={theme.palette.error.main}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box mb={1} mt={4}>
                <Typography variant="h5" fontWeight={800} display="flex" alignItems="center" letterSpacing="-0.5px">
                  <PieChartIcon fontSize="inherit" sx={{ mr: 1, verticalAlign: "middle" }} />
                  Performance by Type
                </Typography>
              </Box>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4, 
                minHeight: 320,
                background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
                border: '1px solid rgba(224, 230, 255, 0.7)',
                boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
              }}>
                <Box height={215} width="100%">
                  <ResponsiveContainer width="99%" height={180}>
                    <ComposedChart
                      data={performanceByType}
                      margin={{ top: 10, right: 18, left: 2, bottom: 15 }}
                    >
                      <defs>
                        <linearGradient id="pbtBudget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.7} />
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.16} />
                        </linearGradient>
                        <linearGradient id="pbtSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.success.light} stopOpacity={0.75} />
                          <stop offset="95%" stopColor={theme.palette.success.light} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
                      <XAxis dataKey="type" style={{ fontWeight: 700 }} />
                      <YAxis style={{ fontWeight: 700 }} />
                      <ChartTooltip
                        formatter={formatNumber}
                        contentStyle={{
                          borderRadius: 8,
                          border: 'none',
                          boxShadow: theme.shadows[4]
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="totalBudget"
                        name="Total Budget"
                        stroke={theme.palette.primary.main}
                        fill="url(#pbtBudget)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalSpent"
                        name="Total Spent"
                        stroke={theme.palette.success.main}
                        fill="url(#pbtSpent)"
                        strokeWidth={3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Fade>

        {/* Table: Campaigns */}
        <Grow in timeout={1000}>
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={900} display="flex" alignItems="center">
                Campaign Details
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title="Refresh">
                  <IconButton onClick={() => fetchData(appliedFilters)}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filter">
                  <IconButton onClick={handleOpenFilterDialog}>
                    <FilterList />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Paper elevation={0} sx={{
              p: 3, 
              borderRadius: 4,
              background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
              border: '1px solid rgba(224, 230, 255, 0.7)',
              boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
            }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Campaign</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>Budget</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>Spent</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>Utilization</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>Installs</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>CTR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaigns.map(campaign => (
                      <TableRow key={campaign._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{
                              bgcolor: getStatusColor(campaign.status),
                              width: 38, height: 38, fontWeight: 700, mr: 2, fontSize: 20
                            }}>
                              {campaign.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={800} fontSize={16}>{campaign.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {campaign.type.toUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            px={1.5} py={0.5} borderRadius={2}
                            color="#fff" fontWeight={700} fontSize="0.97rem"
                            textTransform="capitalize"
                            sx={{ background: getStatusColor(campaign.status) }}
                          >
                            {campaign.status}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(campaign.budgetTotal)}</TableCell>
                        <TableCell align="right">{formatCurrency(campaign.budgetSpent)}</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <Typography fontWeight={600} mr={1}>
                              {formatPercent(campaign.budgetUtilization)}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={campaign.budgetUtilization * 100}
                              sx={{
                                width: 60,
                                mx: 0.5,
                                height: 7,
                                borderRadius: 4,
                                background: theme.palette.grey[100],
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: getStatusColor(campaign.status)
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">{campaign.installsCount}</TableCell>
                        <TableCell align="right">{formatPercent(campaign.ctr)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Grow>
      </Box>
    </Box>
  );
};


// ------- SUMMARY CARD -----------
const SummaryCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ y: -4, boxShadow: "0 8px 24px 1px rgba(92,65,184,.13)" }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
  >
    <Card elevation={0} sx={{
      borderRadius: 4, p: 3, 
      background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
      border: '1px solid rgba(224, 230, 255, 0.7)',
      boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
      height: '100%', 
      minWidth: 0, 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between"
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>{title}</Typography>
          <Typography variant="h4" fontWeight={900} mt={0.5}>{value}</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: alpha(color, 0.1), color, width: 48, height: 48,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", boxShadow: `0 8px 19px 0 ${alpha(color, 0.17)}`
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        {trend >= 0 ?
          <ArrowUpward fontSize="small" sx={{ color: trend === 0 ? "text.secondary" : "success.main" }} />
          : <ArrowDownward fontSize="small" sx={{ color: "error.main" }} />
        }
        <Typography variant="body2" ml={0.5} sx={{
          color: trend === 0 ? "text.secondary" : (trend > 0 ? "success.main" : "error.main"),
          fontWeight: 700
        }}>
          {trend === 0 ? "0.0%" : `${Math.abs(trend).toFixed(1)}%`}
        </Typography>
        <Typography variant="caption" ml={1} color="text.secondary" fontWeight={600}>
          from last month
        </Typography>
      </Box>
    </Card>
  </motion.div>
);

// ------- STATUS CARD -----------
const StatusCard = ({ status, count, color, icon }) => (
  <motion.div
    initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.06, boxShadow: "0 5px 32px -7px " + alpha(color, 0.24) }}
    transition={{ type: "spring", stiffness: 200, damping: 30 }}
  >
    <Card elevation={0} sx={{
      p: 2, 
      borderRadius: 4, 
      background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
      border: '1px solid rgba(224, 230, 255, 0.7)',
      boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
      minHeight: 92,
      height: '100%'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={800}>{status} Campaigns</Typography>
        <Box sx={{
          bgcolor: alpha(color, 0.13),
          color, borderRadius: '50%', width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {icon}
        </Box>
      </Box>
      <Box display="flex" alignItems="flex-end" mt={1}>
        <Typography variant="h4" fontWeight={800} sx={{ color }}>{count}</Typography>
      </Box>
    </Card>
  </motion.div>
);

// ------- METRIC CARD -----------
const MetricCard = ({ title, value, icon, trend, color }) => (
  <motion.div
    initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 240, damping: 18 }}
  >
    <Card elevation={0} sx={{
      p: 2, 
      borderRadius: 4, 
      minHeight: 89,
      background: 'linear-gradient(to bottom right, #ffffff, #f9faff)',
      border: '1px solid rgba(224, 230, 255, 0.7)',
      boxShadow: '0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)',
      height: '100%'
    }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>{title}</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography variant="h4" fontWeight={800}>{value}</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" fontWeight={700} sx={{ color }}>{trend}</Typography>
          <Box ml={1} sx={{ color }}>{icon}</Box>
        </Box>
      </Box>
    </Card>
  </motion.div>
);

export default Dashboard;