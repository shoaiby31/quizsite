import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";

const teacherBenefits = [
  {
    icon: <QuizRoundedIcon color="primary" />,
    title: "Create Online Quizzes",
    description:
      "Design quizzes with multiple question types, timers, and instant evaluation.",
  },
  {
    icon: <GroupsRoundedIcon color="primary" />,
    title: "Manage Classes",
    description:
      "Organize classrooms, assign students, and manage academic activities efficiently.",
  },
  {
    icon: <AssessmentRoundedIcon color="primary" />,
    title: "Performance Reports",
    description:
      "Analyze quiz results and monitor student performance with visual reports.",
  },
  {
    icon: <SchoolRoundedIcon color="primary" />,
    title: "School Collaboration",
    description:
      "Work closely with school administrators and fellow teachers from one platform.",
  },
];

const studentBenefits = [
  {
    icon: <MenuBookRoundedIcon color="warning" />,
    title: "Access Learning Material",
    description:
      "Study course resources, announcements, and teacher-provided content anytime.",
  },
  {
    icon: <QuizRoundedIcon color="warning" />,
    title: "Attempt Online Quizzes",
    description:
      "Complete quizzes online with instant scoring and feedback after submission.",
  },
  {
    icon: <EmojiEventsRoundedIcon color="warning" />,
    title: "Track Your Progress",
    description:
      "Monitor grades, quiz history, achievements, and overall academic improvement.",
  },
  {
    icon: <AutoGraphRoundedIcon color="warning" />,
    title: "Performance Analytics",
    description:
      "View charts and statistics that help identify strengths and areas for improvement.",
  },
];

const JoinBenefits = () => {
  return (
    <Box>

      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        gutterBottom
      >
        Why Join SmartEducator?
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{
          mb: 6,
          maxWidth: 750,
          mx: "auto",
          lineHeight: 1.8,
        }}
      >
        SmartEducator brings teachers, students, and administrators
        together on one secure platform, making teaching and learning
        simpler, faster, and more engaging.
      </Typography>

      <Grid container spacing={4}>

        {/* Teacher */}

        <Grid size={{ xs:12, md:6 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 5,
              border: "1px solid #E5E7EB",
            }}
          >
            <CardContent sx={{ p: 4 }}>

              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                👨‍🏫 For Teachers
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Everything teachers need to efficiently manage
                classrooms, assessments, and student progress.
              </Typography>

              <Stack spacing={3}>
                {teacherBenefits.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        bgcolor: "#F3E8FF",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography
                        fontWeight={600}
                        gutterBottom
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

            </CardContent>
          </Card>
        </Grid>

        {/* Student */}

        <Grid size={{ xs:12, md:6 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 5,
              border: "1px solid #E5E7EB",
            }}
          >
            <CardContent sx={{ p: 4 }}>

              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                🎓 For Students
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Learn smarter with digital assessments,
                progress tracking, and interactive learning tools.
              </Typography>

              <Stack spacing={3}>
                {studentBenefits.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        bgcolor: "#FFF7ED",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography
                        fontWeight={600}
                        gutterBottom
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Bottom CTA */}

      <Card
        sx={{
          mt: 6,
          borderRadius: 5,
          background:
            "linear-gradient(135deg,#7C3AED,#9333EA,#A855F7)",
          color: "#fff",
        }}
      >
        <CardContent
          sx={{
            py: 5,
            px: { xs: 3, md: 6 },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={3}
            alignItems="center"
          >
            <Box>

              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
              >
                One Platform for Everyone
              </Typography>

              <Typography
                sx={{
                  opacity: .9,
                  maxWidth: 650,
                  lineHeight: 1.8,
                }}
              >
                SmartEducator helps schools manage teaching,
                learning, assessments, and academic collaboration
                through one secure cloud-based platform.
              </Typography>

            </Box>

            <SecurityRoundedIcon
              sx={{
                fontSize: 90,
                opacity: .15,
              }}
            />

          </Stack>
        </CardContent>
      </Card>

    </Box>
  );
};

export default JoinBenefits;