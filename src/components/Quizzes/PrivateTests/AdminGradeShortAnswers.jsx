import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, TextField,
  Button, Box, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { getDocs, collection, doc, setDoc, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";

const AdminGradeShortAnswers = () => {
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState("");
  const [gradingData, setGradingData] = useState({});

  useEffect(() => {
    const fetchAttempts = async () => {
      const q = query(
        collection(db, "attempts"),
        where("quizId", "==", quizId),
        where("shortAnswersSubmitted", "==", true)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAttempts(list);
    };
    fetchAttempts();
  }, [quizId]);

  const handleGradingChange = (qIdx, field, value) => {
    setGradingData(prev => ({
      ...prev,
      [qIdx]: {
        ...prev[qIdx],
        [field]: field === "score" ? Math.max(0, parseInt(value) || 0) : value
      }
    }));
  };

  const saveGrades = async () => {
    if (!selectedAttemptId) return;

    const scores = Object.values(gradingData).reduce((acc, val) => acc + (parseInt(val.score) || 0), 0);
    await setDoc(doc(db, "attempts", selectedAttemptId), {
      shortAnswersGraded: true,
      shortGradingDetails: gradingData,
      shortScore: scores
    }, { merge: true });

    alert("Grades saved!");
  };

  const selectedAttempt = attempts.find(a => a.id === selectedAttemptId);
  const answersArray = selectedAttempt?.shortAnswers
    ? Object.values(selectedAttempt.shortAnswers)
    : [];

  const totalScore = Object.values(gradingData).reduce(
    (sum, val) => sum + (parseInt(val.score) || 0),
    0
  );

  return (
    <Box>
      <Typography variant="h5" mb={2}>Short Answer Grading</Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Attempt</InputLabel>
        <Select
          value={selectedAttemptId}
          onChange={(e) => {
            setSelectedAttemptId(e.target.value);
            setGradingData({}); // reset grading data on attempt change
          }}
          label="Select Attempt"
        >
          {attempts.map(a => (
            <MenuItem key={a.id} value={a.id}>
              {a.username || "Unknown User"} ({a.id.slice(0, 6)})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedAttempt && answersArray.map((answer, idx) => {
        const question = selectedAttempt.shortQuestions?.[idx];
        const correctAnswer = question?.answer || "";

        return (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Q{idx + 1}: {question?.text || "Question not available"}
              </Typography>

              <Typography mt={1}><b>Student Answer:</b> {answer}</Typography>
              <Typography mt={1} color="green"><b>Correct Answer:</b> {correctAnswer}</Typography>

              <TextField
                label="Score"
                type="number"
                fullWidth
                sx={{ mt: 2 }}
                value={gradingData[idx]?.score || ""}
                onChange={(e) => handleGradingChange(idx, "score", e.target.value)}
              />

              <TextField
                label="Comment"
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
                value={gradingData[idx]?.comment || ""}
                onChange={(e) => handleGradingChange(idx, "comment", e.target.value)}
              />
            </CardContent>
          </Card>
        );
      })}

      {selectedAttempt && (
        <Box>
          <Typography variant="h6" mt={2}>Total Score: {totalScore}</Typography>
          <Button variant="contained" onClick={saveGrades} sx={{ mt: 2 }}>
            Save Grades
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AdminGradeShortAnswers;