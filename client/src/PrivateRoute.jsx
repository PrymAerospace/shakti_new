import React from "react";
import { Navigate } from "react-router-dom";
import { useUsb } from "./context/UsbContext";

function PrivateRoute({ children }) {
    const { usbVerified, countdown } = useUsb();

    if (!usbVerified && (countdown === null || countdown === 0)) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default PrivateRoute;

