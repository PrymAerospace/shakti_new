const express = require('express');
const cors = require('cors');
const usbDetect = require('usb-detection');
const http = require('http'); 
const { Server } = require('socket.io'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = 8000;

app.use(cors());
app.use(express.json());

usbDetect.startMonitoring();

const TARGET_VENDOR_ID = 0x058F;
const TARGET_PRODUCT_ID = 0x6387;

let usbConnected = false;
let logoutTimer = null;
let countdown = 30; // 30-second logout timer

const startLogoutTimer = () => {
    if (logoutTimer) clearInterval(logoutTimer);
    countdown = 30;

    logoutTimer = setInterval(() => {
        countdown--;
        io.emit('usb-status', { usbConnected: false, countdown }); // Send countdown to frontend

        if (countdown <= 0) {
            console.log("User logged out due to USB removal.");
            io.emit('logout'); // Emit logout event
            clearInterval(logoutTimer);
            logoutTimer = null;
        }
    }, 1000);
};

// USB Inserted
usbDetect.on('add', (device) => {
    console.log('USB Inserted:', device);

    if (device?.vendorId === TARGET_VENDOR_ID && device?.productId === TARGET_PRODUCT_ID) {
        usbConnected = true;
        io.emit('usb-status', { usbConnected: true });

        if (logoutTimer) {
            clearInterval(logoutTimer);
            logoutTimer = null;
        }
    }
});

// USB Removed
usbDetect.on('remove', (device) => {
    console.log('USB Removed:', device);

    if (device?.vendorId === TARGET_VENDOR_ID && device?.productId === TARGET_PRODUCT_ID) {
        usbConnected = false;
        startLogoutTimer(); // Start the 30-second countdown
    }
});


// Add this at the end of your server setup (after usbDetect.startMonitoring())
usbDetect.find(TARGET_VENDOR_ID, TARGET_PRODUCT_ID, (err, devices) => {
    if (err) {
        console.error("Error detecting USB devices:", err);
    } else {
        if (devices.length > 0) {
            usbConnected = true;
            console.log("USB was already connected at server start.");
        } else {
            console.log("No matching USB device connected at server start.");
        }
    }
});


// Check USB Status API
app.get('/api/usb/status', (req, res) => {
    return res.json({ usbConnected });
});

// Login API (Dummy authentication)
app.post('/api/auth/login', (req, res) => {
    const { orgCode, username, password } = req.body;

    if (!orgCode || !username || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    if (orgCode === 'ORG123' && username === 'admin' && password === 'Salamkisan') {
        return res.json({ token: 'mock_jwt_token' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

