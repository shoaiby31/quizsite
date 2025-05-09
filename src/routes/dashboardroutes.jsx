import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashbaordComponents/dashboardlayout';
import Dashboard from '../pages/Dashboard';
import ManageQuizzes from '../components/Quizzes/userquizzes';
import Results from '../pages/ResultCard';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="quizzes" element={<ManageQuizzes />} />
        <Route path="results" element={<Results />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;