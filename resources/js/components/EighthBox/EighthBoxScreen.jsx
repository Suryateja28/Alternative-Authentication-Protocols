import React, { useState } from 'react';
import { Target, ArrowLeft, RefreshCw, Navigation, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight } from 'lucide-react';

const EighthBoxScreen = ({ onBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [sequence, setSequence] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        handleReset();
    };

    const handlePress = (direction) => {
        if (sequence.length < 8) {
            setSequence([...sequence, direction]);
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
        if (sequence.length < 4) {
            setMessage('Please enter a sequence of at least 4 directions');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = isLoginMode ? '/api/eighthbox/login' : '/api/eighthbox/register';
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

    const getDirectionIcon = (dir) => {
        switch (dir) {
            case 'UP': return <ArrowUp size={16} />;
            case 'DOWN': return <ArrowDown size={16} />;
            case 'LEFT': return <ArrowLeftIcon size={16} />;
            case 'RIGHT': return <ArrowRight size={16} />;
            default: return null;
        }
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
                <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 ring-1 ring-emerald-500/20">
                        <Target size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Access Granted</h2>
                    <p className="text-slate-400 mb-8">You have successfully authenticated using the Directional Sequence Protocol.</p>
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
                className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border border-indigo-700/50 bg-indigo-900/40 px-4 py-2 font-semibold text-indigo-100 hover:bg-indigo-800/60 transition-colors z-20 backdrop-blur-xl"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center mb-4 ring-1 ring-indigo-500/30">
                        <Navigation className="text-indigo-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isLoginMode ? 'Login with Directions' : 'Register Directions'}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Enter a specific sequence of directions (4 to 8 moves).
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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-text"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/50 rounded-xl p-4 border border-slate-700 min-h-[70px]">
                        <span className="text-sm font-medium text-slate-400 mr-2">Sequence ({sequence.length}/8)</span>
                        <div className="flex gap-1 flex-wrap justify-end">
                            {sequence.map((dir, index) => (
                                <div
                                    key={index}
                                    className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700 text-indigo-300 flex items-center justify-center"
                                >
                                    {getDirectionIcon(dir)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-[200px] mx-auto">
                        <div className="col-start-2">
                            <button
                                onClick={() => handlePress('UP')}
                                disabled={sequence.length >= 8}
                                className="w-full aspect-square bg-slate-700 hover:bg-slate-600 active:bg-indigo-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-colors shadow-lg"
                            >
                                <ArrowUp size={28} />
                            </button>
                        </div>
                        <div className="col-start-1 row-start-2">
                            <button
                                onClick={() => handlePress('LEFT')}
                                disabled={sequence.length >= 8}
                                className="w-full aspect-square bg-slate-700 hover:bg-slate-600 active:bg-indigo-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-colors shadow-lg"
                            >
                                <ArrowLeftIcon size={28} />
                            </button>
                        </div>
                        <div className="col-start-3 row-start-2">
                            <button
                                onClick={() => handlePress('RIGHT')}
                                disabled={sequence.length >= 8}
                                className="w-full aspect-square bg-slate-700 hover:bg-slate-600 active:bg-indigo-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-colors shadow-lg"
                            >
                                <ArrowRight size={28} />
                            </button>
                        </div>
                        <div className="col-start-2 row-start-3">
                            <button
                                onClick={() => handlePress('DOWN')}
                                disabled={sequence.length >= 8}
                                className="w-full aspect-square bg-slate-700 hover:bg-slate-600 active:bg-indigo-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-colors shadow-lg"
                            >
                                <ArrowDown size={28} />
                            </button>
                        </div>
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
                            disabled={loading || !email || sequence.length < 4}
                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                        >
                            {loading ? 'Processing...' : isLoginMode ? 'Unlock' : 'Register'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? "Don't have a sequence? Register" : 'Already have a sequence? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EighthBoxScreen;
