import React from 'react';
import { Box, Typography, Grid, Paper, CardMedia, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import teacher1 from '../assets/teacher1.jpg'
import teacher2 from '../assets/teacher2.png'
import teacher3 from '../assets/teacher3.avif'



const MotionPaper = motion.create(Paper);

const testimonials = [
  {
    quote: "“This tool helped me easily create tests for my class – and saved me hours every week!”",
    name: "Mr. Zubair R., Teacher",
    pic:teacher1
  },
  {
    quote: "“I used it to prepare for my university entrance exams – the personalized quizzes are amazing!”",
    name: "Zain U., Student",
    pic:teacher2
  },
  {
    quote: "“Managing quizzes and checking performance data is now so simple. Love it!”",
    name: "Mr. Khalid, Academy Owner",
    pic:teacher3
  }
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 2, px:{xs:2, md:5}}}>
        <Divider/>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 1, paddingTop:3 }}>💬 Testimonials</Typography>
      <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 5 }}>Hear what our users say</Typography>

      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((testimonial, index) => (
          <Grid size={{xs:12, sm:6, md:4}} key={index}>
            <MotionPaper elevation={4} initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              sx={{ borderRadius: 3, textAlign: 'center'}}>

                <CardMedia sx={{overflow: 'hidden', display: 'flex', borderTopRightRadius: 8, borderTopLeftRadius: 8}} component="img" height="250" alt="Paella dish" image={testimonial.pic}/>

              <Box sx={{p:3}}>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                {testimonial.quote}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                — {testimonial.name}
              </Typography>
              </Box>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;