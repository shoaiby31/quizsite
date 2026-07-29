import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Button, Avatar, Stack, IconButton, } from "@mui/material";
import { Add, SchoolRounded, GroupsRounded, QuizRounded, ApartmentRounded, MoreVertRounded, CalendarTodayOutlined, BarChartRounded, AddBoxRounded, WavingHandRounded, } from "@mui/icons-material";
import { collection, getCountFromServer, doc, getDoc, } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import FacultyCount from "../AdminComponents/FacultyCount";
import StudentsCount from "./StudentsCount";

const DashboardHeader = () => {
  const [classCount, setClassCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [userName, setUserName] = useState("Mr. Ahmed");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      if (user.displayName) {
        setUserName(user.displayName);
      }

      try {
        // Get logged-in user's role
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserRole(userData.role);
        }

        // Get classes count
        const classes = await getCountFromServer(
          collection(db, "classes")
        );

        // Get quizzes count
        const quizzes = await getCountFromServer(
          collection(db, "quizzes")
        );

        setClassCount(classes.data().count);
        setQuizCount(quizzes.data().count);
      } catch (err) {
        console.log(err);
      }
    });

    return () => unsub();
  }, []);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const day = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Stats cards
  const stats = [
    ...(userRole === "admin"
      ? [
          {
            title: "Total Teachers",
            value: <FacultyCount>{(count) => count}</FacultyCount>,
            subtitle: "+3 this month",
            icon: <GroupsRounded />,
            color: "#6C4AF8",
            bg: "#EFE9FF",
          },
        ]
      : []),

    {
      title: "Total Students",
      value: <StudentsCount>{(count) => count}</StudentsCount>,
      subtitle: "+45 this month",
      icon: <SchoolRounded />,
      color: "#EC4899",
      bg: "#FFE7F3",
    },
    {
      title: "Active Classes",
      value: classCount,
      subtitle: "12 grades",
      icon: <ApartmentRounded />,
      color: "#3B82F6",
      bg: "#E8F1FF",
    },
    {
      title: "Quizzes Taken",
      value: quizCount,
      subtitle: "This Year",
      icon: <QuizRounded />,
      color: "#F59E0B",
      bg: "#FFF2DE",
    },
  ];

  return (
    <Box
      sx={{
      px: { xs: 2, md: 3 }, py: 3, background: "#F7F8FC", }}
    >
      {/* ================= TOP SECTION ================= */}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", lg: "center" }, flexDirection: { xs: "column", lg: "row" }, gap: 3,}}>

        {/* Greeting */}

        <Box>
         <Typography sx={{ fontSize: { xs: 15, md: 20, lg:28, xl:32 }, fontWeight: 700, color: "#111827", lineHeight: 1.2, }}>
        Good Morning, {userName}

        <WavingHandRounded sx={{ ml: 1, color: "#FDBA21", fontSize: { xs: 15, md: 20, lg:26, xl:32}, verticalAlign: "middle",}}/>
      </Typography>

      <Typography sx={{ mt: .8, color: "#6B7280", fontSize: { xs: 12, md: 14, lg:16 } }}>
        Here's what's happening in your school today.
      </Typography>
        </Box>

        {/* Right Side */}

    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" >
    
          {/* Date */}

          <Stack direction="row" spacing={1} alignItems="center" mr={2}>
             <CalendarTodayOutlined sx={{ color: "#6B7280", fontSize: 16, }} />
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 600, }}>{formattedDate}</Typography>
          <Typography sx={{ fontSize: 10, color: "#6B7280", }}>{day}</Typography>
        </Box>
          </Stack>

 <Button startIcon={<Add />} size="small" variant="contained" sx={{ borderRadius: 3, px: 2, py: 1, textTransform: "none", fontWeight: 600, background: "linear-gradient(90deg,#EC3AA6,#6C4AF8)", "&:hover": { background: "linear-gradient(90deg,#EC3AA6,#6C4AF8)", }, }}>
        Add Teacher
      </Button>

      <Button startIcon={<AddBoxRounded />} size="small" variant="outlined" sx={{ borderRadius: 3, px: 2, py: 1, textTransform: "none", borderColor: "#E5E7EB", color: "#111827", }}>
        Create Class
      </Button>

      <Button startIcon={<BarChartRounded />} size="small" variant="outlined" sx={{ borderRadius: 3, px: 2, py: 1, textTransform: "none", borderColor: "#E5E7EB", color: "#111827", }}>
        View Reports
      </Button>
        </Stack>
      </Box>

      {/* ================= STATS ================= */}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((card) => (
         <Grid item size={{xs:12, sm: 6, lg: 3 }} key={card.title}>
        <Paper elevation={0}
          sx={{ p: 2.5, borderRadius: 4, border: "1px solid #ECECEC", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            boxShadow: "0  0px rgba(15,23,42,.05)", }}>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ width: {xs:62, md:42, lg:52, xl:62}, height: {xs:62, md:42, lg:52, xl:62}, bgcolor: card.bg, color: card.color,
                "& svg": { fontSize: 30,}, }}>{card.icon}</Avatar>

            <Box>
              <Typography sx={{ fontSize: 13, color: "#6B7280", }} >{card.title}</Typography>
              <Typography sx={{ mt: .3, fontWeight: 700, fontSize: 38, lineHeight: 1, color: "#111827", }} >{card.value}</Typography>
              <Typography sx={{ mt: 1, fontSize: 13, color: "#16A34A", }}>{card.subtitle}</Typography>
            </Box>
          </Stack>

          <IconButton size="small" >
            <MoreVertRounded sx={{ color: "#6B7280",}}/>
          </IconButton>
        </Paper>
      </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardHeader;