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
import GeneralRoute from './components/PrivateRoute/GeneralRoute'
import Footer from './components/footer';
import BrowseQuizzes from './pages/QuizzesPage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import ResultCard from './pages/ResultCard';
import DashboardRoutes from './routes/dashboardroutes';
import Attemptprivatequiz from './components/Quizzes/PrivateTests/Private-Test-Start-Buttons';
import Attemptpublicquiz from './components/Quizzes/PublicTests/Public-Test-Start-Buttons';

import AttemptMcqs from './components/Quizzes/PrivateTests/AttemptMcqs';
import AttemptTrueFalse from './components/Quizzes/PrivateTests/AttemptTrueFalse';
import AttemptShortAnswers from './components/Quizzes/PrivateTests/AttemptShortAnswers';

import UpgradeAccount from './components/UpgradeAccount';
import Profile from './components/profile';
import MyTeachers from './components/MyTeachers';
import JoinTeacher from './components/FacultyComponents/JoinTeacher';
import JoinAdmin from './components/AdminComponents/JoinAdmin';


import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { setUser } from './redux/slices/authSlice';

const AppRoutes = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            role: userData.role,
            displayName: userData.displayName,
            // ...any other data
          }));
        }
      } else {
        // Optionally dispatch logout/reset
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {!isDashboard && <Appbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/createquiz" element={<GeneralRoute><CreactquizPage /></GeneralRoute>} />
        <Route path="/browsequiz" element={<BrowseQuizzes />} />
        <Route path="/attemptQuiz/:quizId" element={<GeneralRoute><AttemptQuizPage /></GeneralRoute>} />
        <Route path="/result-card/:quizId" element={<GeneralRoute><ResultCard /></GeneralRoute>} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="/start-test/:quizId" element={<GeneralRoute><Attemptprivatequiz /></GeneralRoute>} />
        <Route path="/start-public-test/:quizId" element={<GeneralRoute PrivateRoute><Attemptpublicquiz /></GeneralRoute>} />
        <Route path="/mcqs-test/:quizId" element={<GeneralRoute><AttemptMcqs /></GeneralRoute>} />
        <Route path="/true-false-test/:quizId" element={<GeneralRoute><AttemptTrueFalse /></GeneralRoute>} />
        <Route path="/short-questions-test/:quizId" element={<GeneralRoute><AttemptShortAnswers /></GeneralRoute>} />
        <Route path="/my-teachers" element={<GeneralRoute><MyTeachers /></GeneralRoute>} />
        {/* <Route path="/typing-practice" element={<TypingPractice />} /> */}

        
        <Route path="/upgrade-account" element={<GeneralRoute><UpgradeAccount /></GeneralRoute>} />
        <Route path="/join-admin" element={<GeneralRoute><JoinAdmin /></GeneralRoute>} />
        <Route path="/join-teacher" element={<GeneralRoute><JoinTeacher /></GeneralRoute>} />
        <Route path="/profile" element={<GeneralRoute><Profile /></GeneralRoute>} />
        

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
