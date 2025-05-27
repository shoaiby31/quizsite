import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    Box, Typography, Stack, TableContainer, Paper, Table, TableHead, TableRow, TableCell, CircularProgress,
    TableBody, Checkbox, Pagination, TextField, ToggleButtonGroup, ToggleButton, Button,
    Chip, Snackbar, Alert, InputAdornment, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import Papa from "papaparse";
import { Search } from "@mui/icons-material";
import AttemptDetailsModal from "./attemptdetailsmodal";
const DEFAULT_ITEMS_PER_PAGE = 24;

const Privatequizresults = () => {
    const { quizId, timeLimit } = useParams();
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const printRef = useRef();
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "attempts"), where("quizId", "==", quizId)),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const filtered =
                    filter === "submitted"
                        ? data.filter(r => r.submitted)
                        : filter === "inprogress"
                            ? data.filter(r => !r.submitted)
                            : data;
                setResults(filtered);
                setLoading(false);
            },
            () => {
                setError("Failed to load results.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [quizId, filter]);

    const handleFilterChange = (_, newFilter) => {
        if (newFilter) {
            setFilter(newFilter);
            setPage(1);
            setSelected([]);
        }
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

    const calculatePercentage = (score, total) => (total ? (score / total) * 100 : 0);

    const getScoreColor = (score, total) => {
        const pct = calculatePercentage(score, total);
        if (pct <= 40) return "red";
        if (pct <= 70) return "orange";
        return "green";
    };

    const filteredResults = useMemo(() => {
        let data = [...results];
        if (searchQuery && !isNaN(searchQuery)) {
            const percent = parseFloat(searchQuery);
            data = data.filter(r => calculatePercentage(r.score, r.totalScore) >= percent);
        } else if (searchQuery) {
            data = data.filter(r => (r.username || "").toLowerCase().includes(searchQuery));
        }
        return data;
    }, [results, searchQuery]);

    const paginatedResults = useMemo(() => {
        if (rowsPerPage === -1) return filteredResults;
        const start = (page - 1) * rowsPerPage;
        return filteredResults.slice(start, start + rowsPerPage);
    }, [filteredResults, page, rowsPerPage]);

    const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(filteredResults.length / rowsPerPage);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allIds = paginatedResults.map((row) => row.id);
            setSelected(allIds);
        } else {
            setSelected([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selected.includes(id);

    const handleExportCSV = () => {
        const dataToExport = results.filter((r) => selected.includes(r.id));
        const csvData = dataToExport.map(r => ({
            Username: r.username || "Anonymous",
            Score: `${r.score} / ${r.totalScore}`,
            Percentage: `${calculatePercentage(r.score, r.totalScore).toFixed(2)}%`,
            Status: r.submitted ? "Submitted" : "In Progress"
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `quiz_results_${quizId}_selected.csv`;
        link.click();
    };
    const handlePrint = () => {
        window.print();
    }

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selected.map(id => deleteDoc(doc(db, "attempts", id))));
            setSuccess("Selected attempts deleted successfully.");
            setSelected([]);
        } catch (err) {
            console.log(err)
            setError("Failed to delete selected attempts.");
        }
    };

    const handleBulkSubmit = async () => {
        try {
            await Promise.all(
                selected.map(id =>
                    updateDoc(doc(db, "attempts", id), { submitted: true })
                )
            );
            setSuccess("Selected attempts marked as submitted.");
            setSelected([]);
        } catch (err) {
            setError("Failed to submit selected attempts.");
        }
    };

    const selectedUnsubmitted = useMemo(() => {
        return selected.filter(id => {
            const attempt = results.find(r => r.id === id);
            return attempt && !attempt.submitted;
        });
    }, [selected, results]);

    if (loading) {
        return (
            <Box textAlign="center" mt={8}>
                <CircularProgress />
                <Typography mt={2}>Loading results 📊...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                📋 Private Quiz Results
            </Typography>

            <Stack direction="row" my={2} gap={1} flexWrap="wrap">
                <ToggleButtonGroup size="small" value={filter} exclusive onChange={handleFilterChange}>
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="submitted">✅ Submitted</ToggleButton>
                    <ToggleButton value="inprogress">⏳ In Progress</ToggleButton>
                </ToggleButtonGroup>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={() => { handlePrint() }}
                >
                    Print Table
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportCSV}
                    disabled={selected.length === 0}
                >
                    Export CSV
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setConfirmDialog({
                        open: true,
                        title: "Confirm Deletion",
                        message: "Are you sure you want to delete selected attempts?",
                        onConfirm: handleBulkDelete
                    })}
                    disabled={selected.length === 0}
                    color="error"
                >
                    Delete
                </Button>

                {selectedUnsubmitted.length > 0 && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setConfirmDialog({
                            open: true,
                            title: "Confirm Submit",
                            message: "Submit selected in-progress attempts?",
                            onConfirm: handleBulkSubmit
                        })}
                        color="success"
                    >
                        Submit
                    </Button>
                )}



                <TextField
                    size="small"
                    placeholder="Search by name or score (%)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start"><Search /></InputAdornment>
                        )
                    }}
                    sx={{ width: { xs: "100%", sm: 250 } }}
                />
            </Stack>

            {filteredResults.length === 0 ? (
                <Typography mt={4} color="text.secondary">No attempts to show for this filter.</Typography>
            ) : (
                <div className="print-section" ref={printRef}>
                    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < paginatedResults.length}
                                            checked={selected.length === paginatedResults.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Score</TableCell>
                                    <TableCell>Percentage</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedResults.map((attempt) => {
                                    const percentage = calculatePercentage(attempt.score, attempt.totalScore);
                                    return (
                                        <TableRow key={attempt.id} hover selected={isSelected(attempt.id)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected(attempt.id)}
                                                    onChange={() => handleSelectOne(attempt.id)}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {attempt.username || "Anonymous"}
                                            </TableCell>
                                            <TableCell sx={{ color: getScoreColor(attempt.score, attempt.totalScore) }}>
                                                {attempt.score} / {attempt.totalScore}
                                            </TableCell>
                                            <TableCell>{percentage.toFixed(2)}%</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={attempt.submitted && <CheckCircleIcon />}
                                                    label={attempt.submitted ? "Submitted" : "In Progress"}
                                                    color={attempt.submitted ? "success" : "error"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    disabled={attempt.submitted}
                                                    size="small"
                                                    variant="text"
                                                    onClick={() => {
                                                        setSelectedAttempt(attempt);
                                                        setModalOpen(true);
                                                    }}
                                                    sx={{textTransform:'none'}}
                                                >
                                                    View Reamining Time
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            {totalPages > 1 && (
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                    />
                    <TextField
                        size="small"
                        label="Rows per page"
                        select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value));
                            setPage(1);
                        }}
                    >
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={-1}>Show All</MenuItem>
                    </TextField>
                </Stack>
            )}

            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
                <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess("")}>
                <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>
            </Snackbar>

            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
                <DialogTitle>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{confirmDialog.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            confirmDialog.onConfirm?.();
                            setConfirmDialog({ ...confirmDialog, open: false });
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <AttemptDetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                attempt={selectedAttempt}
                timeLimit={timeLimit}
            />
        </Box>
    );
};

export default Privatequizresults;