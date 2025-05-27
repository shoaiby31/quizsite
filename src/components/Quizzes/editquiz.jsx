import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControlLabel, Select,
  MenuItem, InputLabel, FormControl, Switch,
  Snackbar, Alert
} from '@mui/material';
import {
  doc, updateDoc, collection, query, where, getDocs
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const EditQuizModal = ({ open, onClose, quiz, onQuizUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [secretIdError, setSecretIdError] = useState('');

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
  });

  useEffect(() => {
    if (quiz) {
      setValues({
        title: quiz.title || '',
        description: quiz.description || '',
        secretid: quiz.secretid || '',
        tags: quiz.tags?.join(', ') || '',
        timeLimit: quiz.timeLimit || 10,
        isActive: quiz.isActive || false,
        isPublic: quiz.isPublic ?? true,
      });
      setDisable(true);
      setSecretIdError('');
    }
  }, [quiz]);

  const resetForm = () => {
    setValues({
      title: '',
      description: '',
      tags: '',
      timeLimit: '',
      secretid: '',
      isActive: false,
      isPublic: true,
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
      return true; // Treat as error
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
    const val = type === 'checkbox' || type === 'switch' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: val,
    }));

    if (name === 'secretid') {
      await checkSecretIdDuplicate(val);
    }

    if (name === 'isPublic' && val === true) {
      setSecretIdError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setLoading(true);

    try {
      if (!values.isPublic) {
        const isDuplicate = await checkSecretIdDuplicate(values.secretid);
        if (isDuplicate) {
          setLoading(false);
          return;
        }
      }

      const updatedFields = {
        title: values.title,
        description: values.description,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        timeLimit: Number(values.timeLimit),
        isActive: values.isActive,
        isPublic: values.isPublic,
        secretid: values.isPublic ? '' : values.secretid.trim(),
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
            <TextField
              fullWidth margin="normal" size="small" required
              name="title" label="Title"
              value={values.title}
              onChange={handleChange}
            />

            <TextField
              fullWidth margin="normal" size="small" required
              name="description" label="Description"
              multiline rows={3}
              value={values.description}
              onChange={handleChange}
            />

            <TextField
              fullWidth margin="normal" size="small" required
              name="tags" label="Tags (comma separated)"
              value={values.tags}
              onChange={handleChange}
            />

            <TextField
              fullWidth margin="normal" size="small" required
              name="timeLimit" label="Time Limit (minutes)"
              type="number"
              value={values.timeLimit}
              onChange={handleChange}
            />

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel id="public-select-label">Visibility</InputLabel>
              <Select
                name="isPublic"
                labelId="public-select-label"
                value={values.isPublic}
                label="Visibility"
                onChange={handleChange}
              >
                <MenuItem value={true}>Public</MenuItem>
                <MenuItem value={false}>Private</MenuItem>
              </Select>
            </FormControl>

            {!values.isPublic && (
              <TextField
                fullWidth margin="normal" size="small" required
                name="secretid" label="Secret ID (for accessing private quiz)"
                value={values.secretid}
                onChange={handleChange}
                error={!!secretIdError}
                helperText={secretIdError || ' '}
              />
            )}

            <FormControlLabel
              name="isActive"
              control={
                <Switch
                  checked={values.isActive}
                  color="primary"
                  value={values.isActive}
                  onChange={handleChange}
                />
              }
              label={values.isActive ? 'Active:' : 'Inactive:'}
              labelPlacement="start"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                disable || loading || (!values.isPublic && !!secretIdError)
              }
            >
              {loading ? 'Please Wait...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditQuizModal;