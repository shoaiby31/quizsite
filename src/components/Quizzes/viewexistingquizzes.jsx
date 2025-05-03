import React, { useEffect, useState } from 'react';
import {
  Typography, CircularProgress, Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AddQuestion from './addquestions';
import { onSnapshot } from 'firebase/firestore';

const ViewExistingQuizzes = ({userId}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quizid, setQuizid] = useState(null);
  const [quizTitle, setQuizTitle] = useState(null);

  useEffect(() => {
    if (!userId) return;
  
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('createdBy', '==', userId));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const quizzesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizzesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching quizzes:', error);
      setLoading(false);
    });
  
    return () => unsubscribe(); // cleanup on unmount
  }, [userId]);

  const ViewQuestions = (id, title) => {
    setQuizid(id);
    setQuizTitle(title);
  };

  const handleSelectAll = (event) => {
    setSelectedQuizzes(event.target.checked ? quizzes.map(q => q.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedQuizzes(prev =>
      prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirmed = async () => {
    try {
      for (const quizId of selectedQuizzes) {
        // Delete all questions in subcollection
        const questionsRef = collection(db, 'quizzes', quizId, 'questions');
        const questionsSnapshot = await getDocs(questionsRef);
        const deleteQuestions = questionsSnapshot.docs.map(docSnap =>
          deleteDoc(doc(db, 'quizzes', quizId, 'questions', docSnap.id))
        );
        await Promise.all(deleteQuestions);

        // Delete the quiz document itself
        await deleteDoc(doc(db, 'quizzes', quizId));
      }

      // Update UI
      setQuizzes(prev => prev.filter(q => !selectedQuizzes.includes(q.id)));
      setSelectedQuizzes([]);
      setConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting quiz or questions:', error);
    }
  };

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

      {selectedQuizzes.length > 0 && (
        <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)} sx={{ mb: 2 }}>
          Delete Selected
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table aria-label="quizzes table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedQuizzes.length === quizzes.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell align="right">Questions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedQuizzes.includes(quiz.id)}
                    onChange={() => handleSelectOne(quiz.id)}
                  />
                </TableCell>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>{quiz.createdAt?.seconds ? new Date(quiz.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{quiz.isPublic ? 'Public' : 'Private'}</TableCell>
                <TableCell align="right">
                  <Button variant="text" size="small" onClick={() => ViewQuestions(quiz.id, quiz.title)}>View / Add</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {quizid && <AddQuestion id={quizid} title={quizTitle} />}

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected {selectedQuizzes.length} quiz{selectedQuizzes.length > 1 ? 'zes' : ''} and all of their associated questions? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewExistingQuizzes;