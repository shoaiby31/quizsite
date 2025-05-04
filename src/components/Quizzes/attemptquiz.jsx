import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, Button, Box, Snackbar, Alert} from "@mui/material";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, query, where, getDocs as getDocsFromQuery} from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import Resultcard from "./resultcard";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { motion } from "framer-motion";

// Utility functions
const shuffleArray = (array) => array
  .map(item => ({ item, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ item }) => item);

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user || !quizId) return;

    const fetchData = async () => {
      const quizRef = doc(db, "quizzes", quizId);
      const quizSnap = await getDoc(quizRef);

      if (!quizSnap.exists()) {
        setError("Quiz not found.");
        return;
      }

      const quizData = quizSnap.data();
      setTitle(quizData.title);
      const questionCount = quizData.questionCount || 10;
      const limitInSeconds = (quizData.timeLimit || 5) * 60;

      const questionsRef = collection(quizRef, "questions");
      const questionsSnap = await getDocs(questionsRef);
      let fetchedQuestions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (fetchedQuestions.length === 0) {
        setIsLoading(false);
        return;
      }

      // Limit and shuffle questions
      fetchedQuestions = shuffleArray(fetchedQuestions);
      const selectedQuestions = fetchedQuestions.slice(0, questionCount).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

      // Check existing attempt
      const attemptsRef = collection(db, "attempts");
      const q = query(attemptsRef, where("userId", "==", user.uid), where("quizId", "==", quizId));
      const qSnap = await getDocsFromQuery(q);

      let startTime, savedData;

      if (!qSnap.empty) {
        const docSnap = qSnap.docs[0];
        savedData = docSnap.data();
        setAttemptId(docSnap.id);

        if (savedData.submitted) {
          setSubmitted(true);
          setScore(savedData.score);
          setTotalScore(savedData.totalScore);
          setQuestions(savedData.questions);
          setAnswers(savedData.answers || {});
          setCurrentIdx(savedData.currentIdx || 0);
          setError("You have already submitted this quiz.");
          setIsLoading(false);
          return;
        }

        setQuestions(savedData.questions);
        setAnswers(savedData.answers || {});
        setCurrentIdx(savedData.currentIdx || 0);
        startTime = savedData.startTime.toDate();
      } else {
        const newAttemptId = uuidv4();
        const newAttemptRef = doc(db, "attempts", newAttemptId);
        await setDoc(newAttemptRef, {
          userId: user.uid,
          quizId: quizId,
          questions: selectedQuestions,
          answers: {},
          submitted: false,
          score: 0,
          totalScore: selectedQuestions.length,
          startTime: serverTimestamp(),
          currentIdx: 0
        });
        setAttemptId(newAttemptId);
        setQuestions(selectedQuestions);

        const newSnap = await getDoc(newAttemptRef);
        startTime = newSnap.data().startTime.toDate();
      }

      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const remaining = Math.max(limitInSeconds - elapsed, 0);
      setRemainingTime(remaining);
      setIsLoading(false);
    };

    fetchData();
  }, [user, quizId]);

  const handleSubmit = useCallback(async () => {
    let calculatedScore = 0;
  
    questions.forEach((q, idx) => {
      const correct = q.options.find(o => o.isCorrect)?.text;
      if (answers[idx] === correct) calculatedScore++;
    });
  
    setScore(calculatedScore);
    setSubmitted(true);
    setTotalScore(questions.length);
  
    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        submitted: true,
        score: calculatedScore,
        totalScore: questions.length
      }, { merge: true });
    }
  }, [answers, questions, attemptId]);

  useEffect(() => {
  if (submitted || remainingTime === null) return;

  const timer = setInterval(() => {
    setRemainingTime(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        handleSubmit(); // ✅ Now safe to use
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

  

  const handleCloseError = () => setError("");

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
        <Typography variant="h4" fontWeight="bold" mt={2}>
          Oops! No Questions Found 😕
        </Typography>
      </Box>
    );
  }

  if (submitted) {
    const pieData = [
      { name: "Correct", value: score },
      { name: "Incorrect", value: totalScore - score }
    ];
    return <Resultcard quizId={quizId} title={title} data={pieData} score={score} length={questions.length} totalScore={totalScore} />;
  }

  const currentQuestion = questions[currentIdx];

  return (
    <Card sx={{ px: { xs: 2, md: 5 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Question {currentIdx + 1} of {questions.length}
          </Typography>
          <Typography variant="h6" color={remainingTime <= 60 ? "error" : "primary"}>
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

        <Box mt={3} display="flex" justifyContent="left">
          <Button
            variant="outlined"
            onClick={() => handleNavigation("prev")}
            disabled={currentIdx === 0}
            sx={{mx:1}}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (currentIdx === questions.length - 1) handleSubmit();
              else handleNavigation("next");
            }}
          >
            {currentIdx === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </CardContent>

      <Snackbar open={!!error} autoHideDuration={3000} onClose={handleCloseError}>
        <Alert severity="warning" onClose={handleCloseError}>
          {error}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AttemptQuiz;