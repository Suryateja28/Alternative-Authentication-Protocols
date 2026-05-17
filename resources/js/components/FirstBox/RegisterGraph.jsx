import React, { useState } from 'react';
import { postJson } from '../../utils/api';
import GraphCanvas from './GraphCanvas';
import { Mail, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterGraph = ({ onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [pattern, setPattern] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);

    const handleClicksComplete = (clicks) => {
        setPattern(clicks);
        setStatus({ type: '', message: '' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email.' });
            return;
        }
        
        if (!pattern || pattern.length !== 4) {
            setStatus({ type: 'error', message: 'Please select exactly 4 spots on the graph to create your pattern.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const data = await postJson('/api/firstbox/register', {
                email,
                pattern
            });

            setStatus({ type: 'success', message: data.message || 'Pattern Registered Successfully' });
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

    const resetCanvas = () => {
        setPattern(null);
        setResetSignal(prev => prev + 1);
        setStatus({ type: '', message: '' });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Pattern</h2>
                <p className="text-slate-400">Register a secret 4-spot sequence</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300">Set Authentication Pattern</label>
                        <button 
                            type="button" 
                            onClick={resetCanvas}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Redraw Pattern
                        </button>
                    </div>
                    <GraphCanvas onClicksComplete={handleClicksComplete} maxClicks={4} resetSignal={resetSignal} />
                </div>

                {status.message && (
                    <div className={`p-4 rounded-xl flex items-start space-x-3 ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium">{status.message}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !pattern || !email}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Registering...' : 'Register Pattern'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    Already have a pattern?{' '}
                    <button onClick={onToggleMode} className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-all">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterGraph;
