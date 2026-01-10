import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, CircularProgress, Alert,
  TextField, InputAdornment, MenuItem, Select, FormControl,
  InputLabel, Pagination, CardActions, Button
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Privatequizmodel from './privatequizmodel';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ITEMS_PER_PAGE = 6;

const PublicQuizzes = () => {
  const titleRef = useRef(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, 'quizzes'), where('isPublic', '==', true));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuizzes(list);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quizzes.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    let result = quizzes.filter(quiz =>
      quiz.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent' && quizzes[0]?.createdAt) {
      result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    }

    setFilteredQuizzes(result);
    setPage(1);
  }, [search, sortBy, quizzes]);

  useEffect(() => {
    if (!loading && titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  const handleJoinClick = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setModalOpen(true);
    }
  };

  const paginatedQuizzes = filteredQuizzes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 5 }}>{error}</Alert>;

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pt: { xs: 3, md: 0 } }} ref={titleRef}>
      {/* Search and Sort */}
      <Box sx={{ display: 'flex', justifyContent: 'right', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <Button
          variant='outlined'
          color='info'
          onClick={handleJoinClick}
          sx={{ textTransform: 'none' }}
          size="small"
        >
          Join Private Quiz
        </Button>

        <Privatequizmodel open={modalOpen} onClose={() => setModalOpen(false)} />

        <TextField
          placeholder="Search by title..."
          sx={{ minWidth: 150 }}
          value={search}
          size='small'
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select size='small' value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="recent">Recently Added</MenuItem>
            <MenuItem value="title">Title (A–Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>Available Quizzes</Typography>

      <Grid container spacing={3}>
        {paginatedQuizzes.length === 0 ? (
          <Typography variant="body1">No matching quizzes found.</Typography>
        ) : (
          paginatedQuizzes.map(quiz => (
            <Grid size={{ xs: 12, md: 3 }} key={quiz.id}>
              <Card elevation={3} sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="body2" fontWeight='bold' gutterBottom>{quiz.title}</Typography>
                  <Typography variant="caption" gutterBottom>{quiz.description || 'No description provided.'}</Typography>
                  <Typography variant="body2">For Class: {quiz.class}{quiz.class === 1 ? 'st' : quiz.class === 2 ? 'nd' : quiz.class === 3 ? 'rd' : 'th'}</Typography>

                  {Object.entries(quiz.questionTypes).map(([type, value]) => (
                    <Typography variant="body2" gutterBottom key={type}>
                      {value ? '✅ ' : <span style={{ fontSize: '11px' }}>❌ </span>}
                      {type === 'truefalse' ? 'True/False' : type === 'short' ? 'Short Questions' : "MCQ's"}
                      {value && ` — Time: ${value.timeLimit} min`}
                    </Typography>
                  ))}
                  {/* <Typography variant="body2" fontWeight='bold'>Created By: {quiz.ownerName}</Typography> */}
                </CardContent>
                <CardActions sx={{ paddingX: 5, justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <Button component={Link} to={`/start-public-test/${quiz.id}`} variant='text' sx={{ borderRadius: 20, textTransform: 'none' }} size="small">
                    Attempt Quiz
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {filteredQuizzes.length > ITEMS_PER_PAGE && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PublicQuizzes;