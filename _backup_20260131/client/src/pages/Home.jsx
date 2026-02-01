import { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, ShieldCheck, Cpu, Rocket, Users, Target, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

const SERVICES = [
    { id: 1, name: 'Başlangıç Paketi', price: 99.9, description: 'Fetih dünyasına hızlı bir giriş yapın. Temel kaynaklar ve hızlandırmalar içerir.' },
    { id: 2, name: 'Savaşçı Paketi', price: 199.9, description: 'Rakiplerinizi ezmek için ileri düzey ekipmanlar ve asker takviyeleri.' },
    { id: 3, name: 'İmparator Paketi', price: 499.9, description: 'Sunucunun hakimi olun. Sınırsız kaynak ve özel VIP desteği.' },
];

const Home = () => {
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hasActiveOrder, setHasActiveOrder] = useState(false);

    // Check for existing paid orders
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "chats"),
            where("userId", "==", user.uid),
            where("paymentSuccess", "==", true)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setHasActiveOrder(!snapshot.empty);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddToCart = () => {
        if (!selectedService) return;
        if (hasActiveOrder) {
            alert("Zaten aktif/tamamlanmış bir siparişiniz bulunuyor. Aynı anda birden fazla alım yapılamaz.");
            return;
        }
        navigate('/payment-chat', { state: { service: selectedService } });
    };

    return (
        <div style={{ scrollBehavior: 'smooth', overflowX: 'hidden' }}>
            {/* 1. ANA SAYFA (Hero) */}
            <section id="home" style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'var(--section-padding)'
            }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0, left: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05) 0%, transparent 70%)',
                    zIndex: -1
                }}></div>

                <div className="animate-float" style={{
                    padding: '0.5rem 1.2rem',
                    background: 'rgba(0, 242, 255, 0.1)',
                    border: '1px solid rgba(0, 242, 255, 0.3)',
                    borderRadius: '50px',
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Rocket size={14} /> YENİ NESİL OYUN ÇÖZÜMLERİ
                </div>

                <h1 className="animate-fade-in hero-title" style={{
                    fontSize: 'clamp(2.2rem, 10vw, 5rem)',
                    fontWeight: '900',
                    margin: '0 0 1rem',
                    lineHeight: '1.1'
                }}>
                    SİKİCİ <br />
                    <span style={{
                        color: 'var(--primary)',
                        textShadow: '0 0 30px var(--primary-glow)',
                        WebkitTextStroke: '1px var(--primary)',
                        WebkitTextFillColor: 'transparent'
                    }}>SOKUCU</span>
                </h1>

                <p className="animate-fade-in delay-100 hero-desc" style={{
                    fontSize: 'clamp(0.95rem, 4vw, 1.15rem)',
                    color: 'var(--text-muted)',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    marginBottom: '2.5rem',
                    padding: '0 1rem'
                }}>
                    NexoBots, Fetih Altınçağ evrenindeki en gelişmiş otomasyon ve kaynak sistemidir.
                    En güvenli algoritmalarla hesabınızı zirveye taşımak için buradayız.
                </p>

                <div className="animate-fade-in delay-200 flex-stack hero-btns" style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                    <a href="#services" className="btn-primary">ÜRÜNLERİMİZ</a>
                    <a href="#about" className="btn-outline">BİZ KİMİZ?</a>
                </div>

                {/* Stats */}
                <div className="stats-grid responsive-grid grid-3 grid-mobile-1" style={{
                    width: '100%',
                    maxWidth: '900px',
                    marginTop: '5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '3rem'
                }}>
                    {[
                        { label: 'Aktif Kullanıcı', val: '5,000+' },
                        { label: 'Tamamlanan Görev', val: '1M+' },
                        { label: 'Başarı Oranı', val: '%100' }
                    ].map((stat, i) => (
                        <div key={i} className="stat-item">
                            <div className="stat-val" style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: 'bold' }}>{stat.val}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. HİZMETLER (Services) */}
            <section id="services" style={{ padding: 'var(--section-padding)', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px' }}>KATALOG</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '0.5rem 0' }}>SAVAŞ <span style={{ color: 'var(--primary)' }}>PAKETLERİ</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>Stratejinize en uygun paketi seçin ve yükselişe geçin.</p>
                </div>

                <div className="responsive-grid grid-3 grid-mobile-1" style={{ padding: '0 1rem' }}>
                    {SERVICES.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            selected={selectedService?.id === service.id}
                            onSelect={setSelectedService}
                        />
                    ))}
                </div>
            </section>

            {/* 3. HAKKIMIZDA (About) */}
            <section id="about" style={{
                padding: 'var(--section-padding)',
                minHeight: 'auto',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="about-grid responsive-grid grid-2 grid-mobile-1" style={{ alignItems: 'center', gap: 'clamp(2rem, 5vw, 4rem)' }}>
                        <div>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px' }}>VİZYONUMUZ</span>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0.5rem 0 1.5rem 0' }}>HAKKIMIZDA <span style={{ color: 'var(--primary)' }}>POYNO</span></h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                2024 yılında kurulan NexoBots, Fetih Altınçağ oyuncuları için inovatif çözümler üreten global bir teknoloji topluluğudur.
                                Sadece kaynak sağlamıyor, aynı zamanda oyunun içindeki her saniyeyi zafere dönüştüren bir altyapı sunuyoruz.
                            </p>

                            <div style={{ display: 'grid', gap: '1.2rem' }}>
                                {[
                                    { icon: <ShieldCheck color="var(--primary)" size={18} />, title: 'Tam Güvenlik', desc: 'Antiban sistemleri ile tamamen riskten uzak.' },
                                    { icon: <Cpu color="var(--primary)" size={18} />, title: 'Akıllı Algoritma', desc: 'Rakiplerinizden 10 kat daha hızlı gelişim performansı.' },
                                    { icon: <Globe color="var(--primary)" size={18} />, title: 'Global Destek', desc: '7/24 kesintisiz teknik destek ve güncellemeler.' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                        <div style={{ padding: '0.6rem', background: 'rgba(0,242,255,0.08)', borderRadius: '10px' }}>{item.icon}</div>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.1rem 0', fontSize: '0.9rem', color: '#fff' }}>{item.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div className="animate-float" style={{
                                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                border: '1px solid rgba(0, 242, 255, 0.15)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.3rem' }}>#1</div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>LİDER PLATFORM</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Binlerce oyuncu NexoBots ile Fetih evreninde tarih yazıyor. Senin sıran ne zaman?</p>
                            </div>
                            <div style={{
                                position: 'absolute',
                                width: '100%', height: '100%',
                                top: '20px', right: '20px',
                                background: 'var(--primary)',
                                filter: 'blur(80px)',
                                opacity: 0.08,
                                zIndex: 1
                            }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {selectedService && (
                <div style={{
                    position: 'fixed', bottom: '1.5rem', left: '0', right: '0',
                    display: 'flex', justifyContent: 'center', zIndex: 1000,
                    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: '0 1rem'
                }}>
                    <div className="selected-bar" style={{
                        background: 'rgba(5, 11, 20, 0.95)', padding: '1rem 2rem',
                        borderRadius: '100px', display: 'flex', alignItems: 'center',
                        gap: '2rem', border: '1px solid var(--primary)',
                        boxShadow: '0 10px 40px rgba(0, 242, 255, 0.3)', backdropFilter: 'blur(20px)',
                        width: 'auto', maxWidth: '100%', boxSizing: 'border-box'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Seçilen</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff', whiteSpace: 'nowrap' }}>
                                {selectedService.name} <span style={{ color: 'var(--primary)' }}>{selectedService.price} ₺</span>
                            </span>
                        </div>
                        <button onClick={handleAddToCart} className="btn-primary tech-glow" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', flexShrink: 0 }}>
                            ÖDEMEYE GEÇ
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .selected-bar {
                        padding: 1rem 1.5rem !important;
                        border-radius: 20px !important;
                        gap: 1.2rem !important;
                    }
                    .hero-title { line-height: 1.1 !important; }
                    .stats-grid { margin-top: 3rem !important; gap: 1.5rem !important; }
                    .stat-item { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
                    .stat-item:last-child { border-bottom: none; }
                }
            `}</style>
        </div>
    );
};

export default Home;
