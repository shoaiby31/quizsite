import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControlLabel, Select,
  MenuItem, InputLabel, FormControl, Switch,
  Snackbar, Alert, Box, Typography, Checkbox
} from '@mui/material';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const EditQuizModal = ({ open, onClose, quiz, onQuizUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [secretIdError, setSecretIdError] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [values, setValues] = useState({
    title: '',
    description: '',
    tags: '',
    timeLimit: '',
    secretid: '',
    isActive: false,
    isPublic: true,
    class: '',
    questionTypes: {
      mcq: { enabled: false, count: '', timeLimit: '' },
      truefalse: { enabled: false, count: '', timeLimit: '' },
      short: { enabled: false, count: '', timeLimit: '', scorePerQuestion: '' },
    }
  });

  useEffect(() => {
    if (open && quiz) {
      setValues({
        title: quiz.title || '',
        description: quiz.description || '',
        tags: quiz.tags?.join(', ') || '',
        timeLimit: quiz.timeLimit || '',
        isActive: quiz.isActive || false,
        isPublic: quiz.isPublic || false,
        secretid: quiz.secretid || '',
        questionTypes: {
          mcq: {
            enabled: quiz.questionTypes?.mcq !== null && quiz.questionTypes?.mcq !== undefined,
            count: quiz.questionTypes?.mcq?.count?.toString() || '',
            timeLimit: quiz.questionTypes?.mcq?.timeLimit?.toString() || '',
          },
          truefalse: {
            enabled: quiz.questionTypes?.truefalse !== null && quiz.questionTypes?.truefalse !== undefined,
            count: quiz.questionTypes?.truefalse?.count?.toString() || '',
            timeLimit: quiz.questionTypes?.truefalse?.timeLimit?.toString() || '',
          },
          short: {
            enabled: quiz.questionTypes?.short !== null && quiz.questionTypes?.short !== undefined,
            count: quiz.questionTypes?.short?.count?.toString() || '',
            timeLimit: quiz.questionTypes?.short?.timeLimit?.toString() || '',
            scorePerQuestion: quiz.questionTypes?.short?.scorePerQuestion?.toString() || '',
          }
        }
      });
      setSelectedClass(quiz.class || '');
      setLoading(false);
      setDisable(false);
    }
  }, [open, quiz]);

  const resetForm = () => {
    setValues({
      title: '',
      description: '',
      tags: '',
      timeLimit: '',
      secretid: '',
      isActive: false,
      isPublic: true,
      class: '',
      questionTypes: {
        mcq: { enabled: false, count: '', timeLimit: '' },
        truefalse: { enabled: false, count: '', timeLimit: '' },
        short: { enabled: false, count: '', timeLimit: '', scorePerQuestion: '' },
      }
    });
    setDisable(true);
    setSecretIdError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const checkSecretIdDuplicate = async (newSecretId) => {
    if (!newSecretId.trim()) {
      setSecretIdError('Secret ID is required');
      return true;
    }

    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('secretid', '==', newSecretId.trim()));
    const snapshot = await getDocs(q);
    const duplicate = snapshot.docs.find(doc => doc.id !== quiz.id);

    if (duplicate) {
      setSecretIdError('This Secret ID is already in use.');
      return true;
    } else {
      setSecretIdError('');
      return false;
    }
  };

  const handleChange = async (e) => {
    setDisable(false);
    const { name, value, type, checked } = e.target;

    if (name.startsWith('questionTypes.')) {
      const [, qType, field] = name.split('.');
      setValues(prev => ({
        ...prev,
        questionTypes: {
          ...prev.questionTypes,
          [qType]: {
            ...prev.questionTypes[qType],
            [field]: field === 'count' || field === 'timeLimit' || field === 'scorePerQuestion' ? value : checked,
          }
        }
      }));
    } else {
      const val = type === 'checkbox' ? checked : value;
      setValues(prev => ({ ...prev, [name]: val }));

      if (name === 'secretid') {
        await checkSecretIdDuplicate(val);
      }

      if (name === 'isPublic' && value === true) {
        setSecretIdError('');
      }
    }
  };

  const getClassSuffix = (number) => {
    if (number === 1) return 'st';
    if (number === 2) return 'nd';
    if (number === 3) return 'rd';
    return 'th';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setLoading(true);

    try {
      // Secret ID validation
      if (!values.isPublic) {
        const isDuplicate = await checkSecretIdDuplicate(values.secretid);
        if (isDuplicate) {
          setLoading(false);
          return;
        }
      }

      // Validate enabled question types
      for (const [key, type] of Object.entries(values.questionTypes)) {
        if (type.enabled) {
          const count = Number(type.count);
          const tLimit = Number(type.timeLimit);
          if (!count || count < 1) {
            setSnackbar({
              open: true,
              message: `Please enter a valid count greater than 0 for ${key.toUpperCase()}`,
              severity: 'error'
            });
            setLoading(false);
            return;
          }
          if (!tLimit || tLimit < 1) {
            setSnackbar({
              open: true,
              message: `Please enter a valid time limit greater than 0 for ${key.toUpperCase()}`,
              severity: 'error'
            });
            setLoading(false);
            return;
          }
        }
      }

      const formattedQuestionTypes = {
        mcq: values.questionTypes.mcq.enabled
          ? { count: Number(values.questionTypes.mcq.count), timeLimit: Number(values.questionTypes.mcq.timeLimit) }
          : null,
        truefalse: values.questionTypes.truefalse.enabled
          ? { count: Number(values.questionTypes.truefalse.count), timeLimit: Number(values.questionTypes.truefalse.timeLimit) }
          : null,
        short: values.questionTypes.short.enabled
          ? {
            count: Number(values.questionTypes.short.count),
            timeLimit: Number(values.questionTypes.short.timeLimit),
            scorePerQuestion: Number(values.questionTypes.short.scorePerQuestion || 1) // fallback to 1 if empty
          }
          : null,
      };

      const updatedFields = {
        title: values.title,
        description: values.description,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        timeLimit: Number(values.timeLimit),
        isActive: values.isActive,
        isPublic: values.isPublic,
        secretid: values.isPublic ? '' : values.secretid.trim(),
        class: selectedClass,
        questionTypes: formattedQuestionTypes
      };

      const quizRef = doc(db, 'quizzes', quiz.id);
      await updateDoc(quizRef, updatedFields);

      onQuizUpdated({ ...quiz, ...updatedFields });
      setSnackbar({ open: true, message: 'Quiz updated successfully!', severity: 'success' });
      handleClose();
    } catch (error) {
      console.error('Failed to update quiz:', error);
      setSnackbar({ open: true, message: 'Failed to update quiz.', severity: 'error' });
      setLoading(false);
    } finally {
      setDisable(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Quiz</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField fullWidth margin="normal" size="small" required name="title" label="Title" value={values.title} onChange={handleChange} />
            <TextField fullWidth margin="normal" size="small" required name="description" label="Description" multiline rows={3} value={values.description} onChange={handleChange} />
            <TextField fullWidth margin="normal" size="small" required name="tags" label="Tags (comma separated)" value={values.tags} onChange={handleChange} />

            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                label="Class"
                onChange={e => setSelectedClass(Number(e.target.value))}
              >
                {[...Array(12)].map((_, i) => {
                  const classNum = i + 1;
                  return (
                    <MenuItem key={classNum} value={classNum}>
                      {`${classNum}${getClassSuffix(classNum)}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Box mt={2}>
              <FormControlLabel
                control={<Switch checked={values.isPublic} name="isPublic" onChange={handleChange} />}
                label="Public Quiz"
              />
            </Box>

            {!values.isPublic && (
              <TextField
                fullWidth
                margin="normal"
                size="small"
                name="secretid"
                label="Secret ID"
                value={values.secretid}
                onChange={handleChange}
                error={!!secretIdError}
                helperText={secretIdError}
                required
              />
            )}

            <Typography variant="subtitle1" mt={2} mb={1}>Question Types</Typography>
            {['mcq', 'truefalse', 'short'].map(type => (
              <Box key={type} display="flex" alignItems="center" mb={1} gap={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.questionTypes[type].enabled}
                      onChange={handleChange}
                      name={`questionTypes.${type}.enabled`}
                    />
                  }
                  label={type.toUpperCase()}
                />

                <TextField
                  label="Count"
                  type="number"
                  size="small"
                  name={`questionTypes.${type}.count`}
                  value={values.questionTypes[type].count}
                  onChange={handleChange}
                  disabled={!values.questionTypes[type].enabled}
                  inputProps={{ min: 0 }}
                  sx={{ width: 120 }}
                />

                <TextField
                  label="Time Limit (minutes)"
                  type="number"
                  size="small"
                  name={`questionTypes.${type}.timeLimit`}
                  value={values.questionTypes[type].timeLimit}
                  onChange={handleChange}
                  disabled={!values.questionTypes[type].enabled}
                  inputProps={{ min: 0 }}
                  sx={{ width: 160 }}
                />


                {type === 'short' && (
                  <TextField
                    type="number"
                    size="small"
                    name={`questionTypes.${type}.scorePerQuestion`}
                    label="Score per Question"
                    inputProps={{ min: 1 }}
                    value={values.questionTypes[type].scorePerQuestion}
                    onChange={handleChange}
                    disabled={!values.questionTypes[type].enabled}
                    sx={{ width: 160 }}
                  />
                )}


              </Box>
            ))}

            <FormControlLabel
              control={<Switch checked={values.isActive} name="isActive" onChange={handleChange} />}
              label="Is Active"
              sx={{ mt: 2 }}
            />
          </DialogContent>

          <DialogActions>
            <Button disabled={disable || loading} onClick={handleClose}>Cancel</Button>
            <Button disabled={disable || loading} type="submit" variant="contained" color="primary">
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditQuizModal;