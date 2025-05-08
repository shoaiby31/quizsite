import { Card, Typography, Avatar, Box } from '@mui/material';

const InfoCard = ({ icon, label, value, color }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
    <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  </Card>
);

export default InfoCard;