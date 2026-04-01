/* ═══════════════════════════════════════════════════
   ME360 Portfolio — Shared Scripts
   Handles: scroll reveal, nav hide-on-scroll, hero canvas
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

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
    const nav = document.querySelector('.topnav');
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

        function draw() {
            const cw = w / devicePixelRatio;
            const ch = h / devicePixelRatio;
            ctx.clearRect(0, 0, cw, ch);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * 0.12;
                        ctx.strokeStyle = `rgba(200, 164, 94, ${alpha})`;
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
                ctx.fillStyle = `rgba(200, 164, 94, ${p.opacity})`;
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
