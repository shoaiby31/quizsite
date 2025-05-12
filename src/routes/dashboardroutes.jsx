import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashbaordComponents/dashboardlayout';
import Dashboard from '../pages/Dashboard';
import ManageQuizzes from '../components/Quizzes/userquizzes';
import CreactquizPage from '../components/Quizzes/createquiz';
import Privatequizresults from '../components/Results/privatequizresults';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="quizzes" element={<ManageQuizzes />} />
        <Route path="createquiz" element={<CreactquizPage />} />
        <Route path="private-results/:quizId/:timeLimit" element={<Privatequizresults />} />

      </Route>
    </Routes>
  );
};

export default DashboardRoutes;