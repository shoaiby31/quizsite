import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AddQuestion from './addquestions';

const ViewExistingQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.uid);
  const [quizid, setQuizid] = useState(null);
  const [quizTitle, setQuizTitle] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesRef = collection(db, 'quizzes');
        const q = query(quizzesRef, where('createdBy', '==', userId));
        const querySnapshot = await getDocs(q);

        const quizzesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [isAuthenticated, userId, navigate]);

  const ViewQuestions = (id, title) => {
    setQuizid(id)
    setQuizTitle(title)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        You haven't created any quizzes yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='h6' mb={2}>Your Existing Quizzes</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="quizzes table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell align="right">Questions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell component="th" scope="row">{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>{quiz.createdAt?.seconds ? new Date(quiz.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell><Typography>{quiz.isPublic ? 'Public' : 'Private'}</Typography></TableCell>
                <TableCell align="right">
                  <Button variant="text" size="small" onClick={() => ViewQuestions(quiz.id, quiz.title)}>View / Add</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {quizid && (<AddQuestion id={quizid} title={quizTitle} />)}

    </Box>

  );
};

export default ViewExistingQuizzes;