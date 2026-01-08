import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashbaordComponents/dashboardlayout';
import Dashboard from '../pages/Dashboard';
import ManageQuizzes from '../components/Quizzes/MyQuizzes';
import CreactquizPage from '../components/Quizzes/createquiz';
import Privatequizresults from '../components/Results/privatequizresults';
import Profile from '../components/profile';
import Mystudents from '../components/FacultyComponents/mystudents';
import StudentRequestsManager from '../components/FacultyComponents/StudentsJoiningRequests';
import TeacherRequestsManager from '../components/DashbaordComponents/TeachersJoiningRequests';
import MyFacultyMembers from '../components/AdminComponents/FacultyMembers';

import AdminRoute from '../components/PrivateRoute/AdminRoute';
import TeacherRoute from '../components/PrivateRoute/TeacherRoute';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={ <AdminRoute allowedRoles={['admin', 'teacher']}><DashboardLayout /></AdminRoute> }>

        {/* Shared: admin + teacher */}
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Teacher only */}
        <Route path="private-quizzes" element={<TeacherRoute><ManageQuizzes /></TeacherRoute>} />
        <Route path="createquiz" element={<TeacherRoute><CreactquizPage /></TeacherRoute>} />
        <Route path="private-results/:quizId" element={<TeacherRoute><Privatequizresults /></TeacherRoute>} />
        <Route path="my-students" element={<TeacherRoute><Mystudents /></TeacherRoute>} />
        <Route path="students-requests" element={<TeacherRoute><StudentRequestsManager /></TeacherRoute>} />

        {/* Admin only */}
        <Route path="faculty-requests" element={<AdminRoute allowedRoles={['admin']}><TeacherRequestsManager /></AdminRoute>} />
        <Route path="faculty-members" element={<AdminRoute allowedRoles={['admin']}><MyFacultyMembers /></AdminRoute>} />

      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
