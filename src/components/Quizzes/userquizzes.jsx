import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, CircularProgress, Alert,
  TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Pagination, IconButton, Tooltip
} from '@mui/material';
import { Search, Edit } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';
import EditQuizModal from './editquiz';

const ITEMS_PER_PAGE = 6;

const UserQuizzes = () => {
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
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(1);

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

    if (tagFilter.trim() !== '') {
      result = result.filter(q =>
        q.tags?.some(tag =>
          tag.toLowerCase().includes(tagFilter.toLowerCase())
        )
      );
    }

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent' && result[0]?.createdAt) {
      result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    }

    setFilteredQuizzes(result);
    setPage(1);
  }, [search, sortBy, quizzes, statusFilter, privacyFilter, tagFilter]);

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

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 5 }}>{error}</Alert>;

  return (
    <Box sx={{ px: { xs: 2, md: 0 }, pt: { xs: 3, md: 0 } }} ref={titleRef}>
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

        <TextField label="Tag" size="small" placeholder="Enter tag..." value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} sx={{ minWidth: { xs: '100%', md: 150 } }} />

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
                overflow: 'visible', height:'100%'
              }}>
                 {/* Edit Button */}
                 <Box sx={{width: 20, height: 25, borderRadius: 2,
                  position: 'absolute', backgroundColor: 'inherit', display:'flex',
                  justifyContent: 'center', top: -14, right: '12%',}}>
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

                <CardContent>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>{quiz.title}</Typography>
                  <Typography variant="caption" gutterBottom>{quiz.description || 'No description provided.'}</Typography>
                  <Typography variant="body2">Total Questions: {quiz.questionCount}</Typography>
                  <Typography variant="body2">Time Allowed: {quiz.timeLimit} minutes</Typography>
                  {quiz.secretid !== '' &&
                  <Typography variant="body2">
                    <strong style={{ color: themeMode ? 'white' : 'black' }}>Secret Id:</strong> {quiz.secretid}
                  </Typography>}
                  {/* <Typography variant="body2" color={quiz.isActive ? '#4CAF50' : 'gray'}>
                    <strong style={{ color: themeMode ? 'white' : 'black' }}>Status:</strong> {quiz.isActive ? 'Active' : 'Inactive'}
                  </Typography> */}

                  {quiz.tags && quiz.tags.length > 0 && (
                    <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                      {quiz.tags.map((tag, i) => (
                        <Typography key={i} variant="caption" sx={{ backgroundColor: themeMode ? '#1f1f1f' : '#f0f0f0', px: 1, borderRadius: 1 }}>
                          #{tag}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  
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
    </Box>
  );
};

export default UserQuizzes;