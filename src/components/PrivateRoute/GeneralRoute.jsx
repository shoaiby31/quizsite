import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CircularProgress, Box } from '@mui/material';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const GeneralRoute = ({ children, allowedRoles }) => {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const fetchRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) setRole(snap.data().role);
      } catch (err) {
        console.error('Error fetching role:', err);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user, loading]);

  if (loading || roleLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GeneralRoute;
