import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Radio, RadioGroup, FormControl, FormControlLabel,
  FormLabel, Typography, Alert, CircularProgress, Paper, Tabs, Tab, Input, MenuItem, Select, LinearProgress
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Papa from 'papaparse';
import ViewQuestions from './viewquestions';

const AddQuestions = ({ id, title }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [questionType, setQuestionType] = useState('mcq');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState('');
  const [trueFalseAnswer, setTrueFalseAnswer] = useState('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [csvUploadWait, setCsvUploadWait] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
const [refreshKey, setRefreshKey] = useState(0);

  // Prevent page reload/close during CSV upload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (csvUploadWait) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [csvUploadWait]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex('');
    setTrueFalseAnswer('');
    setShortAnswer('');
    setQuestionType('mcq');
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!questionText.trim()) {
      setMessage({ type: 'error', text: 'Question text is required.' });
      return;
    }

    let questionData = {
      text: questionText,
      type: questionType,
      createdAt: serverTimestamp(),
    };

    if (questionType === 'mcq') {
      if (options.some((opt) => !opt.trim())) {
        setMessage({ type: 'error', text: 'All options must be filled out.' });
        return;
      }
      if (correctOptionIndex === '') {
        setMessage({ type: 'error', text: 'Please select the correct answer.' });
        return;
      }
      questionData.options = options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx.toString() === correctOptionIndex,
      }));
    } else if (questionType === 'truefalse') {
      if (trueFalseAnswer === '') {
        setMessage({ type: 'error', text: 'Please select True or False.' });
        return;
      }
      questionData.answer = trueFalseAnswer === 'true';
    } else if (questionType === 'short') {
      if (!shortAnswer.trim()) {
        setMessage({ type: 'error', text: 'Answer cannot be empty.' });
        return;
      }
      questionData.answer = shortAnswer.trim();
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'quizzes', id, 'questions'), questionData);
      resetForm();
      setMessage({ type: 'success', text: 'Question added successfully!' });
      setRefreshKey(prev => prev + 1); // 🔄 refresh questions
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

    setCsvUploadWait(true);
    setUploadProgress(0);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedData = results.data;
        try {
          for (let i = 0; i < parsedData.length; i++) {
            const row = parsedData[i];
            let questionData = {
              text: row.question,
              type: row.type,
              createdAt: serverTimestamp(),
            };

            if (row.type === 'mcq') {
              const optionsArray = [row.option1, row.option2, row.option3, row.option4];
              const correctIndex = parseInt(row.correctOptionIndex, 10);
              questionData.options = optionsArray.map((opt, idx) => ({
                text: opt,
                isCorrect: idx === correctIndex,
              }));
            } else if (row.type === 'truefalse') {
              questionData.answer = row.answer.toLowerCase() === 'true';
            } else if (row.type === 'short') {
              questionData.answer = row.answer.trim();
            }

            await addDoc(collection(db, 'quizzes', id, 'questions'), questionData);

            // Update progress
            setUploadProgress(Math.round(((i + 1) / parsedData.length) * 100));
          }
          setMessage({ type: 'success', text: 'CSV questions uploaded successfully!' });
          setRefreshKey(prev => prev + 1); // 🔄 refresh questions
        } catch (error) {
          console.error('Error uploading CSV questions:', error);
          setMessage({ type: 'error', text: 'Failed to upload CSV questions. Please try again.' });
        } finally {
          setCsvUploadWait(false);
          setUploadProgress(0);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV file:', error);
        setMessage({ type: 'error', text: 'Failed to parse CSV file. Please check the file format.' });
        setCsvUploadWait(false);
        setUploadProgress(0);
      },
    });
  };

  return (
    <Box my={3}>
    <ViewQuestions key={refreshKey} quizId={id} qtitle={title} />

      <Typography variant='h6' mb={2}>Add Questions</Typography>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ marginBottom: 2 }}>
          <Tab label="Manual Entry" />
          <Tab label="Upload CSV" />
        </Tabs>

        {/* Manual Entry Tab */}
        {tabIndex === 0 && (
          <Box component="form" onSubmit={handleManualSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Question Type</FormLabel>
              <Select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                <MenuItem value="mcq">MCQ</MenuItem>
                <MenuItem value="truefalse">True/False</MenuItem>
                <MenuItem value="short">Short Answer</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Question"
              size='small'
              fullWidth
              margin="normal"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />

            {questionType === 'mcq' && (
              <FormControl component="fieldset" margin="normal">
                <FormLabel>Options</FormLabel>
                <RadioGroup value={correctOptionIndex} onChange={(e) => setCorrectOptionIndex(e.target.value)}>
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
            )}

            {questionType === 'truefalse' && (
              <FormControl component="fieldset" margin="normal">
                <FormLabel>Answer</FormLabel>
                <RadioGroup value={trueFalseAnswer} onChange={(e) => setTrueFalseAnswer(e.target.value)} row>
                  <FormControlLabel value="true" control={<Radio />} label="True" />
                  <FormControlLabel value="false" control={<Radio />} label="False" />
                </RadioGroup>
              </FormControl>
            )}

            {questionType === 'short' && (
              <TextField
                label="Answer"
                size="small"
                fullWidth
                margin="normal"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                required
              />
            )}

            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>{message.text}</Alert>
            )}

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Adding...' : 'Add Question'}
              </Button>
            </Box>
          </Box>
        )}

        {/* CSV Upload Tab */}
        {tabIndex === 1 && (
          <Box>
            <Input type="file" accept=".csv" onChange={handleCsvFileChange} />
            <Button
              variant="contained"
              color="primary"
              disabled={csvUploadWait}
              onClick={handleCsvUpload}
              sx={{ mt: 2, mx: 1 }}
            >
              {csvUploadWait ? "Uploading File" : "Upload CSV"}
            </Button>

            {csvUploadWait && (
              <Box mt={2}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" align="center" mt={1}>{uploadProgress}%</Typography>
              </Box>
            )}

            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>{message.text}</Alert>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AddQuestions;
