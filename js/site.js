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
            updatePathColors();
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


    // ── Background Paths Animation (homepage hero only) ──
    const heroBg = document.querySelector('.hero-bg');
    let allPaths = [];

    if (heroBg) {
        // Remove existing canvas
        const oldCanvas = heroBg.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();

        const PATH_COUNT = 36;
        const svgNS = 'http://www.w3.org/2000/svg';

        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 1000 1000');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;';
        heroBg.appendChild(svg);

        // Generate a smooth bezier path for index i
        function generatePathD(i, total, groupOffset) {
            const yCenter = 500;
            const verticalSpread = 250;
            const t = i / total;
            const yDrift = (t - 0.5) * verticalSpread;

            // Organic variation per path
            const wave1 = Math.sin(i * 0.8 + groupOffset) * 80;
            const wave2 = Math.cos(i * 1.3 + groupOffset) * 60;
            const wave3 = Math.sin(i * 0.5 + groupOffset * 2) * 70;
            const wave4 = Math.cos(i * 0.6 + groupOffset) * 50;

            const x0 = -50;
            const y0 = yCenter + yDrift + wave1;
            const cp1x = 200 + (i * 17) % 180;
            const cp1y = yCenter + yDrift - 120 + wave2;
            const cp2x = 650 - (i * 13) % 120;
            const cp2y = yCenter + yDrift + 120 + wave3;
            const x3 = 1050;
            const y3 = yCenter + yDrift + wave4;

            return `M ${x0} ${y0} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x3} ${y3}`;
        }

        // Two mirrored groups for symmetry
        for (let group = 0; group < 2; group++) {
            const g = document.createElementNS(svgNS, 'g');
            if (group === 1) {
                g.setAttribute('transform', 'translate(1000, 0) scale(-1, 1)');
            }
            svg.appendChild(g);

            for (let i = 0; i < PATH_COUNT; i++) {
                const path = document.createElementNS(svgNS, 'path');
                const d = generatePathD(i, PATH_COUNT, group * 3.7);
                path.setAttribute('d', d);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');

                // Progressive stroke width and base opacity for depth
                const strokeWidth = 0.3 + (i / PATH_COUNT) * 1.5;
                const baseOpacity = 0.02 + (i / PATH_COUNT) * 0.15;

                path.setAttribute('stroke-width', strokeWidth.toFixed(2));
                path.dataset.baseOpacity = baseOpacity.toFixed(3);
                path.dataset.globalIndex = allPaths.length;

                g.appendChild(path);
                allPaths.push(path);
            }
        }

        // Apply stroke colors based on current theme
        updatePathColors();

        // Animate via CSS keyframes — per-path unique timings
        const styleEl = document.createElement('style');
        let css = '';

        allPaths.forEach((p, idx) => {
            const totalLength = p.getTotalLength ? p.getTotalLength() : 2000;
            const dashVisible = totalLength * 0.4;
            const dashGap = totalLength * 0.6;
            const duration = 20 + (idx % 15) * 1.2; // 20–38s
            const delay = -(idx * 0.7); // negative = pre-stagger

            p.style.strokeDasharray = `${dashVisible} ${dashGap}`;
            p.style.strokeDashoffset = `${totalLength}`;

            const name = `bgPath${idx}`;
            css += `
@keyframes ${name} {
  0%   { stroke-dashoffset: ${totalLength}; opacity: 0; }
  25%  { opacity: 1; }
  75%  { opacity: 1; }
  100% { stroke-dashoffset: ${-totalLength}; opacity: 0; }
}
`;
            p.style.animation = `${name} ${duration.toFixed(1)}s ease-in-out ${delay.toFixed(1)}s infinite`;
        });

        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    // Color updater — called on init and on theme toggle
    function updatePathColors() {
        const isLight = document.documentElement.classList.contains('light-mode');
        const rgb = isLight ? '158, 124, 46' : '200, 164, 94';

        allPaths.forEach(p => {
            const opacity = parseFloat(p.dataset.baseOpacity);
            p.setAttribute('stroke', `rgba(${rgb}, ${opacity})`);
        });
    }

    // Expose globally so the toggle click handler can call it
    window.updatePathColors = updatePathColors;

});
