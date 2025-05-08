import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, ToggleButton, ToggleButtonGroup, CardContent, Divider, Grid, CardMedia} from '@mui/material';
import { motion } from 'framer-motion';
import GoogleLoginButton from './Hooks/GoogleLoginButton';
import { useSearchParams } from 'react-router-dom';
import pic from '../assets/Signup.svg';
import pic2 from '../assets/login.svg';
import { useDispatch } from "react-redux";
import { setUser } from '.././redux/slices/authSlice';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth, } from "../config/firebase";
import { useNavigate, useLocation } from 'react-router-dom';

const MotionPaper = motion.create(Paper);

const Signup = (props) => {
    const [searchParams] = useSearchParams();
    const urlMode = searchParams.get('mode');
    const [mode, setMode] = useState(urlMode === 'signup' ? 'signup' : 'login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const from = location.state?.from?.pathname || "/";

    const handleModeChange = (_, newMode) => {
        if (newMode) setMode(newMode);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        if (mode === 'signup') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: name,
                });
                setName('')
                setEmail('')
                setPassword('')
                setMode('login')
                setSuccess('registration successful, please login to continue.')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                setEmail('')
                setPassword('')
                dispatch(
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                    })
                );
                // navigate(from || '/', { replace: true });
                navigate(from, { replace: true });
            } catch (err) {
                setError(err.code)

            } finally {
                setLoading(false);
            }




        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 0, md: 5 } }}>
            <Box sx={{ p: '1px', borderRadius: 3.5, background: { xs: 'none', md: 'linear-gradient(to top left, hsl(315, 93.80%, 44.30%), rgb(104, 70, 253))' } }}>
                <MotionPaper elevation={0} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3 }}>
                    <Grid container>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CardMedia component="img" image={mode === 'signup' ? pic : pic2} alt="Login Illustration" sx={{ width: '100%', objectFit: 'contain' }} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CardContent>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Typography>
                                <ToggleButtonGroup size="small" value={mode} exclusive onChange={handleModeChange} fullWidth sx={{ mb: 3 }}>
                                    <ToggleButton value="login">Login</ToggleButton>
                                    <ToggleButton value="signup">Sign Up</ToggleButton>
                                </ToggleButtonGroup>
                                <form onSubmit={handleSubmit}>
                                    {mode === 'signup' && (
                                        <TextField fullWidth label="Name" size="small" variant="outlined" type="text" required value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 3, display: 'block' }} />
                                    )}
                                    <TextField fullWidth label="Email" size="small" variant="outlined" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
                                    <TextField fullWidth label="Password" size="small" variant="outlined" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />
                                    {error && (
                                        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                                    )}
                                    {success && (
                                        <Typography color='success' sx={{ mb: 2 }}>{success}</Typography>
                                    )}
                                    <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
                                        {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Login'}
                                    </Button>
                                </form>

                                <Divider sx={{ mt: 3 }} />
                                <GoogleLoginButton />
                            </CardContent>
                        </Grid>
                    </Grid>
                </MotionPaper>
            </Box>
        </Box>
    );
};

export default Signup;