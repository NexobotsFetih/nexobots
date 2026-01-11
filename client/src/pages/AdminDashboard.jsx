import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeUsers, setActiveUsers] = useState([
        { id: 2, email: 'user@example.com', status: 'WAITING' }, // Mock Data for visualization
        { id: 3, email: 'player2@example.com', status: 'IN_CHAT' }
    ]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') return;

        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            console.log('Admin Connected');
        });

        socketRef.current.on('receive_message', (message) => {
            // ideally check if message belongs to selectedUser context
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);

    const connectToUser = (targetUser) => {
        setSelectedUser(targetUser);
        socketRef.current.emit('admin_join_room', targetUser.id);
        setMessages([{ system: true, content: `Connected to ${targetUser.email}` }]);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            senderId: user.id,
            receiverId: selectedUser.id,
            content: newMessage,
            timestamp: new Date()
        };

        socketRef.current.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', height: 'calc(100vh - 100px)' }}>

            {/* Sidebar: Active Users/Orders */}
            <div className="card">
                <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1rem' }}>Pending Requests</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeUsers.map(u => (
                        <div
                            key={u.id}
                            onClick={() => connectToUser(u)}
                            style={{
                                padding: '1rem',
                                background: selectedUser?.id === u.id ? '#3b82f6' : '#0f172a',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                border: '1px solid #334155'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>{u.email}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Status: {u.status}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Chat with {selectedUser.email}</span>
                            <button className="btn-primary" style={{ background: '#22c55e' }}>Approve Payment</button>
                        </h2>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.system ? 'center' : (msg.senderId === user.id ? 'flex-end' : 'flex-start'),
                                    background: msg.system ? 'transparent' : (msg.senderId === user.id ? '#3b82f6' : '#334155'),
                                    color: msg.system ? '#94a3b8' : 'white',
                                    padding: msg.system ? '0.5rem' : '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    maxWidth: '80%'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
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
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
