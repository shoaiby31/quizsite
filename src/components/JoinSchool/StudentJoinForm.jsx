import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const StudentJoinForm = () => {
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    schoolId: "",
    rollNumber: "",
    className: "",
    section: "",
    address: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setMessage({
      type: "success",
      text: "Student form submitted successfully. Firebase integration will be added later.",
    });
  };

  return (
    <Box>
      {/* Header */}

      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Student Registration Request
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 650,
            mx: "auto",
            mt: 1,
            lineHeight: 1.8,
          }}
        >
          Join your school's SmartEducator workspace to access quizzes,
          assignments, learning resources, grades, and announcements.
        </Typography>
      </Box>

      {/* Information */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          bgcolor: "#FFF8F1",
          border: "1px solid #FFE0B2",
        }}
      >
        <Stack direction="row" spacing={2}>
          <InfoRoundedIcon color="warning" />

          <Box>
            <Typography fontWeight={700}>
              Before You Continue
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, lineHeight: 1.8 }}
            >
              • Get your School ID from your school administrator.
              <br />
              • Enter your correct Roll Number.
              <br />
              • Provide guardian information.
              <br />
              • Your request will be reviewed before approval.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Form */}

      <Card sx={{ borderRadius: 5 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
          >
            Student Details
          </Typography>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="School ID"
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="Class"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ClassRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupsRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="Guardian Name"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label="Guardian Phone"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FamilyRestroomRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={12}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={2}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip color="warning" label="Student Portal" />
                    <Chip label="Admin Approval" />
                    <Chip color="success" label="Secure Access" />
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    startIcon={<SendRoundedIcon />}
                    sx={{
                      px: 5,
                      py: 1.6,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    Send Join Request
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentJoinForm;