import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';

const FacultyMembers = () => {
  const adminUid = useSelector((state) => state.auth.uid);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminUid) return;

    const fetchFaculty = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get relations for this admin
        const q = query(
          collection(db, 'teacherAdminRelations'),
          where('adminUid', '==', adminUid)
        );

        const relSnapshot = await getDocs(q);

        // 2️⃣ Fetch user profiles for each teacher
        const facultyData = await Promise.all(
          relSnapshot.docs.map(async (docSnap) => {
            const rel = docSnap.data();

            const userSnap = await getDoc(doc(db, 'users', rel.teacherUid));

            return {
              id: docSnap.id,
              teacherUid: rel.teacherUid,
              teacherSecretId: rel.teacherSecretId,
              assignedAt: rel.assignedAt,
              ...(userSnap.exists() ? userSnap.data() : {})
            };
          })
        );

        setFaculty(facultyData);
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [adminUid]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Faculty Members</Typography>
      {faculty.length === 0 ? (
        <Typography color="text.secondary">No faculty members found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone No</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {faculty.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name || '-'}</TableCell>
                  <TableCell>{t.email || '-'}</TableCell>
                  <TableCell>{t.phone || '-'}</TableCell>
                  <TableCell>{t.qualification || '-'}</TableCell>
                  <TableCell>{t.address || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FacultyMembers;
