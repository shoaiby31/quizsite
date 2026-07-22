import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import { motion } from "framer-motion";


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
    icon: '🔐',
    title: 'Real-Time Results',
    description: 'Instant feedback with detailed results, rankings, and performance analytics.'
  },
];


const Features = () => {

  return (

    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 6 },

      }}
    >


      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
        <Typography variant="h4" fontWeight={800}>
          Why Choose {" "}
          <Box component="span"
            sx={{ background: "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", }}>
            SmartEducator</Box>
          {" "}App</Typography>
      </motion.div>




      <Grid container spacing={4} mt={6} >

        {
          features.map((item, index) => (

            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .15 }} viewport={{ once: true }} whileHover={{ y: -8 }}>

                <Card
                  sx={{ height: "100%", borderRadius: 4, backdropFilter: "blur(10px)", boxShadow: "0 20px 40px rgba(0,0,0,.08)" }}>

                  <CardContent>

                     <Typography variant="h3" component="div" sx={{textAlign:'center'}} gutterBottom>{item.icon}</Typography>
                    <Typography variant="h6" sx={{textAlign:'center'}} fontWeight={700}>{item.title}</Typography>
                    
                    <Typography color="text.secondary" sx={{textAlign:'center'}} mt={1} >{item.description}</Typography>
                  </CardContent>

                </Card>


              </motion.div>

            </Grid>

          ))
        }


      </Grid>


    </Box>

  );
};


export default Features;