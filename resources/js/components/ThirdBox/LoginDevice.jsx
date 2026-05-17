import React, { useState, useEffect } from 'react';
import { postJson } from '../../utils/api';
import { Mail, Monitor, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const LoginDevice = ({ onToggleMode, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    // We store the detected system states silently in the background
    const [capsLock, setCapsLock] = useState(false);

    useEffect(() => {
        // Detect Caps Lock when user types their email
        const handleKeyDown = (e) => {
            if (e.getModifierState) {
                setCapsLock(e.getModifierState('CapsLock'));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyDown);
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: 'Detecting system state...' });

        try {
            // Because browsers physically cannot read OS brightness and volume, we simulate reading 
            // the device's physical state by pulling it from local storage (where it was set during registration)
            // If the user registered on this device, these will match.
            // If they are on a different device, or didn't set it, they will default to 50 and fail the strict check!
            const detectedBrightness = parseInt(localStorage.getItem('mock_device_brightness')) || 50;
            const detectedVolume = parseInt(localStorage.getItem('mock_device_volume')) || 50;

            const data = await postJson('/api/thirdbox/login', {
                email,
                brightness: detectedBrightness,
                volume: detectedVolume,
                caps_lock: capsLock
            });

            setStatus({ type: 'success', message: data.message || 'System Verified. Authentication Successful.' });
            setTimeout(() => {
                onLoginSuccess();
            }, 1500);
        } catch (error) {
            const errorMsg = error.message || 'Access Denied: Current device state does not match your saved profile.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 mb-4 ring-1 ring-amber-500/20">
                    <Monitor size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Automatic Login</h2>
                <p className="text-slate-400">Your device state will be verified silently.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 text-center">
                    <p className="text-sm text-slate-300">
                        We will securely check your <strong>Screen Brightness</strong>, <strong>System Volume</strong>, and <strong>Caps Lock</strong>. No sliders required.
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
                    disabled={isLoading || !email}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
                >
                    {isLoading ? 'Verifying System...' : 'Login Now'} <ArrowRight size={18} />
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    Need to configure this device?{' '}
                    <button onClick={onToggleMode} className="text-amber-400 font-medium hover:text-amber-300 hover:underline transition-all">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginDevice;
