import React from 'react';
import {
    Box, Typography, Paper, Divider, Chip, Stack, useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';

const AnswersDetail = ({ attempt, questionType }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   

    if (!attempt || !questionType) return null;

    const typeMapping = {
        mcqs: {
            questions: attempt.mcqsQuestions || [],
            answers: attempt.mcqsAnswers || [],
        },
        truefalse: {
            questions: attempt.trueFalseQuestions || [],
            answers: attempt.trueFalseAnswers || [],
        },
        short: {
            questions: attempt.shortQuestions || [],
            answers: attempt.shortAnswers || [],
        },
    };

    const { questions, answers } = typeMapping[questionType];

    if (questions.length === 0) {
        return (
            <Typography color="text.secondary" mt={4} textAlign="center">
                No {questionType} questions found.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography
                variant={isMobile ? 'h6' : 'h5'}
                fontWeight="bold"
                mb={2}
               
            >
                {questionType === 'mcqs' && 'Multiple Choice Questions'}
                {questionType === 'truefalse' && 'True/False Questions'}
                {questionType === 'short' && 'Short Answer Questions'}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {questions.map((q, index) => {
                const userAnswer = answers[index]?.userAnswer ?? answers[index] ?? 'N/A';

                let correctAnswer = 'N/A';
                let isCorrect = false;

                if (questionType === 'mcqs') {
                    const correctOption = q.options?.find(opt => opt.isCorrect);
                    correctAnswer = correctOption?.text || 'N/A';
                    isCorrect = userAnswer === correctAnswer;
                } else if (questionType === 'truefalse') {
                    correctAnswer = q.answer ?? 'N/A';
                    isCorrect = userAnswer === correctAnswer;
                }

                return (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            transition: 'background-color 0.3s',
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Q{index + 1}: {q.question || q.text || 'No question text'}
                        </Typography>

                        <Stack
                            spacing={1.5}
                            direction="row"
                            flexWrap="wrap"
                            alignItems="center"
                            mt={1}
                        >
                            {questionType === 'short' ? (
                                <>
                                    <Chip
                                        label={`Your Answer: ${userAnswer}`}
                                        color="primary"
                                        sx={{ fontWeight: 'bold', maxWidth: '100%' }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Chip
                                        label={`Your Answer: ${userAnswer}`}
                                        color={isCorrect ? 'success' : 'error'}
                                        icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                                        sx={{ fontWeight: 'bold', maxWidth: '100%' }}
                                    />
                                    <Chip
                                        label={`Correct Answer: ${correctAnswer}`}
                                        color="default"
                                        sx={{ fontWeight: 'bold', maxWidth: '100%' }}
                                    />
                                </>
                            )}
                        </Stack>
                    </Paper>
                );
            })}
        </Box>
    );
};

export default AnswersDetail;