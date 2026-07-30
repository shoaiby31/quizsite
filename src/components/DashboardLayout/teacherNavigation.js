import {
  DashboardRounded,
  GroupsRounded,
  QuizRounded,
  ClassRounded,
  AssessmentRounded,
  SettingsRounded,
  HowToRegRounded,
} from "@mui/icons-material";

export const teacherNavigation = [
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