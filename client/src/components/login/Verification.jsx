import React, {  useState } from "react";
import { toast } from "react-toastify";
import { useUsb } from "../../context/UsbContext";
import { useNavigate } from "react-router-dom";

function Verification() {
    const { usbVerified, setUsbVerified } = useUsb();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const verifyUSB = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/usb/status");
            const data = await response.json();
            setUsbVerified(data.usbConnected);
            toast[data.usbConnected ? "success" : "error"](
                data.usbConnected ? "USB Verified Successfully!" : "USB not detected."
            );
        } catch (error) {
            toast.error("Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center gap-4">

            <h1 className="text-lg font-medium text-blue-500 py-2 text-center">
                Connect your authorized USB device to verify access.
            </h1>

            <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={verifyUSB}
                disabled={loading || usbVerified}
            >
                {loading ? "Checking..." : usbVerified ? "USB Connected" : "Verify USB"}
            </button>

            
        </div>
    );
}

export default Verification;
