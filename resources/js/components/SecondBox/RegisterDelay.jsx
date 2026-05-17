import React, { useState } from 'react';
import { postJson } from '../../utils/api';
import { Mail, Lock, Clock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterDelay = ({ onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [delay, setDelay] = useState(2);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setStatus({ type: 'error', message: 'Please fill in all fields.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const data = await postJson('/api/secondbox/register', {
                email,
                password,
                delay
            });

            setStatus({ type: 'success', message: data.message || 'Account Created Successfully' });
            setTimeout(() => {
                onToggleMode(); // Switch to login after successful registration
            }, 2000);
        } catch (error) {
            const errorMsg = error.message || 'Registration failed. Please try again.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 mb-4 ring-1 ring-purple-500/20">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-slate-400">Set up Key Press Duration Auth</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="password"
                        required
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Clock size={16} className="text-purple-400" />
                            Key Press Delay
                        </label>
                        <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md text-sm">
                            {delay} seconds
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={delay} 
                        onChange={(e) => setDelay(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <p className="text-xs text-slate-500 text-center">
                        Required waiting time between typing each character.
                    </p>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-xl flex items-start space-x-3 ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium">{status.message}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Registering...' : 'Register Account'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    Already have an account?{' '}
                    <button onClick={onToggleMode} className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-all">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterDelay;
