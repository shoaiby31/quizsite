import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Alert
} from '@mui/material';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Privatequizmodel = ({ open, onClose }) => {
  const [secretId, setSecretId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firestoreUser, setFirestoreUser] = useState(null);

  const navigate = useNavigate();

  // Load current user and fetch Firestore user document
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setFirestoreUser({ uid: user.uid, ...userDoc.data() });
        } else {
          setFirestoreUser(null);
        }
      } else {
        setFirestoreUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleJoin = async () => {
    setLoading(true);
    setError('');
  
    try {
      const quizQuery = query(
        collection(db, 'quizzes'),
        where('secretid', '==', secretId),
        where('isPublic', '==', false)
      );
      const snapshot = await getDocs(quizQuery);
  
      if (snapshot.empty) {
        setError('❌ No quiz found with this Secret ID.');
        setLoading(false);
        return;
      }
  
      const quizDoc = snapshot.docs[0];
      const quizData = quizDoc.data();
  
      if (!quizData.isActive) {
        setError('⚠️ This quiz is currently inactive. Stay tuned!');
        setLoading(false);
        return;
      }
  
      // Validate user access
      if (!firestoreUser || !firestoreUser.uid) {
        setError('❌ You must be logged in to join the quiz.');
        setLoading(false);
        return;
      }
  
      if (!quizData.createdBy) {
        setError('❌ Quiz is missing teacher (admin) information.');
        setLoading(false);
        return;
      }
  
      const relationQuery = query(
        collection(db, 'studentTeacherRelations'),
        where('userId', '==', firestoreUser.uid),
        where('adminUid', '==', quizData.createdBy)
      );
  
      const relationSnapshot = await getDocs(relationQuery);
  
      if (relationSnapshot.empty) {
        setError('❌ You are not registered with the teacher who created this quiz.');
        setLoading(false);
        return;
      }

    const validRelation = relationSnapshot.docs.some((doc) => {
      const studentClass = Number(doc.data().className);
      const quizClass = Number(quizData.class); // or quizData.className if that's the correct field
      return !isNaN(studentClass) && !isNaN(quizClass) && studentClass === quizClass;
    });
    
    if (!validRelation) {
      setError(`⚠️ This quiz is for class "${quizData.class}", which doesn't match your registered class.`);
      setLoading(false);
      return;
    }
  
      // ✅ All checks passed
      navigate(`/start-test/${quizDoc.id}`, { state: { secretId } });
      onClose();
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