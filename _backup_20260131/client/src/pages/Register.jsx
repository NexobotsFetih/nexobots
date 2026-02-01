import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Lock, Mail, Loader2, CheckCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailDomain = email.split('@')[1];
        if (!emailDomain || !allowedDomains.includes(emailDomain.toLowerCase())) {
            setError('Sadece geçerli e-posta sağlayıcıları (Gmail, Outlook, Hotmail, Yahoo, iCloud) kabul edilmektedir.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create User in Firebase Auth (NOT in Firestore yet!)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Send Verification Email
            await sendEmailVerification(user);

            // 3. DON'T add to Firestore yet - will be added on first verified login
            setSuccess("Kayıt başarılı! Doğrulama bağlantısı e-postana gönderildi. Lütfen e-postanı kontrol et ve doğrulama linkine tıkla.");

            // Wait 4 seconds before redirecting
            setTimeout(() => {
                navigate('/login');
            }, 4000);

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Bu e-posta adresi zaten kullanımda.');
            } else if (err.code === 'auth/weak-password') {
                setError('Şifre en az 6 karakter olmalıdır.');
            } else {
                setError('Kayıt olurken bir hata oluştu: ' + err.message);
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
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)', border: '1px solid rgba(0, 242, 255, 0.3)',
                    zIndex: 10
                }}>
                    <UserPlus size={48} color="#00f2ff" />
                </div>

                <h2 className="animate-slide-up delay-100" style={{ textAlign: 'center', margin: '2rem 0 2rem', fontSize: '2rem', color: '#00f2ff' }}>KAYIT OL</h2>

                {error && (
                    <div className="animate-slide-up" style={{
                        background: 'rgba(255, 0, 85, 0.1)', border: '1px solid #ff0055',
                        color: '#ff0055', padding: '1rem', borderRadius: '8px',
                        marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="animate-slide-up" style={{
                        background: 'rgba(0, 242, 255, 0.1)', border: '1px solid #00f2ff',
                        color: '#00f2ff', padding: '1rem', borderRadius: '8px',
                        marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                        <CheckCircle size={20} />
                        <span>{success}</span>
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
                            placeholder="ornek@gmail.com"
                            required
                            disabled={loading || success}
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
                            disabled={loading || success}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary animate-slide-up delay-300 tech-glow"
                    style={{
                        width: '100%', fontSize: '1.1rem', marginBottom: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        opacity: loading || success ? 0.7 : 1,
                        cursor: loading || success ? 'not-allowed' : 'pointer'
                    }}
                    disabled={loading || success}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Kayıt Yapılıyor...</span>
                        </>
                    ) : (
                        'Hesap Oluştur'
                    )}
                </button>

                <div className="animate-slide-up delay-300" style={{ textAlign: 'center', color: '#64748b' }}>
                    Zaten hesabın var mı? <span style={{ color: '#00f2ff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => !loading && navigate('/login')}>Giriş Yap</span>
                </div>
            </form>
        </div>
    );
};

export default Register;
