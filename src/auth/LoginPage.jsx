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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8FF] p-4 py-12 font-inter bhutan-cloud-overlay">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl shadow-purple-900/10 p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6B21A8] to-[#8B5CF6] text-white mb-4 shadow-lg shadow-purple-600/30">
              <LogIn className="w-7 h-7" />
            </div>
            <h1 className="font-poppins font-extrabold text-2xl text-[#1E1B4B]">
              Welcome Back
            </h1>
            <p className="text-xs font-poppins font-semibold text-[#6B21A8] uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>eEvents Bhutan Account</span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div>
              <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-[#6B21A8]" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.bt"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-[#6B21A8]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6B21A8] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-inter">
              <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E9D5FF] text-[#6B21A8] focus:ring-[#6B21A8]"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#6B21A8] hover:text-[#581C87] font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-[#6B21A8] to-[#8B5CF6] hover:from-[#581C87] hover:to-[#6B21A8] text-white font-poppins font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all text-sm tracking-wide flex items-center justify-center gap-2 transform active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
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
          <div className="mt-8 text-center pt-6 border-t border-[#E9D5FF]">
            <p className="text-xs text-[#475569] font-inter">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#6B21A8] hover:text-[#581C87] font-poppins font-bold transition-colors">
                Create one now
              </Link>
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure Encrypted Bhutan Sign-In</span>
            </div>
          </div>

        </motion.div>

      </div>
    </PublicLayout>
  );
};

export default LoginPage;
