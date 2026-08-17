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
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.warning('Please enter both username and password');
            return;
        }

        setLoading(true);

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

                // Store admin user data as JSON object (FIXED)
                const adminUserData = {
                    id: data.user_id || null,
                    username: data.username || username,
                    email: data.email || '',
                    is_staff: true,
                    is_superuser: data.is_staff || false,
                    token: data.token
                };

                // Save critical profile tracking info
                localStorage.setItem('adminUser', JSON.stringify(adminUserData));

                // Store token separately for API calls
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('adminToken', data.token);
                }

                // Direct routing execution
                navigate('/admin-dashboard');
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Could not connect to authentication server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1f1c] via-[#1E352F] to-[#0a2820] p-4">
                <div className="w-full max-w-md bg-[#0f1f1c]/90 backdrop-blur-md border border-[#29BBA3]/20 rounded-2xl shadow-2xl p-8 shadow-[#29BBA3]/10">

                    {/* Header / Brand Logo Area */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 mb-4 shadow-lg shadow-teal-900/40">
                            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-white" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l1.5-1.5a2.5 2.5 0 010-3.54L6 3l15 15-1.5 1.5a2.5 2.5 0 01-3.54 0L15 18H9l-1.5 1.5a2.5 2.5 0 01-3.54 0L3 18V9z" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                            TIX<span className="text-teal-400">ELO</span>
                        </h1>
                        <p className="text-xs text-teal-400/80 font-medium uppercase tracking-widest mt-1">
                            Admin Control Panel
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
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-[#29BBA3] transition-colors">
                                    <FaUserShield className="text-sm" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a1e1a]/60 border border-[#29BBA3]/20 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                                    placeholder="admin_username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input Context */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Secret Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-[#29BBA3] transition-colors">
                                    <FaLock className="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-[#0a1e1a]/60 border border-[#29BBA3]/20 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                {/* Toggle Password Visibility Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-500 hover:text-[#29BBA3] transition-colors"
                                    disabled={loading}
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
                                    className="w-4 h-4 rounded border-stone-800 bg-stone-950 text-[#29BBA3] focus:ring-[#29BBA3] focus:ring-offset-stone-900 transition-all"
                                />
                                <span>Remember session</span>
                            </label>
                            <a href="#forgot" className="text-[#29BBA3] hover:text-[#1E8B7A] font-medium transition-colors">
                                Trouble logging in?
                            </a>
                        </div>

                        {/* Authentication Action Dispatcher */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 btn-tixelo text-white font-medium rounded-xl active:scale-[0.98] transition-all text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                'Authenticate Access'
                            )}
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
        </PublicLayout>
    );
};

export default AdminLogin;