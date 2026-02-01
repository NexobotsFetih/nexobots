import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { initializeApp, deleteApp, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, doc, updateDoc, getDocs
} from 'firebase/firestore';
import {
    Send, User, ShieldCheck, MessageSquare,
    UserPlus, Loader2, CheckCircle, Copy, LogOut, ChevronRight
} from 'lucide-react';

// Re-importing config for the secondary app instance
const firebaseConfig = {
    apiKey: "AIzaSyCrwMgJ2Wxf5U8ViV6hWb_1VIrKIAN_q0o",
    authDomain: "nexobots.firebaseapp.com",
    projectId: "nexobots",
    storageBucket: "nexobots.firebasestorage.app",
    messagingSenderId: "919163349736",
    appId: "1:919163349736:web:f110196fbca1b9ba6fb75d"
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // UI States
    const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'account-gen'
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Account Gen States
    const [generatedAccount, setGeneratedAccount] = useState(null);
    const [genLoading, setGenLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [generatedAccounts, setGeneratedAccounts] = useState([]);
    const [catalogLoading, setCatalogLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // 1. Listen for all open chats
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') return;

        // Removing orderBy temporarily to avoid index requirement issues
        const q = query(collection(db, "chats"), where("status", "==", "open"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Manual sort by date if needed
            chatList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setChats(chatList);
        });

        return () => unsubscribe();
    }, [user]);

    // 1.1 Listen for catalog (generated accounts)
    useEffect(() => {
        if (!user || user.role !== 'ADMIN' || activeTab !== 'catalog') return;

        setCatalogLoading(true);
        const q = query(collection(db, "generated_accounts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGeneratedAccounts(list);
            setCatalogLoading(false);
        });

        return () => unsubscribe();
    }, [user, activeTab]);

    // 2. Listen for messages in selected chat
    useEffect(() => {
        if (!selectedChat) return;

        const q = query(collection(db, "chats", selectedChat.id, "messages"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);

            // Auto connect admin if not already connected
            if (!selectedChat.adminConnected) {
                updateDoc(doc(db, "chats", selectedChat.id), { adminConnected: true });
            }
        });

        return () => unsubscribe();
    }, [selectedChat]);

    useEffect(scrollToBottom, [messages]);

    // Send Message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
                senderId: user.uid,
                text: newMessage,
                timestamp: serverTimestamp(),
                senderRole: 'ADMIN'
            });
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    // Confirm Payment
    const confirmPayment = async () => {
        if (!selectedChat) return;
        if (!window.confirm("Ödemeyi onaylıyor musunuz?")) return;

        try {
            await updateDoc(doc(db, "chats", selectedChat.id), { status: 'completed' });
            setSelectedChat(null);
            setMessages([]);
            alert("Ödeme onaylandı ve sohbet kapatıldı.");
        } catch (err) {
            console.error(err);
        }
    };

    // Account Generation Algorithm
    const generateCredentials = () => {
        const adjectives = ['Cyber', 'Neon', 'Quantum', 'Shadow', 'Prime', 'Apex', 'Core', 'Viper'];
        const nouns = ['Bot', 'Unit', 'Nexus', 'Droid', 'Link', 'Node', 'Grid', 'Flow'];
        const num = Math.floor(Math.random() * 9999);
        const email = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${num}@nexobots.com`;
        const pass = Math.random().toString(36).slice(-10) + "NB" + Math.floor(Math.random() * 100);
        return { email, pass };
    };

    const handleCreateAccount = async () => {
        setGenLoading(true);
        setError('');
        setSuccess('');
        setGeneratedAccount(null);

        let tempApp;
        try {
            const { email, pass } = generateCredentials();

            // Create a temporary Firebase app instance so we don't sign out the admin
            const tempAppName = `TempApp-${Date.now()}`;
            tempApp = initializeApp(firebaseConfig, tempAppName);
            const tempAuth = getAuth(tempApp);

            const userCredential = await createUserWithEmailAndPassword(tempAuth, email, pass);
            const newUser = userCredential.user;

            // Create Firestore doc using the main db instance
            const accountLog = {
                uid: newUser.uid,
                email: email,
                password: pass, // Storing password in log for admin reference as requested
                role: 'USER',
                createdAt: serverTimestamp(),
                serviceName: selectedChat?.serviceName || 'Genel Kayıt',
                userEmail: selectedChat?.userEmail || 'Bilinmiyor',
                status: 'active'
            };

            // 1. Add to users collection (for actual login)
            await addDoc(collection(db, "users"), {
                uid: newUser.uid,
                email: email,
                role: 'USER',
                createdAt: serverTimestamp()
            });

            // 2. Add to catalog for admin
            await addDoc(collection(db, "generated_accounts"), accountLog);

            // Clean up temp app
            await deleteApp(tempApp);

            setGeneratedAccount({ email, pass });
            setSuccess("Hesap başarıyla oluşturuldu ve kataloğa eklendi!");
        } catch (err) {
            console.error(err);
            setError("Hata: " + err.message);
            if (tempApp) await deleteApp(tempApp);
        } finally {
            setGenLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Kopyalandı!");
    };

    if (!user || user.role !== 'ADMIN') return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Yetkisiz Erişim.</div>;

    return (
        <div className="admin-layout animate-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '1.5rem',
            minHeight: 'calc(100vh - 120px)'
        }}>

            {/* Sidebar */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <h2 style={{ color: '#00f2ff', fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'Orbitron' }}>YÖNETİM</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={activeTab === 'chats' ? 'btn-primary' : 'btn-outline'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-start', padding: '0.8rem' }}
                    >
                        <MessageSquare size={18} /> Bekleyen Talepler ({chats.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('account-gen')}
                        className={activeTab === 'account-gen' ? 'btn-primary' : 'btn-outline'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-start', padding: '0.8rem' }}
                    >
                        <UserPlus size={18} /> Hesap Üretici
                    </button>
                    <button
                        onClick={() => setActiveTab('catalog')}
                        className={activeTab === 'catalog' ? 'btn-primary' : 'btn-outline'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-start', padding: '0.8rem' }}
                    >
                        <ShieldCheck size={18} /> Açılan Hesaplar
                    </button>
                </div>

                {activeTab === 'chats' && (
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <h3 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Canlı Sohbetler</h3>
                        {chats.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.9rem', marginTop: '1rem' }}>Aktif talep yok.</div>
                        ) : (
                            chats.map(chat => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    style={{
                                        padding: '1rem',
                                        background: selectedChat?.id === chat.id ? 'rgba(0, 242, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                                        border: `1px solid ${selectedChat?.id === chat.id ? '#00f2ff' : 'transparent'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>{chat.userEmail.split('@')[0]}</div>
                                        {chat.paymentSuccess ? (
                                            <span style={{ fontSize: '0.65rem', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 6px', borderRadius: '4px', border: '1px solid #22c55e' }}>ÖDENDİ</span>
                                        ) : (
                                            <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #f59e0b' }}>BEKLİYOR</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{chat.serviceName}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Main Section */}
            <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {activeTab === 'chats' ? (
                    selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '1.2rem 2rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(0, 242, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{selectedChat.userEmail}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#00f2ff' }}>{selectedChat.serviceName} - {selectedChat.servicePrice} <span style={{ fontWeight: 'normal' }}>₺</span></span>
                                        {selectedChat.paymentSuccess ? (
                                            <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 'bold', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #22c55e' }}>✨ ÖDEME TAMAMLANDI</span>
                                        ) : (
                                            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 'bold', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #f59e0b' }}>⏳ ÖDEME BEKLENİYOR</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={confirmPayment} className="btn-primary" style={{ background: '#22c55e', fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <CheckCircle size={16} /> Sohbeti Kapat
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.map((msg) => (
                                    <div key={msg.id} style={{
                                        alignSelf: msg.senderRole === 'ADMIN' ? 'flex-end' : 'flex-start',
                                        background: msg.senderRole === 'ADMIN' ? 'linear-gradient(45deg, #0044ff, #00f2ff)' : '#1e293b',
                                        color: 'white',
                                        padding: '0.8rem 1.2rem',
                                        borderRadius: '12px',
                                        maxWidth: '70%',
                                        fontSize: '0.95rem',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        {msg.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Yanıtınızı yazın..."
                                    style={{ flex: 1, background: '#0f172a', border: '1px solid #334155' }}
                                />
                                <button type="submit" className="btn-primary" style={{ padding: '0.8rem' }} disabled={!newMessage.trim()}>
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            <MessageSquare size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p>Sohbeti başlatmak için soldan bir talep seçin.</p>
                        </div>
                    )
                ) : activeTab === 'catalog' ? (
                    /* Catalog Tab */
                    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                        <h2 style={{ color: '#00f2ff', marginBottom: '2rem', fontFamily: 'Orbitron', fontSize: '1.5rem' }}>Açılan Hesaplar Kataloğu</h2>

                        {catalogLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" size={40} color="#00f2ff" /></div>
                        ) : generatedAccounts.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#475569', marginTop: '3rem' }}>Henüz hesap oluşturulmamış.</div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {generatedAccounts.map(acc => (
                                    <div key={acc.id} className="catalog-item" style={{
                                        padding: '1.2rem',
                                        background: 'rgba(16, 28, 45, 0.6)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0, 242, 255, 0.1)',
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Kullanıcı / Pass</div>
                                            <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{acc.email}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#00f2ff' }}>{acc.password}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Satın Alınan Ürün</div>
                                            <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{acc.serviceName}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Müşteri</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{acc.userEmail}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Tarih</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{acc.createdAt?.toDate().toLocaleDateString('tr-TR')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Account Generator Tab */
                    <div style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                        <h2 style={{ color: '#00f2ff', marginBottom: '2rem', textAlign: 'center', fontFamily: 'Orbitron' }}>Hesap Üretici</h2>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem', textAlign: 'center' }}>
                                Tek tıkla rastgele kullanıcı adı ve şifre oluşturun. Admin oturumunuz kesilmez.
                            </p>

                            <button
                                onClick={handleCreateAccount}
                                className="btn-primary tech-glow"
                                style={{ width: '100%', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                disabled={genLoading}
                            >
                                {genLoading ? <Loader2 className="animate-spin" /> : <UserPlus />}
                                {genLoading ? "Üretiliyor..." : "Yeni Hesap Üret"}
                            </button>

                            {error && <div style={{ color: '#ff0055', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                            {generatedAccount && (
                                <div className="animate-slide-up" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid #00f2ff', borderRadius: '12px' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>E-POSTA</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input readOnly value={generatedAccount.email} style={{ border: 'none', background: 'transparent', color: '#00f2ff', fontWeight: 'bold', padding: 0 }} />
                                            <Copy size={16} color="#00f2ff" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(generatedAccount.email)} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>ŞİFRE</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input readOnly value={generatedAccount.pass} style={{ border: 'none', background: 'transparent', color: '#00f2ff', fontWeight: 'bold', padding: 0 }} />
                                            <Copy size={16} color="#00f2ff" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(generatedAccount.pass)} />
                                        </div>
                                    </div>

                                    {selectedChat && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
                                                        senderId: user.uid,
                                                        text: `✅ Hesabınız Hazır! \n📧 E-posta: ${generatedAccount.email} \n🔑 Şifre: ${generatedAccount.pass}`,
                                                        timestamp: serverTimestamp(),
                                                        senderRole: 'ADMIN'
                                                    });
                                                    alert("Hesap bilgileri sohbete gönderildi!");
                                                } catch (err) { alert("Gönderilemedi: " + err.message); }
                                            }}
                                            className="btn-primary"
                                            style={{ width: '100%', background: '#7000ff', fontSize: '0.8rem' }}
                                        >
                                            Sohbete Bilgileri Gönder
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .admin-layout {
                        grid-template-columns: 1fr !important;
                        height: auto !important;
                    }
                    .catalog-item {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                    .catalog-item > div {
                        text-align: left !important;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                        padding-bottom: 0.5rem;
                    }
                    .catalog-item > div:last-child {
                        border-bottom: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
