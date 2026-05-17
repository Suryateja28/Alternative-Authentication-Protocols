import React, { useState, useEffect, useRef } from 'react';
import { postJson } from '../../utils/api';
import { Mail, Lock, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const LoginDelay = ({ onToggleMode, onLoginSuccess }) => {
    const [step, setStep] = useState(1); // 1: email, 2: password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [delay, setDelay] = useState(0);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    const [timings, setTimings] = useState([]);
    const lastKeyTimeRef = useRef(null);

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const data = await postJson('/api/secondbox/check-email', { email });
            setDelay(data.delay);
            setStep(2);
            setStatus({ type: 'success', message: 'Email verified. Please enter your password.' });
        } catch (error) {
            const errorMsg = error.message || 'Email not found.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        const now = Date.now();
        
        // Only trigger delay if we actually added a character
        if (val.length > password.length) {
            if (lastKeyTimeRef.current !== null) {
                // Record the time passed since the last keypress
                const timePassed = (now - lastKeyTimeRef.current) / 1000;
                setTimings(prev => [...prev, timePassed]);
            }
        } else if (val.length < password.length) {
            // User deleted a character, we might want to remove last timing
            setTimings(prev => prev.slice(0, -1));
        }

        setPassword(val);
        lastKeyTimeRef.current = now;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!password) {
            setStatus({ type: 'error', message: 'Please enter your password.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const data = await postJson('/api/secondbox/login', {
                email,
                password,
                timings
            });

            setStatus({ type: 'success', message: data.message || 'Authentication Successful' });
            setTimeout(() => {
                onLoginSuccess();
            }, 1500);
        } catch (error) {
            const errorMsg = error.message || 'Authentication Failed';
            setStatus({ type: 'error', message: errorMsg });
            // Reset for retry
            setPassword('');
            setTimings([]);
            lastKeyTimeRef.current = null;
        } finally {
            setIsLoading(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setPassword('');
        setTimings([]);
        lastKeyTimeRef.current = null;
        setStatus({ type: '', message: '' });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 mb-4 ring-1 ring-purple-500/20">
                    <KeyRound size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400">Login with Key Press Duration</p>
            </div>

            {step === 1 ? (
                <form onSubmit={handleCheckEmail} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-start space-x-3 ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
                    >
                        {isLoading ? 'Checking...' : 'Continue'} <ArrowRight size={18} />
                    </button>
                </form>
            ) : (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-300">Email verified</span>
                        <button 
                            type="button" 
                            onClick={resetFlow}
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Change Email
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="password"
                            required
                            disabled={isLoading}
                            className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-slate-900"
                            placeholder="Enter password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-start space-x-3 ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            )}

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    Don't have an account?{' '}
                    <button onClick={onToggleMode} className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-all">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginDelay;
