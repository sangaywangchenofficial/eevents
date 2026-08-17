import { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { setAuth, clearAuth, isAuthenticated, STORAGE_KEYS } from '../utils/auth';
import { api } from '../utils/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || location.search.split('redirect=')[1]
    ? decodeURIComponent(location.search.split('redirect=')[1])
    : null;

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/userdashboard', { replace: true });
      return;
    }
    const rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL);
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/login/', {
        email: email.trim(),
        password: password
      });

      toast.success(data.message || '🎉 Welcome back! Login successful.');

      setFormData({
        email: '',
        password: '',
      });

      const userObj = data.user || {};
      const currentUserId = data.user_id || userObj.userid || userObj.id || null;

      const userData = {
        username: `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() || data.username || '',
        email: userObj.email || data.email || email.trim(),
        first_name: userObj.first_name || data.first_name || '',
        last_name: userObj.last_name || data.last_name || '',
        phone_number: userObj.phone_number || data.phone_number || '',
        isStaff: data.is_staff || false,
        userId: currentUserId
      };

      const token = data.access_token || data.token;
      const username = userData.username;

      setAuth({
        token,
        user: userData,
        userId: currentUserId,
        username,
        email: userData.email
      });

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
      }

      const redirectTo = from || '/userdashboard';
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 600);

    } catch (error) {
      console.error('Login error:', error);
      if (error && error.__unauthorized) {
        return;
      }
      const msg = (error && error.message) || 'Invalid credentials. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDF7] p-4 py-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#E6E1D8] shadow-2xl shadow-teal-900/8 p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#29BBA3] to-[#1E8B7A] text-white mb-4 shadow-lg shadow-teal-600/30">
              <LogIn className="w-7 h-7" />
            </div>
            <h1 className="font-extrabold text-2xl text-[#1E352F]">
              Welcome Back
            </h1>
            <p className="text-xs font-semibold text-[#1E8B7A] uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TIXELO Account</span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-[#29BBA3]" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.bt"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-[#29BBA3]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#66756F] hover:text-[#29BBA3] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#66756F] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E6E1D8] text-[#29BBA3] focus:ring-[#29BBA3]"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#1E8B7A] hover:text-[#29BBA3] font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white font-bold rounded-xl shadow-lg shadow-teal-600/25 transition-all text-sm tracking-wide flex items-center justify-center gap-2 transform active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Register Callout */}
          <div className="mt-8 text-center pt-6 border-t border-[#E6E1D8]">
            <p className="text-xs text-[#66756F]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#1E8B7A] hover:text-[#29BBA3] font-bold transition-colors">
                Create one now
              </Link>
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-[#66756F] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#29BBA3]" />
              <span>Secure Encrypted Bhutan Sign-In</span>
            </div>
          </div>

        </motion.div>

      </div>
    </PublicLayout>
  );
};

export default LoginPage;
