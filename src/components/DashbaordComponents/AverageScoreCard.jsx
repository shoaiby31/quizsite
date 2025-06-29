import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { collection, query, where, getDocs, and, or } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';

const AverageScoreCard = () => {
    const [loading, setLoading] = useState(true);
    const [averageScore, setAverageScore] = useState(0);
    const userId = useSelector(state => state.auth.uid);

    useEffect(() => {
        const fetchAverageScore = async () => {
            if (!userId) return;

            try {
                const attemptsRef = collection(db, 'attempts');
                // const q = query(attemptsRef, where('adminUid', '==', userId), where('mcqsSubmitted', '==', true));
                const q = query(
                    attemptsRef,
                    and(
                        where('adminUid', '==', userId),
                        or(
                            where('mcqsSubmitted', '==', true),
                            where('trueFalseSubmitted', '==', true),
                            where('shortAnswersSubmitted', '==', true)
                        )
                    )
                );
                const snapshot = await getDocs(q);

                let totalScore = 0;
                let totalQuestions = 0;

                snapshot.forEach(doc => {
                    const data = doc.data();
                    totalScore += (data.mcqsScore || 0) + (data.shortAnswerScores || 0) + (data.trueFalseScore || 0);
                    totalQuestions += (data.totalMcqsScore || 0) + (data.totalShortScore || 0) + (data.totalTrueFalseScore || 0);
                });

                const average = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
                setAverageScore(average.toFixed(1));
            } catch (error) {
                console.error('Error calculating average score:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAverageScore();
    }, [userId]);

    return (
        <Card>
            <CardContent sx={{ p: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <BarChartIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Average. Score
                        </Typography>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Typography variant="h6">
                                {averageScore.padStart(4, '0')}%
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AverageScoreCard;