import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

import { motion } from "framer-motion";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";


const services = [
  {
    icon: <AdminPanelSettingsRoundedIcon />,
    title: "School Administration Management",
    description:
      "A complete management system for principals and school administrators to control their educational ecosystem.",
    features: [
      "Manage teachers and students",
      "Monitor school activities",
      "Track overall performance",
      "Control user permissions",
    ],
  },

  {
    icon: <GroupsRoundedIcon />,
    title: "Teacher & Classroom Management",
    description:
      "Teachers can organize their classes, manage students, and handle daily academic activities efficiently.",
    features: [
      "Create and manage classes",
      "Add and organize students",
      "Assign daily diaries",
      "Monitor student progress",
    ],
  },

  {
    icon: <QuizRoundedIcon />,
    title: "Online Quiz & Assessment System",
    description:
      "Create engaging digital assessments with multiple question formats for modern learning environments.",
    features: [
      "MCQ questions",
      "True/False questions",
      "Short answer questions",
      "Practice quizzes",
    ],
  },

  {
    icon: <SecurityRoundedIcon />,
    title: "Secure Examination Environment",
    description:
      "Conduct reliable online exams with security features designed to minimize unfair practices.",
    features: [
      "Tab switching prevention",
      "Quiz window protection",
      "Controlled exam sessions",
      "Secure assessment process",
    ],
  },

  {
    icon: <AnalyticsRoundedIcon />,
    title: "Performance Analytics",
    description:
      "Understand student and teacher performance through meaningful reports and insights.",
    features: [
      "Student performance tracking",
      "Teacher evaluation",
      "Quiz result analysis",
      "Learning improvement insights",
    ],
  },

  {
    icon: <PsychologyRoundedIcon />,
    title: "AI Powered Evaluation",
    description:
      "Upcoming AI technology that evaluates subjective answers with human-like understanding.",
    features: [
      "AI answer evaluation",
      "Smart grading assistance",
      "Reduced manual checking",
      "Intelligent feedback",
    ],
  },
];


const Services = () => {

  return (

    <Box
      sx={{
        minHeight:"100vh",
        py:10,
        px:{
          xs:2,
          md:6
        },

        background:
        "linear-gradient(135deg,#f8fbff 0%,#f9f5ff 100%)",
      }}
    >


      {/* Hero Section */}

      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.7
        }}

      >

        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={800}
        >

          Our{" "}

          <Box
            component="span"
            sx={{

              background:
              "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",

              WebkitBackgroundClip:"text",

              WebkitTextFillColor:"transparent"

            }}
          >

            Services

          </Box>


        </Typography>



        <Typography

          textAlign="center"

          maxWidth="850px"

          mx="auto"

          mt={3}

          color="text.secondary"

          fontSize="1.1rem"

          lineHeight={1.8}

        >

          SmartEducator provides a complete digital education
          ecosystem that helps schools, academies, teachers, and
          students manage learning, assessments, and performance
          efficiently.

        </Typography>


      </motion.div>




      {/* Services Cards */}


      <Grid

        container

        spacing={4}

        mt={7}

      >

        {
          services.map((service,index)=>(

            <Grid

              size={{
                xs:12,
                md:6,
                lg:4
              }}

              key={service.title}

            >

              <motion.div

                initial={{
                  opacity:0,
                  y:50
                }}

                whileInView={{
                  opacity:1,
                  y:0
                }}

                viewport={{
                  once:true
                }}

                transition={{
                  delay:index*.1
                }}

                whileHover={{
                  y:-10
                }}

              >


                <Card

                  sx={{

                    height:"100%",

                    minHeight:390,

                    borderRadius:4,

                    background:
                    "rgba(255,255,255,.8)",

                    backdropFilter:
                    "blur(10px)",

                    boxShadow:
                    "0 20px 40px rgba(0,0,0,.08)"

                  }}

                >


                  <CardContent>


                    <Stack
                      spacing={2}
                    >


                      <Box

                        sx={{

                          width:65,

                          height:65,

                          borderRadius:"50%",

                          display:"flex",

                          alignItems:"center",

                          justifyContent:"center",

                          color:"white",

                          background:

                          "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))"

                        }}

                      >

                        {service.icon}

                      </Box>



                      <Typography

                        variant="h6"

                        fontWeight={800}

                      >

                        {service.title}

                      </Typography>



                      <Typography

                        color="text.secondary"

                        lineHeight={1.7}

                      >

                        {service.description}

                      </Typography>



                      {
                        service.features.map((feature)=>(

                          <Chip

                            key={feature}

                            label={feature}

                            size="small"

                            sx={{

                              justifyContent:"flex-start",

                              width:"fit-content"

                            }}

                          />

                        ))
                      }


                    </Stack>


                  </CardContent>


                </Card>


              </motion.div>


            </Grid>

          ))
        }


      </Grid>



      {/* Bottom CTA */}

      <Box

        mt={10}

        textAlign="center"

      >

        <Typography

          variant="h5"

          fontWeight={700}

        >

          Transform your educational workflow with{" "}

          <Box

            component="span"

            sx={{

              background:
              "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",

              WebkitBackgroundClip:"text",

              WebkitTextFillColor:"transparent"

            }}

          >

          SmartEducator

          </Box>


        </Typography>


      </Box>


    </Box>

  );
};


export default Services;