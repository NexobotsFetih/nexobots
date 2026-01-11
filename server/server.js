const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_chat', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined chat`);
    });

    socket.on('send_message', async (data) => {
        // Save to DB
        try {
            const { senderId, receiverId, content } = data;
            const message = await prisma.message.create({
                data: { senderId, receiverId, content }
            });
            // Emit to receiver
            io.to(`user_${receiverId}`).emit('receive_message', message);
            // Emit back to sender (confirmation)
            io.to(`user_${senderId}`).emit('receive_message', message);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    });

    // Admin joining a specific user room
    socket.on('admin_join_room', (targetUserId) => {
        // Admin joins the user's room to listen
        socket.join(`user_${targetUserId}`);
        io.to(`user_${targetUserId}`).emit('admin_connected');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Basic Routes
app.get('/', (req, res) => {
    res.send('NexoBots API is running');
});

// Auth Routes Placeholders
app.post('/api/auth/register', async (req, res) => {
    // Implement Register
    res.json({ message: "Register endpoint" });
});

app.post('/api/auth/login', async (req, res) => {
    // Implement Login
    res.json({ message: "Login endpoint" });
});

// Services Route
app.get('/api/services', async (req, res) => {
    // Mock Data or DB
    const services = await prisma.service.findMany();
    res.json(services);
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
