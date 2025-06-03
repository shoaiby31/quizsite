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
import {
    doc, getDoc, onSnapshot, collection, query, where, deleteDoc, addDoc, getDocs
} from 'firebase/firestore';

const TopBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const displayName = useSelector((state) => state.auth.displayName);
    const userpic = useSelector((state) => state.auth.photoURL);
    const themeMode = useSelector((state) => state.mode.value);

    const [adminId, setAdminId] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);
    const [joinRequests, setJoinRequests] = useState([]);

    // Fetch adminId from user document
    useEffect(() => {
        if (!auth.currentUser) return;
        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        getDoc(userDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAdminId(data.adminid || auth.currentUser.uid);
            } else {
                setAdminId(auth.currentUser.uid);
            }
        }).catch(() => {
            setAdminId(auth.currentUser.uid);
        });
    }, []);

    // Listen for joinRequests
    useEffect(() => {
        if (!adminId) return;

        const q = query(collection(db, 'joinRequests'), where('adminId', '==', adminId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sorted = [...requests].sort((a, b) => Number(!a.read) - Number(!b.read));
            setJoinRequests(sorted);
        });

        return () => unsubscribe();
    }, [adminId]);

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


    const handleAccept = async (request) => {
        try {
            const { studentEmail, className, adminId, id, rollNo, studentName } = request;
    
            if (!studentEmail || !className || !adminId) {
                console.error('Missing data in request:', request);
                return;
            }
    
            // Check if the student already has a relation with this class/admin
            const existingQuery = query(
                collection(db, 'studentTeacherRelations'),
                where('studentEmail', '==', studentEmail),
                where('className', '==', className),
                where('adminId', '==', adminId)
            );
    
            const existingSnapshot = await getDocs(existingQuery);
    
            if (!existingSnapshot.empty) {
                console.warn('Student already joined this class.');
                await deleteDoc(doc(db, 'joinRequests', id));
                return;
            }
    
            // Add the relation
            await addDoc(collection(db, 'studentTeacherRelations'), {
                studentEmail,
                className,
                adminId,
                rollNo,
                studentName,
                timestamp: new Date()
            });
    
            // Delete the join request after accepting
            await deleteDoc(doc(db, 'joinRequests', id));
    
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDeny = async (id) => {
        try {
            await deleteDoc(doc(db, 'joinRequests', id));
        } catch (err) {
            console.error('Error denying request:', err);
        }
    };

    const unreadCount = joinRequests.filter(r => !r.read).length;

    return (
        <AppBar position="static" elevation={0} color="inherit">
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
                        {joinRequests.length === 0 && (
                            <MenuItem disabled>No join requests</MenuItem>
                        )}

                        {joinRequests.map((req) => (
                            <Box key={req.id} sx={{ px: 2, py: 1 }}>
                                <Stack spacing={0.5}>
                                    <Typography variant="subtitle2" fontWeight={req.read ? 'medium' : 'bold'}>
                                        {req.studentName || 'Unknown'} wants to join
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Roll No: {req.rollNo} • Class: {req.className}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Button size="small" variant="text" color="success" onClick={() => handleAccept(req)}>
                                            Accept
                                        </Button>
                                        <Button size="small" variant="text" color="error" onClick={() => handleDeny(req.id)}>
                                            Deny
                                        </Button>
                                    </Stack>
                                </Stack>
                                <Divider sx={{ mt: 1.5 }} />
                            </Box>
                        ))}

                        {joinRequests.length > 0 && (
                            <MenuItem onClick={() => {
                                handleCloseNotifMenu();
                                navigate('/dashboard/join-requests');
                            }} sx={{ justifyContent: 'center', fontWeight: 600, fontSize:14 }}>
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
                            sx={{ mt: '45px' }}
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