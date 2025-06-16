import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashbaordComponents/dashboardlayout';
import Dashboard from '../pages/Dashboard';
import ManageQuizzes from '../components/Quizzes/MyQuizzes';
import CreactquizPage from '../components/Quizzes/createquiz';
import Privatequizresults from '../components/Results/privatequizresults';
import Profile from '../components/profile';
import Mystudents from '../components/DashbaordComponents/mystudents';
import JoinRequestsManager from '../components/DashbaordComponents/JoinRequestsManager';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="private-quizzes" element={<ManageQuizzes />} />
        <Route path="createquiz" element={<CreactquizPage />} />
        <Route path="private-results/:quizId" element={<Privatequizresults />} />
        <Route path="createquiz" element={<CreactquizPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-students" element={<Mystudents />} />
        <Route path="join-requests" element={<JoinRequestsManager />} />




      </Route>
    </Routes>
  );
};

export default DashboardRoutes;