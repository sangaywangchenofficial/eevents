import { useState } from 'react'
import PublicLayout from '../publiclayout/PublicLayout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa'
import { MdPersonAdd } from 'react-icons/md'

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false) // Keep this

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { first_name, last_name, email, phone_number, password, confirm_password } = formData

        // Simple validations with toast only
        if (!first_name.trim() || !last_name.trim() || !email.trim() || !phone_number.trim()) {
            toast.error('All fields are required')
            return
        }

        if (password !== confirm_password) {
            toast.error('Passwords do not match!')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    email: email.trim(),
                    phone_number: phone_number.trim(),
                    password
                })
            })

            const data = await response.json()

            if (response.status === 201) {
                toast.success(data.message || 'Registration successful!')
                setFormData({ // it reset the form empty once the registration is successful.
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    password: '',
                    confirm_password: '',
                });

                setTimeout(() => { // Redirect to login page after successful registration
                    navigate('/login')
                }, 2000)

            } else {
                toast.error(data.message || 'Registration failed. Please try again.')
            }
        } catch (error) {
            toast.error('Could not connect to authentication server')
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
                            <MdPersonAdd className="text-3xl" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-stone-100 tracking-wide">
                            Create Account
                        </h1>
                        <p className="text-xs text-purple-400/80 font-medium uppercase tracking-widest mt-1">
                            Join eEvents Today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                    First Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                        <FaUser className="text-xs" />
                                    </div>
                                    <input
                                        type="text"
                                        name="first_name"
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2.5 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                    Last Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                        <FaUser className="text-xs" />
                                    </div>
                                    <input
                                        type="text"
                                        name="last_name"
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2.5 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
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

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaPhone className="text-sm" />
                                </div>
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    maxLength="20"
                                    className="w-full pl-10 pr-4 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaLock className="text-sm" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirm_password"
                                    placeholder="••••••••••••"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-500 hover:text-purple-400 transition-colors"
                                >
                                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 text-stone-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 rounded border-stone-800 bg-stone-950 text-purple-600 focus:ring-purple-500 focus:ring-offset-stone-900 transition-all"
                                />
                                <span>Accept terms & conditions</span>
                            </label>
                            <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Already have an account?
                            </a>
                        </div>

                        {/* Register Button */}
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
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <FaUserPlus className="mr-2" />
                                    Create Account
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-stone-800/60 text-center">
                        <p className="text-xs text-stone-500">
                            Secure registration • Your data is protected
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}

export default RegisterPage