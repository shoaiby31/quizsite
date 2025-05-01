import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Divider, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { changeThemeMode } from '../redux/slices/theme/index'
import Drawer from '@mui/material/Drawer';
import { useLocation } from 'react-router-dom';
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase'; // Make sure auth and googleProvider are exported from firebase.js
import { signOut } from 'firebase/auth';
import Logo from "../assets/logo.png";
const drawerWidth = 240;
const pages = [{
  id: 1,
  name: 'Home',
  to: '/'
},
{
  id: 2,
  name: 'Skills',
  to: '#skills'

},
{
  id: 3,
  name: 'Experience',
  to: '#experience'

},
{
  id: 4,
  name: 'Services',
  to: 'services'

},
{
  id: 5,
  name: 'About',
  to: '#about'

},
{
  id: 6,
  name: 'Contact',
  to: '#contact'

},];

export default function Appbar(props) {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();
  const user = useSelector((state) => state.auth.photoURL);



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Divider />
      <List sx={{ width: 250 }}>
        {pages.map((item, k) => (
          <ListItem key={k} disablePadding>
            <ListItemButton to={item.to} selected={location.pathname === item.to} onClick={handleDrawerToggle}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}

      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;



  const themeMode = useSelector((state) => state.mode.value)
  const dispatch = useDispatch()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const Profile = () => {
    alert("I am Profile function")
  };
  const Settings = () => {
    alert("I am Settings function")
  };
  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };



  return (
    <Box sx={{ flexGrow: 1, mb:5 }}>
      <AppBar position='fixed' color='inherit' elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
          <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={handleDrawerToggle} edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box component="img" src={Logo} sx={{ padding: 0, width: 80, display: { xs: 'none', md: 'flex' } }} alt="Your logo." />
          </a>
          <Typography sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Typography>





          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((item, key) => (
              <Button component={Link} to={item.to} key={key} sx={{ my: 2, color: 'inherit', display: 'block' }}>{item.name}</Button>
            ))}
          </Box>
          <IconButton edge="end" color="inherit" onClick={() => dispatch(changeThemeMode())}>
            {themeMode ? <Brightness7Icon fontSize='small' /> : <Brightness4Icon fontSize='small' />}
          </IconButton>
          {!user ? (
            <>
              <Button variant='outlined' component={Link} to='/signup?mode=signup' size='small' sx={{ marginLeft: 2, color: 'inherit', display: 'block' }}>Sign up</Button>
              <Button variant='outlined' component={Link} to='/signup' size='small' sx={{ marginLeft: 2, color: 'inherit', display: 'block' }}>Log in</Button>
            </>
          ) : (
            <Box sx={{ flexGrow: 0, marginLeft: 2 }}>
              <Tooltip title="Open Menu">
                <IconButton onClick={handleOpenUserMenu} size='small' sx={{ p: 0, }}>
                  <Avatar alt={'profile pic'} src={user} sx={{ width: 32, height: 32 }} />
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{
                vertical: 'top', horizontal: 'right'
              }}
                keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                <MenuItem onClick={Profile}>Profile</MenuItem>
                <MenuItem onClick={Settings}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>

              </Menu>
            </Box>
          )}




        </Toolbar>
      </AppBar>
      <nav>
        <Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }}>
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}