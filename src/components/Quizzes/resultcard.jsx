import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Divider, Chip, useTheme, Button, Stack, Snackbar, Alert, Paper, Grid} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ShareIcon from '@mui/icons-material/Share';
import ReplayIcon from '@mui/icons-material/Replay';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';

const COLORS = ["#47bf99", "#f04135"];

const renderCustomLabel = ({ name, percent }) => {
    const emoji = name === "Correct" ? "✅" : "❌";
    return `${emoji} ${name}: ${(percent * 100).toFixed(0)}%`;
};

function ResultCard() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();
    const userId = useSelector((state) => state.auth.uid);
    const [isLoading, setIsLoading] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");

    // Optional chaining to avoid crashes if `state` is undefined
    const quizId = state?.quizId || "";
    const title = state?.title || "Untitled Quiz";
    const data = state?.data || [];
    const score = state?.score || 0;
    const length = state?.length || 0;
    const totalScore = state?.totalScore || 0;
    const total = length === 0 ? totalScore : length;
 useEffect(() => {
    if(!quizId)
     return navigate(`/browsequiz`);
    setIsLoading(false)
  }, [navigate, quizId]);

    const handleRetake = async () => {
        try {
            const quizRef = doc(db, "quizzes", quizId);
            const quizSnap = await getDoc(quizRef);

            if (!quizSnap.exists()) {
                setErrorMsg("❌ Quiz not found.");
                return;
            }

            const quizData = quizSnap.data();
            if (!quizData.isPublic) {
                setErrorMsg("⛔ You can not re-attempt the quiz, because it's a protected quiz and only the admin can allow you to re-attempt it. 🔒");
                return;
            }

            const attemptsRef = collection(db, "attempts");
            const q = query(attemptsRef, where("quizId", "==", quizId), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const deletions = querySnapshot.docs.map((docSnap) =>
                deleteDoc(doc(db, "attempts", docSnap.id))
            );
            await Promise.all(deletions);

            navigate(`/attemptQuiz/${quizId}`);
        } catch (err) {
            console.error("Error retaking quiz:", err);
            setErrorMsg("⚠️ Something went wrong while retaking the quiz.");
        }
    };

    const handleShare = async () => {
        const shareText = `I just scored ${score}/${total} on a quiz! 🎉 Try to beat my score!`;
        const shareUrl = window.location.origin + `/quiz/${quizId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Quiz Result',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.error('Sharing failed:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setSnackbarOpen(true);
            } catch {
                alert('Could not copy link.');
            }
        }
    };

     if (isLoading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
   
    return (
        <Paper sx={{ px: { xs: 2, md: 5 } }} elevation={0}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Card sx={{ borderRadius: 4, width: '100%', boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}>
                <CardContent sx={{ padding: 5 }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h4" fontWeight="bold" mt={1}>
                                Quiz Completed! 🎉 <CelebrationIcon sx={{ fontSize: 60, color: '#ffb300' }} />
                            </Typography>
                            <Typography variant="h6" color="text.secondary" mt={1}>
                                Here's your performance summary for {title}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" spacing={2} mt={5}>
                                <Button onClick={handleRetake} variant="outlined" startIcon={<ReplayIcon />}
                                    sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}>
                                    Retake Quiz
                                </Button>
                                <Button onClick={handleShare} variant="contained" color="secondary" startIcon={<ShareIcon />}
                                    sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}>
                                    Share Result
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box textAlign="center" mt={2}>
                                <Chip icon={<QueryStatsIcon />} label={`Your Score: ${score} / ${total}`} color="primary"
                                    sx={{ fontSize: 18, px: 3, py: 1.5, fontWeight: 'bold' }} />
                                <Typography variant="body1" mt={1.5} color="text.secondary">
                                    You got {((score / total) * 100).toFixed(1)}% of the questions correct.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {data.length > 0 ? (
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    sx={{
                                        width: '100%',
                                        height: 360,
                                        p: 5,
                                        position: 'relative',
                                        backgroundColor: theme.palette.background.paper,
                                        borderRadius: 4,
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={1} dataKey="value" label={renderCustomLabel} isAnimationActive>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                            {/* Center label */}
                                            <Label value={`${score}/${total}`} position="center" fill="#1976D2" fontSize={35} fontWeight="bold" />
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.default, border: 'none', borderRadius: 8, color: theme.palette.text.primary, }}
                                            formatter={(value, name) => [`${value}`, name === 'Correct' ? '✅ Correct' : '❌ Incorrect',]} />
                                        <Legend verticalAlign="bottom" iconSize={14} />
                                    </PieChart>

                                </ResponsiveContainer>
                                </Box>
                            ) : (
                                <Typography color="text.secondary" textAlign="center" mt={10}>
                                    No data to display chart.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Snackbar open={snackbarOpen} autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
                    Link copied to clipboard! 📋
                </Alert>
            </Snackbar>

            <Snackbar open={!!errorMsg} autoHideDuration={5000}
                onClose={() => setErrorMsg("")}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="warning" variant="filled" onClose={() => setErrorMsg("")}
                    sx={{ fontWeight: 'bold', fontSize: 16, whiteSpace: 'pre-line' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Paper>
    );
}

export default ResultCard;