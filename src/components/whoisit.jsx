import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion.create(Paper);


const Whoisit = () => {
  return (
    <Box sx={{ px:{xs:2, md:5} }}>
        <Divider/>
      <Typography variant="h5" component="h2" gutterBottom sx={{ paddingTop:5, fontWeight: 'bold' }}>Who Is It For?</Typography>
      <MotionPaper initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 * 0.1, duration: 0.5 }} viewport={{ once: true }} elevation={0}
            sx={{ p: 3 }}>
                <Typography variant="body1" component="div" gutterBottom>Whether you're a school teacher, an academy owner, or a student preparing for exams, this platform adapts to your needs. No tech skills required.</Typography>
                </MotionPaper>
     
          
       
    </Box>
  );
};

export default Whoisit;