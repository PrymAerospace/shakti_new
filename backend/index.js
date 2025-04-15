import express from 'express';
import cors from 'cors';
import usbDetect from 'usb-detection';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { users } from './models/Users.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://software002:tr660X5uY5RbnNPv@cluster0.j2cjs7w.mongodb.net/shakti?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('✅ MongoDB Connected');
        loadAuthorizedDevices();
    })
    .catch(err => console.error('❌ MongoDB Error:', err.message));

mongoose.connection.on('error', err => console.error('❌ Mongoose error:', err));

// USB Detection Setup
usbDetect.startMonitoring();

let usbConnected = false;
let logoutTimer = null;
let countdown = 30;
let authorizedDevices = [];

// Load authorized USBs from DB
const loadAuthorizedDevices = async () => {
    try {
        const devices = await users.find({});
        authorizedDevices = devices.map(d => ({
            vendorId: Number(d.vendorId),
            productId: Number(d.productId),
            serialNumber: d.serialNumber || null,
            username: d.username,
        }));
        console.log("🔄 Authorized USB devices loaded:", authorizedDevices);
    } catch (err) {
        console.error("❌ Error loading devices:", err.message);
    }
};

// USB Added
usbDetect.on('add', (device) => {
    console.log('🟢 USB Inserted:', device);

    const matchedDevice = authorizedDevices.find(d =>
        d.vendorId === Number(device.vendorId) &&
        d.productId === Number(device.productId) &&
        (!d.serialNumber || d.serialNumber === device.serialNumber)
    );

    if (matchedDevice) {
        usbConnected = true;
        io.emit('usb-status', { usbConnected: true, user: matchedDevice.username });

        if (logoutTimer) {
            clearInterval(logoutTimer);
            logoutTimer = null;
        }

        console.log(`✅ Authorized USB connected for user: ${matchedDevice.username}`);
    } else {
        console.log("🚫 Unauthorized USB inserted.", device);
    }
});

// USB Removed
usbDetect.on('remove', (device) => {
    console.log('🔴 USB Removed:', device);

    const wasAuthorized = authorizedDevices.some(d =>
        d.vendorId === Number(device.vendorId) &&
        d.productId === Number(device.productId) &&
        (!d.serialNumber || d.serialNumber === device.serialNumber)
    );

    if (wasAuthorized) {
        usbConnected = false;
        startLogoutTimer();
        console.log("⏳ Starting logout timer...");
    }
});

// Start Logout Countdown
const startLogoutTimer = () => {
    if (logoutTimer) clearInterval(logoutTimer);
    countdown = 30;

    logoutTimer = setInterval(() => {
        countdown--;
        io.emit('usb-status', { usbConnected: false, countdown });

        if (countdown <= 0) {
            console.log("⚠️ Logging out due to USB removal.");
            io.emit('logout');
            clearInterval(logoutTimer);
            logoutTimer = null;
        }
    }, 1000);
};

// Routes
app.get('/api/usb/status', (req, res) => res.json({ usbConnected }));

// Login
app.post('/api/auth/login', async (req, res) => {
    const { orgCode, username, password } = req.body;

    if (!orgCode || !username || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    const user = await users.findOne({ orgCode, username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({ token: 'mock_jwt_token' });
});

// Register USB + User
app.post('/api/register-device', async (req, res) => {
    const { orgCode, username, password, vendorId, productId, serialNumber } = req.body;

    if (!orgCode || !username || !password || !vendorId || !productId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!Number.isInteger(Number(vendorId)) || !Number.isInteger(Number(productId))) {
        return res.status(400).json({ message: 'Vendor/Product ID must be valid numbers.' });
    }

    const exists = await users.findOne({ orgCode, username });
    if (exists) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDevice = new users({
        orgCode,
        username,
        password: hashedPassword,
        vendorId: Number(vendorId),
        productId: Number(productId),
        serialNumber: serialNumber || null,
    });

    await newDevice.save();

    // Add directly to authorizedDevices to avoid DB reload
    authorizedDevices.push({
        vendorId: Number(vendorId),
        productId: Number(productId),
        serialNumber: serialNumber || null,
        username,
    });

    return res.status(201).json({ message: 'User + USB registered successfully' });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
