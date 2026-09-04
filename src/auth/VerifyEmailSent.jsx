import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from 'react-toastify';
import { Mail, RefreshCw, Clock } from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';
import SEO from '../components/SEO';
import { APP_NAME_CAPITALIZED } from '../utils/auth';

const COOLDOWN_SECONDS = 300; // must match backend RESEND_COOLDOWN_SECONDS

const VerifyEmailSent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';
    const [isResending, setIsResending] = useState(false);
    // cooldownUntil is a Date after which the button re-enables
    const [cooldownUntil, setCooldownUntil] = useState(null);
    const [remaining, setRemaining] = useState(0);

    // Count-down ticker
    useEffect(() => {
        if (!cooldownUntil) return;
        const tick = () => {
            const secs = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
            setRemaining(secs);
            if (secs === 0) setCooldownUntil(null);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [cooldownUntil]);

    const isCoolingDown = remaining > 0;

    const handleResend = async () => {
        if (!email) {
            toast.error('No email address found. Please register again.');
            navigate('/register');
            return;
        }
        if (isCoolingDown) return;

        setIsResending(true);
        try {
            const { data } = await api.post('/resend-verification/', { email });
            toast.success(data.message || 'Verification email resent! Check your inbox.');
            // Start the 5-minute cooldown locally
            setCooldownUntil(Date.now() + COOLDOWN_SECONDS * 1000);
        } catch (err) {
            const code = err.code || err.response?.data?.code;
            const msg =
                err.error ||
                err.response?.data?.error ||
                err.message ||
                'Failed to resend. Please try again.';

            if (code === 'rate_limited') {
                const retryAfter = err.response?.data?.retry_after || COOLDOWN_SECONDS;
                setCooldownUntil(Date.now() + retryAfter * 1000);
                toast.warn(msg);
            } else if (code === 'already_verified') {
                toast.info('Your email is already verified — you can log in!');
                navigate('/login');
            } else {
                toast.error(msg);
            }
        } finally {
            setIsResending(false);
        }
    };

    const formatRemaining = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    return (
        <PublicLayout>
            <SEO
                title={`Verification Link Sent | ${APP_NAME_CAPITALIZED}`}
                noindex={true}
                nofollow={true}
            />
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDF7] dark:bg-[#0F1A17] p-4 py-12">
                <div className="max-w-md w-full bg-white dark:bg-[#1C2B27] rounded-3xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-4">
                        <Mail className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1E352F] dark:text-[#E8F5F2] mb-2">
                        Check Your Email
                    </h2>
                    <p className="text-sm text-[#66756F] dark:text-[#7AA49D] mb-1 leading-relaxed">
                        We've sent a verification link to{' '}
                        {email ? (
                            <strong className="text-[#1E352F] dark:text-white">{email}</strong>
                        ) : (
                            'your email address'
                        )}
                        .<br />
                        Click the link to activate your account.
                    </p>
                    <p className="text-xs text-[#8A9B95] mb-6">
                        Don't forget to check your spam/junk folder. The link expires in 24 hours.
                    </p>

                    {/* Resend Button */}
                    {isCoolingDown ? (
                        <div className="inline-flex items-center gap-2 text-sm text-[#66756F] dark:text-[#7AA49D] font-medium">
                            <Clock className="w-4 h-4" />
                            Resend available in{' '}
                            <span className="font-bold text-[#29BBA3]">{formatRemaining(remaining)}</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#29BBA3] hover:text-[#1E8B7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                            {isResending ? 'Sending…' : 'Resend verification email'}
                        </button>
                    )}

                    <div className="mt-6 pt-4 border-t border-[#E6E1D8] dark:border-[#2A3D38] flex justify-center gap-6">
                        <Link to="/login" className="text-sm text-[#1E8B7A] hover:underline font-medium">
                            Back to Login
                        </Link>
                        <Link to="/" className="text-sm text-[#66756F] dark:text-[#7AA49D] hover:underline">
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default VerifyEmailSent;