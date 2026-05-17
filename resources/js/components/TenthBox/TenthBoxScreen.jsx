import React, { useState, useRef } from 'react';
import { Target, ArrowLeft, RefreshCw, Radio } from 'lucide-react';

const TenthBoxScreen = ({ onBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [morseCode, setMorseCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Use a ref to hold start time for duration tracking
    const pressStartTime = useRef(0);
    const [isPressing, setIsPressing] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        handleReset();
    };

    const handlePointerDown = () => {
        pressStartTime.current = Date.now();
        setIsPressing(true);
    };

    const handlePointerUp = () => {
        if (!pressStartTime.current) return;

        const duration = Date.now() - pressStartTime.current;
        setIsPressing(false);
        pressStartTime.current = 0;

        // Less than 300ms = dot, otherwise dash
        const symbol = duration < 300 ? '.' : '-';

        if (morseCode.length < 15) {
            setMorseCode(prev => prev + symbol);
        }
        setMessage('');
    };

    const handleReset = () => {
        setMorseCode('');
        setMessage('');
    };

    const submit = async () => {
        if (!email) {
            setMessage('Email is required');
            return;
        }
        if (morseCode.length < 3) {
            setMessage('Morse code must have at least 3 symbols');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const url = isLoginMode ? '/api/tenthbox/login' : '/api/tenthbox/register';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ email, morse_code: morseCode }),
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
                    <p className="text-slate-400 mb-8">You have successfully authenticated using the Morse Code Protocol.</p>
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
                className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border border-red-700/50 bg-red-900/40 px-4 py-2 font-semibold text-red-100 hover:bg-red-800/60 transition-colors z-20 backdrop-blur-xl"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4 ring-1 ring-red-500/30">
                        <Radio className="text-red-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isLoginMode ? 'Login with Morse' : 'Register Morse Code'}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Tap short for dots (•) and hold for dashes (—) to generate your password.
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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-text"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/50 rounded-xl p-4 border border-slate-700 min-h-[70px]">
                        <span className="text-sm font-medium text-slate-400 mr-2">Signal:</span>
                        <div className="flex gap-2 flex-wrap justify-end text-red-400 font-bold tracking-widest text-2xl">
                            {morseCode || <span className="text-slate-600 text-sm font-normal">No signal yet...</span>}
                        </div>
                    </div>

                    <button
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp} // Handle cases where mouse drags off button
                        className={`w-full aspect-video rounded-xl flex items-center justify-center transition-all select-none shadow-lg border-2 ${isPressing
                                ? 'bg-red-500 border-red-400 scale-95 shadow-red-500/50 text-white'
                                : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-300 shadow-black/50'
                            }`}
                        style={{ touchAction: 'none' }} // Prevents zoom/scroll on mobile when tapping
                    >
                        <span className="text-xl font-bold uppercase tracking-widest">
                            {isPressing ? 'Transmitting...' : 'Press Key'}
                        </span>
                    </button>

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
                            disabled={loading || !email || morseCode.length < 3}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                        >
                            {loading ? 'Processing...' : isLoginMode ? 'Unlock' : 'Register'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? "Don't have a code? Register" : 'Already have a code? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenthBoxScreen;
