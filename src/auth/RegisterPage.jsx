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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8FF] p-4 py-12 font-inter bhutan-cloud-overlay">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl shadow-purple-900/10 p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6B21A8] to-[#8B5CF6] text-white mb-4 shadow-lg shadow-purple-600/30">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="font-poppins font-extrabold text-2xl text-[#1E1B4B]">
              Create Your Account
            </h1>
            <p className="text-xs font-poppins font-semibold text-[#6B21A8] uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join eEvents Bhutan Today</span>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#6B21A8]" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#6B21A8]" />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Dorji"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-[#6B21A8]" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.bt"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-[#6B21A8]" />
                </div>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="+975 17 00 00 00"
                  value={formData.phone_number}
                  onChange={handleChange}
                  maxLength="20"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#6B21A8]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#6B21A8] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-[#1E1B4B] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#6B21A8]" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="••••••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[#1E1B4B] placeholder-slate-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-all text-sm font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#6B21A8] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1 flex items-center justify-between text-xs font-inter">
              <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-[#E9D5FF] text-[#6B21A8] focus:ring-[#6B21A8]"
                />
                <span>I accept terms & conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-[#6B21A8] to-[#8B5CF6] hover:from-[#581C87] hover:to-[#6B21A8] text-white font-poppins font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all text-sm tracking-wide flex items-center justify-center gap-2 transform active:scale-[0.98] ${
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
          <div className="mt-6 text-center pt-5 border-t border-[#E9D5FF]">
            <p className="text-xs text-[#475569] font-inter">
              Already registered?{' '}
              <Link to="/login" className="text-[#6B21A8] hover:text-[#581C87] font-poppins font-bold transition-colors">
                Sign in to your account
              </Link>
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your data is protected under Bhutan digital privacy guidelines</span>
            </div>
          </div>

        </motion.div>

      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
