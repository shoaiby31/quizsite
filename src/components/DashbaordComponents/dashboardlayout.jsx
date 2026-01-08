import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import TopBar from "./topbar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import DashboardHeaderSkeleton from "./DashboardHeaderSkeleton";

const DashboardLayout = () => {
  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    schoolAddress: "",
    coverPhotoUrl: "",
  });
  const [loadingSchool, setLoadingSchool] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoadingSchool(false);
        return;
      }

      try {
        // 1️⃣ Get user profile
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (!userSnap.exists()) {
          setLoadingSchool(false);
          return;
        }

        const userData = userSnap.data();
        let schoolId = null;

        // 2️⃣ Resolve schoolId based on role
        if (userData.role === "admin") {
          schoolId = user.uid;
        }

        if (userData.role === "teacher") {
          // Find relation to get adminUid
          const q = query(
            collection(db, "teacherAdminRelations"),
            where("teacherUid", "==", user.uid)
          );
          const relSnap = await getDocs(q);
          if (!relSnap.empty) {
            schoolId = relSnap.docs[0].data().adminUid;
          }
        }

        if (!schoolId) {
          console.warn("No schoolId resolved for user:", user.uid);
          setLoadingSchool(false);
          return;
        }

        // 3️⃣ Fetch school document
        const schoolSnap = await getDoc(doc(db, "schools", schoolId));
        if (schoolSnap.exists()) {
          const data = schoolSnap.data();
          setSchoolData({
            schoolName: data.instituteName || "",
            schoolAddress: data.instituteAddress || "",
            coverPhotoUrl: data.coverPhotoUrl || "",
          });
        }
      } catch (err) {
        console.error("Error fetching school data:", err);
      } finally {
        setLoadingSchool(false);
      }
    });

    return () => unsub();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />

        <Box sx={{ position: "relative" }}>
          {loadingSchool ? (
            <DashboardHeaderSkeleton />
          ) : (
            <DashboardHeader
              schoolName={schoolData.schoolName}
              coverPhotoUrl={schoolData.coverPhotoUrl}
            />
          )}
        </Box>

        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
