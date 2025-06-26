import React, { useCallback, useEffect, useState } from "react";
import {
  Card, CardContent, Typography, RadioGroup,
  FormControlLabel, Radio, Button, Box, Snackbar, Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { motion } from "framer-motion";
import CountdownDisplay from "../Hooks/CountdownDisplay";

const shuffleArray = (array) =>
  array.map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user || !quizId) return;

    const fetchQuiz = async () => {
      try {
        const quizRef = doc(db, "quizzes", quizId);
        const quizSnap = await getDoc(quizRef);
        if (!quizSnap.exists()) throw new Error("Quiz not found.");
    
        const quizData = quizSnap.data();
        setTitle(quizData.title);
    
        const questionCount = quizData.questionCount || 10;
        const timeLimit = (quizData.timeLimit || 5) * 60; // seconds
    
        // Check if user has an existing attempt
        const attemptQuery = query(
          collection(db, "attempts"),
          where("userId", "==", user.uid),
          where("quizId", "==", quizId)
        );
        const attemptSnap = await getDocs(attemptQuery);
    
        if (!attemptSnap.empty) {
          const docSnap = attemptSnap.docs[0];
          const attemptData = docSnap.data();
          setAttemptId(docSnap.id);
    
          // Already submitted? Redirect to result.
          if (attemptData.submitted) {
            const pieData = [
              { name: "Correct", value: attemptData.score },
              { name: "Incorrect", value: attemptData.totalScore - attemptData.score }
            ];
            return navigate("/result", {
              state: {
                quizId,
                title: quizData.title,
                data: pieData,
                score: attemptData.score,
                length: attemptData.questions.length,
                totalScore: attemptData.totalScore
              }
            });
          }
    
          const startTime = attemptData.startTime.toDate();
          const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    
          // Time expired — auto-submit silently
          if (elapsed >= timeLimit) {
            const storedQuestions = attemptData.questions;
            const storedAnswers = attemptData.answers || {};
    
            let score = 0;
            storedQuestions.forEach((q, idx) => {
              const correct = q.options.find(o => o.isCorrect)?.text;
              if (storedAnswers[idx] === correct) score++;
            });
    
            await setDoc(doc(db, "attempts", docSnap.id), {
              submitted: true,
              score,
              totalScore: storedQuestions.length
            }, { merge: true });
    
            const pieData = [
              { name: "Correct", value: score },
              { name: "Incorrect", value: storedQuestions.length - score }
            ];
    
            return navigate("/result", {
              state: {
                quizId,
                title: quizData.title,
                data: pieData,
                score,
                length: storedQuestions.length,
                totalScore: storedQuestions.length
              }
            });
          }
    
          // Time remaining — resume quiz
          setQuestions(attemptData.questions);
          setAnswers(attemptData.answers || {});
          setCurrentIdx(attemptData.currentIdx || 0);
          setRemainingTime(Math.max(timeLimit - elapsed, 0));
          setIsLoading(false);
          return;
        }
    
        // No previous attempt — start new quiz
        const questionsSnap = await getDocs(collection(quizRef, "questions"));
        let fetchedQuestions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        if (!fetchedQuestions.length) {
          setIsLoading(false);
          return;
        }
    
        const selectedQuestions = shuffleArray(fetchedQuestions)
          .slice(0, questionCount)
          .map(q => ({ ...q, options: shuffleArray(q.options) }));
    
        const newAttemptId = uuidv4();
        const newAttemptRef = doc(db, "attempts", newAttemptId);
    
        const newAttemptData = {
          userId: user.uid,
          quizId,
          username: user.displayName,
          questions: selectedQuestions,
          answers: {},
          submitted: false,
          score: 0,
          totalScore: selectedQuestions.length,
          startTime: serverTimestamp(),
          currentIdx: 0
        };
    
        await setDoc(newAttemptRef, newAttemptData);
        const newSnap = await getDoc(newAttemptRef);
        newSnap.data().startTime.toDate();
    
        setAttemptId(newAttemptId);
        setQuestions(selectedQuestions);
        setRemainingTime(timeLimit); // fresh start
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [user, quizId, navigate]);

  const handleSubmit = useCallback(async () => {
    let calculatedScore = 0;

    questions.forEach((q, idx) => {
      const correct = q.options.find(o => o.isCorrect)?.text;
      if (answers[idx] === correct) calculatedScore++;
    });

    setSubmitted(true);

    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        submitted: true,
        score: calculatedScore,
        totalScore: questions.length
      }, { merge: true });
    }

    const pieData = [
      { name: "Correct", value: calculatedScore },
      { name: "Incorrect", value: questions.length - calculatedScore }
    ];

    navigate("/result", {
      state: {
        quizId, title, data: pieData,
        score: calculatedScore,
        length: questions.length,
        totalScore: questions.length
      }
    });
  }, [answers, questions, attemptId, navigate, quizId, title]);

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
  }, [remainingTime, submitted, handleSubmit]);

  const handleOptionChange = async (e) => {
    const updatedAnswers = { ...answers, [currentIdx]: e.target.value };
    setAnswers(updatedAnswers);

    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        answers: updatedAnswers
      }, { merge: true });
    }
  };

  const handleNavigation = async (direction) => {
    const newIndex = direction === "next"
      ? Math.min(currentIdx + 1, questions.length - 1)
      : Math.max(currentIdx - 1, 0);

    setCurrentIdx(newIndex);

    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        currentIdx: newIndex
      }, { merge: true });
    }
  };

  if (isLoading) {
    return (
      <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={8}>
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ fontSize: 48 }}>🧠</motion.div>
        <Typography variant="h6" fontWeight="bold" mt={2}>Loading your quiz...</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>Please wait while we think of some tricky questions 🤔</Typography>
      </Box>
    );
  }

  if (!questions.length) {
    return (
      <Box textAlign="center" mt={8}>
        <SentimentDissatisfiedIcon color="disabled" sx={{ fontSize: 60 }} />
        <Typography variant="h4" fontWeight="bold" mt={2}>Oops! No Questions Found 😕</Typography>
      </Box>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <Card sx={{ px: { xs: 2, md: 5 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Question {currentIdx + 1} of {questions.length}</Typography>

          <CountdownDisplay remainingTime={remainingTime}/>
        </Box>

        <Typography variant="body1" fontWeight="bold" mt={2}>{currentQuestion.text}</Typography>

        <RadioGroup value={answers[currentIdx] || ""} onChange={handleOptionChange} sx={{ mt: 2 }}>
          {currentQuestion.options.map((opt, i) => (
            <FormControlLabel key={i} value={opt.text} control={<Radio />} label={opt.text}/>
          ))}
        </RadioGroup>

        <Box mt={3} display="flex">
          <Button variant="outlined" onClick={() => handleNavigation("prev")} disabled={currentIdx === 0} sx={{ mx: 1 }}>Previous</Button>
          <Button variant="contained" onClick={() => {
              if (currentIdx === questions.length - 1) handleSubmit();
              else handleNavigation("next");
            }}>
            {currentIdx === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </CardContent>

      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
        <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Card>
  );
};

export default AttemptQuiz;