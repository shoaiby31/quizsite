import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';

const QuizzesAttemptedCard = () => {
    const [loading, setLoading] = useState(true);
    const [attemptCount, setAttemptCount] = useState(0);
    const userId = useSelector(state => state.auth.uid);

    useEffect(() => {
        const fetchAttemptedQuizzes = async () => {
            if (!userId) return;
            setLoading(true);

            try {
                const q = query(collection(db, 'attempts'), where('adminUid', '==', userId));
                const snapshot = await getDocs(q);
                setAttemptCount(snapshot.size);
            } catch (error) {
                console.error('Error fetching quiz attempts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttemptedQuizzes();
    }, [userId]);

    return (

        <Card>
            <CardContent sx={{ p: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Total Attempts</Typography>
                        {loading ? (
                            <Skeleton variant="text" width={60} height={30} />
                        ) : (
                            <Typography variant="h6">{String(attemptCount).padStart(2, '0')}</Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default QuizzesAttemptedCard;