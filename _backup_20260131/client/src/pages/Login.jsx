import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Lock, Mail, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            const isAdmin = user.email === 'egekocaxpro123@gmail.com';

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    role: isAdmin ? 'ADMIN' : 'USER',
                    createdAt: serverTimestamp(),
                    credits: 0
                });
            } else if (isAdmin && userDoc.data().role !== 'ADMIN') {
                // Eğer mail admin maili ama rolü USER kalmışsa düzelt
                await setDoc(userDocRef, { role: 'ADMIN' }, { merge: true });
            }

            // Eğer adminsen direkt admin paneline at, değilsen ana sayfaya
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('E-posta adresi veya şifre hatalı.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
            } else {
                setError('Giriş yapılırken bir hata oluştu: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <form onSubmit={handleSubmit} className="card animate-slide-up" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                <div className="animate-float" style={{
                    position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
                    background: '#050b14', borderRadius: '50%', padding: '1rem',
                    boxShadow: '0 0 20px rgba(0,242,255,0.3)', border: '1px solid rgba(0,242,255,0.3)',
                    zIndex: 10
                }}>
                    <Cpu size={48} color="#00f2ff" />
                </div>

                <h2 className="animate-slide-up delay-100" style={{ textAlign: 'center', margin: '2rem 0 2rem', fontSize: '2rem', color: '#00f2ff' }}>GİRİŞ YAP</h2>

                {error && (
                    <div className="animate-slide-up" style={{
                        background: 'rgba(255, 0, 85, 0.1)', border: '1px solid #ff0055',
                        color: '#ff0055', padding: '0.8rem', borderRadius: '8px',
                        marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div className="animate-slide-up delay-200" style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>E-POSTA ADRESİ</label>
                    <div style={{ position: 'relative' }}>
                        <Mail color="#64748b" size={20} style={{ position: 'absolute', top: '14px', left: '12px' }} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                            placeholder="ornek@email.com"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="animate-slide-up delay-300" style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>ŞİFRE</label>
                    <div style={{ position: 'relative' }}>
                        <Lock color="#64748b" size={20} style={{ position: 'absolute', top: '14px', left: '12px' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary animate-slide-up delay-300 tech-glow"
                    style={{
                        width: '100%', fontSize: '1.1rem', marginBottom: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Giriş Yapılıyor...</span>
                        </>
                    ) : (
                        'Giriş Yap'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Login;
