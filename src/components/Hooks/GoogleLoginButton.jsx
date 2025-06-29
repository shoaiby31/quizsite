import React from 'react';
import { Button, Box } from '@mui/material';
import googleicon from '../../assets/google-icon-logo.svg';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let role = 'student';

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role,
          enrolledSubjects: [],
          createdAt: serverTimestamp(), // ✅ use Firestore server time
        });
      } else {
        const userData = userSnap.data();
        role = userData.role || 'student';
      }

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role,
        })
      );

      // ✅ Delay navigation slightly to avoid internal promise assertion bug
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 50);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Button
        onClick={handleGoogleLogin}
        variant="contained"
        startIcon={<img src={googleicon} alt="Google" style={{ width: 20, height: 20 }} />}
        sx={{
          textTransform: 'none',
          fontWeight: 'bold',
          backgroundColor: '#fff',
          color: '#444',
          border: '1px solid #ddd',
          '&:hover': { backgroundColor: '#f5f5f5' },
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;