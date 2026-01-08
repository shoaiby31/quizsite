import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Box, Button, Checkbox, Paper, Snackbar, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Typography, Alert, CircularProgress } from '@mui/material';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';
import { approveTeacherRequest, denyTeacherRequest } from "../AdminComponents/AcceptRequests.service";

const TeacherRequestsManager = () => {
    const [requests, setRequests] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const uid = useSelector((state) => state.auth.uid);

    useEffect(() => {
        if (!uid) return;

        const fetchAdminIdAndListen = async () => {
            const userDocRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userDocRef);
            if (!userSnap.exists()) return;

            const institutePassword = userSnap.data().institutePassword;
            const q = query(collection(db, 'teacherRequests'), where('institutePassword', '==', institutePassword), where('status', '==', 'pending'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRequests(data);
            });

            return () => unsubscribe();
        };

        fetchAdminIdAndListen();
    }, [uid]);

    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedIds(checked ? requests.map(r => r.id) : []);
    };

    const handleAccept = async (req) => {
        setLoading(true);
        try {
            await approveTeacherRequest(req, uid);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDeny = async (id) => {
        setLoading1(true);
        try {
            await denyTeacherRequest(id);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        } finally {
            setLoading1(false);
        }
    };


    const handleBulkAccept = async () => {
        if (selectedIds.length === 0) return;
        let successCount = 0;
        for (const id of selectedIds) {
            const req = requests.find(r => r.id === id);
            if (req) {
                const result = await handleAccept(req);
                if (result) successCount++;
            }
        }
        setSnackbar({
            open: true,
            severity: 'success',
            message: `${successCount} request${successCount > 1 ? 's' : ''} approved.`,
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
            <Typography variant="h6" sx={{ mb: 2 }}>Faculty Requests</Typography>
            <Box display="flex" gap={2} mb={2} alignItems="center">
                <Button
                    variant="contained"
                    color="success"
                    disabled={selectedIds.length === 0 || loading}
                    onClick={handleBulkAccept} startIcon={loading && <CircularProgress size={20} />}
                >
                    {loading ? "Approving..." : "Approve Selected"}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    disabled={selectedIds.length === 0 || loading1}
                    onClick={handleBulkDeny} startIcon={loading1 && <CircularProgress size={20} />}
                >
                    {loading1 ? "Rejecting..." : "Reject Selected"}
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < requests.length}
                                    checked={requests.length > 0 && selectedIds.length === requests.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phono no</TableCell>
                            <TableCell>Qualification</TableCell>
                            <TableCell>Address</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No request found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedIds.includes(req.id)}
                                            onChange={() => handleSelect(req.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{req.name}</TableCell>
                                    <TableCell>{req.phone}</TableCell>
                                    <TableCell>{req.qualification}</TableCell>
                                    <TableCell>{req.address}</TableCell>
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

export default TeacherRequestsManager;