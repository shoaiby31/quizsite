import React, { useState, useEffect } from 'react';
import {
  AppBar, Box, Toolbar, Button, IconButton, Avatar, Divider, List,
  ListItem, ListItemButton, ListItemText, Drawer, Tooltip, Paper, Popper, Menu, MenuItem, Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { setUser, clearUser } from '../redux/slices/authSlice/index';
import { changeThemeMode } from '../redux/slices/theme';
import Logo from '../assets/logo.png';
import Privatequizmodel from './Quizzes/privatequizmodel';

const drawerWidth = 240;

const pages = [
  { id: 1, name: 'Home', to: '/' },
  { id: 2, name: 'Dashboard', to: '/dashboard' },
  { id: 3, name: 'My Teachers', to: '/my-teachers' },
  {
    id: 4, name: 'Join', submenu: [
      { name: 'Join Teacher', to: '/join-teacher' },
      { name: 'Join Quiz', to: '/join-quiz' }
    ]
  },
  { id: 5, name: 'Services', to: 'services' },
  { id: 6, name: 'About', to: '#about' },
  { id: 7, name: 'Contact', to: '#contact' },
];

export default function Appbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [openDrawerSubmenus, setOpenDrawerSubmenus] = useState({});
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.uid);
  const userpic = useSelector((state) => state.auth.photoURL);
  const userRole = useSelector((state) => state.auth.role);
  const themeMode = useSelector((state) => state.mode.value);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const { role, photoURL } = userDoc.data();
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            photoURL: photoURL || user.photoURL,
            role: role || null,
          }));
        }
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenUserMenu = (event) => {
    if (event.currentTarget.offsetParent !== null) {
      setAnchorElUser(event.currentTarget);
    }
  };
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const toggleDrawerSubmenu = (id) => {
    setOpenDrawerSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getVisiblePages = () => {
    return pages.filter(item => {
      if (item.name === 'Dashboard') return userRole && userRole !== 'student';
      return true;
    });
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Divider />
      <List sx={{ width: 250 }}>
        {getVisiblePages().map((item, k) => (
          item.submenu ? (
            <Box key={k}>
              <ListItemButton onClick={(e) => { e.stopPropagation(); toggleDrawerSubmenu(item.id); }}>
                <ListItemText primary={item.name} />
                {openDrawerSubmenus[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
              <Collapse in={openDrawerSubmenus[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem, subKey) => (
                    <ListItemButton
                      key={subKey}
                      sx={{ pl: 4 }}
                      component={Link}
                      to={subItem.to}
                      onClick={(e) => {
                        if (subItem.name === 'Join Quiz') {
                          e.preventDefault();
                          setModalOpen(true);
                        }
                      }}
                    >
                      <ListItemText primary={subItem.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem key={k} disablePadding>
              <ListItemButton to={item.to} selected={location.pathname === item.to} component={Link}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )
        ))}
        <Divider />
        {!user ? (
          <Box>
            <ListItem disablePadding>
              <ListItemButton to="/login?mode=signup" component={Link}>
                <ListItemText primary="Sign up" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton to="/login" component={Link}>
                <ListItemText primary="Log in" />
              </ListItemButton>
            </ListItem>
          </Box>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => { handleDrawerToggle(); handleLogout(); }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ flexGrow: 1, pb: 10 }}>
      <Privatequizmodel open={modalOpen} onClose={() => setModalOpen(false)} />
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', position: 'relative' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: 'auto' }}>
            <Box component="img" src={Logo} sx={{ padding: 0, width: 80 }} alt="Logo" />
          </a>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {getVisiblePages().map((item, key) => (
              item.submenu ? (
                <Box key={key} onMouseEnter={(e) => { setSubmenuAnchorEl(e.currentTarget); setIsSubmenuOpen(true);
                  }} onMouseLeave={() => setIsSubmenuOpen(false)}
                  sx={{ position: 'relative', display: 'inline-block' }}>
                  <Button sx={{ my: 1, textTransform: 'none', color: 'inherit' }} endIcon={<ExpandMoreIcon />} >
                    {item.name}
                  </Button>
                  <Popper open={isSubmenuOpen} anchorEl={submenuAnchorEl} placement="bottom-start" disablePortal style={{ zIndex: 1300, width: '150px' }}>
                    <Paper onMouseEnter={() => setIsSubmenuOpen(true)} onMouseLeave={() => setIsSubmenuOpen(false)} elevation={3}>
                      <List sx={{ p: 0 }}>
                        {item.submenu.map((subItem, subKey) => (
                          <ListItemButton key={subKey} component={Link} to={subItem.to} onClick={(e) => {
                              setIsSubmenuOpen(false);
                              if (subItem.name === 'Join Quiz') {
                                e.preventDefault();
                                setModalOpen(true);
                              }
                            }}>
                            <ListItemText primary={subItem.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Paper>
                  </Popper>
                </Box>
              ) : (
                <Button component={Link} to={item.to} key={key} sx={{ my: 2, textTransform: 'none', color: 'inherit' }}>
                  {item.name}
                </Button>
              )
            ))}

            {!user && (
              <Button component={Link} to="/login" sx={{ my: 2, textTransform: 'none', color: 'primary' }}>
                Log in
              </Button>
            )}
            <IconButton edge="end" color="inherit" onClick={() => dispatch(changeThemeMode())}>
              {themeMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
            {user && (
              <Box sx={{ flexGrow: 0, marginLeft: 2 }}>
                <Tooltip title="Open Menu">
                  <IconButton onClick={handleOpenUserMenu} size="small" sx={{ p: 0 }}>
                    <Avatar alt="profile pic" src={userpic} sx={{ width: 32, height: 32, bgcolor: 'green' }} />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ mt: '45px' }}>
                  <MenuItem component={Link} to='/profile' onClick={handleCloseUserMenu}>Profile</MenuItem>
                  <MenuItem onClick={() => alert("Settings coming soon")}>Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: 'auto' }} onClick={handleDrawerToggle} edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}