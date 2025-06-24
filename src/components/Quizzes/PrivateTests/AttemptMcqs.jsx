import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Card, CardContent, Typography, RadioGroup,
  FormControlLabel, Radio, Button, Box,
  Grid,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, query, where } from "firebase/firestore";
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

const AttemptMcqs = () => {
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
  const [isPublic, setIsPublic] = useState(true);

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
        // Check if quiz is active and if the secretId matches
        if (!quizData.isActive) {
          setError("This quiz is currently inactive. Stay tuned!");
          setIsLoading(false);
          return;
        }
        setIsPublic(quizData.isPublic)


        if (quizData.secretid !== secretId && quizData.secretid !== "") {
          setError("Secret ID does not match.");
          setIsLoading(false);
          return;
        }

        const questionCount = quizData.questionTypes.mcq.count || 10;
        const timeLimit = (quizData.questionTypes.mcq.timeLimit || 5) * 60; // seconds

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
          const warningCountFromFirestore = attemptData.warningCount || 0;
          setWarningCount(warningCountFromFirestore);
          warningCountRef.current = warningCountFromFirestore;

          // Check if mcqsQuestions exist
          if (attemptData.mcqsQuestions && attemptData.mcqsQuestions.length > 0) {
            // Already submitted? Redirect to result.
            if (attemptData.mcqsSubmitted) {
              if (isPublic) {
                return navigate(`/start-public-test/${quizId}`)
              } else {
                return navigate(`/start-test/${quizId}`, { state: { secretId } })
              }
            }

            const startTime = attemptData.startTime.toDate();
            const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);

            // Time expired — auto-submit silently
            if (elapsed >= timeLimit) {
  const storedQuestions = attemptData.mcqsQuestions;
  const storedAnswers = attemptData.mcqsAnswers || {};

  let score = 0;

  storedQuestions.forEach((q, idx) => {
    const correctOption = q.options.find(opt => opt.isCorrect);
    const userAnswer = storedAnswers[idx];

    if (userAnswer && correctOption && userAnswer === correctOption.text) {
      score++;
    }
  });

  await setDoc(doc(db, "attempts", docSnap.id), {
    mcqsSubmitted: true,
    mcqsScore: score,
    totalMcqsScore: storedQuestions.length
  }, { merge: true });

  if (isPublic) {
    return navigate(`/start-public-test/${quizId}`);
  } else {
    return navigate(`/start-test/${quizId}`, { state: { secretId } });
  }
}

            // Time remaining — resume quiz
            setQuestions(attemptData.mcqsQuestions);
            setAnswers(attemptData.mcqsAnswers || {});
            setCurrentIdx(attemptData.currentIdx || 0);
            setRemainingTime(Math.max(timeLimit - elapsed, 0));
            setIsLoading(false);
            return;
          } else {
            // mcqsQuestions do not exist — fetch from quiz
            const questionsSnap = await getDocs(
              query(collection(quizRef, "questions"), where("type", "==", "mcq"))
            );
            let fetchedQuestions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (!fetchedQuestions.length) {
              setIsLoading(false);
              return;
            }

            const selectedQuestions = shuffleArray(fetchedQuestions)
              .slice(0, questionCount)
              .map(q => ({ ...q, options: shuffleArray(q.options) }));

            await setDoc(doc(db, "attempts", docSnap.id), {
              mcqsQuestions: selectedQuestions,
              mcqsAnswers: {},
              mcqsSubmitted: false,
              mcqsScore: 0,
              currentIdx: 0,
              totalMcqsScore: selectedQuestions.length,
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

        // No previous attempt — start new quiz
        const questionsSnap = await getDocs(
          query(collection(quizRef, "questions"), where("type", "==", "mcq"))
        );
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

        // 🔍 Fetch roll number from studentTeacherRelations
        let rollNo = null;

        try {
          const relationQuery = query(
            collection(db, "studentTeacherRelations"),
            where("userId", "==", user.uid)
          );
          const relationSnap = await getDocs(relationQuery);
          if (!relationSnap.empty) {
            const relationData = relationSnap.docs[0].data();
            rollNo = relationData.rollNo || null;
          }
        } catch (err) {
          console.warn("Error fetching roll number:", err.message);
        }


        const newAttemptData = {
          userId: user.uid,
          quizId,
          username: user.displayName,
          mcqsQuestions: selectedQuestions,
          mcqsAnswers: {},
          mcqsSubmitted: false,
          warningCount: warningCount,
          mcqsScore: 0,
          totalMcqsScore: selectedQuestions.length,
          startTime: serverTimestamp(),
          currentIdx: 0,
          secretId: secretId || null,
          title: quizData.title,
          className: quizData.class || null,
          rollNo: rollNo || null  // ✅ Save rollNo here
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
  }, [user, quizId, navigate, secretId, warningCount, isPublic]);

  const handleSubmit = useCallback(async () => {
    let calculatedScore = 0;

    questions.forEach((q, idx) => {
      const correct = q.options.find(o => o.isCorrect)?.text;
      if (answers[idx] === correct) calculatedScore++;
    });

    setSubmitted(true);

    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        mcqsSubmitted: true,
        mcqsScore: calculatedScore,
        totalMcqsScore: questions.length,
        warningCount: 0,
        currentIdx: 0,
      }, { merge: true });
    }
    if (isPublic) {
      navigate(`/start-public-test/${quizId}`)
    } else {
      navigate(`/start-test/${quizId}`, { state: { secretId } })
    }

  }, [answers, questions, attemptId, navigate, quizId, secretId, isPublic]);

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


  const handleOptionChange = async (e) => {
    const selectedAnswer = e.target.value;
    const updatedAnswers = { ...answers, [currentIdx]: selectedAnswer };

    // Update the answer locally
    setAnswers(updatedAnswers);

    // Calculate the live score
    let updatedScore = 0;
    questions.forEach((q, idx) => {
      const correct = q.options.find(o => o.isCorrect)?.text;
      if (updatedAnswers[idx] === correct) updatedScore++;
    });

    // Update the live score on Firebase (assuming the score is stored in the attempt document)
    if (attemptId) {
      await setDoc(doc(db, "attempts", attemptId), {
        mcqsAnswers: updatedAnswers,
        mcqsScore: updatedScore
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
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 6, md: 4, xl:3 }}>
            <Typography variant="h6">Question {currentIdx + 1} of {questions.length}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 4 , xl:2 }}>
            <CountdownDisplay remainingTime={remainingTime} />
          </Grid>
          <Grid size={{ xs: 12, md: 4, xl:3 }}>
            {error !== '' &&
              <Box component={motion.div} initial={{ scale: 1 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                sx={{ backgroundColor: "#e3f2fd", maxWidth:'350px', borderRadius: "12px", px: 2, py: 1, boxShadow: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" fontWeight='bold' color="error.main">{error}</Typography>
              </Box>}
          </Grid>
        </Grid>

        <Typography variant="body1" fontWeight="bold" mt={2}>{currentQuestion.text}</Typography>

        <RadioGroup value={answers[currentIdx] || ""} onChange={handleOptionChange} sx={{ mt: 2 }}>
          {currentQuestion.options.map((opt, i) => (
            <FormControlLabel key={i} value={opt.text} control={<Radio />} label={opt.text} />
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

      {/* <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
                <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>
            </Snackbar> */}
    </Card>
  );
};

export default AttemptMcqs;