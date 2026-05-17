import React, { useRef, useEffect, useState } from 'react';

const GraphCanvas = ({ onClicksComplete, maxClicks = 4, resetSignal }) => {
    const canvasRef = useRef(null);
    const [clicks, setClicks] = useState([]);

    useEffect(() => {
        if (resetSignal !== undefined) {
            setClicks([]);
        }
    }, [resetSignal]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#334155'; // slate-700
        ctx.lineWidth = 1;

        const gridSize = 40;
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#94a3b8'; // slate-400
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2); // X-axis
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height); // Y-axis
        ctx.stroke();

        // Draw clicks
        clicks.forEach((click, index) => {
            ctx.beginPath();
            ctx.arc(click.x, click.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6'; // blue-500
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw number
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((index + 1).toString(), click.x, click.y);
        });

    }, [clicks]);

    const handleCanvasClick = (e) => {
        if (clicks.length >= maxClicks) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate scale factors in case canvas is resized via CSS
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Calculate exact coordinates relative to internal canvas resolution (400x400)
        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);

        const newClicks = [...clicks, { x, y }];
        setClicks(newClicks);

        if (newClicks.length === maxClicks) {
            onClicksComplete(newClicks);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-crosshair touch-none"
            />
            {clicks.length < maxClicks && (
                <div className="absolute top-4 left-0 w-full text-center pointer-events-none">
                    <span className="bg-slate-900/80 text-slate-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        Click {maxClicks - clicks.length} more {maxClicks - clicks.length === 1 ? 'spot' : 'spots'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default GraphCanvas;
