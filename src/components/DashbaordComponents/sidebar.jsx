import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import { Home, Map, People, History, Settings, AppRegistration } from '@mui/icons-material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import { Link } from 'react-router-dom';
import Logo from "../../assets/logo.png";

const Sidebar = () => (
  <Drawer variant="permanent"
    sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', backgroundColor: 'transparent', paddingTop: 2, border: 'none' }, }}>
    <Box display='flex' justifyContent='center'>
      <Box component="img" src={Logo} sx={{ padding: 1, width: 80, display: { xs: 'none', md: 'flex' } }} alt="Your logo." />
    </Box>
    <Box sx={{ p: 2 }}>
      <Button variant="contained" fullWidth startIcon={<AppRegistration />} color="secondary">
        Register Patient
      </Button>
    </Box>
    <List>
      {[['Home', <Home />, '/'], ['Overview', <People />, '/dashboard'], ['Map', <Map />, '/map'], ['History', <History />, '/history'], ['Settings', <Settings />, '/settings']].map(([text, icon, link]) => (
        <ListItem button key={text} component={Link} to={link}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
    <Box sx={{ mt: 'auto', p: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <AppleIcon color="action" />
        <AndroidIcon color="action" />
      </Box>
    </Box>
  </Drawer>
);

export default Sidebar;
