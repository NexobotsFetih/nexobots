import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PaymentChat from './pages/PaymentChat';
import AdminDashboard from './pages/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const location = useLocation();
    // Hide navbar on login page
    const hideNavbar = location.pathname === '/login';

    return (
        <div className="app-container">
            {!hideNavbar && <Navbar />}
            <div className="content">
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/payment-chat" element={
                        <ProtectedRoute>
                            <PaymentChat />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
}

export default App;
