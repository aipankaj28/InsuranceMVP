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
        <div className="w-full max-w-md mx-auto p-6 z-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-accent/20 rounded-2xl mb-4">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {step === 1 ? 'Welcome Back' : 'Verify Identity'}
                    </h2>
                    <p className="text-slate-400">
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
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all placeholder:text-slate-600"
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
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1">Verification Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-center text-2xl tracking-[1em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all placeholder:text-slate-600"
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
                            className="w-full text-slate-400 text-sm hover:text-white transition-colors"
                        >
                            Back to email
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs">
                        By logging in, you agree to our <span className="text-slate-400 underline cursor-pointer">Terms of Service</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
