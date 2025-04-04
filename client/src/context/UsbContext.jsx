import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const socket = io("http://localhost:8000");
const UsbContext = createContext();

export function UsbProvider({ children }) {
    const [usbVerified, setUsbVerified] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const toastIdRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const usbRemovedRef = useRef(false);
    const hasLoggedOutRef = useRef(false); // ✅ Prevent double logout
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("usb-status", (data) => {
            setUsbVerified(data.usbConnected);
            console.log("USB status received:", data);

            if (data.usbConnected) {
                toast.success("USB Inserted!");
                usbRemovedRef.current = false;
                hasLoggedOutRef.current = false;
                setCountdown(null);

                if (toastIdRef.current) {
                    toast.dismiss(toastIdRef.current);
                    toastIdRef.current = null;
                }

                if (countdownTimerRef.current) {
                    clearInterval(countdownTimerRef.current);
                    countdownTimerRef.current = null;
                }
            } else {
                if (!usbRemovedRef.current) {
                    toast.error("USB Removed!");
                    usbRemovedRef.current = true;
                }

                if (!countdownTimerRef.current) {
                    let timeLeft = 30;
                    setCountdown(timeLeft);

                    toastIdRef.current = toast.warning(`Logging out in ${timeLeft} seconds...`, { autoClose: false });

                    countdownTimerRef.current = setInterval(() => {
                        timeLeft--;
                        setCountdown(timeLeft);

                        if (timeLeft > 0) {
                            toast.update(toastIdRef.current, {
                                render: `Logging out in ${timeLeft} seconds...`,
                            });
                        } else {
                            clearInterval(countdownTimerRef.current);
                            countdownTimerRef.current = null;
                            toast.dismiss(toastIdRef.current);

                            // ✅ Logout only once
                            if (!hasLoggedOutRef.current) {
                                hasLoggedOutRef.current = true;
                                toast.error("Logging out...");
                                navigate("/");
                            }
                        }
                    }, 1000);
                }
            }
        });

        // Initial status check on page load
        fetch("http://localhost:8000/api/usb/status")
            .then((res) => res.json())
            .then((data) => {
                if (data.usbConnected) {
                    setUsbVerified(true);
                    console.log("Initial USB connected status confirmed.");
                }
            })
            .catch((err) => console.error("USB check failed:", err));

        return () => {
            socket.off("usb-status");
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
            }
        };
    }, [navigate]);

    return (
        <UsbContext.Provider value={{ usbVerified, setUsbVerified, countdown }}>
            {children}
        </UsbContext.Provider>
    );
}

export function useUsb() {
    return useContext(UsbContext);
}
