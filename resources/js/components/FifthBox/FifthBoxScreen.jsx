import React, { useState } from 'react';
import { Target, ArrowLeft, RefreshCw } from 'lucide-react';

const COLORS = [
    { id: 'red', hex: '#EF4444' },
    { id: 'blue', hex: '#3B82F6' },
    { id: 'green', hex: '#10B981' },
    { id: 'yellow', hex: '#F59E0B' },
    { id: 'purple', hex: '#8B5CF6' },
    { id: 'pink', hex: '#EC4899' },
    { id: 'orange', hex: '#F97316' },
    { id: 'cyan', hex: '#06B6D4' },
    { id: 'teal', hex: '#14B8A6' },
];

const FifthBoxScreen = ({ onBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [sequence, setSequence] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setSequence([]);
        setMessage('');
    };

    const handleSelectColor = (colorId) => {
        if (sequence.length < 4) {
            setSequence([...sequence, colorId]);
        }
        setMessage('');
    };

    const handleReset = () => {
        setSequence([]);
        setMessage('');
    };

    const submit = async () => {
        if (!email) {
            setMessage('Email is required');
            return;
        }
        if (sequence.length !== 4) {
            setMessage('Please select exactly 4 colors');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = isLoginMode ? '/api/fifthbox/login' : '/api/fifthbox/register';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ email, sequence }),
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
                    <p className="text-slate-400 mb-8">You have successfully authenticated using your Color Sequence.</p>
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
                className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700 transition-colors z-20 backdrop-blur-xl"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white">
                        {isLoginMode ? 'Login with Colors' : 'Register Colors'}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Select a sequence of 4 colors to {isLoginMode ? 'login' : 'register'}
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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                        <span className="text-sm text-slate-400">Sequence ({sequence.length}/4)</span>
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, i) => {
                                const colorId = sequence[i];
                                const colorData = COLORS.find(c => c.id === colorId);
                                return (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full border-2 border-slate-700"
                                        style={{ backgroundColor: colorData ? colorData.hex : 'transparent' }}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {COLORS.map((color) => (
                            <button
                                key={color.id}
                                disabled={sequence.length >= 4}
                                onClick={() => handleSelectColor(color.id)}
                                style={{ backgroundColor: color.hex }}
                                className="h-16 rounded-xl hover:opacity-80 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-white border border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Clear
                        </button>
                        <button
                            onClick={submit}
                            disabled={loading || !email || sequence.length !== 4}
                            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Register'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? "Don't have a sequence? Register" : 'Already have a sequence? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FifthBoxScreen;
