import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Alert, Stack, Select, CircularProgress, MenuItem, InputLabel, FormControl
} from '@mui/material';
import {
  collection, addDoc, query, where, getDocs, serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const JoinTeacherRequest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    adminId: '',
    rollNo: '',
    class: '',
  });

  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo({
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
  
    if (!userInfo) {
      setMessage({ type: 'error', text: 'User not authenticated.' });
      setIsLoading(false);
      return;
    }
  
    const { adminId, rollNo, class: studentClass } = formData;
    if (!adminId || !rollNo || !studentClass) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      setIsLoading(false);
      return;
    }
  
    try {
      // Step 1: Check if student is already registered with this teacher
      const relationQuery = query(
        collection(db, 'studentTeacherRelations'),
        where('studentEmail', '==', userInfo.email),
        where('adminId', '==', adminId)
      );
      const relationSnapshot = await getDocs(relationQuery);
      if (!relationSnapshot.empty) {
        setMessage({ type: 'info', text: 'You are already registered with this teacher.' });
        return;
      }
  
      // Step 2: Check if there's already a pending join request
      const existingRequestQuery = query(
        collection(db, 'joinRequests'),
        where('studentEmail', '==', userInfo.email),
        where('adminId', '==', adminId)
      );
      const requestSnapshot = await getDocs(existingRequestQuery);
      if (!requestSnapshot.empty) {
        setMessage({ type: 'warning', text: 'You already have a pending join request for this teacher.' });
        return;
      }
  
      // Step 3: Prevent duplicate rollNo + class for same admin in studentTeacherRelations
      const duplicateRelationQuery = query(
        collection(db, 'studentTeacherRelations'),
        where('adminId', '==', adminId),
        where('rollNo', '==', rollNo),
        where('className', '==', studentClass)
      );
      const duplicateRelationSnapshot = await getDocs(duplicateRelationQuery);
      if (!duplicateRelationSnapshot.empty) {
        setMessage({ type: 'warning', text: 'A student with the same roll number and class is already registered with this teacher.' });
        return;
      }
  
      // Step 4: Prevent duplicate rollNo + class for same admin in joinRequests
      const duplicateRequestQuery = query(
        collection(db, 'joinRequests'),
        where('adminId', '==', adminId),
        where('rollNo', '==', rollNo),
        where('className', '==', studentClass)
      );
      const duplicateRequestSnapshot = await getDocs(duplicateRequestQuery);
      if (!duplicateRequestSnapshot.empty) {
        setMessage({ type: 'warning', text: 'A join request with the same roll number and class is already pending for this teacher.' });
        return;
      }
  
      // Step 5: Check if adminId is valid
      const adminQuery = query(collection(db, 'users'), where('adminid', '==', adminId));
      const adminSnapshot = await getDocs(adminQuery);
      if (adminSnapshot.empty) {
        setMessage({ type: 'error', text: 'Invalid Admin ID. No matching admin found.' });
        return;
      }
  
      // Step 6: Send join request
      await addDoc(collection(db, 'joinRequests'), {
        studentId: userInfo.uid,
        studentName: userInfo.name,
        studentEmail: userInfo.email,
        rollNo,
        className: studentClass,
        adminId,
        status: 'pending',
        timestamp: serverTimestamp(),
      });
  
      setMessage({ type: 'success', text: 'Join request sent successfully.' });
      setFormData({ adminId: '', rollNo: '', class: '' });
    } catch (error) {
      console.error('Error sending join request:', error);
      setMessage({ type: 'error', text: 'Failed to send join request.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Join a Teacher/Admin
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {message.text && <Alert severity={message.type}>{message.text}</Alert>}

          <TextField
            label="Admin/Teacher ID"
            name="adminId"
            value={formData.adminId}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Your Roll Number"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={formData.class}
              onChange={handleChange}
              label="Class"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={`${i + 1}`}>
                  Class {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" disabled={isLoading} variant="contained" startIcon={isLoading && <CircularProgress size={20} />}>
            {isLoading ? 'Request Sending...' : 'Send Join Request'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default JoinTeacherRequest;