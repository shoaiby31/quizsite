import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CircularProgress, Box } from '@mui/material';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AdminRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const [userRole, setUserRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (loading) return;
    
        const fetchUserRole = async () => {
            if (!user) {
                setRoleLoading(false);
                return;
            }
    
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    setUserRole(docSnap.data().role);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setRoleLoading(false);
            }
        };
    
        fetchUserRole();
    }, [user, loading]);

    if (loading || roleLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;