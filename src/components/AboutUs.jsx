import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import { motion } from "framer-motion";

import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";


const values = [
  {
    icon: <LightbulbRoundedIcon />,
    title: "Our Mission",
    description:
      "Our mission is to simplify education management by providing schools and academies with smart digital solutions that improve learning, assessment, and communication.",
  },
  {
    icon: <TrackChangesRoundedIcon />,
    title: "Our Vision",
    description:
      "We envision a future where every educational institution can use technology to create smarter classrooms and deliver better learning experiences.",
  },
  {
    icon: <FavoriteRoundedIcon />,
    title: "Our Commitment",
    description:
      "We are committed to building reliable, secure, and innovative tools that empower educators, support students, and help institutions grow.",
  },
];


const AboutUs = () => {

  return (

    <Box
      sx={{
        py:10,
        px:{xs:2,md:6},
        background:
        "linear-gradient(135deg,#f8fbff 0%,#f9f5ff 100%)"
      }}
    >

      {/* Heading */}

      <motion.div
        initial={{
          opacity:0,
          y:40
        }}
        whileInView={{
          opacity:1,
          y:0
        }}
        transition={{
          duration:.7
        }}
        viewport={{
          once:true
        }}
      >

        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={800}
        >

          About{" "}

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

        </Typography>


        <Typography
          textAlign="center"
          maxWidth="850px"
          mx="auto"
          mt={3}
          color="text.secondary"
          lineHeight={1.8}
          fontSize="1.1rem"
        >

          SmartEducator is an innovative education technology platform
          dedicated to helping schools, academies, teachers, and students
          embrace digital transformation. We believe technology can make
          education more organized, accessible, secure, and effective.

        </Typography>

      </motion.div>



      {/* Main About Text */}


      <Grid
        container
        spacing={4}
        mt={6}
        alignItems="center"
      >


        <Grid
          size={{
            xs:12,
            md:7
          }}
        >

          <Card

            sx={{

              borderRadius:4,

              p:2,

              background:
              "rgba(255,255,255,.8)",

              boxShadow:
              "0 20px 40px rgba(0,0,0,.08)"

            }}

          >

            <CardContent>

              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                Empowering Digital Education
              </Typography>


              <Typography
                color="text.secondary"
                lineHeight={1.9}
              >

                Education is evolving, and institutions need smarter
                solutions to manage learning activities efficiently.
                SmartEducator was created to bridge the gap between
                traditional education and modern technology.

                <br/>
                <br/>

                Our platform helps educational institutions manage
                assessments, improve communication, monitor performance,
                and create a better learning environment for everyone.

              </Typography>

            </CardContent>


          </Card>


        </Grid>



        <Grid
          size={{
            xs:12,
            md:5
          }}
        >

          <motion.div

            whileHover={{
              scale:1.03
            }}

          >

            <Box

              sx={{

                height:280,

                borderRadius:5,

                display:"flex",

                justifyContent:"center",

                alignItems:"center",

                background:
                "linear-gradient(135deg,#6846fd,#e21c9a)",

                color:"white",

                textAlign:"center",

                p:4

              }}

            >

              <Typography
                variant="h4"
                fontWeight={800}
              >

                Smarter Education.
                <br/>
                Better Future.

              </Typography>


            </Box>


          </motion.div>


        </Grid>


      </Grid>




      {/* Mission Vision Commitment */}


      <Grid

        container

        spacing={4}

        mt={8}

      >

        {
          values.map((item,index)=>(

            <Grid
              size={{
                xs:12,
                md:4
              }}
              key={item.title}
            >

              <motion.div

                initial={{
                  opacity:0,
                  y:40
                }}

                whileInView={{
                  opacity:1,
                  y:0
                }}

                transition={{
                  delay:index*.2
                }}

                viewport={{
                  once:true
                }}

              >

                <Card

                  sx={{

                    height:"100%",

                    borderRadius:4,

                    boxShadow:
                    "0 15px 35px rgba(0,0,0,.08)"

                  }}

                >

                  <CardContent>


                    <Box

                      sx={{

                        width:55,

                        height:55,

                        borderRadius:"50%",

                        display:"flex",

                        alignItems:"center",

                        justifyContent:"center",

                        color:"white",

                        background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))"

                      }}

                    >

                      {item.icon}

                    </Box>


                    <Typography
                      variant="h6"
                      fontWeight={700}
                      mt={3}
                    >

                      {item.title}

                    </Typography>


                    <Typography
                      color="text.secondary"
                      mt={2}
                      lineHeight={1.7}
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


export default AboutUs;