import { Grid, Box } from '@mui/material';
import InfoCard from '../components/DashbaordComponents/infocard';
import { People, 
  // AttachMoney, LocalCarWash, 
  Quiz } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../config/firebase';
import QuizzesAttemptedCard from '../components/DashbaordComponents/QuizzesAttemptedCard';
import AverageScoreCard from '../components/DashbaordComponents/AverageScoreCard';
import RecentActivityCard from '../components/DashbaordComponents/RecentActivityCard';
import AverageScorePieChart from '../components/DashbaordComponents/AverageScorePieChart';
import TopScorersCard from '../components/DashbaordComponents/TopScorersCard';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [adminId, setAdminId] = useState(null);
  const [quizCount, setQuizCount] = useState(0); // ✅ New state for quiz count
  const currentUid = useSelector((state) => state.auth.uid);

  // Step 1: Get adminId from Firestore based on current user's UID
  useEffect(() => {
    if (!currentUid) return;

    const fetchAdminId = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAdminId(userData.adminid); // could be same as UID or different
        }
      } catch (error) {
        console.error('Error fetching adminId:', error);
      }
    };

    fetchAdminId();
  }, [currentUid]);

  // Step 2: Get live student count based on adminId
  useEffect(() => {
    if (!adminId) return;

    const q = query(
      collection(db, 'studentTeacherRelations'),
      where('adminId', '==', adminId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudentCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [adminId]);

  useEffect(() => {
    if (!adminId) return;

    const q = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', currentUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuizCount(snapshot.size);
    });

    return () => unsubscribe();
  },);


  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{xs:12, sm:6, md:3}}>
          <InfoCard icon={<People />} label="Total Students" value={String(studentCount).padStart(2, '0')} color="purple" />
        </Grid>
        <Grid size={{xs:12, sm:6, md:3}}>
          <InfoCard icon={<Quiz />} label="My Quizzes" value={String(quizCount).padStart(2, '0')} color="blue" />
        </Grid>
        <Grid size={{xs:12, sm:6, md:3}}>
          <QuizzesAttemptedCard/>
        </Grid>
        <Grid size={{xs:12, sm:6, md:3}}>
          <AverageScoreCard/>
        </Grid>
      </Grid>

      <Grid container spacing={3} rowSpacing={2} sx={{ mt: 2 }}>
        <Grid size={{xs:12, md:8, xl:5}}>
            <AverageScorePieChart/>
        </Grid>
        <Grid size={{xs:12, md:4, xl:3}}>
          <TopScorersCard/>

        </Grid>
        <Grid size={{xs:12, md:6, lg:4, xl:4}}>
            <RecentActivityCard/>
          {/* <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Time Admitted
          </Box> */}
        </Grid>
        <Grid size={{xs:12, md:4}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Table: Patients by Division
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;