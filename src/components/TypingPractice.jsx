import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const TypingPractice = () => {
  const [text] = useState(
    "dictator or another powerful person is the head of such a state. he uses a strong army and a police force to keep law and order. he is often a strong, authoritarian leader who is, at the beginning, admired by many people. fascism first appeared after world war i when benito mussolini came to power in italy. in germany of the adolf hitlers national socialism rose to power. fascism also appeared in japan, spain and argentina. life in a fascist regime fascist governments control the way people live. those who criticize the government or do not obey are punished. they must leave the country, go to prison or are often executed. fascist leaders want to make their state strong and powerful. they claim that only the strongest and fittest in the population can survive. with the help of a strong army they go to war and expand their territory. school teachers show children that only the state is important. pupils must exercise to stay healthy. young organizations are often created in which children admire the state and learn slogans and songs. they are trained to march and follow the beliefs of the ruling party. fascist governments try to give all people work, mainly in the industries they need. they build roads, hospitals and industries which help them rise to power. in fascist countries no other political parties are allowed. the government controls newspapers, radio and television. there is no freedom of speech. fascism became a strong movement during the first part of the century for many reasons. most states had no experience with democracy because they were ruled by a king or queen. after world war i many people were disappointed and angry because the war destroyed a lot of their country or because"
  );

  // ⏱ allow changing test time
  const [selectedTime, setSelectedTime] = useState(60);
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0,
  });

  const inputRef = useRef(null);
  const beforeRef = useRef(null);
  const timerRef = useRef(null);
  const typedTextRef = useRef("");
  const timeLeftRef = useRef(selectedTime);
  const LEFT_PADDING = 12;
  const [shiftX, setShiftX] = useState(0);

  // Keep refs updated
  useEffect(() => {
    typedTextRef.current = typedText;
    timeLeftRef.current = timeLeft;
  }, [typedText, timeLeft]);

  // ✅ Result Calculation
  const calculateResults = useCallback(() => {
    const finalTyped = typedTextRef.current;
    const remainingTime = timeLeftRef.current;
    const elapsedSeconds = selectedTime - remainingTime;

    const typedWordsArr = finalTyped.trim().length
      ? finalTyped.trim().split(/\s+/)
      : [];
    const wordsTyped = typedWordsArr.length;

    const correctChars = finalTyped
      .split("")
      .filter((ch, i) => ch === text[i]).length;

    const accuracy =
      finalTyped.length > 0
        ? (correctChars / finalTyped.length) * 100
        : 0;

    const timeInMinutes =
      elapsedSeconds > 0 ? elapsedSeconds / 60 : 1 / 60;

    const grossSpeed = Math.round(wordsTyped / timeInMinutes);
    const netSpeed = Math.round(grossSpeed * (accuracy / 100));

    setStats({
      grossSpeed,
      netSpeed,
      accuracy: accuracy.toFixed(1),
    });
  }, [text, selectedTime]);

  const startInternalTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsRunning(false);
          setShowResult(true);
          calculateResults();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [calculateResults]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const beforeWidth = beforeRef.current
      ? beforeRef.current.getBoundingClientRect().width
      : 0;
    const newShift = Math.max(0, beforeWidth - LEFT_PADDING);
    setShiftX(newShift);
  }, [typedText]);

  const handleStart = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTypedText("");
    setTimeLeft(selectedTime);
    setIsRunning(false);
    setShowResult(false);
    setStats({ grossSpeed: 0, netSpeed: 0, accuracy: 0 });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length < typedText.length) return;
    if (value.length > text.length) return;

    if (!isRunning && value.length === 1) {
      setIsRunning(true);
      setTimeout(() => startInternalTimer(), 50);
    }
    setTypedText(value);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const currentIndex = typedText.length;
  const beforeChar = text.slice(0, currentIndex);
  const currentChar = text[currentIndex] || " ";
  const afterChar = text.slice(currentIndex + 1);

  return (
    <Box
      sx={{
        bgcolor: "black",
        color: "red",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {!showResult ? (
        <>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Typing Practice
          </Typography>

          {/* ⏱ Time Selector */}
          {!isRunning && (
            <FormControl sx={{ mb: 2, minWidth: 150 }}>
              <InputLabel sx={{ color: "red" }}>Select Time</InputLabel>
              <Select
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(Number(e.target.value));
                  setTimeLeft(Number(e.target.value));
                }}
                sx={{
                  color: "white",
                  border: "1px solid red",
                  "& .MuiSvgIcon-root": { color: "red" },
                }}
              >
                <MenuItem value={15}>15 seconds</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={120}>2 minutes</MenuItem>
              </Select>
            </FormControl>
          )}

          <Typography variant="h6" sx={{ mb: 1 }}>
            Time Left: {formatTime(timeLeft)}
          </Typography>
          <Box sx={{ width: "80%", mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / selectedTime) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: "#333",
                "& .MuiLinearProgress-bar": { backgroundColor: "red" },
              }}
            />
          </Box>

          {/* Text area */}
          <Box
            sx={{
              position: "relative",
              width: "80%",
              bgcolor: "#111",
              border: "1px solid red",
              borderRadius: "8px",
              overflow: "hidden",
              px: `${LEFT_PADDING}px`,
            }}
          >
            <TextField
              fullWidth
              inputRef={inputRef}
              value={typedText}
              onChange={handleChange}
              disabled={timeLeft === 0}
              autoComplete="off"
              variant="outlined"
              InputProps={{
                style: {
                  color: "transparent",
                  caretColor: "transparent",
                  backgroundColor: "transparent",
                  fontSize: "18px",
                  fontFamily: "monospace",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: `translateX(-${shiftX}px) translateY(-50%)`,
                whiteSpace: "nowrap",
                fontFamily: "monospace",
                fontSize: "18px",
                color: "red",
                transition: "transform 0.08s linear",
                pointerEvents: "none",
              }}
            >
              <span ref={beforeRef} style={{ opacity: 0.4 }}>
                {beforeChar}
              </span>
              <span
                style={{
                  backgroundColor: "red",
                  color: "black",
                  borderRadius: 3,
                  padding: "0 2px",
                }}
              >
                {currentChar}
              </span>
              <span>{afterChar}</span>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            {!isRunning && timeLeft > 0 && (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "red",
                  color: "white",
                  "&:hover": { bgcolor: "#cc0000" },
                  px: 4,
                  py: 1,
                }}
                onClick={handleStart}
              >
                Start Typing
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: "center", color: "red", mt: -10 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Test Finished
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Gross Speed: {stats.grossSpeed} WPM
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Net Speed: {stats.netSpeed} WPM
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Accuracy: {stats.accuracy}%
          </Typography>
          <Button
            variant="contained"
            onClick={handleStart}
            sx={{
              bgcolor: "red",
              color: "black",
              fontWeight: "bold",
              "&:hover": { bgcolor: "darkred", color: "white" },
            }}
          >
            Retry
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TypingPractice;
