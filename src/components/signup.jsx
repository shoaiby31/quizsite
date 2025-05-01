import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, ToggleButton, ToggleButtonGroup, CardContent, Divider } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { motion } from 'framer-motion';
import GoogleLoginButton from './Buttons/GoogleLoginButton';
import { useSearchParams } from 'react-router-dom';

const MotionPaper = motion.create(Paper);

const Signup = (props) => {
    const [name, setName] = useState('');

    const [searchParams] = useSearchParams();
    const urlMode = searchParams.get('mode');
    const [mode, setMode] = useState(urlMode==='signup'?'signup':'login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleModeChange = (_, newMode) => {
        if (newMode) setMode(newMode);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (mode === 'signup') {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            alert(`${mode === 'signup' ? 'Signup' : 'Login'} successful!`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 15 }}>
            <MotionPaper elevation={4} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ p: 3, borderRadius: 4}}>

                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign:'center' }}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Typography>
                    <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} fullWidth sx={{ mb: 3 }} >
                        <ToggleButton value="login">Login</ToggleButton>
                        <ToggleButton value="signup">Sign Up</ToggleButton>
                    </ToggleButtonGroup>

                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Name" variant="outlined" type='text' required={mode === 'signup' ? true : false} value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 3, display:mode === 'signup' ? 'block' : 'none' }} />
                        <TextField fullWidth label="Email" variant="outlined" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Password" variant="outlined" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                        )}

                        <Button type="submit" variant="contained" color="primary">
                            {mode === 'signup' ? 'Sign Up' : 'Login'}
                        </Button>
                    </form>
                    <Divider sx={{mt:3}}/>
                    <GoogleLoginButton />
                   
                </CardContent>

            </MotionPaper>
        </Box>
    );
};

export default Signup;