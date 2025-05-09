import React from 'react';
import Sidebar from './sidebar';
import TopBar from './topbar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
        <Box sx={{ p: 3 }}>
          <Outlet /> {/* This is where nested route components will render */}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;