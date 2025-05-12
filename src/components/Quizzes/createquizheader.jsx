import React from 'react'
import { Box, Card, CardContent, CardMedia, Divider, Grid, Typography } from '@mui/material'
import pic from '../../assets/createquiz.webp'

function createquizheader() {
  return (
    <Box sx={{ pt: 5, px: { xs: 3, md: 5 } }}>
        <Grid container>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Card elevation={0}>
                                <CardContent sx={{ paddingTop: 5, paddingX: { xs: 2, sm: 2, md: 5, lg: 5, xl: 5 } }}>
                                    <Typography sx={{ fontWeight: 'bold', typography: { xs: 'h4', sm: 'h3', md: 'h4', lg: 'h4', xl: 'h2' }, }}>Create a New Quiz 📝</Typography>
                                    <Typography variant="body1" sx={{ typography: { xs: 'body1', sm: 'button', md: 'caption', lg: 'body2', xl: 'h6' }, paddingTop: 3 }}>Welcome! Craft your own quiz effortlessly. Whether it's for your class, academy, or personal practice, our platform makes quiz creation simple and intuitive.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <CardMedia component="img" image={pic} alt="Quiz Picture"
                                sx={{ width: '60%', height: '100%', objectFit: 'contain' }} />
                        </Grid>
                    </Grid>
                    <Divider />
    </Box>
  )
}

export default createquizheader
