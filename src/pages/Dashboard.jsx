import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../config/firebase';
import RecentActivityCard from '../components/DashbaordComponents/RecentActivityCard';
import AverageScorePieChart from '../components/DashbaordComponents/AverageScorePieChart';
import TopScorersCard from '../components/DashbaordComponents/TopScorersCard';

const Dashboard = () => {
  const [adminId, setAdminId] = useState(null);
  const currentUid = useSelector((state) => state.auth.uid);
  const userRole = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (!currentUid) return;

    const fetchAdminId = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAdminId(userData.adminid);
        }
      } catch (error) {
        console.error('Error fetching adminId:', error);
      }
    };

    fetchAdminId();
  }, [currentUid]);

  useEffect(() => {
    if (!adminId) return;

    const q = query(
      collection(db, 'studentTeacherRelations'),
      where('adminId', '==', adminId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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
    });

    return () => unsubscribe();
  }, [adminId, currentUid]);

  if (!userRole) return null;

  return (
    <>
      {userRole === 'teacher' && (
        <>
          <Grid container spacing={3} rowSpacing={2}>
            <Grid size={{xs:12, md:8, xl:5}}>
              <AverageScorePieChart />
            </Grid>
            <Grid size={{xs:12, md:4, xl:3}}>
              <TopScorersCard />
            </Grid>
            <Grid size={{xs:12, md:6, lg:4, xl:4}}>
              <RecentActivityCard />
            </Grid>
          </Grid>
        </>
      )}

      {userRole === 'admin' && (
        <>
        {/* <Grid container spacing={3}>
            <Grid size={{xs:12, sm:6, md:3}}>
              <InfoCard icon={<People />} label="Total Teachers" value="--" color="purple" />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <InfoCard icon={<Quiz />} label="Total Students" value="--" color="blue" />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <InfoCard icon={<History />} label="Total Attempts" value="--" color="green" />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <InfoCard icon={<Map />} label="Avg Score" value="--" color="orange" />
            </Grid>
          </Grid> */}
          

          <Grid container spacing={3} rowSpacing={2}>
            <Grid size={{xs:12, md:8}}>
              <RecentActivityCard />
            </Grid>
            <Grid size={{xs:12, md:4}}>
              <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
                Super Admin Chart Placeholder
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Dashboard;
