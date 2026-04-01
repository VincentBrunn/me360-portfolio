/* ═══════════════════════════════════════════════════
   ME360 Portfolio — Shared Scripts
   Handles: scroll reveal, nav hide-on-scroll, hero background paths, theme toggle
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Theme toggle ──
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-mode');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-mode');
    }

    // Inject toggle button into every nav
    const nav = document.querySelector('.topnav');
    if (nav) {
        let navRight = nav.querySelector('.nav-right');
        if (!navRight) {
            const rightLink = nav.querySelector('a:last-child');
            navRight = document.createElement('div');
            navRight.classList.add('nav-right');
            if (rightLink && rightLink !== nav.querySelector('.site-name')) {
                nav.removeChild(rightLink);
                navRight.appendChild(rightLink);
            }
            nav.appendChild(navRight);
        }

        const toggle = document.createElement('button');
        toggle.classList.add('theme-toggle');
        toggle.setAttribute('aria-label', 'Toggle light/dark mode');
        toggle.innerHTML = `
            <svg class="toggle-icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <svg class="toggle-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <span class="toggle-knob"></span>
        `;
        navRight.appendChild(toggle);

        toggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            applyPathColors();
        });
    }


    // ── Scroll reveal (works on both pages) ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains('project-card')) {
                    const idx = [...el.parentElement.children].indexOf(el);
                    setTimeout(() => el.classList.add('visible'), idx * 120);
                } else {
                    el.classList.add('visible');
                }
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card').forEach(el => revealObserver.observe(el));
    document.querySelectorAll('.article > *').forEach(el => revealObserver.observe(el));


    // ── Nav hide on scroll down, show on scroll up ──
    if (nav) {
        let lastScroll = 0;
        const SCROLL_THRESHOLD = 80;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll < SCROLL_THRESHOLD) {
                nav.classList.remove('nav-hidden');
                lastScroll = currentScroll;
                return;
            }
            if (currentScroll > lastScroll) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }


    // ══════════════════════════════════════════════════
    //  Background Paths — homepage hero only
    //  Single-direction flow: left edge → wave down → exit bottom-right
    //  Paths fan out from left-center, arc downward avoiding the
    //  center text zone, and sweep out through the bottom-right.
    // ══════════════════════════════════════════════════
    const heroBg = document.querySelector('.hero-bg');
    const allPaths = [];

    if (heroBg) {
        const oldCanvas = heroBg.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();

        const PATH_COUNT = 36;
        const svgNS = 'http://www.w3.org/2000/svg';

        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 1000 1000');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;overflow:visible;';
        heroBg.appendChild(svg);

        // ── Path shape ──
        // Start: left edge, clustered around y ≈ 300–700 (mid-left)
        // Flow: sweeps right and downward in a wave
        // Avoid: center zone (~350-650 x, ~350-650 y) where text sits
        // Exit: bottom-right quadrant (x > 800, y > 750)
        //
        // Each path uses two cubic bezier segments (M + C + S)
        // to get the wave-then-sweep shape.

        function generatePathD(i, total) {
            const t = i / total;

            // ── Start point: left edge, spread vertically around center ──
            const x0 = -60 - Math.random() * 40;
            // Fan from y=250 to y=750, but cluster more toward middle
            const yStart = 300 + t * 400 + Math.sin(i * 1.1) * 80;

            // ── First control: pulls right and slightly up (the "wave crest") ──
            // Keep above center to arc over the text zone
            const cp1x = 150 + (i * 23) % 160;
            const cp1y = yStart - 80 - Math.cos(i * 0.9) * 60;

            // ── Second control: below center, pulling the curve downward ──
            // This is the "wave trough" — paths dip below the text zone
            const cp2x = 400 + (i * 17) % 180;
            const cp2y = yStart + 100 + t * 150 + Math.sin(i * 0.7) * 50;

            // ── Midpoint: right-of-center, well below text ──
            const mx = 600 + (i * 11) % 120;
            const my = 550 + t * 200 + Math.cos(i * 1.4) * 40;

            // ── Final sweep controls: pull toward bottom-right exit ──
            const cp3x = 750 + (i * 7) % 100;
            const cp3y = my + 80 + t * 60 + Math.sin(i * 0.6) * 30;

            // ── End point: off-screen bottom-right ──
            const xEnd = 1050 + Math.random() * 80;
            const yEnd = 850 + t * 200 + Math.cos(i * 0.8) * 50;

            return `M ${x0.toFixed(0)} ${yStart.toFixed(0)} `
                + `C ${cp1x.toFixed(0)} ${cp1y.toFixed(0)}, `
                +   `${cp2x.toFixed(0)} ${cp2y.toFixed(0)}, `
                +   `${mx.toFixed(0)} ${my.toFixed(0)} `
                + `S ${cp3x.toFixed(0)} ${cp3y.toFixed(0)}, `
                +   `${xEnd.toFixed(0)} ${yEnd.toFixed(0)}`;
        }

        // Single group — one direction only, no mirroring
        for (let i = 0; i < PATH_COUNT; i++) {
            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('d', generatePathD(i, PATH_COUNT));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');

            // Mid-weight strokes: 0.9 – 3.75 (halfway between old thin and thick)
            const strokeWidth = 0.9 + (i / PATH_COUNT) * 2.85;
            path.setAttribute('stroke-width', strokeWidth.toFixed(2));

            // Opacity range: 0.08 – 0.35
            const baseOpacity = 0.08 + (i / PATH_COUNT) * 0.27;
            path.dataset.baseOpacity = baseOpacity.toFixed(3);

            svg.appendChild(path);
            allPaths.push(path);
        }

        applyPathColors();

        // ── Animate stroke-dashoffset only (no opacity flicker) ──
        const styleEl = document.createElement('style');
        let css = '';

        allPaths.forEach((p, idx) => {
            const len = p.getTotalLength ? p.getTotalLength() : 2400;

            // Visible dash = 45% of path length
            p.style.strokeDasharray = `${(len * 0.45).toFixed(0)} ${(len * 0.55).toFixed(0)}`;

            const duration = 24 + (idx % 11) * 1.6;  // 24–41 s
            const delay = -(idx * 0.9);               // pre-stagger

            const name = `wave${idx}`;
            // Animate from fully offset (hidden) to negative (fully passed through)
            css += `@keyframes ${name}{from{stroke-dashoffset:${len.toFixed(0)}}to{stroke-dashoffset:${(-len).toFixed(0)}}}\n`;

            p.style.animation = `${name} ${duration.toFixed(1)}s linear ${delay.toFixed(1)}s infinite`;
        });

        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }


    // ── Path color helper — theme-aware ──
    function applyPathColors() {
        const isLight = document.documentElement.classList.contains('light-mode');
        const rgb = isLight ? '120, 90, 20' : '210, 175, 105';

        allPaths.forEach(p => {
            const a = parseFloat(p.dataset.baseOpacity);
            p.setAttribute('stroke', `rgba(${rgb}, ${a})`);
        });
    }

    window.applyPathColors = applyPathColors;

});
