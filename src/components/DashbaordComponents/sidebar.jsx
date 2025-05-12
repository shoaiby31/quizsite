import { Drawer, List, ListItemIcon, ListItemText, Box, Button, Divider, IconButton, Tooltip, ListItemButton, } from '@mui/material';
import { Home, Map, People, History, Settings, AppRegistration, ChevronLeft, ChevronRight, } from '@mui/icons-material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const navItems = [
  { label: 'Home', icon: <Home />, path: '/' },
  { label: 'Overview', icon: <People />, path: '/dashboard' },
  { label: 'View Quizzes', icon: <Map />, path: '/dashboard/quizzes' },
  { label: 'Manage Quiz', icon: <History />, path: '/dashboard/createquiz' },
  { label: 'Users Management', icon: <Settings />, path: '/dashboard/abc' },
  { label: 'Settings', icon: <Settings />, path: '/dashboard/efd' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const drawerWidth = isCollapsed ? 70 : 240;
  const themeMode = useSelector((state) => state.mode.value);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          paddingTop: 2,
          border: 'none',
          backgroundColor: 'transparent',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >


      {/* Logo */}
      <Box display="flex" justifyContent="center">
        {!isCollapsed && (
          <Box
            component="img"
            src={Logo}
            sx={{ width: 80, display: { xs: 'none', md: 'flex' } }}
            alt="Your logo."
          />
        )}
      </Box>

      {/* Collapse/Expand Toggle */}
      <Box display="flex" justifyContent={isCollapsed ? 'center' : 'flex-end'} px={1}>
        <IconButton onClick={() => setIsCollapsed(prev => !prev)}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Register Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={!isCollapsed && <AppRegistration />}
          color="secondary"
        >
          {!isCollapsed ? 'Register Patient' : <AppRegistration />}
        </Button>
      </Box>

      {/* Navigation Links */}
      <List>
        {navItems.map(({ label, icon, path }) => (
          <Tooltip title={isCollapsed ? label : ''} placement="right" key={label}>
            <ListItemButton component={NavLink} to={path} end={path === '/dashboard'} style={({ isActive }) => ({
              backgroundColor: isActive ? themeMode? 'gray':'#f0f0f0' : 'transparent', borderRadius: 8, margin: '4px 8px', paddingLeft: isCollapsed ? 2 : 3,})}>
              <ListItemIcon>{icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box flexGrow={1} />

      <Divider />

      {/* Footer Icons */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <AppleIcon color="action" />
          <AndroidIcon color="action" />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;