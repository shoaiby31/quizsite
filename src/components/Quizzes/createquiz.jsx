import React, { useState, useRef } from 'react';
import { Box, Button, CardContent, TextField, Typography, CircularProgress, Paper, Grid, CardMedia, Divider, Card, Switch, Stack, Chip } from '@mui/material'
import { motion } from 'framer-motion';
import pic from '../../assets/createquiz.webp'
import quizpic from '../../assets/quizdetails.webp'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';
import CancelIcon from "@mui/icons-material/Cancel";
import ViewExistingQuizzes from './viewexistingquizzes';
const MotionPaper = motion.create(Paper);

export default function Createquiz() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [tags, setTags] = useState([]);
    const [timeLimit, setTimeLimit] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const uid = useSelector((state) => state.auth.uid)
    const inputRef = useRef();

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && inputRef.current.value) {
            const newTag = inputRef.current.value.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags((prev) => [...prev, newTag]);
                inputRef.current.value = "";
            }
            event.preventDefault();
        }
    };
    const handleDelete = (tagToDelete) => {
        setTags((prev) => prev.filter((tag) => tag !== tagToDelete));
    };

    const Createquiz = async (e) => {
        e.preventDefault();
        if (tags.length > 1) {
            setError('');
            setLoading(true);
            try {
                await addDoc(collection(db, 'quizzes'), {
                    title: title,
                    description: description,
                    createdBy: uid,
                    createdAt: new Date(),
                    tags: tags,
                    isPublic: isPublic,
                    timeLimit: timeLimit
                });
                setLoading(false);
                setTitle('')
                setDescription('')
                setTags([])
                setTimeLimit('')
            } catch (err) {
                setError(err.message);
            }

        } else {
            setError('Please add atleast two tags*')
        }

    };

    return (
        <Box sx={{ pt: 5, px: { xs: 3, md: 5 } }}>

            <Grid container>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card elevation={0}>
                        <CardContent sx={{ paddingTop: 5, paddingX: { xs: 2, sm: 2, md: 5, lg: 5, xl: 5 } }}>
                            <Typography sx={{ fontWeight: 'bold', typography: { xs: 'h4', sm: 'h3', md: 'h4', lg: 'h4', xl: 'h2' }, color: 'text.secondary' }}>Create a New Quiz 📝</Typography>
                            <Typography variant="body1" sx={{ typography: { xs: 'body1', sm: 'button', md: 'caption', lg: 'body2', xl: 'h6' }, paddingTop: 3 }}>Welcome! Craft your own quiz effortlessly. Whether it's for your class, academy, or personal practice, our platform makes quiz creation simple and intuitive.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <CardMedia component="img" image={pic} alt="Quiz Picture"
                        sx={{ width: '60%', height: '100%', objectFit: 'contain' }} />
                </Grid>
            </Grid>
            <Divider />
            <Grid container mt={3} spacing={1}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h4' component='h2'>Enter Quiz Details</Typography>
                    </Box>
                    <CardMedia component="img" image={quizpic} alt="Quiz Picture"
                        sx={{ width: '85%', objectFit: 'contain' }} />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                    <MotionPaper elevation={0} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ p: { xs: 1, md: 3 }, borderRadius: 4 }}>
                        <form onSubmit={Createquiz}>
                            <TextField fullWidth placeholder='eg: Mathematics Test - Algebra' size='small' label="Quiz Title" variant="outlined" type='text' required value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 3 }} />
                            <TextField fullWidth placeholder='eg: Quiz on basic algebra concepts' size='small' label="Description" variant="outlined" type='text' required value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 3 }} />
                            <TextField fullWidth placeholder='Enter time in minutes' size='small' label="Time Limit" variant="outlined" type='number' required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} sx={{ mb: 3 }} />
                            <TextField size='small' inputRef={inputRef} onKeyDown={handleKeyDown} label="Tags" variant="outlined" placeholder="Press Enter to add tags" fullWidth />
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                {tags.map((tag, index) => (
                                    <Chip key={index} label={tag} onDelete={() => handleDelete(tag)} deleteIcon={<CancelIcon />} sx={{ mb: 1 }} />
                                ))}
                            </Stack>


                            <Box sx={{ display: 'flex' }}>
                                <Typography>Public:</Typography>
                                <Switch checked={isPublic} value={isPublic} onChange={() => setIsPublic(!isPublic)} />
                            </Box>
                            {error && (
                                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                            )}

                            <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
                                {loading ? 'Submitting...' : 'Submit'}</Button>
                        </form>
                    </MotionPaper>
                </Grid>
            </Grid>
            <Divider />
            <ViewExistingQuizzes />
        </Box>
    )
}
