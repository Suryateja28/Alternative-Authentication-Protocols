import React, { useState } from 'react';
import { Target, ArrowLeft, RefreshCw, Grid } from 'lucide-react';

const NinthBoxScreen = ({ onBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [gridState, setGridState] = useState(Array(9).fill(false));
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        handleReset();
    };

    const togglePixel = (index) => {
        const newGrid = [...gridState];
        newGrid[index] = !newGrid[index];
        setGridState(newGrid);
        setMessage('');
    };

    const handleReset = () => {
        setGridState(Array(9).fill(false));
        setMessage('');
    };

    const submit = async () => {
        if (!email) {
            setMessage('Email is required');
            return;
        }

        const activePixels = gridState.filter(Boolean).length;
        if (activePixels === 0) {
            setMessage('Please toggle at least one pixel on the grid.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = isLoginMode ? '/api/ninthbox/login' : '/api/ninthbox/register';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ email, grid_state: gridState }),
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
                    <p className="text-slate-400 mb-8">You have successfully authenticated using your Pixel Grid Pattern.</p>
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
                className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border border-teal-700/50 bg-teal-900/40 px-4 py-2 font-semibold text-teal-100 hover:bg-teal-800/60 transition-colors z-20 backdrop-blur-xl"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-teal-900/30 flex items-center justify-center mb-4 ring-1 ring-teal-500/30">
                        <Grid className="text-teal-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isLoginMode ? 'Login with Pattern' : 'Register Pattern'}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Toggle the squares to draw an invisible pixel pattern to {isLoginMode ? 'login' : 'register'}.
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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-text"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex justify-center">
                        <div className="grid grid-cols-3 gap-2 w-48 h-48">
                            {gridState.map((isActive, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => togglePixel(index)}
                                    className={`w-full h-full rounded-lg transition-colors border shadow-sm ${isActive
                                            ? 'bg-teal-500 border-teal-400 shadow-teal-500/50 scale-95'
                                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                        }`}
                                />
                            ))}
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
                            disabled={loading || !email || gridState.filter(Boolean).length === 0}
                            className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/20"
                        >
                            {loading ? 'Processing...' : isLoginMode ? 'Unlock' : 'Register'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? "Don't have a pattern? Register" : 'Already have a pattern? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NinthBoxScreen;
