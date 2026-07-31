import React, { useState } from 'react';
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PublicLayout from '../publiclayout/PublicLayout';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Sends credential payload to backend service
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            // Route authorization switch
            if (response.status === 200) {
                toast.success(data.message || 'Login successful!');
                // Save critical profile tracking info
                localStorage.setItem('adminUser', data.username);
                // Direct routing execution
                navigate('/admin-dashboard');
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            toast.error('Could not connect to authentication server');
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-zinc-900 to-purple-950/40 p-4">
                <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-md border border-stone-800 rounded-2xl shadow-2xl p-8">

                    {/* Header / Brand Logo Area */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 mb-4 border border-purple-500/20 shadow-inner">
                            <MdAdminPanelSettings className="text-3xl" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-stone-100 tracking-wide">
                            eEvents
                        </h1>
                        <p className="text-xs text-purple-400/80 font-medium uppercase tracking-widest mt-1">
                            Event Control Panel
                        </p>
                    </div>

                    {/* Login Form UI Container */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Username Input Context */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Username or Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaUserShield className="text-sm" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="form-control w-full pl-10 pr-4 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    placeholder="admin_username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input Context */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Secret Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaLock className="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    className="form-control w-full pl-10 pr-12 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/* Toggle Password Visibility Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-500 hover:text-purple-400 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                        </div>

                        {/* Utilities & Controls Sub-Row */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 text-stone-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    className="w-4 h-4 rounded border-stone-800 bg-stone-950 text-purple-600 focus:ring-purple-500 focus:ring-offset-stone-900 transition-all"
                                />
                                <span>Remember session</span>
                            </label>
                            <a href="#forgot" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Trouble logging in?
                            </a>
                        </div>

                        {/* Authentication Action Dispatcher */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-950/40 active:scale-[0.98] transition-all text-sm tracking-wide"
                        >
                            Authenticate Access
                        </button>
                    </form>

                    {/* Footer Security Isolation Warning */}
                    <div className="mt-8 pt-6 border-t border-stone-800/60 text-center">
                        <p className="text-xs text-stone-500">
                            Venue & Management terminal session tracking active.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout >
    );
};

export default AdminLogin;
