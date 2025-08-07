import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://advertiserappnew.onrender.com/adv/campaign/get/plans",
          { withCredentials: true }
        );

        if (response.data.status && response.data.data) {
          setPlans(response.data.data);
        } else {
          setPlans([]);
          setError("No plans data available");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Failed to load plans"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const columns = [
    {
      field: "planType",
      headerName: "TYPE",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              background: theme.palette.primary[50],
              fontWeight: 600,
              textTransform: "capitalize",
              color: theme.palette.primary.main,
              fontSize: "0.9rem",
              textAlign: "center",
              minWidth: 80,
            }}
          >
            {params.value || "N/A"}
          </Box>
        </Box>
      ),
    },
    {
      field: "planAmount",
      headerName: "AMOUNT ($)",
      type: "number",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ width: "100%", textAlign: "center" }}>
          {params.value ? (
            <strong style={{ color: theme.palette.success.dark }}>
              ${params.value.toLocaleString()}
            </strong>
          ) : (
            "-"
          )}
        </Box>
      ),
    },
    {
      field: "installs",
      headerName: "INSTALLS",
      type: "number",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: 600,
            color: theme.palette.info.main,
            width: "100%",
            textAlign: "center",
          }}
        >
          {params.value ?? "-"}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 180,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/dashboard/campaigns/${params.row._id}`)}
            sx={{
              fontWeight: 600,
              color: theme.palette.info.main,
              borderColor: theme.palette.info.main,
              "&:hover": {
                backgroundColor: theme.palette.info.light,
                borderColor: theme.palette.info.dark,
              },
            }}
          >
            Create Campaign
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 1 : 4,
        mx: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55 } }}
    >
      <Paper
        elevation={7}
        sx={{
          p: isMobile ? 1 : 2,
          borderRadius: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        {error ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Error loading plans
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              flex: 1,
              minHeight: 400,
            }}
          >
            <DataGrid
              rows={plans}
              columns={columns}
              getRowId={(row) => row._id}
              loading={loading}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
              components={{
                LoadingOverlay: LinearProgress,
                Toolbar: GridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-columnHeader": {
                  justifyContent: "center",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[800],
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: `1px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-toolbarContainer": {
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  justifyContent: "flex-end",
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PlanList;
