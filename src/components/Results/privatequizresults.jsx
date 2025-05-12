import React, { useEffect, useState, useMemo } from "react";
import {
    Card, CardContent, Typography, Box, Grid, Chip, Avatar,
    Snackbar, Alert, Tooltip, CircularProgress, Button,
    ToggleButtonGroup, ToggleButton, Pagination, Stack, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    InputAdornment
} from "@mui/material";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Papa from "papaparse";
import { Search } from '@mui/icons-material';

const ITEMS_PER_PAGE = 6;

const formatRemainingTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const Privatequizresults = () => {
    const { quizId, timeLimit } = useParams();
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("card");
    const [remainingTimes, setRemainingTimes] = useState({});

    useEffect(() => {
        let unsubscribe;

        const fetchResults = () => {
            setLoading(true);
            try {
                const attemptRef = collection(db, "attempts");
                const q = query(attemptRef, where("quizId", "==", quizId));

                unsubscribe = onSnapshot(q, (snapshot) => {
                    const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    const filtered =
                        filter === "submitted"
                            ? allData.filter(r => r.submitted)
                            : filter === "inprogress"
                                ? allData.filter(r => !r.submitted)
                                : allData;

                    setResults(filtered);
                    setLoading(false);
                });
            } catch (err) {
                setError("Failed to load results.");
                setLoading(false);
            }
        };

        fetchResults();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [quizId, filter]);

    // Live countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTimes((prev) => {
                const updated = {};
                results.forEach((attempt) => {
                    if (!attempt.submitted && attempt.startTime) {
                        const start = attempt.startTime.toDate();
                        const elapsedSeconds = Math.floor((Date.now() - start.getTime()) / 1000);
                        const totalAllowed = parseInt(timeLimit) * 60;
                        const remaining = totalAllowed - elapsedSeconds;
                        updated[attempt.id] = remaining > 0 ? remaining : 0;
                    }
                });
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [results, timeLimit]);

    const handleFilterChange = (_, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
            setPage(1);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const calculatePercentage = (score, totalScore) => {
        if (!totalScore) return 0;
        return (score / totalScore) * 100;
    };

    const getScoreColor = (score, totalScore) => {
        const pct = calculatePercentage(score, totalScore);
        if (pct <= 40) return "red";
        if (pct <= 70) return "orange";
        return "green";
    };

    const filteredResults = useMemo(() => {
        let data = [...results];
        if (searchQuery && !isNaN(searchQuery)) {
            const percent = parseFloat(searchQuery);
            data = data.filter(r =>
                calculatePercentage(r.score, r.totalScore) >= percent
            );
        } else if (searchQuery) {
            data = data.filter(r =>
                (r.username || "").toLowerCase().includes(searchQuery)
            );
        }
        return data;
    }, [results, searchQuery]);

    const paginatedResults = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredResults.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredResults, page]);

    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

    const handleExportCSV = () => {
        const csvData = results.map(r => ({
            Username: r.username || "Anonymous",
            Score: `${r.score} / ${r.totalScore}`,
            Percentage: `${calculatePercentage(r.score, r.totalScore).toFixed(2)}%`,
            Status: r.submitted ? "Submitted" : "In Progress"
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `quiz_results_${quizId}.csv`;
        link.click();
    };

    const handlePrint = () => {
        window.print();
    };

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

            <Stack direction="row" spacing={2} my={2} flexWrap="wrap">
                <ToggleButtonGroup size="small" value={filter} exclusive onChange={handleFilterChange} color="primary">
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="submitted">✅ Submitted</ToggleButton>
                    <ToggleButton value="inprogress">
                        ⏳ In Progress <LiveTvIcon sx={{ ml: 1, color: "#f44336" }} />
                    </ToggleButton>
                </ToggleButtonGroup>



                <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
                    Export CSV
                </Button>

                <Button variant="outlined" size="small" color="secondary" startIcon={<PrintIcon />} onClick={handlePrint}>
                    Print
                </Button>

                <ToggleButtonGroup size="small" value={viewMode} exclusive onChange={(_, val) => setViewMode(val)} color="primary">
                    <ToggleButton value="card">Card View</ToggleButton>
                    <ToggleButton value="table">Table View</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                    variant="outlined"
                    placeholder="Search by name or score (%)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
                />
            </Stack>

            {filteredResults.length === 0 ? (
                <Typography mt={4} color="text.secondary">
                    No attempts to show for this filter.
                </Typography>
            ) : viewMode === "card" ? (
                <Grid container spacing={3}>
                    {paginatedResults.map((attempt) => {
                        const percentage = calculatePercentage(attempt.score, attempt.totalScore);
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={attempt.id}>
                                <Card
                                    sx={{
                                        borderLeft: `6px solid ${attempt.submitted ? "#4caf50" : "#fbc02d"}`,
                                        
                                        borderRadius: 3,
                                        boxShadow: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" justifyContent={'space-between'}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography fontWeight="bold">
                                                        {attempt.username || "Anonymous"}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Percentage: {percentage.toFixed(2)}%
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {!attempt.submitted && remainingTimes[attempt.id] !== undefined && (
                                                <Typography fontSize='22px' color="error" textAlign='right' fontWeight="bold">
                                                    ⏱️ {formatRemainingTime(remainingTimes[attempt.id])}
                                                </Typography>
                                            )}

                                        </Box>

                                        <Box mt={2}>
                                            <Typography
                                                variant="h6"
                                                style={{ color: getScoreColor(attempt.score, attempt.totalScore) }}
                                            >
                                                📝 {attempt.score} / {attempt.totalScore}
                                            </Typography>

                                            <Tooltip title={attempt.submitted ? "Quiz Submitted" : "In Progress"}>
                                                <Chip
                                                    icon={attempt.submitted ? <CheckCircleIcon /> : <HourglassBottomIcon />}
                                                    label={attempt.submitted ? "Submitted" : "In Progress"}
                                                    color={attempt.submitted ? "success" : "error"}
                                                    sx={{ mt: 1 }}
                                                />
                                            </Tooltip>


                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Time Left</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedResults.map((attempt) => {
                                const percentage = calculatePercentage(attempt.score, attempt.totalScore);
                                return (
                                    <TableRow key={attempt.id}>
                                        <TableCell>{attempt.username || "Anonymous"}</TableCell>
                                        <TableCell style={{ color: getScoreColor(attempt.score, attempt.totalScore) }}>
                                            {attempt.score} / {attempt.totalScore}
                                        </TableCell>
                                        <TableCell>{percentage.toFixed(2)}%</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={attempt.submitted ? <CheckCircleIcon /> : <LiveTvIcon />}
                                                label={attempt.submitted ? "Submitted" : "LIVE"}
                                                color={attempt.submitted ? "success" : "error"}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {!attempt.submitted && remainingTimes[attempt.id] !== undefined
                                                ? formatRemainingTime(remainingTimes[attempt.id])
                                                : '00:00'}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {totalPages > 1 && (
                <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, val) => setPage(val)}
                        color="primary"
                    />
                </Box>
            )}

            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
                <Alert severity="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Privatequizresults;