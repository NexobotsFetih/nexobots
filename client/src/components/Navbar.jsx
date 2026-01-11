import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0); // Mock cart count

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: '#1e293b',
            borderBottom: '1px solid #334155'
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                NexoBots
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#94a3b8' }}>Home</Link>
                <Link to="/#services" style={{ color: '#94a3b8' }}>Services</Link>

                {user ? (
                    <>
                        {user.role === 'ADMIN' && <Link to="/admin" style={{ color: '#f59e0b' }}>Admin Panel</Link>}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -8, right: -8,
                                    background: 'red', borderRadius: '50%',
                                    width: '18px', height: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} />
                            <span>{user.email}</span>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'transparent', color: '#ef4444' }}>
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn-primary" style={{ background: 'transparent', border: '1px solid #3b82f6' }}>Login</Link>
                        <Link to="/register" className="btn-primary">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
