import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Loader2, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';
import SEO from '../components/SEO';
import { APP_NAME_UPPER, APP_NAME_CAPITALIZED } from '../utils/auth';

/**
 * Possible states:
 *  - loading       : verification in progress
 *  - success       : email verified successfully
 *  - expired       : token older than 24 h (can resend)
 *  - already_verified : email was already verified
 *  - error         : invalid/used token or missing token
 */
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email address…');
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const isVerifying = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token was found in this link.');
      return;
    }

    // Prevent double-invocation in React strict mode
    if (isVerifying.current) return;
    isVerifying.current = true;

    const verifyToken = async () => {
      try {
        const { data } = await api.get(`/verify/?token=${token}`);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully. You can now log in.');
        toast.success(`✅ Email verified! Welcome to ${APP_NAME_UPPER}.`);
      } catch (err) {
        const code = err.code || err.response?.data?.code;
        const errorMsg =
          err.error ||
          err.response?.data?.error ||
          err.message ||
          'Verification failed. Please try again.';

        if (code === 'expired') {
          setStatus('expired');
          setUserEmail(err.response?.data?.email || err.email || '');
        } else if (code === 'already_verified') {
          setStatus('already_verified');
        } else {
          setStatus('error');
        }
        setMessage(errorMsg);
      }
    };

    verifyToken();
  }, [token]);

  const handleResend = async (emailOverride = '') => {
    const email = emailOverride || userEmail;
    if (!email) {
      // If no email is known, redirect to the resend page
      navigate('/verify-email-sent', { state: { email: '' } });
      return;
    }

    setIsResending(true);
    try {
      const { data } = await api.post('/resend-verification/', { email });
      toast.success(data.message || 'Verification email resent!');
      navigate('/verify-email-sent', { state: { email } });
    } catch (err) {
      const msg =
        err.error ||
        err.response?.data?.error ||
        err.message ||
        'Failed to resend. Please try again.';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <PublicLayout>
      <SEO
        title={`Verify Email | ${APP_NAME_CAPITALIZED}`}
        noindex={true}
        nofollow={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDF7] dark:bg-[#0F1A17] p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#1C2B27] rounded-3xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-2xl p-6 sm:p-8 text-center">

          {/* ── LOADING ── */}
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-[#29BBA3] animate-spin" />
              <h2 className="text-xl font-bold text-[#1E352F] dark:text-[#E8F5F2]">Verifying…</h2>
              <p className="text-[#66756F] dark:text-[#7AA49D]">{message}</p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-1">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1E352F] dark:text-[#E8F5F2]">Email Verified!</h2>
              <p className="text-[#66756F] dark:text-[#7AA49D] leading-relaxed">{message}</p>
              <Link
                to="/login"
                className="mt-2 w-full py-3 px-6 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white rounded-xl font-bold shadow-lg shadow-teal-600/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Go to Login
              </Link>
            </div>
          )}

          {/* ── EXPIRED ── */}
          {status === 'expired' && (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-1">
                <Clock className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1E352F] dark:text-[#E8F5F2]">Link Expired</h2>
              <p className="text-[#66756F] dark:text-[#7AA49D] leading-relaxed">{message}</p>
              <button
                onClick={() => handleResend(userEmail)}
                disabled={isResending}
                className="mt-2 w-full py-3 px-6 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white rounded-xl font-bold shadow-lg shadow-teal-600/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending…' : 'Resend Verification Email'}
              </button>
              <Link to="/login" className="text-sm text-[#1E8B7A] hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          )}

          {/* ── ALREADY VERIFIED ── */}
          {status === 'already_verified' && (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-1">
                <ShieldCheck className="w-12 h-12 text-[#29BBA3]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1E352F] dark:text-[#E8F5F2]">Already Verified</h2>
              <p className="text-[#66756F] dark:text-[#7AA49D] leading-relaxed">
                Your email address is already verified. You can log in to your account right away.
              </p>
              <Link
                to="/login"
                className="mt-2 w-full py-3 px-6 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white rounded-xl font-bold shadow-lg shadow-teal-600/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Go to Login
              </Link>
            </div>
          )}

          {/* ── ERROR / INVALID ── */}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-1">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1E352F] dark:text-[#E8F5F2]">Verification Failed</h2>
              <p className="text-[#66756F] dark:text-[#7AA49D] leading-relaxed">{message}</p>
              <Link
                to="/register"
                className="mt-2 w-full py-3 px-6 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#175f55] text-white rounded-xl font-bold shadow-lg shadow-teal-600/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                Back to Registration
              </Link>
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => navigate('/verify-email-sent', { state: { email: '' } })}
                  className="text-[#29BBA3] hover:underline font-medium"
                >
                  Resend Verification Email
                </button>
                <Link to="/login" className="text-[#66756F] dark:text-[#7AA49D] hover:underline">
                  Login
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
};

export default VerifyEmail;
