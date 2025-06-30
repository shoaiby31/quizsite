import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box,
  Skeleton
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';
import PercentIcon from '@mui/icons-material/Percent';

const COLORS = ['#42a5f5', '#66bb6a', '#ffa726'];

const AverageScorePieChart = () => {
  const userId = useSelector(state => state.auth.uid);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAverageScores = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'attempts'), where('adminUid', '==', userId));
        const snapshot = await getDocs(q);

        let mcqTotal = 0, mcqCount = 0;
        let tfTotal = 0, tfCount = 0;
        let shortTotal = 0, shortCount = 0;

        snapshot.forEach(doc => {
          const data = doc.data();

          if (data.mcqsSubmitted && data.totalMcqsScore > 0) {
            mcqTotal += (data.mcqsScore / data.totalMcqsScore) * 100;
            mcqCount++;
          }

          if (data.trueFalseSubmitted && data.totalTrueFalseScore > 0) {
            tfTotal += (data.trueFalseScore / data.totalTrueFalseScore) * 100;
            tfCount++;
          }

          if (data.shortAnswersSubmitted && data.totalShortScore > 0) {
            shortTotal += (data.shortAnswerScores / data.totalShortScore) * 100;
            shortCount++;
          }
        });

        const data = [];

        if (mcqCount) data.push({
          name: 'MCQs',
          value: parseFloat((mcqTotal / mcqCount).toFixed(1)),
          fill: COLORS[0]
        });

        if (tfCount) data.push({
          name: 'True/False',
          value: parseFloat((tfTotal / tfCount).toFixed(1)),
          fill: COLORS[1]
        });

        if (shortCount) data.push({
          name: 'Short Answers',
          value: parseFloat((shortTotal / shortCount).toFixed(1)),
          fill: COLORS[2]
        });

        setChartData(data);
      } catch (err) {
        console.error("Error fetching average scores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageScores();
  }, [userId]);

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <PercentIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h6">Average Score by Question Type</Typography>
        </Box>

        {loading ? (
           <Box mt={2}>
    <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
    <Skeleton
      variant="circular"
      width={180}
      height={180}
      sx={{ mx: 'auto', display: 'block' }}
    />
    <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2, mx: 'auto' }} />
  </Box>
        ) : chartData.length === 0 ? (
          <Typography>No submissions yet to calculate average scores.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AverageScorePieChart;