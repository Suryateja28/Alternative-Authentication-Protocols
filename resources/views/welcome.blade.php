<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Alternative Auth Home</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body>
        <div id="root">
            <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#09090b;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;"> 
                <div style="max-width:680px;text-align:center;">
                    <h1 style="margin:0;font-size:clamp(2rem,4vw,3.5rem);font-weight:800;">Alternative Auth Home</h1>
                    <p style="margin:1rem 0 0;color:#94a3b8;font-size:1rem;line-height:1.7;">
                        This page uses a React/Vite front-end. If the screen is blank, make sure your assets are built and the dev server is running.
                    </p>
                    <p style="margin:0.75rem 0 0;color:#cbd5e1;font-size:0.95rem;">Run <code style="background:#0f172a;color:#7dd3fc;padding:0.2rem 0.4rem;border-radius:0.35rem;">npm run dev</code> or <code style="background:#0f172a;color:#7dd3fc;padding:0.2rem 0.4rem;border-radius:0.35rem;">npm run build</code> and refresh.</p>
                </div>
            </div>
        </div>
    </body>
</html>
