import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import pic from '../../assets/quizheader.avif'
const QuizHeader = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, md: 5 }, pt: 5, pb: 4, backgroundColor: theme.palette.background.default,}}>
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, mt: { xs: 3, md: 0 } }}>
        
        <Typography variant="h4" fontWeight="bold" sx={{color: 'text.secondary'}} gutterBottom>Explore a World of Knowledge Through Public Quizzes</Typography>
        <Typography variant='body1' color="text.secondary">
        Dive into an ever-growing collection of quizzes shared by users like you. Whether you're brushing up
          on skills, preparing for exams, or just having fun, there's something here for everyone. Use the search
          and filters to quickly find quizzes that match your interest.
        </Typography>
        
      </Box>

      <Box
        component="img"
        src={pic} // Replace with your own
        alt="Browse quizzes illustration"
        sx={{
          width: { xs: '100%', md: '35%' },
          maxHeight: 300,
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default QuizHeader;