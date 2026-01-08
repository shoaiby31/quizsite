import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import InfoCard from './infocard';
import { People, Quiz, History, Map } from '@mui/icons-material';
import FacultyCount from '../AdminComponents/FacultyCount';

const DashboardHeader = ({ schoolName, coverPhotoUrl, children }) => {
    return (
        <Box sx={{ width: '100%', minHeight: { xs: 200, sm: 230, md: 230 }, backgroundImage: `url(${coverPhotoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, position: 'relative', color: '#fff', overflow: { xs: 'visible', md: 'hidden' }, }} >
            {/* Overlay */}
            <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', }} />

            {/* Info cards */}
            <Box
                sx={{ position: { xs: 'relative', md: 'absolute' }, top: { md: 'auto', xs: 8 }, bottom: { md: 20 }, right: { md: 24 }, left: { md: 'auto' }, width: { xs: '100%', sm: '100%', md: '50%' }, px: { xs: 2, md: 0 }, zIndex: 2, }}>
                {children ? (children) : (
                    <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <FacultyCount>
                                {(count) => (
                                    <InfoCard icon={<People />} label="Total Faculty Members" value={count ?? "..."} color="purple" transparent />
                                )}
                            </FacultyCount>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <InfoCard icon={<Quiz />} label="Total Students" value="--" color="blue" transparent />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <InfoCard icon={<History />} label="Total Attempts" value="--" color="green" transparent />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <InfoCard icon={<Map />} label="Avg Score" value="--" color="orange" transparent />
                        </Grid>
                    </Grid>
                )}
            </Box>

            {/* School name bottom-left */}
            <Box sx={{
                display: 'flex', alignItems: 'center', px: 2, py: 1, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: 'inherit', zIndex: 2,
                position: { xs: 'relative', md: 'absolute' }, bottom: { md: 20 }, left: { md: 24 }, mt: { xs: 2, md: 0 }, mb: { xs: 2, md: 0 },
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }} >{schoolName}</Typography>
            </Box>
        </Box>

    );
};

export default DashboardHeader;
