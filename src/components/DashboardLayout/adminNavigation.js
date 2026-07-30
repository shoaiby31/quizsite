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
} from "@mui/icons-material";

export const adminNavigation = [
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