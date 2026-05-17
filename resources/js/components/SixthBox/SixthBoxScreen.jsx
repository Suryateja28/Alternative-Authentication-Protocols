import React, { useState } from 'react';
import { Target, ArrowLeft, RefreshCw, Key } from 'lucide-react';

const SixthBoxScreen = ({ onBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [combination, setCombination] = useState([50, 50, 50]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        handleReset();
    };

    const handleReset = () => {
        setCombination([50, 50, 50]);
        setMessage('');
    };

    const handleSliderChange = (index, value) => {
        const newComb = [...combination];
        newComb[index] = parseInt(value, 10);
        setCombination(newComb);
        setMessage('');
    };

    const submit = async () => {
        if (!email) {
            setMessage('Email is required');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = isLoginMode ? '/api/sixthbox/login' : '/api/sixthbox/register';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ email, combination }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            if (isLoginMode) {
                setIsAuthenticated(true);
            } else {
                setMessage('Successfully registered. You can now login.');
                setIsLoginMode(true);
                handleReset();
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        handleReset();
        setEmail('');
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
                <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 ring-1 ring-emerald-500/20">
                        <Target size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Access Granted</h2>
                    <p className="text-slate-400 mb-8">You have successfully authenticated using the Combination Lock.</p>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
            <button
                type="button"
                onClick={onBack}
                className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border border-amber-700/50 bg-amber-900/40 px-4 py-2 font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors z-20 backdrop-blur-xl"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mb-4 ring-1 ring-amber-500/30">
                        <Key className="text-amber-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isLoginMode ? 'Login with Combination' : 'Register Combination'}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Slide the 3 dials to specific percentages to make your unique combination lock.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-200 text-sm break-words">
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-text"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-5 bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                        {[0, 1, 2].map((dialIndex) => (
                            <div key={dialIndex}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Dial {dialIndex + 1}</span>
                                    <span className="text-amber-400 font-mono font-bold">{combination[dialIndex]}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={combination[dialIndex]}
                                    onChange={(e) => handleSliderChange(dialIndex, e.target.value)}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={submit}
                            disabled={loading || !email}
                            className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                        >
                            {loading ? 'Processing...' : isLoginMode ? 'Unlock' : 'Lock (Register)'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? "Don't have a combination? Register" : 'Already have a combination? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SixthBoxScreen;
