// TopBar.js
import React from "react";
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
  useMediaQuery
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

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

const BalanceText = styled("span")({
  color: "#3b82f6",
  fontWeight: 600,
  fontSize: "14px",
  marginRight: "4px",
});

const AddButton = styled(Button)({
  backgroundColor: "#3b82f6",
  color: "#fff",
  textTransform: "none",
  fontSize: "12px",
  minWidth: "40px",
  height: "28px",
  padding: "0 8px",
  marginLeft: "4px",
  "&:hover": {
    backgroundColor: "#2563eb",
  },
});

export default function TopBar({
  toggleDrawer,
  activePage,
  handleMenuOpen,
  user
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ 
        justifyContent: "space-between", 
        px: { xs: 1, sm: 2 },
        minHeight: "56px !important"
      }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton 
            size="small" 
            color="inherit"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            {activePage}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: { xs: 1, sm: 2 }
        }}>
          {!isSmallScreen && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center",
              mr: { xs: 0, sm: 1 }
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "gray", 
                  fontWeight: 500, 
                  mr: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Balance
              </Typography>
              <BalanceText>$12.50</BalanceText>
              <AddButton variant="contained">+ Add</AddButton>
            </Box>
          )}

          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 0.5, sm: 1.5 }
          }}>
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#f1f5f9",
                  borderRadius: "16px",
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: "14px",
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Hi, {user?.name || "Guest"}
              </Typography>
            )}

            <IconButton size="small">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar 
                src={user?.avatar} 
                alt={user?.name} 
                sx={{ 
                  width: { xs: 28, sm: 32 }, 
                  height: { xs: 28, sm: 32 } 
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}