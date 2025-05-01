import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, CircularProgress, TableHead, TableRow, Paper, Checkbox, TablePagination, Button, Box, Typography} from '@mui/material';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Adjust the import path based on your project structure

const ViewQuestions = ({ quizId, qtitle }) => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  // Fetch questions from Firestore
  useEffect(() => {
    setLoading(true)
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'quizzes', quizId, 'questions');
        const querySnapshot = await getDocs(questionsRef);
        const questionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionsData);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [quizId]);

  // Delete a single question
  const deleteQuestion = async (questionId) => {
    try {
      const questionRef = doc(db, 'quizzes', quizId, 'questions', questionId);
      await deleteDoc(questionRef);
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
      setSelected((prevSelected) => prevSelected.filter((id) => id !== questionId));
      console.log('Question deleted successfully.');
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Delete selected questions
  const deleteSelectedQuestions = async () => {
    try {
      const deletePromises = selected.map((questionId) =>
        deleteDoc(doc(db, 'quizzes', quizId, 'questions', questionId))
      );
      await Promise.all(deletePromises);
      setQuestions((prevQuestions) => prevQuestions.filter((q) => !selected.includes(q.id)));
      setSelected([]);
      console.log('Selected questions deleted successfully.');
    } catch (error) {
      console.error('Error deleting selected questions:', error);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = questions.map((q) => q.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questions.length) : 0;


 if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box sx={{ mt: 4 }} elevation={questions.length===0? 0 : 3}>
        {questions.length === 0 ?
          (<Typography variant="h6" align="center" gutterBottom>You haven't uploaded any question in {qtitle} Quiz.</Typography>)
          : 
      <Box>
        <Typography variant='h6' mb={2}>Exisitng Questions in {qtitle} Quiz</Typography>

      {selected.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="secondary" onClick={deleteSelectedQuestions}>Delete Selected</Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox color="primary" indeterminate={selected.length > 0 && selected.length < questions.length} checked={questions.length > 0 && selected.length === questions.length} onChange={handleSelectAllClick} inputProps={{'aria-label': 'select all questions',}}/>
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
                  <TableRow hover onClick={(event) => handleClick(event, q.id)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={q.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} inputProps={{'aria-labelledby': labelId}}/>
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row">{q.text}</TableCell>
                    <TableCell>
                      {q.options.map((opt, idx) => (
                        <Box key={idx}>
                          {opt.text} {opt.isCorrect ? '(Correct)' : ''}
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="text" size="small" onClick={() => deleteQuestion(q.id)}>Delete</Button>
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
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={questions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
      </Box>}
    </Box>
  );
};

export default ViewQuestions;