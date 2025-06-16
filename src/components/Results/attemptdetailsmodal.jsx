import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent,
    IconButton, Typography, Box
} from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const formatRemainingTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
        hrs.toString().padStart(2, "0"),
        mins.toString().padStart(2, "0"),
        secs.toString().padStart(2, "0"),
    ].join(":");
};

const labelMap = {
    mcq: "MCQs",
    truefalse: "True/False",
    short: "Short Answer"
};

const fieldMap = {
    mcq: {
        questions: "mcqsQuestions",
        submitted: "mcqsSubmitted"
    },
    truefalse: {
        questions: "trueFalseQuestions",
        submitted: "trueFalseSubmitted"
    },
    short: {
        questions: "shortQuestions",
        submitted: "shortAnswersSubmitted"
    }
};

const AttemptDetailsModal = ({ open, onClose, attempt, questionTypesData }) => {
    const [liveAttempt, setLiveAttempt] = useState(null);
    const [remainingTimes, setRemainingTimes] = useState({});

    useEffect(() => {
        if (!open || !attempt?.id) return;

        const unsub = onSnapshot(doc(db, "attempts", attempt.id), (docSnap) => {
            if (docSnap.exists()) {
                setLiveAttempt({ id: docSnap.id, ...docSnap.data() });
            }
        });

        return () => unsub();
    }, [open, attempt?.id]);

    useEffect(() => {
        if (!open || !liveAttempt?.startTime) return;

        const start = liveAttempt.startTime.toDate();

        const updateTimes = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - start.getTime()) / 1000);
            const newRemaining = {};

            for (const type in questionTypesData) {
                if (questionTypesData[type] != null) {
                    const limit = questionTypesData[type]?.timeLimit || 0;
                    const total = limit * 60;
                    const remaining = total - elapsed;
                    newRemaining[type] = remaining > 0 ? remaining : 0;
                }
            }

            setRemainingTimes(newRemaining);
        };

        updateTimes();
        const interval = setInterval(updateTimes, 1000);
        return () => clearInterval(interval);
    }, [open, liveAttempt, questionTypesData]);

    if (!attempt || !liveAttempt) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                ⏰ Live Attempt Status
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} py={1}>
                    <Typography variant="h6" fontWeight="bold" align="center">
                        {attempt.username || "Anonymous"}
                    </Typography>

                    {Object.keys(questionTypesData)
                        .filter(type => questionTypesData[type] != null)
                        .map((type) => {
                            const questionField = fieldMap[type].questions;
                            const submittedField = fieldMap[type].submitted;

                            const questions = liveAttempt?.[questionField] ?? null;
                            const submitted = liveAttempt?.[submittedField] ?? false;
                            const isAttempting = questions && !submitted;
                            const timeLeft = remainingTimes[type] ?? 0;

                            let statusLabel;
                            if (submitted) {
                                statusLabel = "✅ Submitted";
                            } else if (questions) {
                                statusLabel = "🕒 In Progress";
                            } else {
                                statusLabel = "— Not Started";
                            }

                            return (
                                <Box
                                    key={type}
                                    p={1.5}
                                    borderRadius={2}
                                    boxShadow={2}
                                    sx={{
                                        backgroundColor: submitted
                                            ? "#d4edda"
                                            : isAttempting
                                                ? "#fff3cd"
                                                : "#e2e3e5",
                                        color: submitted
                                            ? "#155724"
                                            : isAttempting
                                                ? "#856404"
                                                : "#6c757d"
                                    }}
                                >
                                    <Typography fontWeight="bold">
                                        {labelMap[type]}: {statusLabel}
                                    </Typography>

                                    {isAttempting && (
                                        <Box
                                            component={motion.div}
                                            initial={{ scale: 1 }}
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            sx={{
                                                mt: 1,
                                                backgroundColor: timeLeft <= 60 ? "error.main" : "primary.main",
                                                color: "#fff",
                                                borderRadius: 1,
                                                py: 0.5,
                                                px: 2,
                                                textAlign: "center",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            ⏱ {formatRemainingTime(timeLeft)}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AttemptDetailsModal;