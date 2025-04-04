import React from "react";
import { useUsb } from "../../context/UsbContext";
import Verification from "./Verification";
import CredentialsForm from "./CredentialsForm";
import PrymLogo from "../Logos/PrymLogo";
import ShaktiLogo from "../Logos/ShaktiLogo";

function Login() {
    const { usbVerified } = useUsb(); // Use global USB state

    return (
        <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('/logimg2.jpeg')",
                    filter: "blur(8px)",
                }}
            ></div>

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col rounded-xl p-8 bg-white/50 backdrop-blur-md shadow-lg">
                <div className="flex flex-col items-center">
                    <PrymLogo className="w-24 h-24 mb-4" />
                    <ShaktiLogo className="w-32 h-32 mb-6" />
                    <p className="text-xl text-center text-gray-700 font-bold">
                        SAFETY HIGH ACCURACY AERIAL KINEMATIC TRACKING INTEGRATION
                    </p>
                </div>
                {!usbVerified ? <Verification /> : <CredentialsForm />}
            </div>
        </div>
    );
}

export default Login;
