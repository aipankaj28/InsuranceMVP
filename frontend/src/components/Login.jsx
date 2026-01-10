import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, verify } = useAuth();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verify(email, otp);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 md:p-6 z-10">
            <div className="backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl" style={{ 
                backgroundColor: 'var(--bg-auth-card)', 
                borderColor: 'var(--border-auth-card)',
                border: '1px solid'
            }}>
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-brand-accent/20 rounded-xl md:rounded-2xl mb-4">
                        <span className="text-2xl md:text-3xl">🔐</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-auth-primary)' }}>
                        {step === 1 ? 'Secure Login' : 'Verify Identity'}
                    </h2>
                    <p style={{ color: 'var(--text-auth-muted)' }}>
                        {step === 1
                            ? 'Enter your email to receive an OTP'
                            : `We've sent a code to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 ml-1" style={{ color: 'var(--text-auth-label)' }}>Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
                                style={{ 
                                    backgroundColor: 'var(--bg-auth-input)',
                                    borderColor: 'var(--border-auth-card)',
                                    color: 'var(--text-auth-primary)'
                                }}
                                placeholder="pankaj@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-accent to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 ml-1" style={{ color: 'var(--text-auth-label)' }}>Verification Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                className="w-full border rounded-2xl px-5 py-4 text-center text-2xl tracking-[1em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
                                style={{ 
                                    backgroundColor: 'var(--bg-auth-input)',
                                    borderColor: 'var(--border-auth-card)',
                                    color: 'var(--text-auth-primary)'
                                }}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-accent to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm hover:text-white transition-colors"
                            style={{ color: 'var(--text-auth-muted)' }}
                        >
                            Back to email
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-xs" style={{ color: 'var(--text-auth-placeholder)' }}>
                        By logging in, you agree to our <span className="underline cursor-pointer" style={{ color: 'var(--text-auth-muted)' }}>Terms of Service</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
