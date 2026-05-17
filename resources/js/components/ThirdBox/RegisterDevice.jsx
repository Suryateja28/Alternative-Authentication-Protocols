import React, { useState, useEffect } from 'react';
import { postJson } from '../../utils/api';
import { Mail, Monitor, Sun, Volume2, Type, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterDevice = ({ onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [brightness, setBrightness] = useState(parseInt(localStorage.getItem('mock_device_brightness')) || 50);
    const [volume, setVolume] = useState(parseInt(localStorage.getItem('mock_device_volume')) || 50);
    const [capsLock, setCapsLock] = useState(false);
    
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Detect physical caps lock
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

    // Simulate modifying the "system settings" on this device
    const handleBrightnessChange = (e) => {
        const val = parseInt(e.target.value);
        setBrightness(val);
        localStorage.setItem('mock_device_brightness', val);
    };

    const handleVolumeChange = (e) => {
        const val = parseInt(e.target.value);
        setVolume(val);
        localStorage.setItem('mock_device_volume', val);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Save current state as the mock device state physically on this browser
            localStorage.setItem('mock_device_brightness', brightness);
            localStorage.setItem('mock_device_volume', volume);

            const data = await postJson('/api/thirdbox/register', {
                email,
                brightness,
                volume,
                caps_lock: capsLock
            });

            setStatus({ type: 'success', message: data.message || 'Device Configured Successfully' });
            setTimeout(() => {
                onToggleMode();
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 mb-4 ring-1 ring-amber-500/20">
                    <Monitor size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Configure Device</h2>
                <p className="text-slate-400">Set up your Device State Auth</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Brightness Slider */}
                <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Sun size={16} className="text-amber-400" />
                            System Screen Brightness
                        </label>
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md text-sm">
                            {brightness}%
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={brightness} 
                        onChange={handleBrightnessChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <p className="text-xs text-slate-500 text-center">Drag to simulate your device's actual brightness</p>
                </div>

                {/* Volume Slider */}
                <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Volume2 size={16} className="text-orange-400" />
                            System Audio Volume
                        </label>
                        <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-md text-sm">
                            {volume}%
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume} 
                        onChange={handleVolumeChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <p className="text-xs text-slate-500 text-center">Drag to simulate your device's actual volume</p>
                </div>

                {/* Caps Lock Toggle */}
                <div className="flex items-center justify-between bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Type size={16} className={capsLock ? "text-emerald-400" : "text-slate-500"} />
                        Caps Lock State
                    </label>
                    <button
                        type="button"
                        onClick={() => setCapsLock(!capsLock)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                            capsLock ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                capsLock ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
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
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Registering...' : 'Save Configuration'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    Already configured?{' '}
                    <button onClick={onToggleMode} className="text-amber-400 font-medium hover:text-amber-300 hover:underline transition-all">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterDevice;
