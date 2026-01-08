import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar, Toolbar, Typography, InputBase, Avatar, Box, alpha,
    IconButton, Tooltip, Menu, MenuItem, Badge, Divider, Button, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { changeThemeMode } from '../../redux/slices/theme';
import { auth, db } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { setdrawerState } from '../../redux/slices/drawerSlice/index';
import { doc, getDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { approveTeacherRequest, denyTeacherRequest } from "../AdminComponents/AcceptRequests.service";
import { acceptStudentRequest, denyStudentRequest } from '../FacultyComponents/studentRequests.service';

const TopBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const displayName = useSelector((state) => state.auth.displayName);
    const userpic = useSelector((state) => state.auth.photoURL);
    const themeMode = useSelector((state) => state.mode.value);
    const uid = useSelector((state) => state.auth.uid);

    const [institutePassword, setInstitutePassword] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);

    const [role, setRole] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Fetch adminId from user document
    useEffect(() => {
        if (!auth.currentUser) return;

        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        getDoc(userDocRef).then((snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setRole(data.role);
                setInstitutePassword(data.institutePassword || data.teacherSecretId);
            }
        });
    }, []);


    // Listen for joinRequests
    useEffect(() => {
        if (!role) return;

        let q;

        if (role === 'admin') {
            if (!institutePassword) return;
            q = query(
                collection(db, 'teacherRequests'),
                where('institutePassword', '==', institutePassword)
            );
        }

        if (role === 'teacher') {
            q = query(
                collection(db, 'joinRequests'),
                where('teacherSecretId', '==', institutePassword)
            );
        }

        if (!q) return;

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sorted = [...items].sort((a, b) => Number(!a.read) - Number(!b.read));
            setNotifications(sorted);
        });

        return () => unsubscribe();
    }, [role, institutePassword]);


    const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleOpenNotifMenu = (e) => setAnchorElNotif(e.currentTarget);
    const handleCloseNotifMenu = () => setAnchorElNotif(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error', error);
        }
    };

const handleApprove = async (req) => {
  if (role === 'admin') await approveTeacherRequest(req, uid);
  if (role === 'teacher') await acceptStudentRequest(req, uid);
};

const handleReject = async (id) => {
  if (role === 'admin') await denyTeacherRequest(id);
  if (role === 'teacher') await denyStudentRequest(id);
};



    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AppBar position="static" elevation={0} color="inherit" sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // 50% opacity white
            backdropFilter: 'blur(8px)', // optional: nice glass effect
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => dispatch(setdrawerState())}>
                    <MenuIcon />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: alpha('#000', 0.05),
                        borderRadius: 2,
                        px: 2, py: 0.5,
                        width: { xs: '100%', sm: '300px', md: '400px' },
                    }}
                >
                    <SearchIcon color="action" sx={{ mr: 1 }} />
                    <InputBase placeholder="Search dashboard..." fullWidth sx={{ fontSize: '0.95rem' }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Notifications */}
                    <IconButton onClick={handleOpenNotifMenu}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsNoneIcon />
                        </Badge>
                    </IconButton>

                    {/* Notification Menu */}
                    <Menu
                        anchorEl={anchorElNotif}
                        open={Boolean(anchorElNotif)}
                        onClose={handleCloseNotifMenu}
                        PaperProps={{ style: { maxHeight: 360, width: 360 } }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {notifications.length === 0 && (
                            <MenuItem disabled>No join requests</MenuItem>
                        )}

                        {notifications.map((req) => (
                            <Box key={req.id} sx={{ px: 2, py: 1 }}>
                                <Stack spacing={0.5}>
                                    <Typography variant="subtitle2" fontWeight={req.read ? 'medium' : 'bold'}>
                                        {role === 'admin' && `${req.name} wants to join your school`}
                                        {role === 'teacher' && `${req.studentName || 'A student'} wants to join your class`}

                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Name: {req.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Button size="small" variant="text" color="success" onClick={() => handleApprove(req)}>
                                            Accept
                                        </Button>
                                        <Button size="small" variant="text" color="error" onClick={() => handleReject(req.id)}>
                                            Deny
                                        </Button>
                                    </Stack>
                                </Stack>
                                <Divider sx={{ mt: 1.5 }} />
                            </Box>
                        ))}

                        {notifications.length > 0 && (
                            <MenuItem onClick={() => {
                                handleCloseNotifMenu();
                               role === 'admin'? navigate('/dashboard/faculty-requests') : navigate('/dashboard/students-requests');  
                            }} sx={{ justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>
                                View All Requests
                            </MenuItem>
                        )}
                    </Menu>



                    <IconButton onClick={() => dispatch(changeThemeMode())}>
                        {themeMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                    </IconButton>

                    <Typography variant="body1" sx={{ display: { xs: 'none', md: 'inline-block' }, fontWeight: 500 }}>
                        {displayName}
                    </Typography>

                    <Box>
                        <Tooltip title="Open Menu">
                            <IconButton onClick={handleOpenUserMenu} size="small">
                                <Avatar src={userpic} sx={{ width: 32, height: 32, bgcolor: 'green' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            sx={{ mt: '10px' }}
                        >
                            <MenuItem component={Link} to='/'>Home</MenuItem>
                            <MenuItem component={Link} to='/dashboard/profile'>Profile</MenuItem>
                            <MenuItem onClick={() => alert("I am Settings function")}>Settings</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;