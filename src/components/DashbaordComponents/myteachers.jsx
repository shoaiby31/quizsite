import React, { useEffect, useRef, useState } from 'react';
import {
  collection, doc, query, where, deleteDoc, onSnapshot,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, CircularProgress, Box, Checkbox, Button, TextField,
  Snackbar, TablePagination, Alert, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText
} from '@mui/material';
import { db } from '../../config/firebase';

const Myteachers = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const currentUser = useSelector((state) => state.auth);

  const hasMounted = useRef(false);
  const previousIds = useRef(new Set());

  useEffect(() => {
    if (!currentUser?.uid) return;

    let unsubscribeAdmin;
    let unsubscribeStudents;

    const fetchStudentsLive = async () => {
      try {
        unsubscribeAdmin = onSnapshot(doc(db, 'users', currentUser.uid), (adminDoc) => {
          const adminid = adminDoc.data()?.adminid;
          if (!adminid) return;

          const q = query(collection(db, 'teacherAdminRelations'), where('schoolId', '==', adminid));

          unsubscribeStudents = onSnapshot(q, (snapshot) => {
            const studentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentsData);
            setFilteredStudents(studentsData);
            setLoading(false);

            const currentIds = new Set(snapshot.docs.map(doc => doc.id));
            const added = [...currentIds].filter(id => !previousIds.current.has(id));

            if (hasMounted.current && added.length > 0) {
              setSnackbar({
                open: true,
                message: `New student${added.length > 1 ? 's' : ''} joined!`,
                severity: 'info',
              });
            }

            previousIds.current = currentIds;
            hasMounted.current = true;
          });
        });
      } catch (error) {
        console.error('Error fetching teachers live:', error);
        setLoading(false);
      }
    };

    fetchStudentsLive();

    return () => {
      if (unsubscribeAdmin) unsubscribeAdmin();
      if (unsubscribeStudents) unsubscribeStudents();
    };
  }, [currentUser]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = students.filter(s =>
      (s.teacherName?.toLowerCase().includes(lowerSearch) || s.teacherEmail?.includes(lowerSearch))
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleOpenDialog = (ids) => {
    setIdsToDelete(ids);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDialogOpen(false);
    try {
      await Promise.all(idsToDelete.map(id => deleteDoc(doc(db, 'teacherAdminRelations', id))));
      setStudents(prev => prev.filter(s => !idsToDelete.includes(s.id)));
      setSelectedIds([]);
      setSnackbar({ open: true, message: 'Teacher(s) deleted successfully.', severity: 'success' });
    } catch (err) {
      console.error("Error deleting students:", err);
      setSnackbar({ open: true, message: 'Failed to delete teachers.', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" mt={10} justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Teachers Assigned to You</Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField size='small' label="Search by Name or Email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button
          variant="contained"
          color="error"
          disabled={selectedIds.length === 0}
          onClick={() => handleOpenDialog(selectedIds)}
        >
          Delete Selected
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredStudents.length}
                  checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                  onChange={(e) => {
                    const newSelectedIds = e.target.checked
                      ? filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((s) => s.id)
                      : [];
                    setSelectedIds(newSelectedIds);
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Secret Id</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
              <TableRow key={student.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(student.id)}
                    onChange={() => handleSelect(student.id)}
                  />
                </TableCell>
                <TableCell>{student.teacherName || '-'}</TableCell>
                <TableCell>{student.teacherEmail}</TableCell>
                <TableCell>{student.teacherSecretId + 'th'}</TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredStudents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {idsToDelete.length} student(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Myteachers;