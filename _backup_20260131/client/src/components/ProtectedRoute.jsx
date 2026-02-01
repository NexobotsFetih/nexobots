import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                }
            }
            setRoleLoading(false);
        };

        if (!loading) {
            fetchUserRole();
        }
    }, [user, loading]);

    if (loading || roleLoading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Yükleniyor...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if trying to access admin panel
    if (location.pathname === '/admin' && userRole !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
