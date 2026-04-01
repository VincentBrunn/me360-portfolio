/* ═══════════════════════════════════════════════════
   ME360 Portfolio — Shared Scripts
   Handles: scroll reveal, nav hide-on-scroll, hero canvas, theme toggle
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Theme toggle ──
    // Apply saved theme immediately (also handled by inline class in HTML for flash prevention)
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
        // Find or create a .nav-right wrapper for the right-side items
        let navRight = nav.querySelector('.nav-right');
        if (!navRight) {
            // Wrap the existing right-side link in .nav-right and append toggle
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
        });
    }


    // ── Scroll reveal (works on both pages) ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger cards on homepage, instant reveal on project pages
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

    // Observe project cards on homepage
    document.querySelectorAll('.project-card').forEach(el => revealObserver.observe(el));
    // Observe article children on project pages
    document.querySelectorAll('.article > *').forEach(el => revealObserver.observe(el));


    // ── Nav hide on scroll down, show on scroll up ──
    if (nav) {
        let lastScroll = 0;
        const SCROLL_THRESHOLD = 80; // px before nav hides

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Always show nav at top of page
            if (currentScroll < SCROLL_THRESHOLD) {
                nav.classList.remove('nav-hidden');
                lastScroll = currentScroll;
                return;
            }

            // Scrolling down → hide
            if (currentScroll > lastScroll) {
                nav.classList.add('nav-hidden');
            }
            // Scrolling up → show
            else {
                nav.classList.remove('nav-hidden');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }


    // ── Hero canvas animation (only runs if canvas exists) ──
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, particles;
        const PARTICLE_COUNT = 50;
        const MAX_DIST = 140;

        function resize() {
            w = canvas.width = canvas.offsetWidth * devicePixelRatio;
            h = canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * (w / devicePixelRatio),
                    y: Math.random() * (h / devicePixelRatio),
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        // Read particle color from the current accent — adapts to theme
        function getParticleColor() {
            const isLight = document.documentElement.classList.contains('light-mode');
            // Slightly different alpha ranges for readability in each mode
            return isLight
                ? { r: 158, g: 124, b: 46, lineAlpha: 0.18, dotAlphaBase: 0.3 }
                : { r: 200, g: 164, b: 94, lineAlpha: 0.12, dotAlphaBase: 0.2 };
        }

        function draw() {
            const cw = w / devicePixelRatio;
            const ch = h / devicePixelRatio;
            ctx.clearRect(0, 0, cw, ch);

            const pc = getParticleColor();

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * pc.lineAlpha;
                        ctx.strokeStyle = `rgba(${pc.r}, ${pc.g}, ${pc.b}, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw & move particles
            particles.forEach(p => {
                ctx.fillStyle = `rgba(${pc.r}, ${pc.g}, ${pc.b}, ${p.opacity + pc.dotAlphaBase})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > cw) p.vx *= -1;
                if (p.y < 0 || p.y > ch) p.vy *= -1;
            });

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', () => { resize(); initParticles(); });
        resize();
        initParticles();
        draw();
    }

});
