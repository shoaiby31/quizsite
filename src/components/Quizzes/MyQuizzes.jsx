import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, CircularProgress, Alert,
  TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Pagination, IconButton, Tooltip,
  Button
} from '@mui/material';
import { Search, Edit } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';
import EditQuizModal from './editquiz';
import { useNavigate } from "react-router-dom";
import AddQuestions from './addquestions';
const ITEMS_PER_PAGE = 9;

const MyQuizzes = () => {
  const titleRef = useRef(null);
  const user = useSelector(state => state.auth);
  const themeMode = useSelector((state) => state.mode.value);

  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [statusFilter, setStatusFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [title, setTitle] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'quizzes'), where('createdBy', '==', user.uid));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(list);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quizzes.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  useEffect(() => {
    let result = quizzes.filter((quiz) =>
      quiz.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter === 'active') result = result.filter(q => q.isActive);
    if (statusFilter === 'inactive') result = result.filter(q => !q.isActive);

    if (privacyFilter === 'public') result = result.filter(q => q.isPublic);
    if (privacyFilter === 'private') result = result.filter(q => !q.isPublic);

    if (classFilter !== 'all') {
      result = result.filter(q => String(q.class) === classFilter);
    }

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent' && result[0]?.createdAt) {
      result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    }

    setFilteredQuizzes(result);
    setPage(1);
  }, [search, sortBy, quizzes, statusFilter, privacyFilter, classFilter]);

  const paginatedQuizzes = filteredQuizzes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleEditClick = (quiz) => {
    setSelectedQuiz(quiz);
    setEditOpen(true);
  };

  const handleQuizUpdated = (updatedQuiz) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q))
    );
    setEditOpen(false);
  };
  const viewQuestionsftn = (id, title) => {
    setId(id);
    setTitle(title);
  };
  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 5 }}>{error}</Alert>;
  return (
    <Box sx={{ pt: { xs: 3, md: 0 } }} ref={titleRef}>
      {/* Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center', }}>
        <TextField placeholder="Search by title..." sx={{ minWidth: { xs: '100%', md: 150 } }} value={search} size="small" onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} />

        <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
          <InputLabel>Status</InputLabel>
          <Select size="small" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
          <InputLabel>Privacy</InputLabel>
          <Select size="small" value={privacyFilter} label="Privacy" onChange={(e) => setPrivacyFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
          <InputLabel>Class</InputLabel>
          <Select size="small" value={classFilter} label="Class" onChange={(e) => setClassFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1">Class 1</MenuItem>
            <MenuItem value="2">Class 2</MenuItem>
            <MenuItem value="3">Class 3</MenuItem>
            <MenuItem value="4">Class 4</MenuItem>
            <MenuItem value="5">Class 5</MenuItem>
            <MenuItem value="6">Class 6</MenuItem>
            <MenuItem value="7">Class 7</MenuItem>
            <MenuItem value="8">Class 8</MenuItem>
            <MenuItem value="9">Class 9</MenuItem>
            <MenuItem value="10">Class 10</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
          <InputLabel>Sort By</InputLabel>
          <Select size="small" value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="recent">Recently Added</MenuItem>
            <MenuItem value="title">Title (A–Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>My Quizzes</Typography>

      <Grid container spacing={3}>
        {paginatedQuizzes.length === 0 ? (
          <Typography variant="body1">No quizzes found.</Typography>
        ) : (
          paginatedQuizzes.map(quiz => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quiz.id}>
              <Card variant="outlined" sx={{
                border: '1px solid',
                borderColor: quiz.isActive ? '#4CAF50' : 'gray',
                borderRadius: 2,
                position: 'relative',
                overflow: 'visible', height: '100%'
              }}>
                {/* Edit Button */}
                <Box sx={{
                  width: 20, height: 25, borderRadius: 2,
                  position: 'absolute', backgroundColor: 'inherit', display: 'flex',
                  justifyContent: 'center', top: -14, right: '12%',
                }}>
                  <Tooltip title="Edit Quiz">
                    <IconButton onClick={() => handleEditClick(quiz)}>
                      <Edit fontSize='small' color='primary' />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Status dot */}
                <Box sx={{
                  width: 12, height: 12, borderRadius: '50%',
                  backgroundColor: quiz.isActive ? '#4CAF50' : 'gray',
                  position: 'absolute', top: -6, right: 20,
                }} />
                {/* Privacy Badge */}
                <Box sx={{
                  width: 120, height: 25, display: 'flex',
                  justifyContent: 'center', alignItems: 'center',
                  backgroundColor: 'inherit', borderRadius: 2,
                  position: 'absolute', top: -14, left: '30%',
                }}>

                  <Typography variant="body2"><strong>Privacy:</strong> {quiz.isPublic ? ' Public' : ' Private'}</Typography>
                </Box>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>{quiz.title}</Typography>
                    <Typography variant="caption" gutterBottom>{quiz.description || 'No description provided.'}</Typography>
                    <Typography variant="body2">For Class: {quiz.class}{quiz.class === 1 ? 'st' : quiz.class === 2 ? 'nd' : quiz.class === 3 ? 'rd' : 'th'}</Typography>
                    {quiz.secretid !== '' &&
                      <Typography variant="body2">
                        <strong style={{ color: themeMode ? 'white' : 'black' }}>Secret Id:</strong> {quiz.secretid}
                      </Typography>}

                    {Object.entries(quiz.questionTypes).map(([type, value]) => (
                      <Typography variant="body2" gutterBottom key={type}>
                        {value ? '✅ ' : <span style={{ fontSize: '11px' }}>❌ </span>}
                        {type === 'truefalse' ? 'True/False' : type === 'short' ? 'Short Questions' : "MCQ's"}
                        {value && ` — Time Allowed: ${value.timeLimit} min`}
                      </Typography>
                    ))}

                  </Box>

                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button sx={{ textTransform: 'none', mx:2 }} size="small" onClick={() => viewQuestionsftn(quiz.id, quiz.title)}>view / add questions</Button>

                    <Button sx={{ textTransform: 'none' }} size='small' onClick={() => {
                      navigate(`/dashboard/private-results/${quiz.id}`);
                    }}>
                      View Results
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {filteredQuizzes.length > ITEMS_PER_PAGE && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE)} page={page} onChange={(e, value) => setPage(value)} color="primary" />
        </Box>
      )}

      {/* Edit Modal */}
      {selectedQuiz && (
        <EditQuizModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          quiz={selectedQuiz}
          onQuizUpdated={handleQuizUpdated}
        />
      )}
      {id && <AddQuestions id={id} title={title} />}

    </Box>
  );
};

export default MyQuizzes;