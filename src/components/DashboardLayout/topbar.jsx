import React from "react";
import { AppBar, Toolbar, Box, Typography, Avatar, IconButton, InputBase, Paper, useTheme, useMediaQuery, } from "@mui/material";
import { MenuRounded, SearchRounded, KeyboardArrowDownRounded, } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setdrawerState } from "../../redux/slices/drawerSlice";
import NotificationBell from "./NotificationBell";

const TopBar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.auth.displayName) || "Undefined";

  const userRole = useSelector((state) => state.auth.role);

  return (
    <AppBar position="sticky" elevation={0}
      sx={{ bgcolor: "#fff", borderBottom: "1px solid #F1F1F4", color: "#111827", zIndex: (theme) => theme.zIndex.drawer + 1,}}>
      <Toolbar sx={{ height: 78, minHeight: "78px !important", px: { xs: 2, md: 3 }, }} >
        {/* LEFT - MENU */}
        <IconButton onClick={() => dispatch(setdrawerState())} sx={{ width: 44, height: 44, borderRadius: 2, color: "#111827", mr: 2, "&:hover": {bgcolor: "#F7F7FB",}, }} >
          <MenuRounded sx={{ fontSize: 26 }} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* CENTER - SEARCH */}
        {isDesktop && (
          <Paper elevation={0} sx={{width: 290,height: 42,borderRadius: "14px",border: "1px solid #ECECF3",display: "flex",alignItems: "center",px: 1.8,mr: 3,bgcolor: "#fff", "&:hover": { borderColor: "#E0E0EA",}, "&:focus-within": { borderColor: "#8B5CF6", boxShadow: "0 0 0 3px rgba(139,92,246,.08)", }, }} >
            <SearchRounded sx={{ color: "#6B7280", fontSize: 20, mr: 1.2, }} />
            <InputBase placeholder="Search anything..." sx={{ flex: 1, fontSize: 14, color: "#111827", "& input::placeholder": { color: "#9CA3AF", opacity: 1, }, }} />
          </Paper>
        )}

        {/* RIGHT - NOTIFICATION */}
       <NotificationBell />

        {/* USER PROFILE */}
        <Box
          sx={{ display: "flex", alignItems: "center", pl: 2, borderLeft: "1px solid #F1F1F4", cursor: "pointer", }} >
          <Avatar sx={{ width: 44, height: 44, mr: 1.5, fontWeight: 700, background: "linear-gradient(135deg,#ec3aa6,#6b46ff)", }} >
            {userName.charAt(0).toUpperCase()}
          </Avatar>

          {isDesktop && (
            <>
              <Box sx={{ mr: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, color: "#111827", }}> {userName} </Typography>

                <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.2, }} > {userRole === "admin" ? "Principal" : "Teacher"}</Typography>
              </Box>

              <KeyboardArrowDownRounded sx={{ color: "#6B7280", fontSize: 22, }} />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;