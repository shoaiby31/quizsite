import React, { useEffect, useState, useRef } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Pagination, CardActions, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 6;

const PublicQuizzes = () => {
  const titleRef = useRef(null); // Ref for the Typography element (scroll target)

  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'title'
  const [page, setPage] = useState(1);

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

  // Apply search + sort
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
    setPage(1); // Reset to first page on filter change
  }, [search, sortBy, quizzes]);

  // Scroll to "Available Quizzes" after loading
  useEffect(() => {
    if (!loading && titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  const paginatedQuizzes = filteredQuizzes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 5 }}>{error}</Alert>;

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pt:{xs:3, md:0} }} ref={titleRef}>
      {/* Search and Sort */}
      <Box sx={{ display: 'flex', justifyContent: 'right', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <TextField placeholder="Search by title..." sx={{ minWidth: 150 }} value={search} size='small' onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select size='small' value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="recent">Recently Added</MenuItem>
            <MenuItem value="title">Title (A–Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Scroll target */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>Available Quizzes</Typography>

      {/* Quiz Grid */}
      <Grid container spacing={3}>
        {paginatedQuizzes.length === 0 ? (
          <Typography variant="body1">No matching quizzes found.</Typography>
        ) : (
          paginatedQuizzes.map(quiz => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={quiz.id}>
              <Card elevation={3} sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {quiz.description || 'No description provided.'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ paddingX: 5, display: 'flex', justifyContent: 'right', paddingTop: 2 }}>
                  <Button component={Link} to={`/attemptQuiz/${quiz.id}`} variant='outlined' sx={{ borderRadius: 20, textTransform: 'none' }} size="small">Attempt Quiz</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
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