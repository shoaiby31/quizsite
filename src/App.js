import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import Homepage from "./pages/Homepage"
import Appbar from "./components/appbar"
import { Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { setDarkMode } from './redux/slices/theme/index'
import Signup from './components/signup';
import CreactquizPage from './pages/CreactquizPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Footer from './components/footer';
import BrowseQuizzes from './pages/QuizzesPage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import ResultCard from './pages/ResultCard';
import DashboardRoutes from './routes/dashboardroutes';
import Attemptprivatequiz from './components/Quizzes/Private-Test-Start-Buttons';
import AttemptMcqs from './components/Quizzes/PrivateTests/AttemptMcqs';
import AttemptTrueFalse from './components/Quizzes/PrivateTests/AttemptTrueFalse';


import JoinTeacherRequest from './components/JoinTeacherRequest';
import Profile from './components/profile';
import AdminRoute from './components/PrivateRoute/AdminRoute';

const AppRoutes = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Appbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/createquiz" element={<PrivateRoute><CreactquizPage /></PrivateRoute>} />
        <Route path="/browsequiz" element={<BrowseQuizzes />} />
        <Route path="/attemptQuiz/:quizId" element={<PrivateRoute><AttemptQuizPage /></PrivateRoute>} />
        <Route path="/result" element={<PrivateRoute><ResultCard /></PrivateRoute>} />
        <Route path="/dashboard/*" element={<AdminRoute><DashboardRoutes /></AdminRoute>} />
        <Route path="/start-test/:quizId" element={<Attemptprivatequiz />} />
        <Route path="/mcqs-test/:quizId" element={<PrivateRoute><AttemptMcqs /></PrivateRoute>} />
        <Route path="/true-false-test/:quizId" element={<PrivateRoute><AttemptTrueFalse /></PrivateRoute>} />

        
        <Route path="/join-teacher" element={<PrivateRoute><JoinTeacherRequest /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        

      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
};


function App() {
  const dispatch = useDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const themeMode = useSelector((state) => state.mode.value);

  useEffect(() => {
    if (prefersDarkMode) {
      dispatch(setDarkMode(prefersDarkMode));
    }
  }, [dispatch, prefersDarkMode]);

  const darkTheme = createTheme({
    palette: {
      mode: themeMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={0} sx={{ height: 'auto' }} square>
        <Router>
          <AppRoutes />
        </Router>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
