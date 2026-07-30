import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

const steps = [
  {
    icon: <SendRoundedIcon sx={{ fontSize: 35 }} />,
    title: "Submit Request",
    description:
      "Complete the registration form and send your request to the school administrator.",
  },
  {
    icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 35 }} />,
    title: "Administrator Review",
    description:
      "The administrator verifies your details and reviews your request.",
  },
  {
    icon: <VerifiedRoundedIcon sx={{ fontSize: 35 }} />,
    title: "Verification",
    description:
      "Your information is verified before access is granted.",
  },
  {
    icon: <SchoolRoundedIcon sx={{ fontSize: 35 }} />,
    title: "Start Teaching",
    description:
      "Access your dashboard, classes, quizzes and school resources.",
  },
];

const JoinSteps = () => {
  return (
    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
        align="center"
        gutterBottom
      >
        What Happens Next?
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{
          mb: 5,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        Your registration request goes through a simple verification
        process before access is granted.
      </Typography>

      <Grid container spacing={3}>
        {steps.map((step, index) => (
          <Grid size={{ xs:12, md:3 }} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                border: "1px solid #ECECEC",
                transition: ".3s",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 15px 30px rgba(0,0,0,.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  bgcolor: "#7C3AED",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                {step.icon}
              </Box>

              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
              >
                {step.title}
              </Typography>

              <Typography color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default JoinSteps;