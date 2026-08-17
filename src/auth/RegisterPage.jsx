import { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { setAuth, isAuthenticated } from '../utils/auth';
import { api } from '../utils/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/userdashboard', { replace: true });
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
    const { first_name, last_name, email, phone_number, password, confirm_password } = formData;

    if (!first_name.trim() || !last_name.trim() || !email.trim() || !phone_number.trim()) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/register/', {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        phone_number: phone_number.trim(),
        password
      });

      toast.success(data.message || '🎉 Account created successfully! Welcome.');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
      });

      const userObj = data.user || {};
      const currentUserId = data.user_id || userObj.userid || userObj.id || null;
      const token = data.access_token || data.token;

      if (token && currentUserId) {
        const userData = {
          username: `${userObj.first_name || first_name} ${userObj.last_name || last_name}`.trim(),
          email: userObj.email || email.trim(),
          first_name: userObj.first_name || first_name,
          last_name: userObj.last_name || last_name,
          phone_number: userObj.phone_number || phone_number,
          isStaff: false,
          userId: currentUserId
        };

        setAuth({
          token,
          user: userData,
          userId: currentUserId,
          username: userData.username,
          email: userData.email
        });
      }

      setTimeout(() => {
        navigate('/userdashboard', { replace: true });
      }, 900);

    } catch (error) {
      console.error('Registration error:', error);
      if (error && error.__unauthorized) {
        return;
      }
      const msg = (error && error.message) || 'Registration failed. Please try again.';
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
          className="w-full max-w-lg bg-white rounded-3xl border border-[#E6E1D8] shadow-2xl shadow-teal-900/8 p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#29BBA3] to-[#1E8B7A] text-white mb-4 shadow-lg shadow-teal-600/30">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="font-extrabold text-2xl text-[#1E352F]">
              Create Your Account
            </h1>
            <p className="text-xs font-semibold text-[#1E8B7A] uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join TIXELO Today</span>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#29BBA3]" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#29BBA3]" />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Dorji"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-[#29BBA3]" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.bt"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-[#29BBA3]" />
                </div>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="+975 17 00 00 00"
                  value={formData.phone_number}
                  onChange={handleChange}
                  maxLength="20"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#29BBA3]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#66756F] hover:text-[#29BBA3] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E352F] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#29BBA3]" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="••••••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FDFDF7] border border-[#E6E1D8] rounded-xl text-[#1E352F] placeholder-[#66756F] focus:outline-none focus:border-[#29BBA3] focus:ring-1 focus:ring-[#29BBA3] transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#66756F] hover:text-[#29BBA3] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#66756F] cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-[#E6E1D8] text-[#29BBA3] focus:ring-[#29BBA3]"
                />
                <span>I accept terms & conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white font-bold rounded-xl shadow-lg shadow-teal-600/25 transition-all text-sm tracking-wide flex items-center justify-center gap-2 transform active:scale-[0.98] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Complete Account Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Login Callout */}
          <div className="mt-6 text-center pt-5 border-t border-[#E6E1D8]">
            <p className="text-xs text-[#66756F]">
              Already registered?{' '}
              <Link to="/login" className="text-[#1E8B7A] hover:text-[#29BBA3] font-bold transition-colors">
                Sign in to your account
              </Link>
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#66756F] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#29BBA3]" />
              <span>Your data is protected under Bhutan digital privacy guidelines</span>
            </div>
          </div>

        </motion.div>

      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
