import { Box, Skeleton } from '@mui/material';

const DashboardHeaderSkeleton = () => {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: 220, borderRadius: 2, overflow: 'hidden' }}>
      {/* Cover image */}
      <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />

      {/* School name placeholder */}
      <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
        <Skeleton animation="wave" variant="text" width={180} height={32} />
      </Box>

      {/* Info cards */}
      <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 1 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton animation="wave" key={i} variant="rectangular" width={90} height={60} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    </Box>
  );
};
export default DashboardHeaderSkeleton;
