import React from 'react';
import { Button, Box } from '@mui/material';
import googleicon from '../../assets/google-icon-logo.svg'
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';



const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/signup';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Dispatch user info to Redux store
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Button onClick={handleGoogleLogin} variant="contained" startIcon={<img src={googleicon} alt="Google"
          style={{ width: 20, height: 20 }}/>} sx={{textTransform: 'none', fontWeight: 'bold', backgroundColor: '#fff',
            color: '#444', border: '1px solid #ddd', '&:hover': { backgroundColor: '#f5f5f5',}}}>
        Sign in with Google
      </Button>
      
    </Box>
  );
};

export default GoogleLoginButton;