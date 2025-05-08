import { Box } from '@mui/material'
import React from 'react'
import { motion } from "framer-motion";

function CountdownDisplay({ remainingTime }) {
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <Box component={motion.div} initial={{ scale: 1 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
      sx={{
        backgroundColor: remainingTime <= 60 ? "#ffebee" : "#e3f2fd", color: remainingTime <= 60 ? "error.main" : "primary.main", borderRadius: "12px", px: 2, py: 1, fontWeight: "bold", fontSize: "1.25rem", boxShadow: 2,
        display: "flex", alignItems: "center", gap: 1
      }}>
      ⏳ {formatTime(remainingTime)}
    </Box>
  )
}

export default CountdownDisplay
