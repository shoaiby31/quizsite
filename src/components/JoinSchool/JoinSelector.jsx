import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const cardStyle = (selected) => ({
  p: 4,
  borderRadius: 4,
  height: "100%",
  cursor: "pointer",
  transition: "all .3s ease",
  border: selected
    ? "2px solid #7C3AED"
    : "1px solid rgba(0,0,0,.08)",
  background: selected
    ? "linear-gradient(135deg,#F5F3FF,#FFFFFF)"
    : "#fff",

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 15px 35px rgba(0,0,0,.12)",
  },
});

const JoinSelector = ({ joinType, setJoinType }) => {
  return (
    <>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
      >
        Choose How You Want to Join
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
        Select your role to continue. Each role provides
        a personalized experience with tools specifically
        designed for teachers and students.
      </Typography>

      <Grid container spacing={4}>
        {/* Teacher Card */}

        <Grid size={{ xs:12, md:6 }}>
          <Paper
            elevation={0}
            sx={cardStyle(joinType === "teacher")}
            onClick={() => setJoinType("teacher")}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              mb={3}
            >
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  borderRadius: "50%",
                  bgcolor: "#7C3AED",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SchoolRoundedIcon
                  sx={{
                    color: "#fff",
                    fontSize: 34,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  Join as Teacher
                </Typography>

                <Typography color="text.secondary">
                  Educator Portal
                </Typography>
              </Box>
            </Stack>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Request access to your school's teaching
              workspace. Create quizzes, manage classes,
              monitor student progress, evaluate exams,
              and collaborate with school administrators.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              mb={3}
            >
              <Chip icon={<QuizRoundedIcon />} label="Create Quizzes" />
              <Chip icon={<GroupsRoundedIcon />} label="Manage Classes" />
              <Chip icon={<InsightsRoundedIcon />} label="Analytics" />
            </Stack>

            <Button
              fullWidth
              variant={
                joinType === "teacher"
                  ? "contained"
                  : "outlined"
              }
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {joinType === "teacher"
                ? "Teacher Selected"
                : "Join as Teacher"}
            </Button>
          </Paper>
        </Grid>

        {/* Student Card */}

        <Grid size={{ xs:12, md:6 }}>
          <Paper
            elevation={0}
            sx={cardStyle(joinType === "student")}
            onClick={() => setJoinType("student")}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              mb={3}
            >
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  borderRadius: "50%",
                  bgcolor: "#F97316",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PersonRoundedIcon
                  sx={{
                    color: "#fff",
                    fontSize: 34,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  Join as Student
                </Typography>

                <Typography color="text.secondary">
                  Student Portal
                </Typography>
              </Box>
            </Stack>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Join your school's learning environment to
              attempt quizzes, access study material,
              monitor grades, receive announcements,
              and track your academic performance.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              mb={3}
            >
              <Chip
                icon={<MenuBookRoundedIcon />}
                label="Study Material"
              />
              <Chip
                icon={<AssignmentTurnedInRoundedIcon />}
                label="Online Quizzes"
              />
              <Chip
                icon={<EmojiEventsRoundedIcon />}
                label="Track Progress"
              />
            </Stack>

            <Button
              fullWidth
              variant={
                joinType === "student"
                  ? "contained"
                  : "outlined"
              }
              color="warning"
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {joinType === "student"
                ? "Student Selected"
                : "Join as Student"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default JoinSelector;