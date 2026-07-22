import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

import { motion } from "framer-motion";

const users = [
  {
    icon: <SchoolRoundedIcon />,
    title: "School Teachers",
    role: "Educators",
    description:
      "Create quizzes, manage classrooms, assign daily diaries, and monitor student progress with ease.",
  },
  {
    icon: <BusinessRoundedIcon />,
    title: "Academies",
    role: "Institute Owners",
    description:
      "Digitize your academy, organize multiple classes, manage teachers, and conduct secure online assessments.",
  },
  {
    icon: <MenuBookRoundedIcon />,
    title: "Students",
    role: "Learners",
    description:
      "Join your classes, practice quizzes, review learning materials, and improve your performance anytime.",
  },
];

const Whoisit = () => {
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
          Who{" "}

          <Box
            component="span"
            sx={{
              background:
                "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Is It
          </Box>{" "}

          For?
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          maxWidth="800px"
          mx="auto"
          mt={2}
        >
          SmartEducator is designed for everyone involved in modern education.
          Whether you're teaching, managing an institution, or preparing for
          exams, the platform adapts to your needs without requiring any
          technical skills.
        </Typography>
      </motion.div>

      <Grid container spacing={4} mt={6}>
        {users.map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.title}>
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.15,
              }}
              viewport={{
                once: true,
              }}
              whileHover={{
                y: -8,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      fontSize: "large",
                    })}
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
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
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
        ))}
      </Grid>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Card
          sx={{
            mt: 6,
            borderRadius: 4,
            background:
              "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
            color: "white",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,.12)",
          }}
        >
          <CardContent sx={{ py: 5 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              mb={2}
            >
              Simple, Powerful & Ready to Use
            </Typography>

            <Typography
              sx={{
                maxWidth: "750px",
                mx: "auto",
                opacity: 0.95,
              }}
            >
              No technical expertise is required. Simply create your account,
              set up your school or academy, invite teachers and students, and
              start conducting digital learning and assessments within minutes.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Whoisit;