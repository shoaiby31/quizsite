import { Grid, Box } from '@mui/material';
import InfoCard from '../components/DashbaordComponents/infocard';
import { People, MedicalServices, AttachMoney, LocalCarWash } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../config/firebase';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [adminId, setAdminId] = useState(null);
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

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{xs:12, sm:6, md:3}}>
          <InfoCard icon={<People />} label="Total Students" value={studentCount.toString()} color="purple" />
        </Grid>
        <Grid size={{xs:12, sm:6, md:3}}>
          <InfoCard icon={<MedicalServices />} label="Available Staff" value="394" color="blue" />
        </Grid>
        <Grid size={{xs:12, sm:6, md:3}}>
          <InfoCard icon={<AttachMoney />} label="Avg Treat. Costs" value="$2,536" color="green" />
        </Grid>
        <Grid size={{xs:12, sm:6, md:3}}>
          <InfoCard icon={<LocalCarWash />} label="Available Cars" value="38" color="orange" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs:12, md:8}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Outpatients vs. Inpatients Trend
          </Box>
        </Grid>
        <Grid size={{xs:12, md:4}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Patients by Gender
          </Box>
        </Grid>
        <Grid size={{xs:12, md:8}}>
          <Box sx={{ height: 300, bgcolor: 'white', borderRadius: 2 }}>
            Chart: Time Admitted
          </Box>
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