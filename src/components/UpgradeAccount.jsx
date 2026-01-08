import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Stack, CircularProgress, Alert } from '@mui/material';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { nanoid } from 'nanoid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpgradeAccountRequest = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);



  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    schoolId: '',
    schoolName: '',
  });

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo({
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
        });
      }
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdminCreation = async (e) => {
    e.preventDefault();
    let { institutePassword, instituteName, instituteAddress } = form;
    let coverPhotoUrl = null;

    if (!instituteName) {
      setMessage({ type: 'error', text: 'Institute Name is required.' });
      return;
    }
    if (!instituteAddress) {
      setMessage({ type: 'error', text: 'Institute Address is required.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Normalize and auto-generate schoolId if empty
      institutePassword = (institutePassword || nanoid(8)).toLowerCase().replace(/\s+/g, '-');

      // Check if user already has a school
      const existingSchoolDoc = await getDoc(doc(db, 'schools', userInfo.uid));
      if (existingSchoolDoc.exists()) {
        setMessage({ type: 'error', text: 'You already have an institute associated with this account.' });
        setLoading(false);
        return;
      }

      // Check if schoolId already exists in any school
      const q = query(collection(db, 'schools'), where('institutePassword', '==', institutePassword));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage({ type: 'error', text: 'This Institute ID is already taken. Please try another one or leave blank to auto-generate.' });
        setLoading(false);
        return;
      }

      if (coverFile) {
        const coverRef = ref(storage, `schoolCovers/${userInfo.uid}`);
        await uploadBytes(coverRef, coverFile);
        coverPhotoUrl = await getDownloadURL(coverRef);
      }

      // Create school
      await setDoc(doc(db, 'schools', userInfo.uid), {
        institutePassword,
        instituteName,
        instituteAddress,
        coverPhotoUrl: coverPhotoUrl || null,
        schoolAdminUid: userInfo.uid,
        createdAt: serverTimestamp(),
      });

      // Set user role
      await setDoc(doc(db, 'users', userInfo.uid), {
        role: 'admin',
        institutePassword,
      }, { merge: true });

      dispatch(setUser({ role: 'admin' }));
      setMessage({ type: 'success', text: 'Your Institute has been successfully registered with us!' });
      setForm({ instituteId: '', instituteName: '', institutePassword: '', instituteAddress: '' });
      setCoverFile(null);
      setCoverPreview(null);

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Something went wrong during school creation.' });
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!userInfo) {
  //     setMessage({ type: 'error', text: 'You must be signed in to continue.' });
  //     return;
  //   }

  //   handleAdminCreation();
  // };

  return (
    <Box sx={{ maxWidth: { xs: 'auto', md: 800 }, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>Register Your Institute with us.</Typography>

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <form onSubmit={handleAdminCreation}>
        <Stack spacing={2}>
          <TextField label="Institute Name" name="instituteName" value={form.instituteName} onChange={handleChange} fullWidth />
          <TextField label="Institute Address" name="instituteAddress" value={form.instituteAddress} onChange={handleChange} fullWidth />
          {/* <TextField label="Institute Password" type="password" name="institutePassword" placeholder='set secret & unique password' value={form.institutePassword} onChange={handleChange} fullWidth /> */}
          <TextField label="Institute Password" type={showPassword ? 'text' : 'password'} name="institutePassword" placeholder="Set secret & unique password" value={form.institutePassword} onChange={handleChange} fullWidth InputProps={{
            endAdornment: (<InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end" size="small" >{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
            </InputAdornment>),
          }} />
          <Button variant="outlined" component="label">Upload Cover Photo (Optional)
            <input type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files[0]; if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); } }} /></Button>
          {coverPreview && (<Box sx={{ height: 120, borderRadius: 2, backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', }} />)}
          <Button type="submit" variant="contained" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
            {loading ? 'Creating...' : 'Register Institute'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UpgradeAccountRequest;