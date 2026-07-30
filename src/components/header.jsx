import React
// , { useEffect, useRef } 
from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import pic from "../assets/headerpic.png";

const MotionBox = motion.create(Box);

function Header() {
  // const titleRef = useRef(null);

  // useEffect(() => {
  //   if (titleRef.current) {
  //     const topOffset =
  //       titleRef.current.getBoundingClientRect().top +
  //       window.pageYOffset -
  //       100;

  //     window.scrollTo({
  //       top: topOffset,
  //       behavior: "smooth",
  //     });
  //   }
  // }, []);

  return (
    <Box
      // ref={titleRef}
      sx={{
        py: {
          xs: 2,
          sm: 4,
          md: 4,
        },
        px: {
          xs: 2,
          md: 6,
        },
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
      >
        {/* Left Side */}

        <Grid size={{ xs: 12, md: 7 }}>
          <MotionBox
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.4rem",
                  md: "3.8rem",
                },
                lineHeight: {
                  xs: 1.2,
                  md: 1.15,
                },
                textAlign: {
                  xs: "center",
                  md: "left",
                },
                maxWidth: {
                  xs: 340,
                  sm: 550,
                  md: "100%",
                },
                mx: {
                  xs: "auto",
                  md: 0,
                },
              }}
            >
              Empower Your Learning with{" "}

              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SmartEducator
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 3,
                fontSize: {
                  xs: 16,
                  md: 20,
                },
                textAlign: {
                  xs: "center",
                  md: "left",
                },
                maxWidth: 650,
                mx: {
                  xs: "auto",
                  md: 0,
                },
              }}
            >
              Create quizzes, manage schools, evaluate students,
              and simplify learning with one modern educational
              platform built for teachers, academies, and students.
            </Typography>

            {/* Feature Chips */}

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
                mt: 4,
              }}
            >
              <Chip
                size="small"
                icon={<SchoolRoundedIcon />}
                label="Schools"
                sx={{
                  fontWeight: 600,
                }}
              />

              <Chip
                size="small"
                icon={<QuizRoundedIcon />}
                label="Secure Quizzes"
                sx={{
                  fontWeight: 600,
                }}
              />

              <Chip
                size="small"
                icon={<SecurityRoundedIcon />}
                label="AI Ready"
                sx={{
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Buttons */}

            <Box
              mt={5}
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "nowrap",
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                endIcon={<KeyboardArrowRightIcon />}
                sx={{
                  flex: {
                    xs: 1,
                    md: "0 0 auto",
                  },
                  px: {
                    md: 4,
                  },
                  py: {
                    xs: 1.2,
                    md: 1.5,
                  },
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  background:
                    "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                }}
              >
                Get Started
              </Button>

              <Button
                component={Link}
                to="/join-school"
                variant="outlined"
                sx={{
                  flex: {
                    xs: 1,
                    md: "0 0 auto",
                  },
                  px: {
                    md: 4,
                  },
                  py: {
                    xs: 1.2,
                    md: 1.5,
                  },
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  borderWidth: 2,

                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              >
                Join School
              </Button>
            </Box>
          </MotionBox>
        </Grid>
                {/* Right Side - Hero Image */}

        <Grid
          size={{ xs: 12, md: 5 }}
        >
          <MotionBox
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <Box
              component={motion.img}
              src={pic}
              alt="SmartEducator"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: {
                  xs: "75%",
                  sm: "65%",
                  md: "100%",
                },
                maxWidth: 520,
                objectFit: "contain",
              }}
            />

          </MotionBox>
        </Grid>


      </Grid>

    </Box>
  );
}

export default Header;