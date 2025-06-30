import React, { useEffect, useState } from "react";
import {
    Paper, Typography, Box, Avatar, Stack, Divider,
    Skeleton
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { db } from "../../config/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#90caf9", "#a5d6a7"];

const TopScorersCard = () => {
    const [loading, setLoading] = useState(true);
    const [topScorers, setTopScorers] = useState([]);

    useEffect(() => {
        const fetchTopScorers = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, "attempts"),
                    where("adminUid", "==", currentUser.uid),
                    where("rollNo", "!=", ""), // ✅ only if rollNo exists
                    orderBy("rollNo"),          // required for Firestore inequality
                    orderBy("percentage", "desc"),
                    limit(5)
                );

                const snapshot = await getDocs(q);
                const scorers = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                scorers.sort((a, b) => b.percentage - a.percentage);

                setTopScorers(scorers);
            } catch (err) {
                console.error("Error fetching top scorers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopScorers();
    }, []);

    if (loading) {
    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                <EmojiEventsIcon sx={{ mb: "-4px", color: "#ffb300" }} /> Top 5 Performers
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Stack direction="row" alignItems="center" spacing={2} key={index}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="text" width="40%" height={18} />
                            <Skeleton variant="text" width="30%" height={18} />
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
}

    if (topScorers.length === 0) {
        return (
            <Box textAlign="center" py={3}>
                <Typography>No top scorers found yet.</Typography>
            </Box>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
  <Typography variant="h6" fontWeight="bold" gutterBottom>
    <EmojiEventsIcon sx={{ mb: "-4px", color: "#ffb300" }} /> Top 5 Performers
  </Typography>
  <Divider sx={{ mb: 2 }} />

<Box
  sx={{
    overflowY: "auto",
    maxHeight: "calc(100% - 48px)",
    pr: 1,

    // Hide scrollbar for WebKit browsers (Chrome, Safari)
    "&::-webkit-scrollbar": {
      display: "none",
    },

    // Hide scrollbar for Firefox
    scrollbarWidth: "none",
  }}
>
  <Stack spacing={2}>
    {topScorers.map((user, index) => (
      <Stack direction="row" alignItems="center" spacing={2} key={index}>
        <Avatar sx={{ bgcolor: medalColors[index], width: 48, height: 48 }}>
          {index + 1}
        </Avatar>
        <Box>
          <Typography fontWeight="bold">{user.username || "Anonymous"}</Typography>
          <Typography variant="body2" color="text.secondary">
            Roll No: {user.rollNo || "N/A"}
          </Typography>
          <Typography variant="body2" color="primary">
            {user.percentage.toFixed(2)}%
          </Typography>
        </Box>
      </Stack>
    ))}
  </Stack>
</Box>
</Paper>
    );
};

export default TopScorersCard;