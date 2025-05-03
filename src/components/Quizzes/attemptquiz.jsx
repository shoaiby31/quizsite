import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, Button, LinearProgress, Box, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, query, where, getDocs as getDocsFromQuery } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define colors for correct and incorrect
const COLORS = ["#00C49F", "#FF6B6B"];

const AttemptQuiz = () => {
    const { quizId } = useParams();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track if the user is loaded

    const [questions, setQuestions] = useState([]);
    //   const [timeLimit, setTimeLimit] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);

    const [error, setError] = useState("");
    const [attemptId, setAttemptId] = useState(null);

    // Track user login state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setIsLoading(false); // Set loading to false once user data is available
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [auth]);

    // Fetch quiz, user attempt, and start time
    useEffect(() => {
        if (isLoading || !user || !quizId) return; // Don't fetch until the user is ready and authenticated

        const fetchData = async () => {
            const quizRef = doc(db, "quizzes", quizId);
            const quizSnap = await getDoc(quizRef);
            if (!quizSnap.exists()) {
                setError("Quiz not found.");
                return;
            }

            const quizData = quizSnap.data();
            const limitInSeconds = (quizData.timeLimit || 5) * 60;
            //   setTimeLimit(limitInSeconds);

            // Check if user already has an attempt
            const attemptsRef = collection(db, "attempts");
            const q = query(attemptsRef, where("userId", "==", user.uid), where("quizId", "==", quizId));
            const qSnap = await getDocsFromQuery(q);

            let startTime;
            if (!qSnap.empty) {
                const attemptDoc = qSnap.docs[0];
                const data = attemptDoc.data();
                setAttemptId(attemptDoc.id);

                if (data.submitted) {
                    setSubmitted(true);
                    setScore(data.score)
                    setTotalScore(data.totalScore)
                    setError("You have already submitted this quiz.");
                    return;
                }

                startTime = data.startTime.toDate();
            } else {
                const newAttemptId = uuidv4();
                const newAttemptRef = doc(db, "attempts", newAttemptId); // Correct collection name
                await setDoc(newAttemptRef, {
                    userId: user.uid,
                    quizId: quizId,
                    startTime: serverTimestamp(),
                    submitted: false,
                    score: 0
                });
                setAttemptId(newAttemptId);

                // Wait to get accurate server timestamp
                const newSnap = await getDoc(newAttemptRef);
                startTime = newSnap.data().startTime.toDate();
            }

            const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
            const remaining = Math.max(limitInSeconds - elapsed, 0);
            setRemainingTime(remaining);

            const questionsRef = collection(quizRef, "questions");
            const questionsSnap = await getDocs(questionsRef);
            const data = questionsSnap.docs.map(doc => doc.data());
            setQuestions(data);
        };

        fetchData();
    }, [quizId, user, isLoading]);

    // Timer countdown
    useEffect(() => {
        if (submitted || remainingTime === null) return;

        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    });

    const handleOptionChange = (e) => {
        setAnswers({ ...answers, [currentIdx]: e.target.value });
    };

    const handleNext = () => {
        if (!answers[currentIdx]) {
            setError("Please select an option before continuing.");
            return;
        }
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        let newScore = 0;
        questions.forEach((q, idx) => {
            const correctOption = q.options.find(o => o.isCorrect);
            if (answers[idx] === correctOption?.text) {
                newScore++;
            }
        });

        setScore(newScore);
        setSubmitted(true);

        if (attemptId) {
            const attemptRef = doc(db, "attempts", attemptId);
            await setDoc(attemptRef, {
                submitted: true,
                score: newScore,
                totalScore: questions.length

            }, { merge: true });
        }
    };

    const handleCloseError = () => setError("");

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if ((isLoading || !questions.length || remainingTime === null) && !submitted) {
        return <LinearProgress sx={{ mt: 4 }} />;
    }

    if (submitted) {
        const pieData = [
            { name: "Correct", value: score },
            { name: "Incorrect", value: questions.length === 0 ? totalScore : questions.length - score },
        ];

        return (
            <Box px={{xs:2, md:5}}>
                <Card sx={{ borderRadius: 4 }} elevation={0}>
                    <CardContent>
                        <Typography variant="h5" textAlign="center" gutterBottom>🎉 Quiz Completed!</Typography>

                        <Box sx={{ height: 300, mt: 4 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`} isAnimationActive={true}>
                                        {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" iconSize={12} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>

                        <Typography variant="h6" textAlign="center" mt={3} color="info">
                            Your Score: {score} out of {questions.length === 0 ? totalScore : questions.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    const currentQuestion = questions[currentIdx];

    return (
        <Card sx={{ px: { xs: 2, md: 5 } }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Question {currentIdx + 1} of {questions.length}
                    </Typography>
                    <Typography
                        variant="h6"
                        color={remainingTime <= 60 ? "error" : "primary"}
                        fontWeight="bold"
                    >
                        ⏳ {formatTime(remainingTime)}
                    </Typography>
                </Box>

                <Typography variant="body1" fontWeight="bold" mt={2}>
                    {currentQuestion.text}
                </Typography>

                <RadioGroup
                    value={answers[currentIdx] || ""}
                    onChange={handleOptionChange}
                    sx={{ mt: 2 }}
                >
                    {currentQuestion.options.map((opt, i) => (
                        <FormControlLabel
                            key={i}
                            value={opt.text}
                            control={<Radio />}
                            label={opt.text}
                        />
                    ))}
                </RadioGroup>

                <Box mt={3}>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        fullWidth
                        color="primary"
                    >
                        {currentIdx === questions.length - 1 ? "Submit" : "Next"}
                    </Button>
                </Box>
            </CardContent>

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={handleCloseError}
            >
                <Alert severity="warning" onClose={handleCloseError}>
                    {error}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default AttemptQuiz;