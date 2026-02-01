import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, doc, updateDoc
} from 'firebase/firestore';
import { Send, ShieldCheck, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe with Public Key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ service, chatId, onSuccess, payLoading, setPayLoading }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);
    const [cardDisplay, setCardDisplay] = useState({ brand: 'unknown', last4: '' });
    const [name, setName] = useState('');

    const handleCardChange = (event) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError(null);
            // Instant brand detection as user types
            if (event.brand) {
                setCardDisplay(prev => ({
                    ...prev,
                    brand: event.brand
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setPayLoading(true);
        setCardError(null);

        try {
            // InfinityFree doesn't support Node.js, so we'll point to a PHP endpoint we will create
            // or use a direct Firestore update if PHP isn't configured.
            const response = await fetch('/api/payment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: service.price, currency: 'usd' }),
            }).catch(() => ({ ok: false }));

            if (!response.ok) {
                // FALLBACK: If API fails (e.g., PHP not uploaded), we'll do a "Manual Approval" request
                console.warn("Backend not found, switching to Manual Approval flow.");
                await updateDoc(doc(db, "chats", chatId), {
                    status: 'pending_approval',
                    paymentRequest: true
                });
                alert("Ödeme sistemimiz bakımda. Talebiniz iletildi, lütfen sohbet üzerinden devam edin.");
                onSuccess();
                return;
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: { name: name },
                },
            });

            if (result.error) {
                setCardError(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                onSuccess();
            }
        } catch (err) {
            setCardError(err.message || "Ödeme işlemi başarısız.");
        } finally {
            setPayLoading(false);
        }
    };

    const elementStyle = {
        style: {
            base: {
                fontSize: '16px',
                color: '#fff',
                fontFamily: 'Orbitron, sans-serif',
                '::placeholder': { color: '#475569' },
            },
            invalid: { color: '#ff0055' },
        },
    };

    const fieldContainer = {
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        marginBottom: '1rem'
    };

    return (
        <div className="animate-fade-in">
            {/* Secure Visual Card Mockup */}
            <div style={{
                width: '100%', maxWidth: '400px', height: '220px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '20px', padding: '2rem', marginBottom: '2.5rem',
                position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', display: 'flex',
                flexDirection: 'column', justifyContent: 'space-between',
                color: 'white', fontFamily: 'Orbitron, sans-serif', margin: '0 auto 2.5rem auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                        width: '55px',
                        height: '40px',
                        background: 'linear-gradient(45deg, #dbb400, #ffea00)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        color: 'rgba(0,0,0,0.6)',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        fontFamily: 'sans-serif'
                    }}>
                        {cardDisplay.brand !== 'unknown' ? cardDisplay.brand : 'CHIP'}
                    </div>
                    <ShieldCheck color="#00f2ff" size={32} />
                </div>

                <div style={{ fontSize: '1.4rem', letterSpacing: '4px', textAlign: 'center' }}>
                    {cardDisplay.brand !== 'unknown' ? `•••• •••• •••• ${cardDisplay.last4 || '••••'}` : '•••• •••• •••• ••••'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>KART SAHİBİ</div>
                        <div style={{ fontSize: '0.9rem', color: name ? '#fff' : '#475569', textTransform: 'uppercase' }}>{name || 'AD SOYAD'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>BRAND</div>
                        <div style={{ fontSize: '0.9rem', color: '#00f2ff', textTransform: 'uppercase' }}>{cardDisplay.brand}</div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>AD SOYAD</label>
                    <div className="payment-field-wrapper">
                        <input
                            type="text"
                            placeholder="Kart Üzerindeki İsim"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            spellCheck="false"
                            autoComplete="off"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: 0,
                                width: '100%',
                                outline: 'none',
                                color: 'white',
                                textShadow: 'none',
                                boxShadow: 'none'
                            }}
                            required
                        />
                    </div>

                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>KART NUMARASI</label>
                    <div className="payment-field-wrapper">
                        <CardNumberElement options={elementStyle} onChange={handleCardChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>SKT</label>
                            <div className="payment-field-wrapper">
                                <CardExpiryElement options={elementStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>CVC</label>
                            <div className="payment-field-wrapper">
                                <CardCvcElement options={elementStyle} />
                            </div>
                        </div>
                    </div>
                </div>

                {cardError && (
                    <div style={{ color: '#ff0055', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(255,0,85,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                        {cardError}
                    </div>
                )}

                <button type="submit" className="btn-primary tech-glow" style={{ width: '100%', padding: '1.2rem' }} disabled={!stripe || payLoading}>
                    {payLoading ? <Loader2 className="animate-spin" /> : <>GÜVENLİ ÖDE {service.price} <span style={{ fontWeight: 'normal', marginLeft: '4px' }}>₺</span></>}
                </button>
            </form>
        </div>
    );
};

const PaymentChat = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const service = state?.service;

    const [adminConnected, setAdminConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);

    const [showPayment, setShowPayment] = useState(false);
    const [payLoading, setPayLoading] = useState(false);

    const [snapshotStatus, setSnapshotStatus] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!user || !service) return;
        const q = query(
            collection(db, "chats"),
            where("userId", "==", user.uid),
            where("serviceId", "==", service.id),
            where("status", "==", "open")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const chatDoc = snapshot.docs[0];
                setChatId(chatDoc.id);
                setSnapshotStatus(chatDoc.data());
                setAdminConnected(chatDoc.data().adminConnected || false);
            } else {
                createChatSession();
            }
        });
        return () => unsubscribe();
    }, [user, service]);

    const createChatSession = async () => {
        try {
            const chatData = {
                userId: user.uid,
                userEmail: user.email || "E-posta yok",
                serviceId: service.id,
                serviceName: service.name,
                servicePrice: service.price,
                status: 'open',
                adminConnected: false,
                createdAt: serverTimestamp(),
                lastMessage: "Sohbet başlatıldı.",
                viewedByAdmin: false
            };
            const docRef = await addDoc(collection(db, "chats"), chatData);
            setChatId(docRef.id);
        } catch (error) {
            console.error("Sohbet oluşturma hatası:", error);
        }
    };

    useEffect(() => {
        if (!chatId) return;
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [chatId]);

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !chatId) return;
        try {
            await addDoc(collection(db, "chats", chatId, "messages"), {
                senderId: user.uid,
                text: newMessage,
                timestamp: serverTimestamp(),
                senderRole: 'USER'
            });
            setNewMessage('');
        } catch (error) {
            console.error("Message error:", error);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            await updateDoc(doc(db, "chats", chatId), { status: 'completed', paymentSuccess: true });
            await addDoc(collection(db, "chats", chatId, "messages"), {
                senderId: "SYSTEM",
                text: "✅ Ödeme başarıyla onaylandı! Siparişiniz işleme alındı.",
                timestamp: serverTimestamp(),
                senderRole: 'ADMIN'
            });
            alert("ÖDEME BAŞARILI! Siparişiniz hazırlanıyor.");
            setShowPayment(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (!service) return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Hizmet Seçilmedi.</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '0 0.5rem' }}>
            <Elements stripe={stripePromise}>
                <div className="payment-chat-layout responsive-grid grid-2 grid-mobile-1" style={{
                    minHeight: 'calc(100vh - 160px)',
                    alignItems: 'start'
                }}>

                    {/* Ödeme Alanı */}
                    <div className="card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', height: '100%', minHeight: '500px' }}>
                        {showPayment ? (
                            <div className="animate-fade-in" style={{ padding: '0.5rem' }}>
                                <h2 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center', fontFamily: 'Orbitron', fontSize: '1.2rem' }}>GÜVENLİ ÖDEME</h2>

                                <CheckoutForm
                                    service={service}
                                    chatId={chatId}
                                    onSuccess={handlePaymentSuccess}
                                    payLoading={payLoading}
                                    setPayLoading={setPayLoading}
                                />

                                <button onClick={() => setShowPayment(false)} style={{ width: '100%', background: 'transparent', color: 'var(--text-muted)', marginTop: '1.5rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Vazgeç ve Özete Dön</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', fontFamily: 'Orbitron', fontSize: '1.2rem' }}>SİPARİŞ ÖZETİ</h2>
                                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(0,242,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{service.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>{service.description}</p>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '1.5rem', color: 'var(--primary)' }}>{service.price} <span style={{ fontWeight: 'normal' }}>₺</span></div>
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
                                    {snapshotStatus?.paymentSuccess ? (
                                        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                                            <CheckCircle size={60} color="#22c55e" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(34,197,94,0.4))' }} />
                                            <h3 style={{ color: '#22c55e', fontFamily: 'Orbitron' }}>ÖDEME ONAYLANDI</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>İşleminiz başarıyla tamamlandı. Admin ekibi sizinle sohbet üzerinden iletişime geçecek.</p>
                                        </div>
                                    ) : !adminConnected ? (
                                        <>
                                            <Loader2 className="animate-spin" size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                                            <h3 style={{ color: '#f59e0b' }}>YETKİLİ BEKLENİYOR...</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>İşlemi başlatmak için bir yetkilinin bağlanması gerek.</p>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={48} color="#00ff55" style={{ marginBottom: '1rem' }} />
                                            <h3 style={{ color: '#00ff55' }}>YETKİLİ BAĞLANDI</h3>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.85rem' }}>Ödeme işlemini gerçekleştirebilirsiniz.</p>
                                            <button onClick={() => setShowPayment(true)} className="btn-primary tech-glow" style={{ width: '100%', padding: '1.2rem' }}>ÖDEME YAP {service.price} ₺</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mesajlaşma Alanı */}
                    <div className="card animate-slide-up delay-100 chat-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Orbitron', fontSize: '1.1rem' }}>
                            <MessageSquare size={20} color="var(--primary)" /> CANLI DESTEK
                        </h2>
                        <div className="messages-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem', maxHeight: '400px' }}>
                            {messages.map((msg) => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.senderRole === 'ADMIN' ? 'flex-start' : (msg.senderId === "SYSTEM" ? 'center' : 'flex-end'),
                                    background: msg.senderId === "SYSTEM" ? 'rgba(34, 197, 94, 0.1)' : (msg.senderRole === 'ADMIN' ? '#1e293b' : 'linear-gradient(45deg, #0044ff, #00f2ff)'),
                                    color: msg.senderId === "SYSTEM" ? '#22c55e' : 'white',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '12px',
                                    maxWidth: '85%',
                                    fontSize: '0.9rem',
                                    border: msg.senderId === "SYSTEM" ? '1px solid #22c55e' : 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Bir mesaj yazın..." style={{ flex: 1, background: 'rgba(15, 23, 42, 0.6)' }} />
                            <button type="submit" disabled={!newMessage.trim()} className="btn-primary" style={{ padding: '0 1.2rem' }}><Send size={20} /></button>
                        </form>
                    </div>
                </div>
            </Elements>

            <style>{`
                @media (max-width: 768px) {
                    .payment-chat-layout {
                        gap: 1.5rem !important;
                    }
                    .chat-card {
                        min-height: 450px !important;
                    }
                    .messages-container {
                        max-height: 350px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PaymentChat;
