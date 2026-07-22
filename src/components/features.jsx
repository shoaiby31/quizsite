// import React from 'react';
// import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
// import { motion } from 'framer-motion';

// const MotionPaper = motion.create(Paper);

// const features = [
//   {
//     icon: '🎯',
//     title: 'Custom Quiz Builder',
//     description: 'Create unlimited quizzes with multiple question types (MCQs, True/False, Short Answer, etc.)'
//   },
//   {
//     icon: '👩‍🏫',
//     title: 'For Teachers & Institutes',
//     description: 'Easily assign tests to students, track scores, and manage performance data.'
//   },
//   {
//     icon: '🧠',
//     title: 'For Students & Individuals',
//     description: 'Practice for exams or test your knowledge with personalized quizzes.'
//   },
//   {
//     icon: '📊',
//     title: 'Real-Time Results',
//     description: 'Instant feedback with detailed results, rankings, and performance analytics.'
//   },
// //   {
// //     icon: '🔐',
// //     title: 'Secure & Scalable',
// //     description: 'Your data is safe, and the system is built to support large numbers of users simultaneously.'
// //   }
// ];

// const Features = () => {
//   return (
//     <Box sx={{ px:{xs:2, md:5} }}>
//         <Divider/>
//       <Typography variant="h5" component="h2" gutterBottom sx={{ py:5, fontWeight: 'bold' }}>Why Choose Our Quiz App?</Typography>

//       <Grid container spacing={2} justifyContent="center">
//         {features.map((feature, index) => (
//           <Grid size={{xs:12, sm:6, md:3}} key={index}>
//             <MotionPaper initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1, duration: 0.5 }} viewport={{ once: true }} elevation={3}
//               sx={{ p: 3, textAlign: 'center', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
//               }}>
//               <Typography variant="h3" component="div" gutterBottom>{feature.icon}</Typography>
//               <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{feature.title}</Typography>
//               <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
//             </MotionPaper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Features;



import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

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
        py: 2,
        px: { xs: 2, md: 6 },

      }}
    >


      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
        <Typography variant="h5" fontWeight={800}>
          Why Choose {" "}
          <Box component="span"
            sx={{ background: "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", }}>
            SmartEducator</Box>
          {" "}App</Typography>


        {/* <Typography textAlign="center" color="text.secondary" maxWidth="850px" mx="auto" mt={2}>
          From school administration to student assessment,
          SmartEducator provides a complete digital workflow
          that simplifies education management.
        </Typography> */}


      </motion.div>




      <Grid
        container
        spacing={4}
        mt={6}
      >

        {
          features.map((item, index) => (

            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .15 }} viewport={{ once: true }} whileHover={{ y: -8 }}>

                <Card
                  sx={{ height: "100%", borderRadius: 4, backdropFilter: "blur(10px)", boxShadow: "0 20px 40px rgba(0,0,0,.08)" }}>

                  <CardContent>
                    {/* <Box sx={{ width:60, height:60, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))", color:"white", mb:2 }}>
                      {React.cloneElement(
                        item.icon,
                        { fontSize:"large" }
                      )}
                    </Box> */}

                     <Typography variant="h3" component="div" sx={{textAlign:'center'}} gutterBottom>{item.icon}</Typography>
                    
                   


                    <Typography variant="h6" fontWeight={700}>{item.title}</Typography>
                    <Typography
                      sx={{ background: "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 600 }} >
                      {item.role}</Typography>


                    <Typography color="text.secondary" mt={1} >{item.description}</Typography>
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