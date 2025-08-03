import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, CircularProgress, Paper, Grid, Divider, Switch, Stack, Chip,
    FormControl, InputLabel, Select, MenuItem, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import CancelIcon from "@mui/icons-material/Cancel";
import ViewExistingQuizzes from './viewexistingquizzes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const MotionPaper = motion.create(Paper);

export default function Createquiz() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [secretid, setSecretid] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [tags, setTags] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [questionTypes, setQuestionTypes] = useState({
        mcq: { enabled: false, count: '', timeLimit: '' },
        truefalse: { enabled: false, count: '', timeLimit: '' },
        short: { enabled: false, count: '', timeLimit: '', scorePerQuestion: '' }
    });

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid); // 🔹 get uid
                setName(user.displayName || 'nill'); // 🔹 get displayName if available
            } else {
                setUid('');
                setName('nill');
            }
        });
        return () => unsubscribe();
    }, []);
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

    const getClassSuffix = (number) => {
        if (number === 1) return 'st';
        if (number === 2) return 'nd';
        if (number === 3) return 'rd';
        return 'th';
    };

    const Createquiz = async (e) => {
        e.preventDefault();

        if (tags.length === 0) {
            setError('Please add at least one tag*');
            return;
        }
        if (!selectedClass) {
            setError('Please select a class*');
            return;
        }
        if (!isPublic && !secretid.trim()) {
            setError('Secret ID is required for private quizzes.');
            return;
        }

        const invalidTypes = Object.entries(questionTypes).filter(([key, type]) => {
            return (
                type.enabled && (
                    !type.count || isNaN(type.count) || type.count <= 0 ||
                    !type.timeLimit || isNaN(type.timeLimit) || type.timeLimit <= 0 ||
                    (key === 'short' && (!type.scorePerQuestion || isNaN(type.scorePerQuestion) || type.scorePerQuestion <= 0))
                )
            );
        });

        if (invalidTypes.length > 0) {
            setError('Please enter a valid count, time limit, and score for all enabled question types.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (!isPublic) {
                const q = query(collection(db, 'quizzes'), where('secretid', '==', secretid.trim()));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setError('This Secret ID is already in use. Please choose another.');
                    setLoading(false);
                    return;
                }
            }

            await addDoc(collection(db, 'quizzes'), {
                title,
                description,
                secretid: isPublic ? '' : secretid.trim(),
                createdBy: uid,
                ownerName: name || null,
                createdAt: new Date(),
                tags,
                isPublic,
                isActive,
                class: selectedClass,
                questionTypes: {
                    mcq: questionTypes.mcq.enabled ? {
                        count: questionTypes.mcq.count,
                        timeLimit: questionTypes.mcq.timeLimit
                    } : null,
                    truefalse: questionTypes.truefalse.enabled ? {
                        count: questionTypes.truefalse.count,
                        timeLimit: questionTypes.truefalse.timeLimit
                    } : null,
                    short: questionTypes.short.enabled ? {
                        count: questionTypes.short.count,
                        timeLimit: questionTypes.short.timeLimit,
                        scorePerQuestion: questionTypes.short.scorePerQuestion
                    } : null,
                }
            });

            setTitle('');
            setDescription('');
            setSecretid('');
            setTags([]);
            setSelectedClass('');
            setQuestionTypes({
                mcq: { enabled: false, count: 0, timeLimit: '' },
                truefalse: { enabled: false, count: 0, timeLimit: '' },
                short: { enabled: false, count: 0, timeLimit: '', scorePerQuestion: '' }
            });

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <Box sx={{ px: { xs: 2, md: 0 }, maxWidth: '1450px', mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" fontWeight='bold' sx={{ px: 2 }}>Make New Test</Typography>

            <MotionPaper elevation={0} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ p: { xs: 2, md: 2 }, borderRadius: 4 }}>
                <form onSubmit={Createquiz}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Quiz Title" required size="small" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Description" required size="small" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Class</InputLabel>
                                <Select value={selectedClass} label="Class" onChange={(e) => setSelectedClass(e.target.value)} required>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {`Class ${i + 1}${getClassSuffix(i + 1)}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField size="small" inputRef={inputRef} onKeyDown={handleKeyDown} label="Tags" fullWidth sx={{ mb: 1 }} placeholder="Press Enter to add tags" />
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                                {tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleDelete(tag)}
                                        deleteIcon={<CancelIcon />}
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>



                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Visibility</InputLabel>
                                <Select
                                    value={isPublic ? "true" : "false"}
                                    onChange={(e) => setIsPublic(e.target.value === "true")}
                                    label="Visibility"
                                >
                                    <MenuItem value="true">Public</MenuItem>
                                    <MenuItem value="false">Private</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {!isPublic && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Secret ID" required size="small" value={secretid} onChange={(e) => setSecretid(e.target.value)} />
                            </Grid>
                        )}
                        <FormControlLabel
                            sx={{ mb: 2 }}
                            control={
                                <Switch
                                    checked={isActive}
                                    color="success"
                                    onChange={() => setIsActive(!isActive)}
                                />
                            }
                            label={isActive ? "Active" : "Inactive"}
                            labelPlacement="start"
                        />
                    </Grid>

                    <Divider>
                        <Typography variant="h6">Define Question Types</Typography>
                    </Divider>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            { label: "MCQ", key: "mcq" },
                            { label: "True/False", key: "truefalse" },
                            { label: "Short Answer", key: "short" },
                        ].map(({ label, key }) => (
                            <Grid size={{ xs: 12 }} key={key}>
                                <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={questionTypes[key].enabled}
                                                onChange={(e) =>
                                                    setQuestionTypes((prev) => ({
                                                        ...prev,
                                                        [key]: {
                                                            ...prev[key],
                                                            enabled: e.target.checked,
                                                        },
                                                    }))
                                                }
                                            />
                                        }
                                        label={label}
                                    />
                                    {questionTypes[key].enabled && (
                                        <>
                                            <TextField
                                                type="number"
                                                size="small"
                                                label={`Number of ${label}`}
                                                inputProps={{ min: 1 }}
                                                value={questionTypes[key].count}
                                                onChange={(e) =>
                                                    setQuestionTypes((prev) => ({
                                                        ...prev,
                                                        [key]: {
                                                            ...prev[key],
                                                            count: parseInt(e.target.value) || '',
                                                        },
                                                    }))
                                                }
                                            />
                                            <TextField
                                                type="number"
                                                size="small"
                                                label="Time Limit (min)"
                                                inputProps={{ min: 1 }}
                                                value={questionTypes[key].timeLimit}
                                                onChange={(e) =>
                                                    setQuestionTypes((prev) => ({
                                                        ...prev,
                                                        [key]: {
                                                            ...prev[key],
                                                            timeLimit: parseInt(e.target.value) || '',
                                                        },
                                                    }))
                                                }
                                            />
                                            {key === 'short' && (
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    label="Score per Question"
                                                    inputProps={{ min: 1 }}
                                                    value={questionTypes.short.scorePerQuestion}
                                                    onChange={(e) =>
                                                        setQuestionTypes((prev) => ({
                                                            ...prev,
                                                            short: {
                                                                ...prev.short,
                                                                scorePerQuestion: parseFloat(e.target.value) || '',
                                                            },
                                                        }))
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Snackbar open={success} autoHideDuration={5000} onClose={() => setSuccess(false)}>
                        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                            Quiz created successfully!
                        </Alert>
                    </Snackbar>

                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </MotionPaper>

            <Divider sx={{ my: 3 }} />
            <ViewExistingQuizzes userId={uid} />
        </Box>
    );
}