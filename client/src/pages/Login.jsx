import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Emulate login API call
        if (email === 'admin@nexobots.com' && password === 'admin') {
            login({ id: 1, email, role: 'ADMIN' }, 'mock-token-admin');
            navigate('/admin');
        } else {
            login({ id: 2, email, role: 'USER' }, 'mock-token-user');
            navigate('/');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to NexoBots</h2>
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
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
