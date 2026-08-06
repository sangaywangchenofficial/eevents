// LoginPage.jsx - Updated for Email Login
import { useState, useEffect } from 'react'
import PublicLayout from '../publiclayout/PublicLayout'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import { MdLogin } from 'react-icons/md'

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const navigate = useNavigate()

    // Load remembered email if exists
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }))
            setRememberMe(true)
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { email, password } = formData

        // Validation
        if (!email.trim() || !password.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        // Email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsLoading(true)

        try {
            // Send email to backend
            const response = await fetch('http://127.0.0.1:8000/api/v1/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim(),  // Send email
                    password: password
                })
            })

            const data = await response.json()

            if (response.status === 200) {
                toast.success(data.message || 'Login successful!')

                // Reset form
                setFormData({
                    email: '',
                    password: '',
                })

                // Save user session data
                const userData = {
                    username: data.username || '',
                    email: data.email || email.trim(),
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    isStaff: data.is_staff || false,
                    userId: data.user_id || null
                }

                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('username', data.username || '')
                localStorage.setItem('email', data.email || email.trim())
                localStorage.setItem('userId', JSON.stringify(data.user_id || null))

                // Save token if provided
                if (data.access_token || data.token) {
                    localStorage.setItem('token', data.access_token || data.token)
                }

                // Remember me functionality
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true')
                    localStorage.setItem('rememberedEmail', email.trim())
                } else {
                    localStorage.removeItem('rememberMe')
                    localStorage.removeItem('rememberedEmail')
                }

                // Redirect to dashboard
                setTimeout(() => {
                    navigate('/user-dashboard')
                }, 1000)
            } else {
                toast.error(data.message || 'Invalid credentials. Please try again.')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('Could not connect to authentication server. Please check your internet connection.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-zinc-900 to-purple-950/40 p-4">
                <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-md border border-stone-800 rounded-2xl shadow-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 mb-4 border border-purple-500/20 shadow-inner">
                            <MdLogin className="text-3xl" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-stone-100 tracking-wide">
                            Welcome Back
                        </h1>
                        <p className="text-xs text-purple-400/80 font-medium uppercase tracking-widest mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaEnvelope className="text-sm" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaLock className="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-500 hover:text-purple-400 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 text-stone-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-stone-800 bg-stone-950 text-purple-600 focus:ring-purple-500 focus:ring-offset-stone-900 transition-all"
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-950/40 active:scale-[0.98] transition-all text-sm tracking-wide ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <FaSignInAlt className="mr-2" />
                                    Sign In
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-stone-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-stone-800/60 text-center">
                        <p className="text-xs text-stone-500">
                            Secure login • Your privacy matters
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}

export default LoginPage