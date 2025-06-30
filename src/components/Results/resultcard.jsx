import React, { useEffect, useState, useRef } from 'react';
import {
    Paper, Grid, Typography, Divider, Button, Chip,
    Stack, Snackbar, Alert, Box, useMediaQuery, CircularProgress,
} from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ReplayIcon from '@mui/icons-material/Replay';
import ShareIcon from '@mui/icons-material/Share';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { query, collection, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '@mui/material/styles';
import AnswersDetail from './answersdetail';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const COLORS = ['#4caf50', '#2196f3', '#ff9800'];

const ResultCard = () => {
    const detailRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const { quizId } = useParams();
    const location = useLocation();
    const { uid } = location.state || {};
    const [attempt, setAttempt] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [quizData, setQuizData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!quizId || !uid) {
            setLoading(false)
            return;
        }
        const fetchAttempt = async () => {
            try {
                const q = query(
                    collection(db, 'attempts'),
                    where('quizId', '==', quizId),
                    where('userId', '==', uid)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setAttempt(querySnapshot.docs[0].data());
                } else {
                    setErrorMsg("Attempt not found for this quiz.");
                }
            } catch (error) {
                console.error(error);
                setErrorMsg("Failed to fetch result. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttempt();
    }, [quizId, uid]);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) return;
            const quizRef = doc(db, 'quizzes', quizId);
            const quizSnap = await getDoc(quizRef);
            if (quizSnap.exists()) {
                setQuizData(quizSnap.data());
            }
        };
        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        if (selectedQuestionType && detailRef.current) {
            detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedQuestionType]);

    const isTestCompleted = () => {
        if (!quizData?.questionTypes || !attempt) return { completed: false, pendingSections: [] };

        const pending = [];
        if (quizData.questionTypes.mcq && !attempt.mcqsSubmitted) pending.push("MCQs");
        if (quizData.questionTypes.truefalse && !attempt.trueFalseSubmitted) pending.push("True/False");
        if (quizData.questionTypes.short && !attempt.shortAnswersSubmitted) pending.push("Short Answers");

        return {
            completed: pending.length === 0,
            pendingSections: pending
        };
    };

    const { completed, pendingSections } = isTestCompleted();

    if (loading) {
        return (
            <Box textAlign="center" mt={8}>
                <CircularProgress />
                <Typography mt={2}>Loading results 📊...</Typography>
            </Box>
        );
    }

    if (!completed) {
        return (
            <Box textAlign="center" mt={8}>
                <Typography variant="h5" color="error" fontWeight="bold">
                    The test is not completed to view result ❌
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={2}>
                    Please complete the following section(s): {pendingSections.join(', ')}.
                </Typography>
            </Box>
        );
    }

    if (!attempt || !quizData) return null;

    const {
        title = 'Untitled Quiz',
        mcqsScore = 0,
        totalMcqsScore = 0,
        trueFalseScore = 0,
        totalTrueFalseScore = 0,
        shortAnswerScores = 0,
        totalShortScore = 0,
    } = attempt;

    const scoreDistributionData = [
        quizData.questionTypes?.mcq && attempt.mcqsSubmitted ? {
            name: 'MCQs',
            value: mcqsScore,
            total: totalMcqsScore,
            label: 'MCQs Score',
        } : null,
        quizData.questionTypes?.truefalse && attempt.trueFalseSubmitted ? {
            name: 'True/False',
            value: trueFalseScore,
            total: totalTrueFalseScore,
            label: 'True/False Score',
        } : null,
        quizData.questionTypes?.short && attempt.shortAnswersSubmitted ? {
            name: 'Short',
            value: shortAnswerScores,
            total: totalShortScore,
            label: 'Short Answer Score',
        } : null,
    ].filter(Boolean);

    const overallScore = scoreDistributionData.reduce((sum, item) => sum + item.value, 0);
    const overallTotal = scoreDistributionData.reduce((sum, item) => sum + item.total, 0);

    const handleRetake = async () => {
        if (!quizData || !quizId || !uid) {
            setErrorMsg("Missing quiz or user info.");
            return;
        }

        if (quizData.isPublic) {
            try {
                const attemptRef = query(
                    collection(db, 'attempts'),
                    where('quizId', '==', quizId),
                    where('userId', '==', uid)
                );
                const snapshot = await getDocs(attemptRef);

                if (!snapshot.empty) {
                    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deletePromises);
                }

                navigate(`/start-public-test/${quizId}`);
            } catch (err) {
                console.error(err);
                setErrorMsg("Failed to re-attempt. Try again later.");
            }
        } else {
            setErrorMsg("You are not allowed to re-attempt this test.");
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setSnackbarOpen(true);
    };

    return (
        <Paper
            sx={{ px: { xs: 2, md: 5 }, py: 4 }}
            elevation={0}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                        Complete Test Details Card! 🎉 <CelebrationIcon sx={{ fontSize: 50, color: '#ffb300' }} />
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mt={1}>
                        Here's the performance summary for {title}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={2} mt={{ xs: 2, sm: 5 }}>
                        {quizData.isPublic &&
                            <Button onClick={handleRetake} variant="outlined" startIcon={<ReplayIcon />} sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}>
                                Retake Quiz
                            </Button>}
                        <Button onClick={handleShare} variant="contained" color="secondary" startIcon={<ShareIcon />} sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}>
                            Share Result
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'left' }, mb: 1 }}>
                            <Chip icon={<QueryStatsIcon />} label={`Overall Score: ${overallScore} / ${overallTotal}`} color="primary" sx={{ fontSize: 18, px: 3, py: 1.5, fontWeight: 'bold' }} />
                        </Box>
                        <Typography variant="body1" mt={1.5} color="text.secondary">
                            You got {attempt.percentage?.toFixed(1)}% of the questions correct.
                        </Typography>

                        <Box mt={4}>
                            {quizData.questionTypes?.mcq && attempt.mcqsSubmitted && (
                                <Box display='flex' alignItems='center' gap={1}>
                                    <Typography variant="h6" color={COLORS[0]} fontWeight="bold">MCQs: {mcqsScore} / {totalMcqsScore}</Typography>
                                    <Button size='small' onClick={() => setSelectedQuestionType('mcqs')} endIcon={<ExpandMoreIcon />}>View Details</Button>
                                </Box>
                            )}
                            {quizData.questionTypes?.truefalse && attempt.trueFalseSubmitted && (
                                <Box display='flex' alignItems='center' gap={1} mt={1}>
                                    <Typography variant="h6" color={COLORS[1]} fontWeight="bold">True/False: {trueFalseScore} / {totalTrueFalseScore}</Typography>
                                    <Button size='small' onClick={() => setSelectedQuestionType('truefalse')} endIcon={<ExpandMoreIcon />}>View Details</Button>
                                </Box>
                            )}
                            {quizData.questionTypes?.short && attempt.shortAnswersSubmitted && (
                                <Box display='flex' alignItems='center' gap={1} mt={1}>
                                    <Typography variant="h6" color={COLORS[2]} fontWeight="bold">Short Answers: {shortAnswerScores} / {totalShortScore}</Typography>
                                    <Button size='small' onClick={() => setSelectedQuestionType('short')} endIcon={<ExpandMoreIcon />}>View Details</Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <Chip icon={<QueryStatsIcon />} label={'Details in Bar Chart'} color="primary" sx={{ fontSize: 18, px: 3, py: 1.5, fontWeight: 'bold' }} />
                    </Box>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={scoreDistributionData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value, name, props) => [`${value}`, props.payload.label]} />
                            <Legend />
                            <Bar dataKey="value" name="Obtained Marks">
                                {scoreDistributionData.map((entry, index) => (
                                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                            <Bar dataKey="total" name="Total Marks" fill="#ccc" />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <Chip icon={<QueryStatsIcon />} label={'Details in Pie Chart'} color="primary" sx={{ fontSize: 18, px: 3, py: 1.5, fontWeight: 'bold' }} />
                    </Box>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={scoreDistributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={isMobile ? true : false}
                            >
                                {scoreDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <Label value={`${overallScore}/${overallTotal}`} position="center" fill="#1976D2" fontSize={22} fontWeight="bold" />
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: isMobile ? 12 : 18 }} iconSize={12} />
                        </PieChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>Link copied to clipboard! 📋</Alert>
            </Snackbar>

            <Snackbar open={!!errorMsg} autoHideDuration={5000} onClose={() => setErrorMsg("")} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="warning" variant="filled" onClose={() => setErrorMsg("")} sx={{ fontWeight: 'bold', fontSize: 16, whiteSpace: 'pre-line' }}>{errorMsg}</Alert>
            </Snackbar>

            <Divider sx={{ my: 4, mt: 7 }} />

            {selectedQuestionType && (
                <div ref={detailRef}>
                    <AnswersDetail attempt={attempt} questionType={selectedQuestionType} />
                </div>
            )}
        </Paper>
    );
};

export default ResultCard;