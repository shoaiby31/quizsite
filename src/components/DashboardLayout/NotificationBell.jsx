import React, { useEffect, useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  Divider,
  Button,
  MenuItem,
} from "@mui/material";
import { NotificationsNoneRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { auth, db } from "../../config/firebase";
import NotificationItem from "./NotificationItem";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  acceptStudentRequest,
  denyStudentRequest,
} from "../FacultyComponents/studentRequests.service";

import {
  approveTeacherRequest,
  denyTeacherRequest,
} from "../AdminComponents/AcceptRequests.service";
const NotificationBell = () => {
  const navigate = useNavigate();

  const role = useSelector((state) => state.auth.role);

  const [requests, setRequests] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  useEffect(() => {
    if (!auth.currentUser || !role) return;

    let q;

    if (role === "teacher") {
      q = query(
        collection(db, "joinRequests"),
        where("teacherUid", "==", auth.currentUser.uid),
        where("status", "==", "pending")
      );
    } else if (role === "admin") {
      q = query(
        collection(db, "teacherRequests"),
        where("schoolAdminUid", "==", auth.currentUser.uid),
        where("status", "==", "pending")
      );
    } else {
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(data);
    });

    return unsubscribe;
  }, [role]);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (request) => {
    try {
      setLoadingId(request.id);

      if (role === "teacher") {
        await acceptStudentRequest(request, auth.currentUser.uid);
      } else {
        await approveTeacherRequest(request, auth.currentUser.uid);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (request) => {
    try {
      setLoadingId(request.id);

      if (role === "teacher") {
        await denyStudentRequest(request.id);
      } else {
        await denyTeacherRequest(request.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          color: "#111827",
          mr: 2,
          "&:hover": {
            bgcolor: "#F7F7FB",
          },
        }}
      >
        <Badge
          badgeContent={requests.length}
          sx={{
            "& .MuiBadge-badge": {
              background: "#EC4899",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              minWidth: 18,
              height: 18,
              borderRadius: "999px",
              border: "2px solid #fff",
            },
          }}
        >
          <NotificationsNoneRounded sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            borderRadius: 3,
            mt: 1.5,
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Notifications
          </Typography>
        </Box>

        <Divider />

        {/* Notifications */}
        {requests.length === 0 ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#6B7280",
                fontSize: 14,
              }}
            >
              No pending requests
            </Typography>
          </Box>
        ) : (
          <Box>
            
                <Box >
                  {requests.slice(0, 3).map((request) => (
                    <MenuItem
                      key={role === "teacher" ? request.studentId : request.userUid}
                      disableRipple
                      disableTouchRipple
                      sx={{
                        p: 0,
                        display: "block",
                        "&:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <NotificationItem
                        name={
                          role === "teacher"
                            ? request.studentName
                            : request.name
                        }
                        className={
                          role === "teacher"
                            ? `Class: ${request.className}`
                            : `Degree: ${request.qualification}`
                        }
                        rollNo={
                          role === "teacher"
                            ? `Roll No: ${request.rollNo}`
                            : ""
                        }
                        avatar={
                          role === "teacher"
                            ? request.studentPhotoURL
                            : request.teacherPhotoURL
                        }
                        message={
                          role === "teacher"
                            ? "requested to join your class."
                            : "requested to join your school."
                        }
                        loading={loadingId === request.id}
                        onAccept={() => handleAccept(request)}
                        onReject={() => handleReject(request)}
                      />
                    </MenuItem>
                  ))}


                  <Box p={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                      onClick={() => {
                        handleClose();

                        navigate(
                          role === "teacher"
                            ? "/dashboard/students-requests"
                            : "/dashboard/faculty-requests"
                        );
                      }}
                    >
                      View All Requests
                    </Button>
                  </Box>
                </Box>
             
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;