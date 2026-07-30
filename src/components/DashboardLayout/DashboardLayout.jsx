import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../config/firebase";

import Sidebar from "./sidebar";
import TopBar from "./topbar";
import DashboardHeader from "./DashboardHeader";
import DashboardHeaderSkeleton from "./DashboardHeaderSkeleton";

const DashboardLayout = () => {
  const role = useSelector((state) => state.auth.role);

  const [loadingSchool, setLoadingSchool] = useState(true);

  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    schoolAddress: "",
    coverPhotoUrl: "",
  });

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        if (!auth.currentUser || !role) {
          setLoadingSchool(false);
          return;
        }

        let schoolUid = null;

        // Admin owns the school
        if (role === "admin") {
          schoolUid = auth.currentUser.uid;
        }

        // Teacher belongs to a school
        if (role === "teacher") {
          const relationQuery = query(
            collection(db, "teacherAdminRelations"),
            where("teacherUid", "==", auth.currentUser.uid)
          );

          const relationSnap = await getDocs(relationQuery);

          if (!relationSnap.empty) {
            schoolUid = relationSnap.docs[0].data().adminUid;
          }
        }

        if (!schoolUid) {
          console.warn("School UID could not be resolved.");
          return;
        }

        const schoolSnap = await getDoc(doc(db, "schools", schoolUid));

        if (!schoolSnap.exists()) return;

        const school = schoolSnap.data();

        setSchoolData({
          schoolName: school.instituteName || "",
          schoolAddress: school.instituteAddress || "",
          coverPhotoUrl: school.coverPhotoUrl || "",
        });
      } catch (error) {
        console.error("Error loading school:", error);
      } finally {
        setLoadingSchool(false);
      }
    };

    fetchSchool();
  }, [role]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <TopBar />

        {loadingSchool ? (
          <DashboardHeaderSkeleton />
        ) : (
          <DashboardHeader
            schoolName={schoolData.schoolName}
            coverPhotoUrl={schoolData.coverPhotoUrl}
          />
        )}

        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;