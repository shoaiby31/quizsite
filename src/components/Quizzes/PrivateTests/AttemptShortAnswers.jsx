import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Card, CardContent, Typography, Button, Box, TextField,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  doc, getDoc, setDoc, collection, getDocs, serverTimestamp, query, where,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { motion } from "framer-motion";
import CountdownDisplay from "../../CountdownDisplay";

const shuffleArray = (array) =>
  array.map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const AttemptShort = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const warningCountRef = useRef(0);
  const lastWarningTimeRef = useRef(0);
  const location = useLocation();
  const { secretId } = location.state || {};

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

        if (!quizData.isActive) {
          setError("This quiz is currently inactive. Stay tuned!");
          setIsLoading(false);
          return;
        }

        if (quizData.secretid !== secretId) {
          setError("Secret ID does not match.");
          setIsLoading(false);
          return;
        }

        const questionCount = quizData.questionTypes.short.count || 5;
        const timeLimit = (quizData.questionTypes.short.timeLimit || 10) * 60;

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
          const warningCountFromFirestore = attemptData.warningCount || 0;
          setWarningCount(warningCountFromFirestore);
          warningCountRef.current = warningCountFromFirestore;

          if (attemptData.shortQuestions && attemptData.shortQuestions.length > 0) {
            if (attemptData.shortAnswersSubmitted) {
              return navigate(`/start-test/${quizId}`, { state: { secretId } });
            }

            const startTime = attemptData.startTime.toDate();
            const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);

            if (elapsed >= timeLimit) {
              await setDoc(doc(db, "attempts", docSnap.id), {
                shortAnswersSubmitted: true
              }, { merge: true });

              return navigate(`/start-test/${quizId}`, { state: { secretId } });
            }

            setQuestions(attemptData.shortQuestions);
            setAnswers(attemptData.shortAnswers || {});
            setCurrentIdx(attemptData.currentIdx || 0);
            setRemainingTime(Math.max(timeLimit - elapsed, 0));
            setIsLoading(false);
            return;
          } else {
            const questionsSnap = await getDocs(
              query(collection(quizRef, "questions"), where("type", "==", "short"))
            );
            let fetchedQuestions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const selectedQuestions = shuffleArray(fetchedQuestions)
              .slice(0, questionCount);

            await setDoc(doc(db, "attempts", docSnap.id), {
              shortQuestions: selectedQuestions,
              shortAnswers: {},
              shortAnswersSubmitted: false,
              currentIdx: 0,
              startTime: serverTimestamp(),
            }, { merge: true });

            setQuestions(selectedQuestions);
            setAnswers({});
            setCurrentIdx(0);
            setRemainingTime(timeLimit);
            setIsLoading(false);
            return;
          }
        }

        const questionsSnap = await getDocs(
          query(collection(quizRef, "questions"), where("type", "==", "short"))
        );
        let fetchedQuestions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const selectedQuestions = shuffleArray(fetchedQuestions)
          .slice(0, questionCount);

        const newAttemptId = uuidv4();
        const newAttemptRef = doc(db, "attempts", newAttemptId);

        const newAttemptData = {
          userId: user.uid,
          quizId,
          username: user.displayName,
          shortQuestions: selectedQuestions,
          shortAnswers: {},
          shortAnswersSubmitted: false,
          warningCount: warningCount,
          currentIdx: 0,
          startTime: serverTimestamp(),
          secretId,
          className: quizData.class || null,
        };

        await setDoc(newAttemptRef, newAttemptData);
        setAttemptId(newAttemptId);
        setQuestions(selectedQuestions);
        setRemainingTime(timeLimit);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [user, quizId, navigate, secretId, warningCount]);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        shortAnswersSubmitted: true,
        warningCount: 0
      }, { merge: true });
    }

    navigate(`/start-test/${quizId}`, { state: { secretId } });
  }, [attemptId, navigate, quizId, secretId]);

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

  useEffect(() => {
    const triggerWarning = async () => {
      const now = Date.now();
      if (now - lastWarningTimeRef.current > 2000) {
        warningCountRef.current += 1;
        lastWarningTimeRef.current = now;
        setWarningCount(warningCountRef.current);
        setError(`Don't switch tabs! Warning ${warningCountRef.current}/3`);

        if (attemptId) {
          await setDoc(doc(db, "attempts", attemptId), {
            warningCount: warningCountRef.current
          }, { merge: true });
        }

        if (warningCountRef.current >= 3) {
          handleSubmit();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning();
      }
    };

    const handleBlur = () => {
      triggerWarning();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [attemptId, handleSubmit]);

  const handleAnswerChange = async (e) => {
    const value = e.target.value;
    const updatedAnswers = { ...answers, [currentIdx]: value };
    setAnswers(updatedAnswers);

    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        shortAnswers: updatedAnswers
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
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ fontSize: 48 }}>✍️</motion.div>
        <Typography variant="h6" fontWeight="bold" mt={2}>Loading your short answer quiz...</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>Please wait while we grab the questions.</Typography>
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
          {error !== '' &&
            <Box component={motion.div} initial={{ scale: 1 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              sx={{ backgroundColor: "#e3f2fd", borderRadius: "12px", px: 2, py: 1, boxShadow: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight='bold' color="error.main">{error}</Typography>
            </Box>}
          <CountdownDisplay remainingTime={remainingTime} />
        </Box>

        <Typography variant="body1" fontWeight="bold" mt={2}>{currentQuestion.text}</Typography>

        <TextField
          multiline
          minRows={3}
          value={answers[currentIdx] || ""}
          onChange={handleAnswerChange}
          fullWidth
          sx={{ mt: 2 }}
        />

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
    </Card>
  );
};

export default AttemptShort;