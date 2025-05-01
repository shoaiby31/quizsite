import React, { useState } from 'react';
import { Box, Button, TextField, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Typography, Alert, CircularProgress, Paper, Tabs, Tab, Input } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Ensure Firebase is initialized
import Papa from 'papaparse';
import ViewQuestions from './viewquestions';
const AddQuestions = ({ id, title }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  // const [questions, setQuestions] = useState([]);
  const [csvFile, setCsvFile] = useState(null);


 

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };



  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!questionText.trim()) {
      setMessage({ type: 'error', text: 'Question text is required.' });
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setMessage({ type: 'error', text: 'All options must be filled out.' });
      return;
    }
    if (correctOptionIndex === '') {
      setMessage({ type: 'error', text: 'Please select the correct answer.' });
      return;
    }
    setLoading(true);
    try {
      const questionData = {
        text: questionText,
        options: options.map((opt, idx) => ({
          text: opt,
          isCorrect: idx.toString() === correctOptionIndex,
        })),
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'quizzes', id, 'questions'), questionData);
      // Reset form
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex('');
      setMessage({ type: 'success', text: 'Question added successfully!' });
    } catch (error) {
      console.error('Error adding question:', error);
      setMessage({ type: 'error', text: 'Failed to add question. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      setMessage({ type: 'error', text: 'Please select a CSV file to upload.' });
      return;
    }
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedData = results.data;
        const batch = parsedData.map((row) => {
          const optionsArray = [row.option1, row.option2, row.option3, row.option4];
          const correctIndex = parseInt(row.correctOptionIndex, 10);
          return {
            text: row.question,
            options: optionsArray.map((opt, idx) => ({
              text: opt,
              isCorrect: idx === correctIndex,
            })),
            createdAt: serverTimestamp(),
          };
        });

        try {
          for (const question of batch) {
            await addDoc(collection(db, 'quizzes', id, 'questions'), question);
          }
          setMessage({ type: 'success', text: 'CSV questions uploaded successfully!' });
        } catch (error) {
          console.error('Error uploading CSV questions:', error);
          setMessage({ type: 'error', text: 'Failed to upload CSV questions. Please try again.' });
        }
      },
      error: (error) => {
        console.error('Error parsing CSV file:', error);
        setMessage({ type: 'error', text: 'Failed to parse CSV file. Please check the file format.' });
      },
    });
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box my={3}>
      <ViewQuestions quizId={id} qtitle={title} />

      <Paper elevation={3} sx={{ padding: 4 }}>
        
  



        <Box mt={2}>
          <Typography variant="h5" gutterBottom>Add Questions</Typography>
          <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ marginBottom: 2 }}>
            <Tab label="Manual Entry" />
            <Tab label="Upload CSV" />
          </Tabs>
        </Box>


        {tabIndex === 0 && (
          <Box component="form" onSubmit={handleManualSubmit} noValidate>
            <TextField
              label="Question"
              fullWidth
              margin="normal"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Options</FormLabel>
              <RadioGroup
                value={correctOptionIndex}
                onChange={(e) => setCorrectOptionIndex(e.target.value)}
              >
                {options.map((opt, idx) => (
                  <Box key={idx} display="flex" alignItems="center" mt={1}>
                    <FormControlLabel
                      value={idx.toString()}
                      control={<Radio required />}
                      label={`Option ${idx + 1}`}
                    />
                    <TextField
                      variant="outlined"
                      size="small"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      required
                      sx={{ ml: 2, flex: 1 }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>
                {message.text}
              </Alert>
            )}
            <Box mt={3}>
              <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
                {loading ? 'Adding...' : 'Add Question'}
              </Button>
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Input type="file" accept=".csv" onChange={handleCsvFileChange} />
            <Button variant="contained" color="primary" onClick={handleCsvUpload} sx={{ mt: 2 }}>
              Upload CSV
            </Button>
            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>
                {message.text}
              </Alert>
            )}
          </Box>
        )}


      </Paper>
    </Box >
  );
};

export default AddQuestions;