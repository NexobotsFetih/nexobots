import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentChat from './pages/PaymentChat';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <div className="app-container">
            <Navbar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/payment-chat" element={<PaymentChat />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
