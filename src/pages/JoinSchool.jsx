import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Stack,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import JoinSelector from "../components/JoinSchool/JoinSelector";
import TeacherJoinForm from "../components/JoinSchool/TeacherJoinForm";
import StudentJoinForm from "../components/JoinSchool/StudentJoinForm";
import JoinSteps from "../components/JoinSchool/JoinSteps";
import JoinBenefits from "../components/JoinSchool/JoinBenefits";
import HelpCard from "../components/JoinSchool/HelpCard";

const JoinSchool = () => {
  const [joinType, setJoinType] = useState("teacher");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* ---------------- Hero ---------------- */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          background:
            "linear-gradient(135deg,#7C3AED 0%, #8B5CF6 45%, #A855F7 100%)",
          color: "#fff",
          p: { xs: 4, md: 7 },
          mb: 5,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
        >
          Join Your School
        </Typography>

        <Typography
          sx={{
            maxWidth: 700,
            opacity: .92,
            lineHeight: 1.8,
            mb: 4,
            fontSize: "1.05rem",
          }}
        >
          Become a part of your school's SmartEducator workspace.
          Join as a Teacher or Student to access quizzes,
          classrooms, academic resources, performance reports,
          and collaboration tools.
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            icon={<VerifiedUserRoundedIcon />}
            label="Secure Verification"
            sx={{ bgcolor: "rgba(255,255,255,.15)", color: "#fff" }}
          />

          <Chip
            icon={<SecurityRoundedIcon />}
            label="Admin Approval"
            sx={{ bgcolor: "rgba(255,255,255,.15)", color: "#fff" }}
          />

          <Chip
            icon={<SchoolRoundedIcon />}
            label="School Access"
            sx={{ bgcolor: "rgba(255,255,255,.15)", color: "#fff" }}
          />

          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="Smart Learning"
            sx={{ bgcolor: "rgba(255,255,255,.15)", color: "#fff" }}
          />
        </Stack>
      </Paper>

      {/* -------- Teacher / Student Selector ------- */}

      <JoinSelector
        joinType={joinType}
        setJoinType={setJoinType}
      />

      {/* ---------------- Form ---------------- */}

      <Box mt={5}>
        {joinType === "teacher" ? (
          <TeacherJoinForm />
        ) : (
          <StudentJoinForm />
        )}
      </Box>

      {/* ---------- Steps ---------- */}

      <Box mt={8}>
        <JoinSteps />
      </Box>

      {/* ---------- Benefits ---------- */}

      <Box mt={8}>
        <JoinBenefits />
      </Box>

      {/* ---------- Help ---------- */}

      <Box mt={8}>
        <HelpCard />
      </Box>

    </Container>
  );
};

export default JoinSchool;