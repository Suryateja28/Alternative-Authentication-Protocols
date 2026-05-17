import React, { useState } from 'react';
import { Target, ArrowLeft, RefreshCw, Smile } from 'lucide-react';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];

const SeventhBoxScreen = ({ onBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [emojis, setEmojis] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        handleReset();
    };

    const handleSelectEmoji = (emoji) => {
        if (emojis.length < 4) {
            setEmojis([...emojis, emoji]);
        }
        setMessage('');
    };

    const handleReset = () => {
        setEmojis([]);
        setMessage('');
    };

    const submit = async () => {
        if (!email) {
            setMessage('Email is required');
            return;
        }
        if (emojis.length !== 4) {
            setMessage('Please select exactly 4 emojis');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = isLoginMode ? '/api/seventhbox/login' : '/api/seventhbox/register';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ email, emojis }),
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
                    <p className="text-slate-400 mb-8">You have successfully authenticated using your Emoji Story Protocol.</p>
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
                className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border border-pink-700/50 bg-pink-900/40 px-4 py-2 font-semibold text-pink-100 hover:bg-pink-800/60 transition-colors z-20 backdrop-blur-xl"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-pink-900/30 flex items-center justify-center mb-4 ring-1 ring-pink-500/30">
                        <Smile className="text-pink-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isLoginMode ? 'Login with Emojis' : 'Register Emoji Story'}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Create a story by picking 4 emojis in sequence to {isLoginMode ? 'login' : 'register'}.
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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-text"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/50 rounded-xl p-4 border border-slate-700 min-h-[80px]">
                        <span className="text-sm font-medium text-slate-400">Story ({emojis.length}/4)</span>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-xl"
                                >
                                    {emojis[index] || ''}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        {EMOJIS.map((emoji, index) => (
                            <button
                                key={index}
                                disabled={emojis.length >= 4}
                                onClick={() => handleSelectEmoji(emoji)}
                                className="aspect-square text-3xl rounded-xl hover:bg-slate-700 active:scale-90 transition-all outline-none focus:ring-2 focus:ring-pink-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 border border-slate-700"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Reset
                        </button>
                        <button
                            onClick={submit}
                            disabled={loading || !email || emojis.length !== 4}
                            className="flex-1 py-3 px-4 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-900/20"
                        >
                            {loading ? 'Processing...' : isLoginMode ? 'Unlock' : 'Register'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? "Don't have a story? Register" : 'Already tell a story? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeventhBoxScreen;
