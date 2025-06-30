import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, Stack, Skeleton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';
import { formatDistanceToNow } from 'date-fns';

const RecentActivityCard = () => {
  const [loading, setLoading] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const userId = useSelector(state => state.auth.uid);

  useEffect(() => {
    const fetchRecentAttempts = async () => {
      if (!userId) return;

      try {
        const attemptsRef = collection(db, 'attempts');
        const q = query(
          attemptsRef,
          where('adminUid', '==', userId),
          where('hasSubmitted', '==', true),
          orderBy('startTime', 'desc'),
          limit(4)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentAttempts(data);
      } catch (error) {
        console.error('Error fetching recent activity:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAttempts();
  }, [userId]);

  return (
    <Card sx={{ borderRadius: 3, minWidth: 300, height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <HistoryIcon sx={{ fontSize: 30, color: '#f9a825' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Recent Activity
          </Typography>
        </Box>

        {loading ? (
          <Stack spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={18} />
                {i < 3 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Stack>
        ) : recentAttempts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
        ) : (
          recentAttempts.map((attempt, index) => (
            <Box key={attempt.id}>
              <Typography variant="body1" fontWeight={500}>
                {attempt.username || 'Unknown Student'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attempted <strong>{attempt.title || 'Quiz'}</strong> ·{" "}
                {attempt.startTime?.toDate
                  ? formatDistanceToNow(attempt.startTime.toDate(), { addSuffix: true })
                  : 'Unknown time'}
              </Typography>
              {index < recentAttempts.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;