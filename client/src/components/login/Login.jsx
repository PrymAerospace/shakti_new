import React from "react";
import { useUsb } from "../../context/UsbContext";
import Verification from "./Verification";
import CredentialsForm from "./CredentialsForm";
import PrymLogo from "../Logos/PrymLogo";
import ShaktiLogo from "../Logos/ShaktiLogo";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

function Login() {
    const { usbVerified } = useUsb();
    const navigate = useNavigate();

    const redirectToSuperAdmin = () => {
        navigate("/AdminLogin");
    };

    return (
        <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('/logimg2.jpeg')",
                    filter: "blur(8px)",
                }}
            ></div>

            {/* Card */}
            <div className="relative z-10 flex flex-col rounded-xl p-8 bg-white/50 backdrop-blur-md shadow-lg min-w-[350px]">
                {/* Cross Icon at top-right */}
                <button
                    onClick={redirectToSuperAdmin}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl"
                    title="Go to Super Admin Login"
                >
                    <RxCross2 />
                </button>

                {/* Logo and Text */}
                <div className="flex flex-col items-center">
                    <PrymLogo className="w-24 h-24 mb-4" />
                    <ShaktiLogo className="w-32 h-32 mb-6" />
                    <p className="text-xl text-center text-gray-700 font-bold">
                        SAFETY HIGH ACCURACY AERIAL KINEMATIC TRACKING INTEGRATION
                    </p>
                </div>

                {/* Conditional Component */}
                {!usbVerified ? <Verification /> : <CredentialsForm />}
            </div>
        </div>
    );
}

export default Login;
