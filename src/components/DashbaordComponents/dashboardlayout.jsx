import React from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from './sidebar';
import TopBar from './topbar';

const DashboardLayout = ({ children }) => {
  return (

    
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fff', minHeight: '100vh', }}>
        <TopBar />
        <Container maxWidth="xl" sx={{ pt: 3, bgcolor: '#f3f4f6' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;