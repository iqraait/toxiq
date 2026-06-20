import React, { useContext, useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, 
  List, ListItem, ListItemText, useTheme, useMediaQuery 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ScienceIcon from '@mui/icons-material/Science';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { glassmorphismStyles } from '../theme';
import API from '../services/api';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const isHome = location.pathname === '/';

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const host = API.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${host}${path}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('cms/settings/');
        setSettings(res.data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);
  
  const handleNavClick = (sectionId) => {
    if (isHome) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const navLinks = [
    { label: 'Home', action: () => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/') },
    { label: 'Brochure & Gallery', action: () => navigate('/brochure-gallery') },
    { label: 'Registration', action: () => navigate('/registration') },
    { label: 'Article Submission', action: () => navigate('/article-submission') }
  ];

  const adminMenu = (
    <>
      {isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') ? (
        <>
          <Button 
            color="primary" 
            variant="outlined" 
            size="small"
            sx={{ mr: 1, borderRadius: '20px' }}
            onClick={() => navigate('/admin/dashboard')}
          >
            Admin Panel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            size="small"
            sx={{ borderRadius: '20px' }}
            onClick={logout}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button 
          variant="contained" 
          size="small"
          startIcon={<LockIcon sx={{ fontSize: '0.85rem !important' }} />}
          sx={{ 
            borderRadius: '8px', 
            px: 2.5, 
            py: 1,
            bgcolor: '#0f172a', 
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1e293b'
            }
          }}
          onClick={() => navigate('/login')}
        >
          Admin Login
        </Button>
      )}
    </>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        ...glassmorphismStyles,
        background: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        top: 0,
        zIndex: 1100,
        color: '#0f172a'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
        {/* Logo and Brand Title */}
        <Box 
          display="flex" 
          alignItems="center" 
          onClick={() => navigate('/')} 
          sx={{ cursor: 'pointer', gap: 1.2 }}
        >
          {settings?.logo ? (
            <img 
              src={getFileUrl(settings.logo)} 
              alt="logo" 
              style={{ 
                height: '40px', 
                width: 'auto', 
                objectFit: 'contain', 
                display: 'block',
                transition: 'transform 0.2s ease-in-out'
              }} 
            />
          ) : (
            <>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '10px', 
                  bgcolor: 'rgba(13, 148, 136, 0.08)', 
                  border: '2.5px solid #0d9488',
                  color: '#0d9488'
                }}
              >
                <ScienceIcon sx={{ fontSize: '1.5rem' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Raleway', sans-serif", 
                    fontWeight: 900, 
                    lineHeight: 1.1,
                    letterSpacing: '-0.3px',
                    color: '#0f172a',
                    fontSize: '1.25rem'
                  }}
                >
                  {settings?.site_name || <>TOXIQ <span style={{ color: '#0d9488' }}>2026</span></>}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: "'Raleway', sans-serif", 
                    fontWeight: 700, 
                    color: '#64748b',
                    letterSpacing: '0.2px',
                    fontSize: '0.7rem',
                    display: 'block',
                    mt: 0.1
                  }}
                >
                  Toxicology Program
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <Box display="flex" gap={2} alignItems="center">
            {navLinks.map((link) => (
              <Button 
                key={link.label}
                onClick={link.action}
                sx={{ 
                  color: '#334155',
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.04)'
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right Action buttons */}
        {!isMobile && (
          <Box display="flex" alignItems="center">
            {adminMenu}
          </Box>
        )}

        {/* Mobile menu trigger */}
        {isMobile && (
          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="menu" 
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Drawer menu for mobile screens */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: '260px', p: 2 }
        }}
      >
        <Box 
          display="flex" 
          alignItems="center" 
          mb={3}
          px={1}
        >
          {settings?.logo ? (
            <img 
              src={getFileUrl(settings.logo)} 
              alt="logo" 
              style={{ 
                height: '32px', 
                width: 'auto', 
                objectFit: 'contain', 
                display: 'block' 
              }} 
            />
          ) : (
            <>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 32, 
                  height: 32, 
                  borderRadius: '8px', 
                  bgcolor: 'rgba(13, 148, 136, 0.08)', 
                  border: '2px solid #0d9488',
                  color: '#0d9488',
                  mr: 1.5
                }}
              >
                <ScienceIcon sx={{ fontSize: '1.1rem' }} />
              </Box>
              <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
                {settings?.site_name || <>TOXIQ <span style={{ color: '#0d9488' }}>2026</span></>}
              </Typography>
            </>
          )}
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem 
              button 
              key={link.label} 
              onClick={() => {
                link.action();
                setDrawerOpen(false);
              }}
              sx={{ borderRadius: '8px', mb: 1 }}
            >
              <ListItemText 
                primary={link.label} 
                primaryTypographyProps={{ 
                  fontFamily: "'Raleway', sans-serif", 
                  fontWeight: 600 
                }} 
              />
            </ListItem>
          ))}
        </List>
        <Box mt="auto" display="flex" flexDirection="column" gap={1.5} pt={2} borderTop="1px solid #e2e8f0">
          {isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') ? (
            <>
              <Typography variant="caption" color="textSecondary" align="center">
                Logged in as: {user?.username} ({user?.role})
              </Typography>
              <Button 
                color="primary" 
                variant="outlined" 
                fullWidth
                onClick={() => {
                  navigate('/admin/dashboard');
                  setDrawerOpen(false);
                }}
              >
                Admin Panel
              </Button>
              <Button 
                color="error" 
                variant="contained" 
                fullWidth
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<LockIcon />}
              fullWidth
              sx={{ 
                borderRadius: '8px', 
                bgcolor: '#0f172a', 
                color: '#ffffff',
                fontWeight: 700,
                py: 1,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1e293b'
                }
              }}
              onClick={() => {
                navigate('/login');
                setDrawerOpen(false);
              }}
            >
              Admin Login
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
