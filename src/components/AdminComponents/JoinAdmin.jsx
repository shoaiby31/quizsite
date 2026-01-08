import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Alert, Stack, CircularProgress
} from '@mui/material';
import {
    collection, addDoc, query, where, getDocs, serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const JoinAdmin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        institutePassword: '',
        secretCode: '',
        qualification: '',
        address: '',
        phone: '',
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

  const { institutePassword, secretCode, qualification, address, phone } = formData;

  if (!institutePassword || !secretCode || !qualification || !address || !phone) {
    setMessage({ type: 'error', text: 'Please fill all fields.' });
    setIsLoading(false);
    return;
  }

  try {
    // 1️⃣ Already registered with this admin?
    const relationQuery = query(
      collection(db, 'teacherAdminRelations'),
      where('teacherEmail', '==', userInfo.email),
      where('institutePassword', '==', institutePassword)
    );
    const relationSnapshot = await getDocs(relationQuery);
    if (!relationSnapshot.empty) {
      setMessage({ type: 'info', text: 'You are already registered in this school.' });
      return;
    }

    // 2️⃣ Already has a pending request?
    const existingRequestQuery = query(
      collection(db, 'teacherRequests'),
      where('email', '==', userInfo.email),
      where('institutePassword', '==', institutePassword)
    );
    const requestSnapshot = await getDocs(existingRequestQuery);
    if (!requestSnapshot.empty) {
      setMessage({ type: 'warning', text: 'Your request is already pending. Please wait for approval.' });
      return;
    }

    // 3️⃣ Is this secret code already used in active relations?
    const secretUsedInRelationsQuery = query(
      collection(db, 'teacherAdminRelations'),
      where('teacherSecretId', '==', secretCode)
    );
    const secretUsedInRelationsSnap = await getDocs(secretUsedInRelationsQuery);
    if (!secretUsedInRelationsSnap.empty) {
      setMessage({ type: 'warning', text: 'This secret code is already taken. Please choose another one.' });
      return;
    }

    // 4️⃣ Is this secret code already requested by someone else?
    const secretUsedInRequestsQuery = query(
      collection(db, 'teacherRequests'),
      where('secretCode', '==', secretCode)
    );
    const secretUsedInRequestsSnap = await getDocs(secretUsedInRequestsQuery);
    if (!secretUsedInRequestsSnap.empty) {
      setMessage({ type: 'warning', text: 'This secret code is already in use by another request. Please choose another one.' });
      return;
    }

    // 5️⃣ Validate admin / school ID
    const adminQuery = query(
      collection(db, 'users'),
      where('institutePassword', '==', institutePassword),
      where('role', '==', 'admin')
    );
    const adminSnapshot = await getDocs(adminQuery);
    if (adminSnapshot.empty) {
      setMessage({ type: 'error', text: 'Invalid School ID. No matching admin found.' });
      return;
    }

    // 6️⃣ Send join request
    await addDoc(collection(db, 'teacherRequests'), {
      userUid: userInfo.uid,
      name: userInfo.name,
      email: userInfo.email,
      institutePassword,
      secretCode,
      qualification,
      address,
      phone,
      status: 'pending',
      requestedAt: serverTimestamp(),
    });

    setMessage({ type: 'success', text: 'Join request sent successfully.' });
    setFormData({
      institutePassword: '',
      secretCode: '',
      qualification: '',
      address: '',
      phone: '',
    });

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
                Request Teacher Access
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    {message.text && <Alert severity={message.type}>{message.text}</Alert>}

                    <TextField
                        label="Principal ID / School ID"
                        name="institutePassword"
                        value={formData.institutePassword}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Your Secret Code"
                        name="secretCode"
                        value={formData.secretCode}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Your Qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Your Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Phone Number"
                        name="phone"
                        type='number'
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />


                    <Button type="submit" disabled={isLoading} variant="contained" startIcon={isLoading && <CircularProgress size={20} />}>
                        {isLoading ? 'Request Sending...' : 'Send Join Request'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default JoinAdmin;