import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { motion } from "framer-motion";

import teacher1 from "../assets/teacher1.jpg";
import teacher2 from "../assets/teacher2.png";
import teacher3 from "../assets/teacher3.avif";

const testimonials = [
  {
    quote:
      "This platform has completely changed the way I conduct quizzes. It saves me hours every week and my students enjoy using it.",
    name: "Mr. Zubair R.",
    role: "School Teacher",
    pic: teacher1,
  },
  {
    quote:
      "Preparing for exams has become much easier. The quizzes help me practice regularly and instantly identify my weak areas.",
    name: "Zain U.",
    role: "Student",
    pic: teacher2,
  },
  {
    quote:
      "Managing teachers, quizzes, and student performance from one dashboard has made running my academy much more efficient.",
    name: "Mr. Khalid",
    role: "Academy Owner",
    pic: teacher3,
  },
];

const Testimonials = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={800}
        >
          What Our{" "}
          <Box
            component="span"
            sx={{
              background:
                "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Users
          </Box>{" "}
          Say
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          maxWidth="800px"
          mx="auto"
          mt={2}
        >
          Discover how SmartEducator is helping teachers, students,
          and institutions transform learning through a smarter
          digital experience.
        </Typography>
      </motion.div>

      <Grid container spacing={4} mt={6}>
        {testimonials.map((item, index) => (
          <Grid
            size={{ xs: 12, md: 4 }}
            key={index}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,.08)",
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <Avatar
                    src={item.pic}
                    alt={item.name}
                    sx={{
                      width: 90,
                      height: 90,
                      mx: "auto",
                      mb: 3,
                      border: "4px solid",
                      borderColor: "primary.light",
                    }}
                  />

                  <FormatQuoteRoundedIcon
                    sx={{
                      fontSize: 40,
                      mb: 2,
                      background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      minHeight: 110,
                    }}
                  >
                    "{item.quote}"
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={3}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
                    }}
                  >
                    {item.role}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;