import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  Button,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  DashboardRounded,
  SchoolRounded,
  GroupsRounded,
  ClassRounded,
  QuizRounded,
  AssessmentRounded,
  CampaignRounded,
  SettingsRounded,
  HowToRegRounded,
  WorkspacePremiumRounded,
  KeyboardArrowDownRounded,
  LogoutRounded,
} from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setdrawerState } from "../../redux/slices/drawerSlice";
import Logo from "../../assets/logo.png";
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { clearUser } from '../../redux/slices/authSlice';
const Sidebar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mobileDrawerOpen = useSelector(
    (state) => state.drawer.value
  );

  const userRole = useSelector(
    (state) => state.auth.role
  );

  const userName =
    useSelector((state) => state.auth.displayName) ||
    "Mr. Ahmed";
  // const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = 270;

  const adminItems = [
    {
      label: "Dashboard",
      icon: <DashboardRounded />,
      path: "/dashboard",
    },
    {
      label: "Teachers",
      icon: <SchoolRounded />,
      path: "/dashboard/faculty-members",
    },
    {
      label: "Students",
      icon: <GroupsRounded />,
      path: "/dashboard/students",
    },
    {
      label: "Classes",
      icon: <ClassRounded />,
      path: "/dashboard/classes",
    },
    {
      label: "Quizzes",
      icon: <QuizRounded />,
      path: "/dashboard/quizzes",
    },
    {
      label: "Reports",
      icon: <AssessmentRounded />,
      path: "/dashboard/reports",
    },
    {
      label: "Join Requests",
      icon: <HowToRegRounded />,
      path: "/dashboard/faculty-requests",
      badge: 5,
    },
    {
      label: "Announcements",
      icon: <CampaignRounded />,
      path: "/dashboard/announcements",
    },
    {
      label: "Settings",
      icon: <SettingsRounded />,
      path: "/dashboard/settings",
    },
  ];

  const teacherItems = [
    {
      label: "Dashboard",
      icon: <DashboardRounded />,
      path: "/dashboard",
    },
    {
      label: "Students",
      icon: <GroupsRounded />,
      path: "/dashboard/my-students",
    },
    {
      label: "My Quizzes",
      icon: <QuizRounded />,
      path: "/dashboard/private-quizzes",
    },
    {
      label: "Create Quiz",
      icon: <ClassRounded />,
      path: "/dashboard/createquiz",
    },
    {
      label: "Requests",
      icon: <HowToRegRounded />,
      path: "/dashboard/students-requests",
    },
    {
      label: "Reports",
      icon: <AssessmentRounded />,
      path: "/dashboard/reports",
    },
    {
      label: "Settings",
      icon: <SettingsRounded />,
      path: "/dashboard/settings",
    },
  ];

  const navItems = userRole === "admin" ? adminItems : teacherItems;

  const handleLogout = async () => {
      try {
        await signOut(auth);
        dispatch(clearUser());
      } catch (error) {
        console.error('Logout error', error);
      }
    };
  
  return (<Drawer
    variant={isDesktop ? "permanent" : "temporary"}
    open={isDesktop ? true : mobileDrawerOpen}
    onClose={() => dispatch(setdrawerState())}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      width: drawerWidth,
      flexShrink: 0,

      "& .MuiDrawer-paper": {
        width: drawerWidth,
        border: "none",
        overflowX: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 12px 40px rgba(0,0,0,.08)",
      },
    }}
  >
    {/* HEADER */}

    <Box
      sx={{
        px: 2.2,
        py: 2.2,
        background:
          "linear-gradient(135deg,#ec3aa6 0%,#6b46ff 100%)",
        color: "#fff",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <Avatar
          src={Logo}
          onClick={() => navigate("/")}
          sx={{
            width: 38,
            height: 38,
            bgcolor: "#fff",
            cursor: "pointer",
          }}
        />

        <Box ml={1.4}>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            SmartEducator
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              opacity: .85,
              mt: .3,
            }}
          >
            School Management
          </Typography>
        </Box>
        {/* {isDesktop && (
      <Box display="flex" justifyContent={
        collapsed ? "center" : "flex-end"} p={1} >
        <IconButton onClick={() => setCollapsed(!collapsed)}
          sx={{ bgcolor: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,.12)", "&:hover": { bgcolor: "#fafafa", }, }} >
          {collapsed ? (<ChevronRightRounded />) : (<ChevronLeftRounded />)}
        </IconButton>
      </Box>
    )} */}
      </Box>
    </Box>
    
    {/* MENU */}

    <List
      sx={{
        px: 1.5,
        py: 1.5,
      }}
    >
      {navItems.map((item) => (
        <ListItemButton
          key={item.label}
          component={NavLink}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={() => {
            if (!isDesktop) dispatch(setdrawerState());
          }}
          sx={{
            height: 42,
            mb: .5,
            px: 1.8,
            borderRadius: "12px",
            color: "#333",

            "& .MuiListItemIcon-root": {
              minWidth: 30,
              color: "#666",

              "& svg": {
                fontSize: 18,
              },
            },

            "& .MuiTypography-root": {
              fontSize: 13,
              fontWeight: 500,
            },

            "&.active": {
              background:
                "linear-gradient(90deg,#ec3aa6,#6b46ff)",

              color: "#fff",

              "& .MuiListItemIcon-root": {
                color: "#fff",
              },
            },

            "&:hover": {
              background: "#f5f2ff",
            },
          }}
        >
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ListItemText
              primary={item.label}
            />

            {item.badge && (
              <Badge
                badgeContent={item.badge}
                color="secondary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#ff2d8d",
                    color: "#fff",
                  },
                }}
              />
            )}
          </Box>
        </ListItemButton>
      ))}
    </List>

    <Box sx={{ flexGrow: 1 }} />

    <Divider
      sx={{
        borderColor: "#efefef",
      }}
    />
    {/* USER SECTION */}

    <Box
      sx={{
        px: 2,
        py: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              fontSize: 15,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#ec3aa6,#6b46ff)",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>

          <Box ml={1.2}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {userName}
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#8b8b8b",
              }}
            >
              {userRole === "admin"
                ? "Principal"
                : "Teacher"}
            </Typography>
          </Box>
        </Box>

        <KeyboardArrowDownRounded
          sx={{
            color: "#777",
            fontSize: 20,
          }}
        />
      </Box>
    </Box>

    {/* LOGOUT */}

    <List
      sx={{
        px: 1.5,
        pb: 1.5,
      }}
    >
      <ListItemButton
        onClick={handleLogout}
        sx={{
          height: 42,
          borderRadius: "12px",

          "&:hover": {
            background: "#f5f2ff",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 30,
            color: "#666",

            "& svg": {
              fontSize: 18,
            },
          }}
        >
          <LogoutRounded />
        </ListItemIcon>

        <ListItemText
          primary="Logout"
          primaryTypographyProps={{
            fontSize: 13,
            fontWeight: 500,
          }}
        />
      </ListItemButton>
    </List>

    {/* PREMIUM CARD */}

    <Box
      sx={{
        px: 1.5,
        pb: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #ececec",
          p: 2,
          boxShadow: "none",
        }}
      >
        <WorkspacePremiumRounded
          sx={{
            color: "#F6B100",
            fontSize: 26,
          }}
        />

        <Typography
          sx={{
            mt: 1,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Upgrade to Premium
        </Typography>

        <Typography
          sx={{
            mt: .5,
            fontSize: 11,
            color: "#888",
          }}
        >
          Unlock more features
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 12,
            background:
              "linear-gradient(90deg,#ec3aa6,#6b46ff)",

            "&:hover": {
              background:
                "linear-gradient(90deg,#ec3aa6,#6b46ff)",
            },
          }}
        >
          Upgrade Now
        </Button>
      </Card>
    </Box>

  </Drawer>
  );
};

export default Sidebar;