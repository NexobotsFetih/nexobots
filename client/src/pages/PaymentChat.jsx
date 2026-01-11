import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const PaymentChat = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const service = state?.service; // Should contain the selected service

    const [adminConnected, setAdminConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        if (!user) return;

        // Connect to Socket.IO
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            socketRef.current.emit('join_chat', user.id);
        });

        socketRef.current.on('admin_connected', () => {
            setAdminConnected(true);
            setMessages(prev => [...prev, { system: true, content: 'Authorized staff connected. You may proceed with the purchase.' }]);
        });

        socketRef.current.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const messageData = {
            senderId: user.id,
            receiverId: adminConnected ? 1 : 0, // Assuming admin ID 1, simpler logic could be used
            content: newMessage,
            timestamp: new Date()
        };

        // Optimistic update
        // setMessages(prev => [...prev, { ...messageData, self: true }]); 
        // Better to wait for server echo for consistency in this example, but let's just emit
        socketRef.current.emit('send_message', messageData);
        setNewMessage('');
    };

    if (!service) {
        return <div style={{ padding: '2rem' }}>No service selected. Please go back to Home.</div>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: 'calc(100vh - 100px)' }}>

            {/* Left Side: Payment Area */}
            <div className="card">
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>Order Summmary</h2>
                <div style={{ marginBottom: '2rem', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{service.name}</h3>
                    <p style={{ color: '#94a3b8' }}>{service.description}</p>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>${service.price}</div>
                </div>

                <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed #334155', borderRadius: '1rem' }}>
                    {!adminConnected ? (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                            <h3>Waiting for Staff...</h3>
                            <p style={{ color: '#94a3b8' }}>Please wait for an authorized staff member to connect to start the secure payment process.</p>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h3 style={{ color: '#22c55e' }}>Staff Connected</h3>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>You may now proceed with the payment.</p>
                            <button className="btn-primary" style={{ width: '100%', fontSize: '1.2rem' }}>Pay Now ${service.price}</button>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side: Live Chat */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1rem' }}>Live Support</h2>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.system ? 'center' : (msg.senderId === user.id ? 'flex-end' : 'flex-start'),
                            background: msg.system ? 'transparent' : (msg.senderId === user.id ? '#3b82f6' : '#334155'),
                            color: msg.system ? '#94a3b8' : 'white',
                            padding: msg.system ? '0.5rem' : '0.75rem 1rem',
                            borderRadius: '1rem',
                            maxWidth: '80%',
                            fontSize: msg.system ? '0.9rem' : '1rem'
                        }}>
                            {msg.content}
                        </div>
                    ))}
                    {messages.length === 0 && !adminConnected && (
                        <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
                            Connecting to support...
                        </div>
                    )}
                </div>

                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                    />
                    <button type="submit" className="btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
};

export default PaymentChat;
