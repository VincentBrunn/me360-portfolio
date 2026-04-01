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
    //  36 animated SVG bezier curves × 2 mirrored groups
    // ══════════════════════════════════════════════════
    const heroBg = document.querySelector('.hero-bg');
    const allPaths = [];

    if (heroBg) {
        // Remove old canvas if present
        const oldCanvas = heroBg.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();

        const PATH_COUNT = 36;
        const svgNS = 'http://www.w3.org/2000/svg';

        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 1000 1000');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;overflow:visible;';
        heroBg.appendChild(svg);

        // Generate a smooth bezier path for index i
        function generatePathD(i, total, seed) {
            const yCenter = 500;
            const spread = 300;
            const t = i / total;
            const yDrift = (t - 0.5) * spread;

            const w1 = Math.sin(i * 0.8 + seed) * 90;
            const w2 = Math.cos(i * 1.3 + seed) * 70;
            const w3 = Math.sin(i * 0.5 + seed * 2) * 80;
            const w4 = Math.cos(i * 0.6 + seed) * 60;

            const x0 = -100;
            const y0 = yCenter + yDrift + w1;
            const cp1x = 220 + (i * 19) % 200;
            const cp1y = yCenter + yDrift - 140 + w2;
            const cp2x = 620 - (i * 14) % 140;
            const cp2y = yCenter + yDrift + 140 + w3;
            const x3 = 1100;
            const y3 = yCenter + yDrift + w4;

            return `M ${x0} ${y0} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x3} ${y3}`;
        }

        // Two mirrored groups
        for (let group = 0; group < 2; group++) {
            const g = document.createElementNS(svgNS, 'g');
            if (group === 1) {
                g.setAttribute('transform', 'translate(1000, 0) scale(-1, 1)');
            }
            svg.appendChild(g);

            for (let i = 0; i < PATH_COUNT; i++) {
                const path = document.createElementNS(svgNS, 'path');
                path.setAttribute('d', generatePathD(i, PATH_COUNT, group * 3.7));
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');

                // THICK strokes — range 1.5 to 6 (viewBox units)
                const strokeWidth = 1.5 + (i / PATH_COUNT) * 4.5;
                path.setAttribute('stroke-width', strokeWidth.toFixed(1));

                // Store opacity for color application
                // High contrast range: 0.08 to 0.40
                const baseOpacity = 0.08 + (i / PATH_COUNT) * 0.32;
                path.dataset.baseOpacity = baseOpacity.toFixed(3);

                g.appendChild(path);
                allPaths.push(path);
            }
        }

        // Set colors
        applyPathColors();

        // ── Animate ONLY stroke-dashoffset — NO opacity changes ──
        // Paths stay permanently visible at their base opacity.
        // Only the dash pattern slides along the curve.
        const styleEl = document.createElement('style');
        let css = '';

        allPaths.forEach((p, idx) => {
            const len = p.getTotalLength ? p.getTotalLength() : 2200;

            // Visible portion = 50% of path, gap = 50%
            p.style.strokeDasharray = `${len * 0.5} ${len * 0.5}`;

            const duration = 22 + (idx % 13) * 1.4;   // 22–40 s
            const delay = -(idx * 0.6);                // pre-stagger

            const name = `bgPath${idx}`;
            css += `
@keyframes ${name} {
  from { stroke-dashoffset: ${len.toFixed(0)}; }
  to   { stroke-dashoffset: ${(-len).toFixed(0)}; }
}
`;
            p.style.animation = `${name} ${duration.toFixed(1)}s linear ${delay.toFixed(1)}s infinite`;
        });

        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }


    // ── Path color helper — theme-aware ──
    function applyPathColors() {
        const isLight = document.documentElement.classList.contains('light-mode');
        // Dark: bright amber on near-black   Light: deep warm brown on cream
        const rgb = isLight ? '120, 90, 20' : '210, 175, 105';

        allPaths.forEach(p => {
            const a = parseFloat(p.dataset.baseOpacity);
            p.setAttribute('stroke', `rgba(${rgb}, ${a})`);
        });
    }

    window.applyPathColors = applyPathColors;

});
