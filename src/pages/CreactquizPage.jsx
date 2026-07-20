import React from "react";
import {
  Box,
  Container,
  Paper,
} from "@mui/material";

import { motion } from "framer-motion";

import Createquiz from "../components/Quizzes/createquiz";
import QuizHeader from "../components/Quizzes/createquizheader";


export default function CreateQuizPage() {

  return (

    <Box
      sx={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg,#f8fbff 0%,#f7f3ff 100%)",

        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <QuizHeader/>


      <Container maxWidth="lg">


        {/* Page Header */}

        <motion.div

          initial={{
            opacity:0,
            y:-30
          }}

          animate={{
            opacity:1,
            y:0
          }}

          transition={{
            duration:.6
          }}

        >


        </motion.div>



        {/* Form Area */}

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
            delay:.2,
            duration:.6
          }}

        >

          <Paper

            elevation={0}

            sx={{

              mt:4,

              p:{
                xs:2,
                md:4
              },

              borderRadius:4,

              background:
              "rgba(255,255,255,.75)",

              backdropFilter:
              "blur(12px)",


              boxShadow:
              "0 20px 50px rgba(0,0,0,.08)"

            }}

          >

            <Createquiz/>

          </Paper>


        </motion.div>


      </Container>


    </Box>

  );
}