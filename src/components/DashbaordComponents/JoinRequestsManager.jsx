import React, { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot, getDocs, addDoc, deleteDoc, doc
} from 'firebase/firestore';
import {
  Box, Button, Checkbox, MenuItem, Paper, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Alert, CircularProgress
} from '@mui/material';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';

const JoinRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [classFilter, setClassFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const uid = useSelector((state) => state.auth.uid);


  useEffect(() => {
    const q = query(collection(db, 'joinRequests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });

    return () => unsubscribe();
  }, []);

  // Filter requests by className
  useEffect(() => {
    const filtered = classFilter
      ? requests.filter(r => r.className === classFilter)
      : requests;
    setFilteredRequests(filtered);
    setSelectedIds([]); // reset selection on filter change
  }, [classFilter, requests]);

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredRequests.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleAccept = async (request) => {
    setLoading(true)
    try {
      const { studentEmail, className, adminId, id, rollNo, studentName, } = request;

      if (!studentEmail || !className || !adminId) {
        console.error('Missing data in request:', request);
        return false;
      }

      // Check if student already related
      const existingQuery = query(
        collection(db, 'studentTeacherRelations'),
        where('studentEmail', '==', studentEmail),
        where('className', '==', className),
        where('adminId', '==', adminId)
      );

      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        console.warn('Student already joined this class.');
        await deleteDoc(doc(db, 'joinRequests', id));
        return true;
      }
      // Add relation
      await addDoc(collection(db, 'studentTeacherRelations'), {
        studentEmail,
        className,
        adminId,
        adminUid: uid ,
        rollNo,
        studentName,
        userId:request.studentId,
        timestamp: new Date(),
      });

      // Delete request after accepting
      await deleteDoc(doc(db, 'joinRequests', id));
      return true;
    } catch (error) {
      console.error('Error accepting request:', error);
      return false;
    } finally {
      setLoading(false)
    }
  };

  const handleDeny = async (id) => {
    setLoading1(true)
    try {
      await deleteDoc(doc(db, 'joinRequests', id));
      return true;
    } catch (err) {
      console.error('Error denying request:', err);
      return false;
    } finally {
      setLoading1(false)
    }
  };

  const handleBulkAccept = async () => {
    if (selectedIds.length === 0) return;

    let successCount = 0;
    for (const id of selectedIds) {
      const req = filteredRequests.find(r => r.id === id);
      if (req) {
        const result = await handleAccept(req);
        if (result) successCount++;
      }
    }
    setSnackbar({
      open: true,
      severity: 'success',
      message: `${successCount} request${successCount > 1 ? 's' : ''} accepted.`,
    });
    setSelectedIds([]);
  };

  const handleBulkDeny = async () => {
    if (selectedIds.length === 0) return;

    let successCount = 0;
    for (const id of selectedIds) {
      const result = await handleDeny(id);
      if (result) successCount++;
    }
    setSnackbar({
      open: true,
      severity: 'info',
      message: `${successCount} request${successCount > 1 ? 's' : ''} denied.`,
    });
    setSelectedIds([]);
  };
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Join Requests
      </Typography>

      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          select
          label="Filter by Class"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="">All Classes</MenuItem>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i + 1} value={`${i + 1}`}>
              Class {i + 1}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="success"
          disabled={selectedIds.length === 0 || loading}
          onClick={handleBulkAccept} startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Accepting..." : "Accept Selected"}
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={selectedIds.length === 0 || loading1}
          onClick={handleBulkDeny} startIcon={loading1 && <CircularProgress size={20} />}
        >
          Deny Selected
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < filteredRequests.length
                  }
                  checked={
                    filteredRequests.length > 0 && selectedIds.length === filteredRequests.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Student Email</TableCell>
              <TableCell>Admin ID</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No join requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(req.id)}
                      onChange={() => handleSelect(req.id)}
                    />
                  </TableCell>
                  <TableCell>{req.studentName}</TableCell>
                  <TableCell>{req.rollNo || '-'}</TableCell>
                  <TableCell>{req.className}</TableCell>
                  <TableCell>{req.studentEmail}</TableCell>
                  <TableCell>{req.adminId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JoinRequestsManager;