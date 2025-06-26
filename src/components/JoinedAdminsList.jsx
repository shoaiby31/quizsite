import React, { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Avatar,
  Card, CardContent, Grid, Stack, Button,
  Chip
} from '@mui/material';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../config/firebase'; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
const JoinedAdminsList = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJoinedAdmins = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        const relRef = collection(db, 'studentTeacherRelations');
        const relQuery = query(relRef, where('userId', '==', currentUser.uid));
        const relSnap = await getDocs(relQuery);

        const adminIds = relSnap.docs.map(doc => doc.data().adminUid);

        const adminPromises = adminIds.map(id => getDoc(doc(db, 'users', id)));
        const adminSnaps = await Promise.all(adminPromises);

        const adminData = adminSnaps
          .filter(snap => snap.exists())
          .map(snap => ({ id: snap.id, ...snap.data() }));

        setAdmins(adminData);
      } catch (error) {
        console.error('Error fetching joined admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedAdmins();
  }, [currentUser]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      {admins.length === 0 ? (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          textAlign="center"
        >
          <Typography variant="h3" mb={1}>🎓</Typography>
          <Typography variant="h5" gutterBottom>
            No joined admins found.
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Start learning by connecting with your teacher now!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/join-teacher')}
          >
            Join New Teacher
          </Button>
        </Box>
      ) : (
        <>
          <Chip icon={<SchoolIcon />} label={'Your are enroled with these teachers'} color='secondary' variant="outlined" sx={{ fontSize: { xs: 14, md: 17 }, width:{xs:'100%', md:'auto'}, px: 1, py: 1.5, mb:1, fontWeight: 'bold', borderRadius: '14px'}} />
          <Grid container spacing={3} mt={1}>
            {admins.map((admin) => (
              <Grid size={{xs:12, sm:6, md:4, lg:3}} key={admin.id}>
                <Card
                  variant="outlined"
                  sx={{ borderRadius: 3, p: 1, width: '100%' }}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={admin.photoURL || ''} sx={{ width: 56, height: 56 }}>
                        {admin.name?.[0] || '?'}
                      </Avatar>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="h6">{admin.name || 'Unnamed'}</Typography>
                        <Typography variant="body2">{admin.email}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default JoinedAdminsList;