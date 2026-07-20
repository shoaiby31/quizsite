import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

import { motion } from "framer-motion";

import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import pic from "../../assets/createquiz.webp";


function CreateQuizHeader() {

  return (

    <Box
      sx={{
        pt: 1,
        px: {
          xs: 2,
          md: 5
        },
      }}
    >


      <Card

        elevation={0}

        sx={{

          borderRadius:5,

          overflow:"hidden",

          background:
          "linear-gradient(135deg,#ffffff 0%,#f6f2ff 100%)",

          boxShadow:
          "0 20px 50px rgba(0,0,0,.08)"

        }}

      >

        <Grid
          container
          alignItems="center"
          spacing={2}
        >



          {/* Text Section */}

          <Grid
            size={{
              xs:12,
              md:8
            }}
          >

            <motion.div

              initial={{
                opacity:0,
                x:-40
              }}

              animate={{
                opacity:1,
                x:0
              }}

              transition={{
                duration:.6
              }}

            >

              <CardContent

                sx={{

                  px:{
                    xs:3,
                    md:6
                  },

                  py:{
                    xs:4,
                    md:6
                  }

                }}

              >


                <Chip

                  icon={<QuizRoundedIcon/>}

                  label="Quiz Management"

                  sx={{

                    mb:2,

                    fontWeight:600,

                    background:
                    "linear-gradient(135deg,#fce7f3,#ede9fe)"

                  }}

                />



                <Typography

                  sx={{

                    fontWeight:800,

                    fontSize:{
                      xs:"2rem",
                      sm:"2.5rem",
                      md:"2.8rem"
                    },

                    lineHeight:1.2

                  }}

                >

                  Create a Free Practice{" "}

                  <Box

                    component="span"

                    sx={{

                      background:
                      "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",

                      WebkitBackgroundClip:
                      "text",

                      WebkitTextFillColor:
                      "transparent"

                    }}

                  >

                    Quiz

                  </Box>

                  {" "}📝


                </Typography>




                <Typography

                  variant="body1"

                  color="text.secondary"

                  sx={{

                    mt:3,

                    maxWidth:"650px",

                    lineHeight:1.8,

                    fontSize:{
                      xs:"0.95rem",
                      md:"1.1rem"
                    }

                  }}

                >

                  Welcome! Create engaging quizzes effortlessly for
                  your class, academy, or online learning environment.
                  SmartEducator makes quiz creation simple,
                  organized, and intuitive.


                </Typography>



              </CardContent>


            </motion.div>


          </Grid>





          {/* Image Section */}


          <Grid

            size={{
              xs:12,
              md:4
            }}

          >

            <motion.div

              initial={{
                opacity:0,
                scale:.8
              }}

              animate={{
                opacity:1,
                scale:1
              }}

              transition={{
                duration:.7
              }}

              whileHover={{
                scale:1.05
              }}

            >

              <Box

                sx={{

                  display:"flex",

                  justifyContent:"center",

                  alignItems:"center",

                  p:3

                }}

              >

                <CardMedia

                  component="img"

                  image={pic}

                  alt="Create Quiz"

                  sx={{

                    width:{
                      xs:"65%",
                      md:"90%"
                    },

                    objectFit:"contain",

                    filter:
                    "drop-shadow(0px 20px 25px rgba(0,0,0,.15))"

                  }}

                />


              </Box>


            </motion.div>


          </Grid>



        </Grid>



      </Card>



      <Divider

        sx={{

          mt:5

        }}

      />


    </Box>

  );
}


export default CreateQuizHeader;