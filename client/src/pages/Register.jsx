import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Emulate Register
        login({ id: Math.floor(Math.random() * 1000), email, role: 'USER' }, 'mock-token');
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;
