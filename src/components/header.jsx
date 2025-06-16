import React , { useEffect, useRef } from 'react'
import { Box, Grid, Typography, Card, CardContent, CardActions, Button, CardMedia } from '@mui/material'
import pic from '../assets/headerpic.png';
import { Link } from 'react-router-dom';

function Header() {
    const titleRef = useRef(null);
useEffect(() => {
    if (titleRef.current) {
        const topOffset = titleRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }, []);
    return (
        <Box ref={titleRef}>
            <Grid container spacing={1} sx={{flexDirection: { xs: 'column-reverse', md: 'row' },}}>
                <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }} >
                    <Card elevation={0}>
                        <CardContent sx={{ paddingTop: 5, paddingX: { xs: 2, sm: 2, md: 5, lg: 5, xl: 5 } }}>
                            <Typography sx={{ fontWeight: 'bold', typography: { xs: 'h5', sm: 'h3', md: 'h4', lg: 'h4', xl: 'h2' } }}>Empower Your Learning With Smart Online Quizzes</Typography>
                            <Typography variant="body1" sx={{ typography: { xs: 'body2', sm: 'button', md: 'caption', lg: 'body2', xl: 'h6' }, paddingTop: 3 }}>Create, Share, and Attempt Quizzes for Schools, Academies, or Personal Test Prep — All in One Powerful Platform.</Typography>
                        </CardContent>
                        <CardActions sx={{ paddingX:{xs:2, md:5}, paddingTop: 2, display:{xs:'flex', md:'block'}, justifyContent:'center' }}>
                            <Button variant='contained' color='info' sx={{ borderRadius: 20, color:'white', backgroundImage: 'linear-gradient(to top left,hsl(315, 93.80%, 44.30%),rgb(104, 70, 253))',
                            textTransform: 'none'}} component={Link} to='/createquiz' size="large">Create Quiz</Button>
                            <Button variant='contained' color='info' sx={{ borderRadius: 20, color:'white', backgroundImage: 'linear-gradient(to top left,hsl(315, 93.80%, 44.30%),rgb(104, 70, 253))',
                            textTransform: 'none'}} component={Link} to='/browsequiz' size="large">Browse Quizzes</Button>

                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                        <CardMedia component="img" image={pic} alt="Quiz Picture"
                            sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default Header
