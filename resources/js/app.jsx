import './bootstrap';
import '../css/app.css';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    ArrowLeft,
    Award,
    Check,
    FileText,
    HelpCircle,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    Upload,
    Terminal as TerminalIcon,
    Cpu,
} from 'lucide-react';
import FirstBoxScreen from './components/FirstBox/FirstBoxScreen';
import SecondBoxScreen from './components/SecondBox/SecondBoxScreen';
import ThirdBoxScreen from './components/ThirdBox/ThirdBoxScreen';
import FourthBoxScreen from './components/FourthBox/FourthBoxScreen';
import FifthBoxScreen from './components/FifthBox/FifthBoxScreen';
import SeventhBoxScreen from './components/SeventhBox/SeventhBoxScreen';
import EighthBoxScreen from './components/EighthBox/EighthBoxScreen';
import NinthBoxScreen from './components/NinthBox/NinthBoxScreen';
import TenthBoxScreen from './components/TenthBox/TenthBoxScreen';

const homeBoxes = [
    {
        title: 'Box 1',
        description: 'Graph Spot Authentication',
        active: true,
    },
    {
        title: 'Box 2',
        description: 'Key Press Duration Auth',
        active: true,
    },
    {
        title: 'Box 3',
        description: 'Device State Auth',
        active: true,
    },
    {
        title: 'Box 4',
        description: 'Rhythm / Tap Protocol',
        active: true,
    },
    {
        title: 'Box 5',
        description: 'Color Sequence Protocol',
        active: true,
    },
    {
        title: 'Box 7',
        description: 'Emoji Story Auth',
        active: true,
    },
    {
        title: 'Box 8',
        description: 'Directional Sequence Protocol',
        active: true,
    },
    {
        title: 'Box 9',
        description: 'Pixel Grid Protocol',
        active: true,
    },
    {
        title: 'Box 10',
        description: 'Morse Code Protocol',
        active: true,
    },
];

const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

async function postJson(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.message || Object.values(data.errors || {}).flat()[0] || 'Request failed.';
        throw new Error(message);
    }

    return data;
}

async function postForm(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrf,
        },
        body: payload,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.message || Object.values(data.errors || {}).flat()[0] || 'Request failed.';
        throw new Error(message);
    }

    return data;
}

function CustomCursor() {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-screen"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        >
            <div className="w-full h-full border border-cyan-400/50 rounded-full animate-[spin_8s_linear_infinite]" />
            <div className="absolute w-6 h-6 border-[0.5px] border-fuchsia-500/50 rotate-45" />
            <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
        </div>
    );
}

function BootSequence({ onComplete }) {
    const [lines, setLines] = useState([]);

    React.useEffect(() => {
        const bootText = [
            "SYS.INIT_KERNEL...",
            "LOADING ALTERNATIVE_AUTH_MODULES: [GRAPH, RHYTHM, GRID, MORSE]",
            "ESTABLISHING SECURE PROTOCOLS...",
            "DECRYPTING PAYLOAD...",
            "BYPASSING TRADITIONAL CREDENTIALS...",
            "SYSTEM READY."
        ];

        let delay = 300;
        bootText.forEach((text, i) => {
            setTimeout(() => {
                setLines(prev => [...prev, text]);
                if (i === bootText.length - 1) {
                    setTimeout(onComplete, 900);
                }
            }, delay);
            delay += Math.random() * 200 + 200;
        });
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#050505] z-[10000] flex flex-col justify-center items-start p-10 sm:p-20 font-mono text-cyan-500 text-sm md:text-xl selection:bg-none pointer-events-none">
            <Cpu size={48} className="mb-8 text-cyan-600 animate-pulse" />
            {lines.map((line, i) => (
                <div key={i} className="mb-3 tracking-widest font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    <span className="text-fuchsia-500 mr-2">{'>'}</span> {line}
                </div>
            ))}
            <div className="w-3 h-6 bg-cyan-500 animate-pulse mt-2 shadow-[0_0_15px_#22d3ee]" />
        </div>
    );
}

function App() {
    const [screen, setScreen] = useState('home');
    const [booted, setBooted] = useState(false);
    const [logs, setLogs] = useState([
        { time: new Date().toLocaleTimeString(), text: 'SYSTEM BOOT SEQUENCE... OK', type: 'info' },
        { time: new Date().toLocaleTimeString(), text: 'ESTABLISHING SECURE CONNECTION... OK', type: 'info' },
        { time: new Date().toLocaleTimeString(), text: 'WAITING FOR OPERATOR INPUT...', type: 'warning' },
    ]);

    const addLog = (text, type = 'info') => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text, type }]);
    };

    const handleSetScreen = (newScreen) => {
        if (newScreen === 'home') addLog('NAVIGATING TO OVERVIEW DASHBOARD...', 'info');
        else addLog(`INITIALIZING AUTH PROTOCOL: [${newScreen.toUpperCase()}]...`, 'warn');
        setScreen(newScreen);
    };

    return (
        <>
            {!booted && <BootSequence onComplete={() => setBooted(true)} />}
            <CustomCursor />
            {/* CRT Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[9998] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />

            <main className={`min-h-screen bg-[#09090b] text-zinc-100 font-sans tracking-wide selection:bg-cyan-500/30 overflow-hidden relative flex transition-opacity duration-1000 cursor-crosshair ${booted ? 'opacity-100' : 'opacity-0'}`}>
                {/* Ambient Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-cyan-900/20 blur-[140px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-fuchsia-900/10 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
                </div>

                <div className="flex-1 h-screen overflow-y-auto relative z-10 custom-scrollbar">
                    {screen === 'home' ? (
                        <HomeScreen
                            onOpenFirstBox={() => handleSetScreen('first-box')}
                            onOpenSecondBox={() => handleSetScreen('second-box')}
                            onOpenThirdBox={() => handleSetScreen('third-box')}
                            onOpenFourthBox={() => handleSetScreen('fourth-box')}
                            onOpenFifthBox={() => handleSetScreen('fifth-box')}
                            onOpenSeventhBox={() => handleSetScreen('seventh-box')}
                            onOpenEighthBox={() => handleSetScreen('eighth-box')}
                            onOpenNinthBox={() => handleSetScreen('ninth-box')}
                            onOpenTenthBox={() => handleSetScreen('tenth-box')}
                            onOpenCertificateAuth={() => handleSetScreen('certificate-auth')}
                            addLog={addLog}
                        />
                    ) : screen === 'first-box' ? (
                        <FirstBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'second-box' ? (
                        <SecondBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'third-box' ? (
                        <ThirdBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'fourth-box' ? (
                        <FourthBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'fifth-box' ? (
                        <FifthBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'seventh-box' ? (
                        <SeventhBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'eighth-box' ? (
                        <EighthBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'ninth-box' ? (
                        <NinthBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : screen === 'tenth-box' ? (
                        <TenthBoxScreen onBack={() => handleSetScreen('home')} />
                    ) : (
                        <CertificateAuthenticationScreen onBack={() => handleSetScreen('home')} />
                    )}
                </div>

                {/* Live Security Terminal Sidebar */}
                <aside className="w-80 h-screen border-l border-white/10 bg-black/40 backdrop-blur-3xl hidden xl:flex flex-col z-20 relative shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
                    <div className="h-16 border-b border-white/10 flex items-center px-6 gap-3">
                        <TerminalIcon size={18} className="text-cyan-500" />
                        <h2 className="text-sm font-bold tracking-widest text-cyan-500 uppercase">Sys_Terminal</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end">
                        <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="opacity-50 tracking-tighter shrink-0">[{log.time}]</span>
                                    <span className={`${log.type === 'error' ? 'text-rose-500' : log.type === 'warn' ? 'text-amber-500' : 'text-cyan-400'}`}>
                                        {log.text}
                                    </span>
                                </div>
                            ))}
                            <div className="animate-pulse inline-block w-2 h-4 bg-cyan-500 mt-1" />
                        </div>
                    </div>
                </aside>
            </main>
        </>
    );
}

function HomeScreen({ onOpenFirstBox, onOpenSecondBox, onOpenThirdBox, onOpenFourthBox, onOpenFifthBox, onOpenSeventhBox, onOpenEighthBox, onOpenNinthBox, onOpenTenthBox, onOpenCertificateAuth, addLog }) {
    return (
        <section className="mx-auto max-w-6xl px-8 py-12">
            <header className="mb-12 border-b border-white/10 pb-10">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold tracking-widest text-cyan-400 uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <ShieldCheck size={16} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                    Alternative Auth Home v1.0
                </div>
                <h1 className="text-4xl font-black leading-tight sm:text-6xl tracking-tight text-white drop-shadow-xl">
                    Alternative <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Authentication</span> Home
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-cyan-200/80 sm:text-base">
                    A simple, visual homepage for the project that explains alternative authentication methods. Explore nine interactive security boxes and certificate verification in a clean UI.
                </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {homeBoxes.map((box, index) => {
                    let clickHandler = undefined;
                    if (box.title === 'Box 1') clickHandler = onOpenFirstBox;
                    if (box.title === 'Box 2') clickHandler = onOpenSecondBox;
                    if (box.title === 'Box 3') clickHandler = onOpenThirdBox;
                    if (box.title === 'Box 4') clickHandler = onOpenFourthBox;
                    if (box.title === 'Box 5') clickHandler = onOpenFifthBox;
                    if (box.title === 'Box 7') clickHandler = onOpenSeventhBox;
                    if (box.title === 'Box 8') clickHandler = onOpenEighthBox;
                    if (box.title === 'Box 9') clickHandler = onOpenNinthBox;
                    if (box.title === 'Box 10') clickHandler = onOpenTenthBox;
                    // Example: if (box.title === 'Box 0') clickHandler = onOpenCertificateAuth; 

                    return (
                        <HomeBox
                            key={box.title}
                            box={box}
                            number={index + 1}
                            onClick={clickHandler}
                        />
                    );
                })}
            </section>
        </section>
    );
}

function HomeBox({ box, number, onClick }) {
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
        if (!box.active) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.4s ease-out'
        });
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!box.active}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className={`flex min-h-[280px] flex-col justify-between rounded-2xl p-6 text-left relative overflow-hidden group border transition-all ${box.active
                ? 'border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] z-10'
                : 'border-white/5 text-white/30 opacity-60'
                }`}
        >
            {/* Unique Background Image per box */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0 bg-[#09090b]">
                <img
                    src={`https://picsum.photos/seed/cyberauth${number}/600/400`}
                    alt=""
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                {/* Lighter Gradient Masks for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
                <div className="absolute inset-0 bg-cyan-900/30 mix-blend-color group-hover:bg-cyan-500/10 transition-colors duration-500" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            <span className="flex items-start justify-between gap-3 relative z-10">
                <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-b ${box.active ? 'from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 text-cyan-400' : 'from-white/10 to-white/5 border border-white/10'}`}>
                    {box.active ? <Award size={22} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> : <LockKeyhole size={22} />}
                </span>
                <span className="text-5xl font-black text-white/5 select-none transition-all group-hover:text-cyan-500/10 group-hover:-translate-y-2 group-hover:translate-x-2">
                    {number}
                </span>
            </span>
            <span className="relative z-10 mt-12 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5">
                <span className={`block text-xl font-bold tracking-wide ${box.active ? 'text-white' : 'text-white/50'}`}>{box.title}</span>
                {box.description ? (
                    <span className="mt-2 block text-sm leading-relaxed text-cyan-200/70 font-medium">{box.description}</span>
                ) : null}
            </span>
        </button>
    );
}

function CertificateAuthenticationScreen({ onBack }) {
    const [certificateText, setCertificateText] = useState('');
    const [certificateFile, setCertificateFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [challenge, setChallenge] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const canGenerate = certificateText.trim().length >= 30 || Boolean(certificateFile);

    async function handleFileUpload(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setCertificateFile(file);
        setFileName(file.name);
        setResult(null);
        setChallenge(null);
        setAnswers({});

        if (file.type === 'application/pdf') {
            setResult({
                type: 'success',
                message: 'PDF selected. Click Generate questions and the server will read it.',
            });
            return;
        }

        const text = await file.text();
        setCertificateText(text);
    }

    async function generateQuestions(event) {
        event.preventDefault();

        if (!canGenerate) {
            setResult({ type: 'error', message: 'Add at least 30 characters from the certificate first.' });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const payload = new FormData();

            if (certificateFile) {
                payload.append('certificate_file', certificateFile);
            }

            if (certificateText.trim()) {
                payload.append('certificate_text', certificateText);
            }

            const data = await postForm('/api/certificate-challenge', payload);

            setChallenge(data);
            setAnswers({});
        } catch (error) {
            setResult({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    }

    async function verifyAnswers(event) {
        event.preventDefault();

        if (!challenge) {
            setResult({ type: 'error', message: 'Generate certificate questions first.' });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const data = await postJson('/api/certificate-verify', {
                challenge_id: challenge.challenge_id,
                answers,
            });

            setResult({
                type: data.passed ? 'success' : 'error',
                message: `${data.message} ${data.correct_count}/${data.total} answers correct.`,
                results: data.results,
            });
            alert(data.passed ? 'Correct' : 'Wrong');
        } catch (error) {
            setResult({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    }

    function resetChallenge() {
        setChallenge(null);
        setAnswers({});
        setResult(null);
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
            <button
                type="button"
                onClick={onBack}
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 font-semibold text-zinc-800 hover:bg-zinc-100"
            >
                <ArrowLeft size={18} />
                Home
            </button>

            <header className="mb-8 border-b border-zinc-200 pb-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800">
                    <Award size={16} />
                    Box 0
                </div>
                <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
                    Certificate Q&A authentication
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
                    Add certificate text, generate questions from it, then answer every question correctly to unlock the correct password popup.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <form onSubmit={generateQuestions} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold">Certificate input</h2>
                            <p className="mt-1 text-sm leading-6 text-zinc-600">Upload a text certificate or paste the certificate content.</p>
                        </div>
                        <FileText className="text-cyan-700" size={28} />
                    </div>

                    <label className="mt-5 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-4 text-center hover:bg-cyan-100">
                        <Upload className="text-cyan-800" size={26} />
                        <span className="mt-2 text-sm font-bold text-cyan-950">{fileName || 'Upload certificate text file'}</span>
                        <span className="mt-1 text-xs font-semibold text-cyan-800">PDF and TXT files work directly.</span>
                        <input type="file" accept=".txt,.text,.csv,.pdf" onChange={handleFileUpload} className="sr-only" />
                    </label>

                    <label className="mt-5 block">
                        <span className="text-sm font-semibold text-zinc-700">Certificate text</span>
                        <textarea
                            value={certificateText}
                            onChange={(event) => {
                                setCertificateText(event.target.value);
                                setCertificateFile(null);
                                setFileName('');
                                resetChallenge();
                            }}
                            className="mt-2 min-h-64 w-full resize-y rounded-lg border border-zinc-300 px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600"
                            placeholder="Paste certificate text here, for example: This is to certify that..."
                        />
                    </label>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                            type="submit"
                            disabled={loading || !canGenerate}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                        >
                            <HelpCircle size={18} />
                            {loading ? 'Generating...' : 'Generate questions'}
                        </button>
                        <button
                            type="button"
                            onClick={resetChallenge}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-800 hover:bg-zinc-100"
                        >
                            <RefreshCw size={18} />
                            Reset
                        </button>
                    </div>
                </form>

                <form onSubmit={verifyAnswers} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Certificate questions</h2>
                            <p className="mt-1 text-sm leading-6 text-zinc-600">
                                {challenge ? 'Answer the generated questions to verify the certificate password.' : 'Questions will appear after certificate text is generated.'}
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !challenge}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                        >
                            <Check size={18} />
                            {loading ? 'Checking...' : 'Check answers'}
                        </button>
                    </div>

                    {challenge ? (
                        <div className="mt-5 space-y-4">
                            {challenge.questions.map((item, index) => {
                                const questionResult = result?.results?.find((entry) => entry.id === item.id);

                                return (
                                    <label
                                        key={item.id}
                                        className={`block rounded-lg border p-4 ${questionResult?.correct === true
                                            ? 'border-emerald-200 bg-emerald-50'
                                            : questionResult?.correct === false
                                                ? 'border-rose-200 bg-rose-50'
                                                : 'border-zinc-200 bg-zinc-50'
                                            }`}
                                    >
                                        <span className="text-xs font-bold uppercase text-zinc-500">Question {index + 1}</span>
                                        <span className="mt-1 block text-base font-bold text-zinc-950">{item.question}</span>
                                        <span className="mt-1 block text-sm text-zinc-600">{item.hint}</span>
                                        <input
                                            type="text"
                                            value={answers[item.id] || ''}
                                            onChange={(event) => setAnswers({ ...answers, [item.id]: event.target.value })}
                                            className="mt-3 min-h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 outline-none focus:border-cyan-600"
                                            placeholder="Type your answer"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-5 grid min-h-96 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 text-center">
                            <div className="max-w-md">
                                <Award className="mx-auto text-zinc-400" size={42} />
                                <p className="mt-3 text-sm font-semibold leading-6 text-zinc-500">
                                    Add certificate content on the left and generate questions. This screen will become the password challenge.
                                </p>
                            </div>
                        </div>
                    )}

                    {result ? (
                        <p className={`mt-5 rounded-lg border px-4 py-3 text-sm font-semibold ${result.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-rose-200 bg-rose-50 text-rose-800'
                            }`}>
                            {result.message}
                        </p>
                    ) : null}
                </form>
            </div>
        </section>
    );
}

createRoot(document.getElementById('root')).render(<App />);
