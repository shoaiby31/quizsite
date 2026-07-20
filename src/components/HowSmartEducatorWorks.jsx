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

import { motion } from "framer-motion";


const workflow = [
  {
    icon: <SchoolRoundedIcon />,
    title: "School Setup",
    role: "Super Admin",
    description:
      "The principal creates and manages the school environment, controls users, and monitors overall activities.",
  },
  {
    icon: <PersonRoundedIcon />,
    title: "Teacher Management",
    role: "Teacher / Sub Admin",
    description:
      "Teachers create classes, add students, prepare quizzes, assign daily diaries, and manage learning activities.",
  },
  {
    icon: <GroupsRoundedIcon />,
    title: "Student Learning",
    role: "Students",
    description:
      "Students access their accounts, practice quizzes, view diaries, and participate in digital assessments.",
  },
  {
    icon: <QuizRoundedIcon />,
    title: "Secure Quiz System",
    role: "Assessment",
    description:
      "Students attempt MCQs, True/False, and short-answer questions in a secure environment.",
  },
  {
    icon: <PsychologyRoundedIcon />,
    title: "AI Evaluation",
    role: "Coming Soon",
    description:
      "AI will intelligently evaluate subjective answers like a human examiner.",
  },
  {
    icon: <AssessmentRoundedIcon />,
    title: "Performance Reports",
    role: "Analytics",
    description:
      "Schools can analyze teacher performance, student progress, and learning outcomes.",
  },
];


const HowSmartEducatorWorks = () => {

  return (

    <Box
      sx={{
        py:2,
        px:{xs:2,md:6},
        
      }}
    >


      <motion.div
        initial={{opacity:0,y:40}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
        transition={{duration:.7}}
      >

        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={800}
        >

          How{" "}

          <Box
            component="span"
            sx={{
              background:
              "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
            }}
          >
            SmartEducator
          </Box>

          {" "}Works

        </Typography>


        <Typography
          textAlign="center"
          color="text.secondary"
          maxWidth="850px"
          mx="auto"
          mt={2}
        >

          From school administration to student assessment,
          SmartEducator provides a complete digital workflow
          that simplifies education management.

        </Typography>


      </motion.div>




      <Grid
        container
        spacing={4}
        mt={6}
      >

        {
          workflow.map((item,index)=>(

            <Grid
              size={{xs:12,md:6,lg:4}}
              key={item.title}
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

                transition={{
                  delay:index*.15
                }}

                viewport={{
                  once:true
                }}

                whileHover={{
                  y:-8
                }}

              >


                <Card

                  sx={{
                    height:"100%",
                    borderRadius:4,
                    backdropFilter:"blur(10px)",
               
                    boxShadow:
                    "0 20px 40px rgba(0,0,0,.08)"
                  }}

                >

                  <CardContent>


                    <Box

                      sx={{
                        width:60,
                        height:60,
                        borderRadius:"50%",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",

                        background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",

                        color:"white",
                        mb:2
                      }}

                    >

                      {React.cloneElement(
                        item.icon,
                        {
                          fontSize:"large"
                        }
                      )}

                    </Box>



                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {item.title}
                    </Typography>


                    <Typography
                      sx={{
                        background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                        WebkitBackgroundClip:"text",
                        WebkitTextFillColor:"transparent",
                        fontWeight:600
                      }}
                    >
                      {item.role}
                    </Typography>


                    <Typography
                      color="text.secondary"
                      mt={1}
                    >
                      {item.description}
                    </Typography>


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


export default HowSmartEducatorWorks;