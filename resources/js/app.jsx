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
} from 'lucide-react';
import FirstBoxScreen from './components/FirstBox/FirstBoxScreen';
import SecondBoxScreen from './components/SecondBox/SecondBoxScreen';
import ThirdBoxScreen from './components/ThirdBox/ThirdBoxScreen';

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
        description: '',
        active: false,
    },
    {
        title: 'Box 5',
        description: '',
        active: false,
    },
    {
        title: 'Box 6',
        description: '',
        active: false,
    },
    {
        title: 'Box 7',
        description: '',
        active: false,
    },
    {
        title: 'Box 8',
        description: '',
        active: false,
    },
    {
        title: 'Box 9',
        description: '',
        active: false,
    },
    {
        title: 'Box 10',
        description: '',
        active: false,
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

function App() {
    const [screen, setScreen] = useState('home');

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-950">
            {screen === 'home' ? (
                <HomeScreen 
                    onOpenFirstBox={() => setScreen('first-box')} 
                    onOpenSecondBox={() => setScreen('second-box')} 
                    onOpenThirdBox={() => setScreen('third-box')}
                    onOpenCertificateAuth={() => setScreen('certificate-auth')}
                />
            ) : screen === 'first-box' ? (
                <FirstBoxScreen onBack={() => setScreen('home')} />
            ) : screen === 'second-box' ? (
                <SecondBoxScreen onBack={() => setScreen('home')} />
            ) : screen === 'third-box' ? (
                <ThirdBoxScreen onBack={() => setScreen('home')} />
            ) : (
                <CertificateAuthenticationScreen onBack={() => setScreen('home')} />
            )}
        </main>
    );
}

function HomeScreen({ onOpenFirstBox, onOpenSecondBox, onOpenThirdBox, onOpenCertificateAuth }) {
    return (
        <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
            <header className="mb-8 border-b border-zinc-200 pb-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800">
                    <ShieldCheck size={16} />
                    Security project
                </div>
                <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
                    Alternative to traditional credential based authentication
                </h1>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {homeBoxes.map((box, index) => {
                    let clickHandler = undefined;
                    if (box.title === 'Box 1') clickHandler = onOpenFirstBox;
                    if (box.title === 'Box 2') clickHandler = onOpenSecondBox;
                    if (box.title === 'Box 3') clickHandler = onOpenThirdBox;
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
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!box.active}
            className={`flex min-h-56 flex-col justify-between rounded-lg border p-5 text-left transition ${
                box.active
                    ? 'border-cyan-500 bg-white shadow-sm hover:bg-cyan-50'
                    : 'border-zinc-200 bg-white text-zinc-500'
            }`}
        >
            <span className="flex items-start justify-between gap-3">
                <span className={`grid h-12 w-12 place-items-center rounded-lg ${box.active ? 'bg-cyan-100 text-cyan-800' : 'bg-zinc-100 text-zinc-500'}`}>
                    {box.active ? <Award size={24} /> : <LockKeyhole size={24} />}
                </span>
                <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${box.active ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    {number}
                </span>
            </span>
            <span>
                <span className="block text-lg font-bold text-zinc-950">{box.title}</span>
                {box.description ? (
                    <span className="mt-2 block text-sm leading-6 text-zinc-600">{box.description}</span>
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
                                        className={`block rounded-lg border p-4 ${
                                            questionResult?.correct === true
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
                        <p className={`mt-5 rounded-lg border px-4 py-3 text-sm font-semibold ${
                            result.type === 'success'
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
