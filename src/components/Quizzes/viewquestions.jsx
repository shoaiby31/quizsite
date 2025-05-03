import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, CircularProgress, TableHead,
  TableRow, Paper, Checkbox, TablePagination, Button, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ViewQuestions = ({ quizId, qtitle }) => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Fetch questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const questionsRef = collection(db, 'quizzes', quizId, 'questions');
        const querySnapshot = await getDocs(questionsRef);
        const questionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [quizId]);

  // Delete a single question
  const deleteQuestion = async (questionId) => {
    try {
      const questionRef = doc(db, 'quizzes', quizId, 'questions', questionId);
      await deleteDoc(questionRef);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setSelected((prev) => prev.filter((id) => id !== questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Delete selected questions
  const deleteSelectedQuestions = async () => {
    try {
      const deletePromises = selected.map((id) =>
        deleteDoc(doc(db, 'quizzes', quizId, 'questions', id))
      );
      await Promise.all(deletePromises);
      setQuestions((prev) => prev.filter((q) => !selected.includes(q.id)));
      setSelected([]);
    } catch (error) {
      console.error('Error deleting selected questions:', error);
    }
  };

  // Confirmation dialog handlers
  const handleOpenDeleteDialog = (questionId = null) => {
    if (questionId) {
      setQuestionToDelete(questionId);
      setDeleteMultiple(false);
    } else {
      setDeleteMultiple(true);
    }
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setQuestionToDelete(null);
    setDeleteMultiple(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteMultiple) {
      await deleteSelectedQuestions();
    } else if (questionToDelete) {
      await deleteQuestion(questionToDelete);
    }
    handleCloseDeleteDialog();
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = questions.map((q) => q.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questions.length) : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }} elevation={questions.length === 0 ? 0 : 3}>
      {questions.length === 0 ? (
        <Typography variant="h6" align="center" gutterBottom>
          You haven't uploaded any question in {qtitle} Quiz.
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" mb={2}>
            Existing Questions in {qtitle} Quiz
          </Typography>

          {selected.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenDeleteDialog()}
              >
                Delete Selected
              </Button>
            </Box>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < questions.length
                      }
                      checked={
                        questions.length > 0 &&
                        selected.length === questions.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all questions',
                      }}
                    />
                  </TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((q) => {
                    const isItemSelected = isSelected(q.id);
                    const labelId = `enhanced-table-checkbox-${q.id}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, q.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={q.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {q.text}
                        </TableCell>
                        <TableCell>
                          {q.options.map((opt, idx) => (
                            <Box key={idx}>
                              {opt.text} {opt.isCorrect ? '(Correct)' : ''}
                            </Box>
                          ))}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="text"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDialog(q.id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={questions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteMultiple
              ? 'Are you sure you want to delete the selected questions? This action cannot be undone.'
              : 'Are you sure you want to delete this question?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewQuestions;