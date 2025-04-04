import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { FaBuildingUser, FaUser } from 'react-icons/fa6';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CredentialsForm() {
    const [orgCode, setOrgCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgCode, username, password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                let errorMessage = data?.message || 'Login failed. Please try again.';
    
                if (response.status === 401) {
                    errorMessage = 'Invalid credentials. Please check your username and password.';
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. Contact your admin.';
                } else if (response.status === 500) {
                    errorMessage = 'Server error. Try again later.';
                } else if (response.status === 404) {
                    errorMessage = 'User not found. Please check your details.';
                }
    
                setError(errorMessage); // Set error state
                toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
                return; // Stop execution without throwing an error
            }
    
            if (data?.token) {
                localStorage.setItem('jwtToken', data.token);
                toast.success('Login successful! Redirecting...', { position: 'top-right', autoClose: 2000 });
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        } catch (err) {
            const networkError = err.message || 'Network error. Please try again.';
            setError(networkError);
            toast.error(networkError, { position: 'top-right', autoClose: 3000 });
        }
    };
    
    

    return (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 pt-8">
            <div className="flex gap-2 items-center">
                <FaBuildingUser className="text-[#1c4684]" />
                <label className='font-bold' htmlFor="org_code">Organizational Code:</label>
            </div>
            <input 
                type="text" 
                value={orgCode} 
                onChange={(e) => setOrgCode(e.target.value)} 
                placeholder="Enter Organizational Code" 
                className="border rounded p-2"
            />
            <div className="flex gap-2 items-center">
                <FaUser className="text-[#1c4684]" />
                <label className='font-bold' htmlFor="username">Username:</label>
            </div>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter Username" 
                className="border rounded p-2"
            />
            <div className="flex gap-2 items-center">
                <RiLockPasswordFill className="text-[#1c4684]" />
                <label className='font-bold' htmlFor="password">Password:</label>
            </div>
            <div className="relative">
                <input 
                    type={passwordVisible ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter Password" 
                    className="border rounded p-2 pr-10 w-full"
                />
                <button 
                    type="button" 
                    onClick={togglePasswordVisibility} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                    {passwordVisible ? <LuEye /> : <LuEyeClosed />}
                </button>
            </div>
            <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Login
            </button>
        </form>
    );
}

function ErrorMessage({ message }) {
    return <p className="text-red-500">{message}</p>;
}

export default CredentialsForm;
