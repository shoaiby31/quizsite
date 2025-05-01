import React from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion.create(Paper);

const features = [
  {
    icon: '🎯',
    title: 'Custom Quiz Builder',
    description: 'Create unlimited quizzes with multiple question types (MCQs, True/False, Short Answer, etc.)'
  },
  {
    icon: '👩‍🏫',
    title: 'For Teachers & Institutes',
    description: 'Easily assign tests to students, track scores, and manage performance data.'
  },
  {
    icon: '🧠',
    title: 'For Students & Individuals',
    description: 'Practice for exams or test your knowledge with personalized quizzes.'
  },
  {
    icon: '📊',
    title: 'Real-Time Results',
    description: 'Instant feedback with detailed results, rankings, and performance analytics.'
  },
//   {
//     icon: '🔐',
//     title: 'Secure & Scalable',
//     description: 'Your data is safe, and the system is built to support large numbers of users simultaneously.'
//   }
];

const Features = () => {
  return (
    <Box sx={{ px:{xs:2, md:5} }}>
        <Divider/>
      <Typography variant="h5" component="h2" gutterBottom sx={{ py:5, fontWeight: 'bold' }}>Why Choose Our Quiz App?</Typography>

      <Grid container spacing={2} justifyContent="center">
        {features.map((feature, index) => (
          <Grid size={{xs:12, sm:6, md:3}} key={index}>
            <MotionPaper initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }} viewport={{ once: true }} elevation={3}
              sx={{ p: 3, textAlign: 'center', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
              <Typography variant="h3" component="div" gutterBottom>{feature.icon}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{feature.title}</Typography>
              <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;