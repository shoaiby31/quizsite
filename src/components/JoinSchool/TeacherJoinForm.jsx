import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
// import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
// import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
// import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
// import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { auth, db } from "../../config/firebase";

import { onAuthStateChanged } from "firebase/auth";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import InputAdornment from "@mui/material/InputAdornment";
const TeacherJoinForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    institutePassword: "",
    secretCode: "",
    qualification: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo({
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setIsLoading(true);
  setMessage({
    type: "",
    text: "",
  });

  if (!userInfo) {
    setMessage({
      type: "error",
      text: "User not authenticated.",
    });
    setIsLoading(false);
    return;
  }

  const {
    institutePassword,
    secretCode,
    qualification,
    address,
    phone,
  } = formData;

  if (
    !institutePassword ||
    !secretCode ||
    !qualification ||
    !address ||
    !phone
  ) {
    setMessage({
      type: "error",
      text: "Please fill all fields.",
    });

    setIsLoading(false);
    return;
  }

  try {
    // Already registered?

    const relationQuery = query(
      collection(db, "teacherAdminRelations"),
      where("teacherEmail", "==", userInfo.email),
      where("institutePassword", "==", institutePassword)
    );

    const relationSnapshot = await getDocs(relationQuery);

    if (!relationSnapshot.empty) {
      setMessage({
        type: "info",
        text: "You are already registered in this school.",
      });

      setIsLoading(false);
      return;
    }

    // Pending request?

    const existingRequestQuery = query(
      collection(db, "teacherRequests"),
      where("email", "==", userInfo.email),
      where("institutePassword", "==", institutePassword)
    );

    const requestSnapshot = await getDocs(existingRequestQuery);

    if (!requestSnapshot.empty) {
      setMessage({
        type: "warning",
        text: "Your request is already pending. Please wait for approval.",
      });

      setIsLoading(false);
      return;
    }

    // Secret code already used?

    const secretUsedRelationQuery = query(
      collection(db, "teacherAdminRelations"),
      where("teacherSecretId", "==", secretCode)
    );

    const secretRelationSnap = await getDocs(
      secretUsedRelationQuery
    );

    if (!secretRelationSnap.empty) {
      setMessage({
        type: "warning",
        text:
          "This secret code is already taken. Please choose another one.",
      });

      setIsLoading(false);
      return;
    }

    // Secret code pending?

    const secretUsedRequestQuery = query(
      collection(db, "teacherRequests"),
      where("secretCode", "==", secretCode)
    );

    const secretRequestSnap = await getDocs(
      secretUsedRequestQuery
    );

    if (!secretRequestSnap.empty) {
      setMessage({
        type: "warning",
        text:
          "This secret code is already in use by another request.",
      });

      setIsLoading(false);
      return;
    }

    // Validate school

    const adminQuery = query(
      collection(db, "schools"),
      where("institutePassword", "==", institutePassword)
    );

    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      setMessage({
        type: "error",
        text: "Invalid School ID.",
      });

      setIsLoading(false);
      return;
    }

    const relationData = adminSnapshot.docs[0].data();

    const adminUid = relationData.schoolAdminUid;

    // Find school uid

    const schoolQuery = query(
      collection(db, "schools"),
      where("institutePassword", "==", institutePassword)
    );

    const schoolSnapshot = await getDocs(schoolQuery);

    if (schoolSnapshot.empty) {
      setMessage({
        type: "error",
        text: "Invalid School ID.",
      });

      setIsLoading(false);
      return;
    }

    const schoolUid = schoolSnapshot.docs[0].id;

    // Save Request

    await addDoc(
      collection(db, "teacherRequests"),
      {
        userUid: userInfo.uid,
        schoolAdminUid: adminUid,
        schoolUid: schoolUid,

        name: userInfo.name,
        email: userInfo.email,

        institutePassword,
        secretCode,
        qualification,
        address,
        phone,

        status: "pending",

        requestedAt: serverTimestamp(),
      }
    );

    setMessage({
      type: "success",
      text: "Join request sent successfully.",
    });

    setFormData({
      institutePassword: "",
      secretCode: "",
      qualification: "",
      address: "",
      phone: "",
    });
  } catch (error) {
    console.error(error);

    setMessage({
      type: "error",
      text: "Failed to send join request.",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box>

      {/* Header */}

      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
        >
          Teacher Registration Request
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 650,
            mx: "auto",
            lineHeight: 1.8,
          }}
        >
          Complete the form below to request access to your school's
          SmartEducator workspace. Your request will be reviewed by
          the school administrator before access is granted.
        </Typography>
      </Box>

      {/* Information Card */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          mb: 4,
          bgcolor: "#F8FAFC",
          border: "1px solid #E5E7EB",
        }}
      >
        <Stack direction="row" spacing={2}>
          <InfoRoundedIcon
            color="primary"
            sx={{ mt: .4 }}
          />

          <Box>

            <Typography
              fontWeight={700}
              gutterBottom
            >
              Before You Continue
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              • Obtain the School ID from your administrator.
              <br />
              • Create a unique Teacher Secret Code.
              <br />
              • Enter accurate qualification and contact details.
              <br />
              • Your request will remain pending until approved.
            </Typography>

          </Box>
        </Stack>
      </Paper>

      {/* Main Form */}

      <Card
        elevation={4}
        sx={{
          borderRadius: 5,
        }}
      >
        <CardContent sx={{ p: 4 }}>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mb={4}
          >
            <SchoolRoundedIcon color="primary" />

            <Typography
              variant="h5"
              fontWeight={700}
            >
              Teacher Details
            </Typography>
          </Stack>

          {message.text && (
            <Alert
              severity={message.type}
              sx={{ mb: 3 }}
            >
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
                  helperText="Provided by your administrator"
                  name="institutePassword"
                  value={formData.institutePassword}
                  onChange={handleChange}
                 InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <SchoolRoundedIcon color="action" />
    </InputAdornment>
  ),
}}
                />
              </Grid>

              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  fullWidth
                  required
                  label="Teacher Secret Code"
                  helperText="Choose a unique code"
                  name="secretCode"
                  value={formData.secretCode}
                  onChange={handleChange}
                 InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <SchoolRoundedIcon color="action" />
    </InputAdornment>
  ),
}}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  label="Qualification"
                  helperText="Example: BS Computer Science"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                 InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <SchoolRoundedIcon color="action" />
    </InputAdornment>
  ),
}}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                 InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <SchoolRoundedIcon color="action" />
    </InputAdornment>
  ),
}}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                 InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <SchoolRoundedIcon color="action" />
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
                  alignItems={{ xs: "start", md: "center" }}
                  spacing={2}
                >

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip label="Secure" color="primary" />
                    <Chip label="Admin Approval" />
                    <Chip label="Teacher Portal" color="success" />
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={
                      isLoading
                        ? <CircularProgress size={18} color="inherit" />
                        : <SendRoundedIcon />
                    }
                    sx={{
                      px: 5,
                      py: 1.6,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    {isLoading
                      ? "Sending Request..."
                      : "Send Join Request"}
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

export default TeacherJoinForm;