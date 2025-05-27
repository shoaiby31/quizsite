import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Alert,
  Modal,
} from '@mui/material';
import { auth } from '../config/firebase'; // adjust the path as needed
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

import { db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [authProvider, setAuthProvider] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [allowNewPassword, setAllowNewPassword] = useState(false);

  // Admin Modal States
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [secritId, setSecritId] = useState('');
  const [error, setError] = useState('');



useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {
      const providerId = user.providerData[0]?.providerId || '';
      setAuthProvider(providerId);

      // Real-time listener for user data
      const userRef = doc(db, 'users', user.uid);
      const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            name: userData.name || user.displayName || '',
            email: user.email || '',
            role: userData.role || '',
            currentPassword: '',
            newPassword: '',
          });
        }
      });

      return () => unsubscribeUser(); // Cleanup Firestore listener
    }
  });

  return () => unsubscribeAuth(); // Cleanup auth listener
}, []);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVerifyPassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);

      await reauthenticateWithCredential(user, credential);
      setAllowNewPassword(true);
      setMessage({ type: 'success', text: 'Password verified. Enter a new password.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Incorrect current password.' });
    }
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });

    try {
      const user = auth.currentUser;

      if (user) {
        // Update display name in Firebase Authentication
        await updateProfile(user, { displayName: formData.name });

        // Update name in Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { name: formData.name });

        if (
          authProvider === 'password' &&
          allowNewPassword &&
          formData.newPassword.trim()
        ) {
          await updatePassword(user, formData.newPassword);
        }

        setMessage({ type: 'success', text: 'Profile updated successfully.' });
        setEditMode(false);
        setAllowNewPassword(false);
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  // Handle Admin Role Update
  const handleAdminUpgrade = async () => {
    if(secritId!=='' && secritId.length>=6){
        setError('')
        try {
            const user = auth.currentUser;
            const userRef = doc(db, 'users', user.uid);
      
            await updateDoc(userRef, {
              role: 'admin',
              adminid:secritId,
            });
      
            setMessage({ type: 'success', text: 'You are now an admin!' });
            setOpenAdminModal(false);
          } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upgrade to admin.' });
            console.error(error);
          }

    } else{
        setError('please enter alteast 6 digits long secrit id*')
    }
    
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={auth.currentUser?.photoURL}
              sx={{ width: 100, height: 100 }}
            />
          </Stack>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Stack spacing={2}>
            {editMode ? (
              <>
                <TextField label="Name" size="small" name="name" value={formData.name} onChange={handleChange} />
                <TextField label="Email" value={formData.email} size="small" disabled />

                {authProvider === 'password' && !allowNewPassword && (
                  <>
                    <TextField
                      label="Current Password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      size="small"
                      type="password"
                    />
                    <Button variant="outlined" onClick={handleVerifyPassword}>
                      Verify Current Password
                    </Button>
                  </>
                )}
                {authProvider === 'password' && allowNewPassword && (
                  <TextField
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    fullWidth
                    type="password"
                  />
                )}
              </>
            ) : (
              <>
                <Typography variant="h6">Name: {formData.name}</Typography>
                <Typography variant="body1">Email: {formData.email}</Typography>
                <Typography variant="body1">Role: {formData.role}</Typography>

              </>
            )}
          </Stack>

          {/* Admin Button */}
          {formData.role !== 'admin' && (
            <Button variant="contained" color="secondary" onClick={() => setOpenAdminModal(true)} sx={{ mt: 2 }}>
              I Want to Be an Admin
            </Button>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          {editMode ? (
            <>
              <Button variant="contained" onClick={handleSave}>Save</Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditMode(false);
                  setAllowNewPassword(false);
                  setMessage({ type: '', text: '' });
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: ''
                  }));
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outlined" onClick={() => setEditMode(true)}>Edit Profile</Button>
          )}
        </CardActions>
      </Card>

      {/* Modal for Admin Role Upgrade */}
      <Modal open={openAdminModal} onClose={() => setOpenAdminModal(false)}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 3,
          width: 400,
          margin: 'auto',
          backgroundColor: 'white',
          marginTop: '10%',
          borderRadius: 2,
          boxShadow: 3
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Become an Admin</Typography>
          {error !== '' && <Typography variant='body2' gutterBottom color='error.main'>{error}</Typography>}
          <TextField
            label="Secret ID"
            name="sectedid"
            value={secritId}
            onChange={(e) => setSecritId(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAdminUpgrade}>Upgrade to Admin</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;