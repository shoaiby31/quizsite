import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, CircularProgress, Button, Grid,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotesIcon from '@mui/icons-material/Notes';
import LegendToggle from '@mui/icons-material/LegendToggle';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const typeInfo = {
  mcq: { label: 'MCQs', icon: <QuizIcon color="primary" /> },
  truefalse: { label: 'True/False', icon: <CheckCircleIcon color="success" /> },
  short: { label: 'Short Answer', icon: <NotesIcon color="warning" /> },
};

const PublicStartButtons = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { secretId } = location.state || {};

  const [firestoreUser, setFirestoreUser] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [questionTypes, setQuestionTypes] = useState({});
  const [attemptedSections, setAttemptedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setFirestoreUser({ ...docSnap.data(), uid: currentUser.uid });
          } else {
            setFirestoreUser(null);
          }
        });
        return () => unsubscribeUser();
      } else {
        setFirestoreUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!quizId) return;
    const docRef = doc(db, 'quizzes', quizId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const quiz = docSnap.data();
        setQuizData(quiz);
        setQuestionTypes(quiz.questionTypes || {});
      } else {
        console.error('Quiz not found');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [quizId]);

  useEffect(() => {
    if (!quizId || !firestoreUser?.uid) return;
    const attemptsRef = collection(db, 'attempts');
    const q = query(
      attemptsRef,
      where('quizId', '==', quizId),
      where('userId', '==', firestoreUser.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setAttemptedSections([]);
      } else {
        const data = querySnapshot.docs[0].data();
        const attempted = [];
        if (data.mcqsSubmitted) attempted.push('mcq');
        if (data.trueFalseSubmitted) attempted.push('truefalse');
        if (data.shortAnswersSubmitted) attempted.push('short');
        setAttemptedSections(attempted);
      }
      setAttemptsLoading(false);
    });
    return () => unsubscribe();
  }, [quizId, firestoreUser?.uid]);

  const handleStart = (type) => {
    const routes = {
      mcq: `/mcqs-test/${quizId}`,
      truefalse: `/true-false-test/${quizId}`,
      short: `/short-questions-test/${quizId}`,
    };

    if (routes[type]) {
      if (quizData?.isPublic) {
        navigate(routes[type], { state: { secretId } });
      } else {
        alert('This quiz is not public. You are not allowed to start it.');
      }
    } else {
      console.warn('Invalid question type:', type);
    }
  };

  if (loading || attemptsLoading || !firestoreUser) {
    return (
      <Box sx={{ width: '100%', minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const activeTypes = Object.entries(questionTypes)
    .filter(([_, config]) => config !== null)
    .map(([type]) => type);

  if (activeTypes.length === 0) {
    return <Typography>No active question types available.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Select a Section to Begin</Typography>
      <Grid container spacing={3}>
        {activeTypes.map((type) => {
          const config = questionTypes[type];
          const isAttempted = attemptedSections.includes(type);
          const { label, icon } = typeInfo[type] || {};

          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={type}>
              <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 3, opacity: isAttempted ? 0.6 : 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {icon}
                    <Typography variant="h6">{label || type}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {config.count} Questions • Time: {config.timeLimit} mins
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color={isAttempted ? 'secondary' : 'primary'}
                    onClick={() => handleStart(type)}
                    disabled={isAttempted}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    {isAttempted ? 'Attempted' : `Start ${label || type}`}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LegendToggle color="primary" />
                <Typography variant="body1">Detailed Result Card</Typography>
              </Box>
              <Button fullWidth variant="contained" color="primary"
                onClick={() => navigate(`/result-card/${quizId}`, { state: { uid: firestoreUser?.uid } })}
              >
                View Result
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PublicStartButtons;