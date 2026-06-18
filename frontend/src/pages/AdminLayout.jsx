import React, { useContext, useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Avatar, Menu, MenuItem, useTheme, useMediaQuery, CircularProgress 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { glassmorphismStyles } from '../theme';

const drawerWidth = 260;

const AdminLayout = () => {
  const { user, loading, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  // Security Gate: redirect to login if not authenticated or not admin role
  if (!isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Registrations', icon: <PeopleIcon />, path: '/admin/registrations' },
    { text: 'Article Submissions', icon: <DescriptionIcon />, path: '/admin/articles' },
    { text: 'Website CMS', icon: <EditNoteIcon />, path: '/admin/cms' },
    { text: 'Form Builder', icon: <BuildIcon />, path: '/admin/form-builder' },
    { text: 'Payment Tracking', icon: <AccountBalanceWalletIcon />, path: '/admin/payments' },
    { text: 'Reports & Exports', icon: <BarChartIcon />, path: '/admin/reports' }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
        <LocalHospitalIcon color="primary" sx={{ fontSize: '1.8rem' }} />
        <Box>
          <Typography variant="h6" fontWeight="900" color="primary.main" sx={{ letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            TOXIQ Admin
          </Typography>
          <Typography variant="caption" color="textSecondary" fontWeight="600">
            Hospital Event Portal
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  bgcolor: isSelected ? 'rgba(30, 58, 138, 0.08)' : 'transparent',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  '& .MuiListItemIcon-root': {
                    color: isSelected ? 'primary.main' : 'text.light',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(30, 58, 138, 0.04)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontFamily: "'Raleway', sans-serif", 
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.92rem'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* User profile section at the bottom of the sidebar */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontWeight: 'bold' }}>
            {user?.username?.[0].toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textTransform: 'lowercase' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      
      {/* Top Header Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          color: 'text.primary',
          zIndex: 1000
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold" fontFamily="'Raleway', sans-serif" color="#1e3a8a">
            {menuItems.find(item => item.path === location.pathname)?.text || 'Administration'}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/'); }}>View Main Website</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
                <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Responsive Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #cbd5e1' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 4.5 },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          mt: '70px', // matches toolbar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
