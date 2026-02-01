import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Cpu, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('home');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Refs for each nav link to calculate position
    const linkRefs = {
        home: useRef(null),
        services: useRef(null),
        about: useRef(null),
        admin: useRef(null)
    };

    // Close menu on resize
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth > 768) setIsMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname !== '/') return;
            const sections = ['home', 'services', 'about'];
            let current = 'home';
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) current = section;
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === '/admin') setActiveSection('admin');
        else if (location.pathname !== '/') setActiveSection(null);
    }, [location.pathname]);

    useEffect(() => {
        const activeRef = linkRefs[activeSection];
        if (activeRef && activeRef.current && window.innerWidth > 768) {
            const { offsetLeft, offsetWidth } = activeRef.current;
            setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [activeSection, location.pathname, isMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const navLinkStyle = (name) => ({
        color: activeSection === name ? 'var(--primary)' : 'var(--text-main)',
        fontFamily: 'Rajdhani',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        fontSize: '0.9rem',
        padding: '0.5rem 0',
        transition: 'all 0.3s ease',
        textShadow: activeSection === name ? '0 0 10px var(--primary-glow)' : 'none',
        display: 'block',
        cursor: 'pointer'
    });

    return (
        <nav className="navbar-container">
            <Link to="/" onClick={() => { document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="logo">
                <Cpu size={32} color="var(--primary)" />
                <span className="logo-text"><span style={{ color: 'var(--primary)' }}>NEXO</span>BOTS</span>
            </Link>

            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link
                    ref={linkRefs.home}
                    to="/"
                    onClick={() => { document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}
                    style={navLinkStyle('home')}
                >
                    Ana Sayfa
                </Link>

                <a
                    ref={linkRefs.services}
                    href={location.pathname === '/' ? "#services" : "/#services"}
                    style={navLinkStyle('services')}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Hizmetler
                </a>

                <a
                    ref={linkRefs.about}
                    href={location.pathname === '/' ? "#about" : "/#about"}
                    style={navLinkStyle('about')}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Hakkımızda
                </a>

                {user?.role === 'ADMIN' && (
                    <Link
                        ref={linkRefs.admin}
                        to="/admin"
                        style={navLinkStyle('admin')}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        ADMIN
                    </Link>
                )}

                <div className="desktop-indicator" style={{
                    position: 'absolute',
                    bottom: '-4px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    boxShadow: '0 0 12px var(--primary)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    ...indicatorStyle
                }} />

                {user ? (
                    <div className="user-profile-nav">
                        <div className="user-badge">
                            <User size={16} color="var(--primary)" />
                            <span>{user.email.split('@')[0]}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="nav-auth-btns">
                        <Link to="/login" className="btn-outline nav-login-btn" onClick={() => setIsMenuOpen(false)}>GİRİŞ</Link>
                    </div>
                )}
            </div>

            <style>{`
                .navbar-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 4rem;
                    background: rgba(5, 11, 20, 0.95);
                    border-bottom: 1px solid var(--border-color);
                    backdrop-filter: blur(20px);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    font-size: 1.8rem;
                    font-weight: 900;
                    font-family: 'Orbitron', sans-serif;
                    text-shadow: 0 0 15px var(--primary-glow);
                }

                .nav-links {
                    display: flex;
                    gap: 3rem;
                    align-items: center;
                    position: relative;
                }

                .mobile-menu-btn {
                    display: none;
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    z-index: 1001;
                    padding: 0.5rem;
                }

                .user-profile-nav {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(0, 242, 255, 0.05);
                    padding: 0.4rem 1rem;
                    border-radius: 50px;
                    border: 1px solid rgba(0, 242, 255, 0.15);
                    font-size: 0.85rem;
                }

                .logout-btn {
                    background: rgba(255, 0, 85, 0.1);
                    border: 1px solid rgba(255, 0, 85, 0.2);
                    color: var(--accent);
                    padding: 0.5rem;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .nav-login-btn {
                    white-space: nowrap;
                    padding: 0.5rem 1.5rem !important;
                    font-size: 0.8rem !important;
                }

                @media (max-width: 1024px) {
                    .navbar-container { padding: 1rem 2rem; }
                    .nav-links { gap: 1.5rem; }
                }

                @media (max-width: 768px) {
                    .navbar-container { padding: 0.8rem 1rem !important; }
                    .logo-text { font-size: 1.3rem; }
                    .mobile-menu-btn { display: block; }
                    
                    .nav-links {
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 80%;
                        max-width: 300px;
                        height: 100vh;
                        background: rgba(5, 11, 20, 0.98);
                        border-left: 1px solid var(--border-color);
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        z-index: 1000;
                        gap: 2.5rem;
                    }

                    .nav-links.open { right: 0; box-shadow: -10px 0 30px rgba(0,0,0,0.5); }
                    .desktop-indicator { display: none; }
                    .user-profile-nav { flex-direction: column; width: 100%; padding: 0 2rem; }
                    .user-badge { width: 100%; justify-content: center; }
                    .nav-auth-btns { width: 100%; padding: 0 2rem; }
                    .nav-login-btn { width: 100%; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
