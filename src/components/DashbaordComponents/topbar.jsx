import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, InputBase, Avatar, Box, alpha, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { changeThemeMode } from '../../redux/slices/theme';  // Adjust path accordingly
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link } from 'react-router-dom';

const TopBar = () => {
    const dispatch = useDispatch();
    const displayName = useSelector((state) => state.auth.displayName);
    const userpic = useSelector((state) => state.auth.photoURL);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const themeMode = useSelector((state) => state.mode.value);
    useEffect(() => {
        setAnchorElUser(null); // Clear any stale anchor
    }, [displayName]);

    const handleOpenUserMenu = (event) => {
        // Ensure element is visible in layout
        if (event.currentTarget.offsetParent !== null) {
            setAnchorElUser(event.currentTarget);
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    return (
        <AppBar position="static" elevation={0} color="inherit">
            <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                {/* Search Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: alpha('#000', 0.05),
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        width: { xs: '100%', sm: '300px', md: '400px' },
                    }}
                >
                    <SearchIcon color="action" sx={{ mr: 1 }} />
                    <InputBase
                        placeholder="Search dashboard..."
                        fullWidth
                        sx={{
                            fontSize: '0.95rem',
                        }}
                    />
                </Box>

                {/* Icons & User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton>
                        <NotificationsNoneIcon />
                    </IconButton>
                    <IconButton>
                        <SettingsOutlinedIcon />
                    </IconButton>
                    <IconButton edge="end" color="inherit" onClick={() => dispatch(changeThemeMode())}>
                        {themeMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                    </IconButton>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {displayName}
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open Menu">
                            <IconButton onClick={handleOpenUserMenu} size="small" sx={{ p: 0 }}>
                                <Avatar alt="profile pic" src={userpic} sx={{ width: 32, height: 32, backgroundColor: 'green' }} />
                            </IconButton>
                        </Tooltip>

                        {anchorElUser && (
                            <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                <MenuItem component={Link}to='/'>Home</MenuItem>
                                <MenuItem onClick={() => alert("I am Profile function")}>Profile</MenuItem>
                                <MenuItem onClick={() => alert("I am Settings function")}>Settings</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        )}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;