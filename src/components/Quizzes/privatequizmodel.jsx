import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Alert
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Privatequizmodel = ({ open, onClose }) => {
  const [secretId, setSecretId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    setLoading(true);
    setError('');

    try {
      const q = query(
        collection(db, 'quizzes'),
        where('secretid', '==', secretId),
        where('isPublic', '==', false)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('❌ No quiz found with this Secret ID.');
      } else {
        const quizDoc = snapshot.docs[0];
        const quizData = quizDoc.data();

        if (!quizData.isActive) {
          setError('⚠️ This quiz is currently inactive. Stay tuned!');
        } else {
          navigate(`/start-test/${quizDoc.id}`,{ state: { secretId } });
          onClose(); // close modal
        }
      }
    } catch (err) {
      console.error('Error joining quiz:', err);
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setSecretId('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Join Private Quiz</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Enter Secret ID"
          value={secretId}
          onChange={(e) => setSecretId(e.target.value)}
          margin="normal"
          size="small"
        />
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleJoin}
          disabled={!secretId || loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Join'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Privatequizmodel;