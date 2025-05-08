import React, { useRef, useState } from 'react';
import { Alert, Backdrop, Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
import svg from '../assets/contact.svg'
import emailjs from '@emailjs/browser';
const Contact = () => {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = useState('');
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        if (!form.current['name'].value.trim() || !form.current['reply_to'].value.trim() || !form.current['subject'].value.trim() || !form.current['message'].value.trim()) {
            setStatus('error');
        } else {
            setOpen(true)
            emailjs
                .sendForm(
                    'service_kpxo4vs',     // e.g., "service_xxxxx"
                    'template_0yhjq6j',    // e.g., "template_abcd"
                    form.current,
                    'V7enx7yWsRHAnlnRG'      // e.g., "user_123abcXYZ"
                )
                .then(
                    (result) => {
                        setStatus('success');
                        form.current.reset();
                        setOpen(false);
                        setTimeout(() => setStatus(''), 5000);
                    },
                    (error) => {
                        setStatus('error');
                        setOpen(false);
                        setTimeout(() => setStatus(''), 5000);
                    }
                );
        }



    };
    return (
        <Box paddingX={{ xs: 2, md: 5 }} paddingTop={5}>
            <Divider />
            <Typography variant='h1' sx={{
                typography: { xs: 'h4', md: 'h4', xl: 'h3' },
                fontFamily: 'sans-serif', textAlign: 'center', background: 'linear-gradient(to right, #4facfe, #8e44ad 70%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', paddingY: 2
            }}>Let's Connect</Typography>
            <Grid container>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Card elevation={0}>
                        <CardContent>
                            <Box component="form" ref={form} onSubmit={sendEmail} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {status === 'success' && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        Message sent successfully!
                                    </Alert>
                                )}
                                {status === 'error' && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        Something went wrong. Please try again.
                                    </Alert>
                                )}
                                <TextField variant="outlined" name="name" placeholder="Name" />
                                <TextField variant="outlined" name="reply_to" placeholder="Email" />
                                <TextField variant="outlined" name="subject" placeholder="Subject" />
                                <TextField variant="outlined" name="message" multiline minRows={4} placeholder="Message" />
                                <Button variant="contained" type="submit"
                                    sx={{
                                        mt: 1, background: 'linear-gradient(to right, #4facfe, #8e44ad)', color: '#fff',
                                        textTransform: 'none', fontWeight: 'bold',
                                        '&:hover': { background: 'linear-gradient(to right, #8e44ad, #4facfe)' },
                                    }}>
                                    Message
                                </Button>
                                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={open}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }} display={{ xs: "none", sm: 'none', md: 'flex', lg: "flex", xl: 'flex' }} justifyContent='center'>
                    <CardMedia component="img" image={svg} alt="Contact Form" sx={{ width: '70%', objectFit: 'contain' }} />
                </Grid>


            </Grid>
        </Box>
    );
};


export default Contact;