import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
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

const AttemptDetailsModal = ({ open, onClose, attempt, timeLimit }) => {
    const [liveAttempt, setLiveAttempt] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [showTime, setShowTime] = useState(false);

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
        if (!open || !liveAttempt?.startTime || liveAttempt.submitted) {
            setRemainingTime(null);
            return;
        }

        const calculateRemaining = () => {
            const start = liveAttempt.startTime.toDate();
            const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
            const total = parseInt(timeLimit) * 60;
            const remaining = total - elapsed;
            setRemainingTime(remaining > 0 ? remaining : 0);
            setTimeout(() => setShowTime(true), 100); // Trigger simple fade animation
        };

        calculateRemaining();
        const interval = setInterval(calculateRemaining, 1000);
        return () => clearInterval(interval);
    }, [open, liveAttempt, timeLimit]);

    if (!attempt || !liveAttempt) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                ⏰ Live Time Tracker
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={2}>
                    <Typography variant="h6" fontWeight="bold">{attempt.username || "Anonymous"}</Typography>
                    <Typography fontSize={20} gutterBottom fontWeight="bold" color="primary">
                           {showTime}Live Score: {attempt.score+'/'+attempt.totalScore}
                        </Typography>
                    <Box textAlign="center">
                        
                        <Box component={motion.div} initial={{ scale: 1 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                            sx={{
                                backgroundColor: remainingTime <= 60 ? "error.main" : "#3cb570", color: remainingTime <= 60 ? "#ffebee" : "#fff", borderRadius: "12px", px: 2, py: 1, fontWeight: "bold", fontSize: "1.25rem", boxShadow: 2,
                                display: "flex", alignItems: "center", gap: 1
                            }}>

                            <Box component="span">
                                ⏱ {remainingTime !== null ? formatRemainingTime(remainingTime) : "00:00:00"}
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AttemptDetailsModal;