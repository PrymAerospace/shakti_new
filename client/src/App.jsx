import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import { UsbProvider } from "./context/UsbContext";
import Login from "./components/login/Login";
import MainDashboard from "./pages/MainDashboard";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <Router> 
            <UsbProvider>
                <Routes>
                    {/* ✅ Redirect root ("/") to login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><MainDashboard /></PrivateRoute>} />
                </Routes>
            </UsbProvider>
            <ToastContainer />
        </Router>
    );
}

export default App;
