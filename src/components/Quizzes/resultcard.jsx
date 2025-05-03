import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FF6B6B"];

function Resultcard({data, score, length, totalScore}) {
  return (
    <Box px={{ xs: 2, md: 5 }}>
                    <Card sx={{ borderRadius: 4 }} elevation={0}>
                        <CardContent>
                            <Typography variant="h5" textAlign="center" gutterBottom>🎉 Quiz Completed!</Typography>
    
                            <Box sx={{ height: 300, mt: 4 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`} isAnimationActive={true}>
                                            {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" iconSize={12} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
    
                            <Typography variant="h6" textAlign="center" mt={3} color="info">
                                Your Score: {score} out of {length === 0 ? totalScore : length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
  )
}

export default Resultcard
