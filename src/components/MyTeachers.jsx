import React, { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Avatar,
  Card, CardContent, Grid, Stack, Button, Chip,
  CardActionArea
} from '@mui/material';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';

const JoinedTeachersList = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen for auth
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user || null);
      if (!user) setLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch teachers
  useEffect(() => {
    if (!currentUser) return;

    const fetchTeachers = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get relations for this student
        const relQuery = query(
          collection(db, 'studentTeacherRelations'),
          where('studentUid', '==', currentUser.uid)
        );

        const relSnap = await getDocs(relQuery);
        const teacherUids = relSnap.docs.map(d => d.data().teacherUid);

        if (teacherUids.length === 0) {
          setTeachers([]);
          return;
        }

        // 2️⃣ Fetch teacher profiles
        const teacherSnaps = await Promise.all(
          teacherUids.map(uid => getDoc(doc(db, 'users', uid)))
        );

        const teacherData = teacherSnaps
          .filter(snap => snap.exists())
          .map(snap => ({ id: snap.id, ...snap.data() }));

        setTeachers(teacherData);
      } catch (err) {
        console.error('Error fetching teachers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
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
      {teachers.length === 0 ? (
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
            You are not enrolled with any teacher yet.
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Send a request to join a teacher to start learning.
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
          <Chip
            icon={<SchoolIcon />}
            label="You are enrolled with these teachers"
            color="secondary"
            variant="outlined"
            sx={{
              fontSize: { xs: 14, md: 17 },
              width: { xs: '100%', md: 'auto' },
              px: 1, py: 1.5, mb: 1,
              fontWeight: 'bold',
              borderRadius: '14px'
            }}
          />

          <Grid container spacing={3} mt={1}>
            {teachers.map((teacher) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={teacher.id}>
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
                      <Avatar src={teacher.photoURL || ''} sx={{ width: 56, height: 56 }}>
                        {teacher.name?.[0] || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{teacher.name || 'Unnamed'}</Typography>
                        <Typography variant="caption">{teacher.qualification}</Typography>
                        <Typography variant="caption" sx={{display:'block'}}>{teacher.email}</Typography>

                      </Box>
                    </Stack>

                  </CardContent>
                  <CardActionArea>
                      <Button fullWidth variant="contained" color="primary">View Profile</Button>

                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default JoinedTeachersList;