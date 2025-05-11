import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControlLabel, Select,
  MenuItem, InputLabel, FormControl,
  Switch
} from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const EditQuizModal = ({ open, onClose, quiz, onQuizUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);

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
        isPublic: quiz.isPublic || false,
      });
      setDisable(true);
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
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    setDisable(false);
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'switch' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true)
    setLoading(true);
    try {
      const updatedFields = {
        title: values.title,
        description: values.description,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        timeLimit: Number(values.timeLimit),
        isActive: values.isActive,
        isPublic: values.isPublic,
        secretid: values.isPublic ? '' : values.secretid,
      };

      const quizRef = doc(db, 'quizzes', quiz.id);
      await updateDoc(quizRef, updatedFields);

      onQuizUpdated({ ...quiz, ...updatedFields });
      handleClose(); // Close and reset
    } catch (error) {
      console.error('Failed to update quiz:', error);
      setLoading(false);
    } finally {
      setDisable(false)
    }
  };

  return (
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
          <Button type="submit" variant="contained" disabled={disable}>
            {loading ? 'Please Wait...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditQuizModal;