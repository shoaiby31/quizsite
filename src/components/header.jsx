import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
} from "@mui/material";

import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import pic from "../assets/headerpic.png";

const MotionBox = motion.create(Box);

function Header() {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      const topOffset =
        titleRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        100;

      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <Box
      ref={titleRef}
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
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
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "2.2rem",
                  md: "3.8rem",
                },
                lineHeight: 1.15,
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
                maxWidth: 650,
              }}
            >
              Create quizzes, manage schools, evaluate students,
              and simplify learning with one modern educational
              platform built for teachers, academies, and students.
            </Typography>

            {/* Feature Chips */}
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mt={4}
            >
              <Chip
                icon={<SchoolRoundedIcon />}
                label="Schools"
              />

              <Chip
                icon={<QuizRoundedIcon />}
                label="Secure Quizzes"
              />

              <Chip
                icon={<SecurityRoundedIcon />}
                label="AI Ready"
              />
            </Box>

            {/* Buttons */}
            <Box
              mt={5}
              display="flex"
              gap={2}
              flexWrap="wrap"
            >
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                size="large"
                endIcon={<KeyboardArrowRightIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  background:
                    "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                }}
              >
                Get Started
              </Button>

              <Button
                component={Link}
                to="/browsequiz"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              >
                Browse Quizzes
              </Button>
            </Box>
          </MotionBox>
        </Grid>

        {/* Right Side */}
        <Grid size={{ xs: 12, md: 5 }}>
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <motion.img
              src={pic}
              alt="SmartEducator"
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              style={{
                width: "100%",
                maxWidth: 520,
              }}
            />
          </MotionBox>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Header;