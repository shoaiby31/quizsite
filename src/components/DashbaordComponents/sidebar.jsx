import React, { useState } from 'react';

import { Drawer, useMediaQuery, useTheme, List, ListItemIcon, ListItemText, Box, Button, Divider, IconButton, Tooltip, ListItemButton, } from '@mui/material';
import { Map, People, History, Settings, AppRegistration, ChevronLeft, ChevronRight, LegendToggle, Quiz } from '@mui/icons-material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { setdrawerState } from '../../redux/slices/drawerSlice/index';

const navItems = [
  { label: 'My Students', icon: <People />, path: '/dashboard/my-students' },
  { label: 'My Quizzes', icon: <Quiz />, path: '/dashboard/private-quizzes' },
  { label: 'Make New Quiz', icon: <History />, path: '/dashboard/createquiz' },
  { label: 'Requests', icon: <LegendToggle />, path: '/dashboard/join-requests' },
  { label: 'Users Management', icon: <Map />, path: '/dashboard/abc' },
  { label: 'Settings', icon: <Settings />, path: '/dashboard/efd' },

  
];

const Sidebar = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isCollapsed1 = useSelector((state) => state.drawer.value);

  const drawerWidth = isCollapsed ? 70 : 240;
  const themeMode = useSelector((state) => state.mode.value);


  return (

    <Drawer variant={isMdUp ? "permanent" : "temporary"}
      open={isMdUp ? true : isCollapsed1} // control visibility in temporary mode
      onClose={() => { dispatch(setdrawerState()) }} // only necessary for temporary
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "block", md: "block" },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          paddingTop: 2,
          border: 'none',
          backgroundColor: isCollapsed1 ? '' : 'transparent',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >


      {/* Logo */}
      <Box display="flex" justifyContent="center">
        {!isCollapsed && (
          <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.05)', }, display: 'inline-block', }}>
            <Box component="img" src={Logo} alt="Your logo" sx={{ width: 80, display: { xs: 'none', md: 'flex' } }} />
          </Box>
        )}
      </Box>

      {/* Collapse/Expand Toggle */}
      {isMdUp &&
        <Box display="flex" justifyContent={isCollapsed ? 'center' : 'flex-end'} px={1}>
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>}

      {/* Register Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={!isCollapsed && <AppRegistration />}
          color="secondary" component={NavLink} to={'/dashboard'}
        >
          {!isCollapsed ? 'Overview' : <AppRegistration />}
        </Button>
      </Box>

      {/* Navigation Links */}
      <List>
        {navItems.map(({ label, icon, path }) => (
          <Tooltip title={isCollapsed ? label : ''} placement="right" key={label}>
            <ListItemButton onClick={() => { dispatch(setdrawerState()) }} component={NavLink} to={path} end={path === '/dashboard'} style={({ isActive }) => ({
              backgroundColor: isActive ? themeMode ? 'gray' : '#f0f0f0' : 'transparent', borderRadius: 8, margin: '4px 8px', paddingLeft: isCollapsed ? 2 : 3,
            })}>
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