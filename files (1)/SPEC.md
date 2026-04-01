# ME360 Portfolio — Site Spec

## Purpose
Portfolio website for ME360 Electromechanics (Spring 2026, Boston University). Serves as the submission format for 5 portfolio entries. Hosted on GitHub Pages. Design quality and visual polish are part of the grade.

## Architecture

### File structure
```
repo-root/
├── index.html              ← Homepage (hero + project grid)
├── css/
│   └── style.css           ← ALL styles (single source of truth)
├── js/
│   └── site.js             ← ALL scripts (scroll reveal, nav, hero canvas)
├── assets/                 ← Images, videos, PDFs
│   └── placeholder.svg
├── projects/
│   ├── project-01.html     ← Project pages (clone template for each)
│   ├── project-02.html
│   ├── project-03.html
│   ├── project-04.html
│   └── project-05.html
├── SPEC.md                 ← This file
└── README.md               ← Setup & content reference
```

### Key principle
`style.css` and `site.js` are the only files that control appearance and behavior. HTML files contain only content and structure. To change any visual aspect of the site, edit `style.css`. To change any interactive behavior, edit `site.js`. Never put `<style>` or `<script>` blocks in HTML files (except the KaTeX CDN onload attribute in project pages, which is required by KaTeX).

### Path conventions
- Homepage links to assets: `assets/...`, `css/...`, `js/...`
- Project pages link to assets: `../assets/...`, `../css/...`, `../js/...`

---

## Design System

### Color palette (dark theme)
| Token             | Value                        | Usage                    |
|-------------------|------------------------------|--------------------------|
| `--bg-primary`    | `#0a0a0a`                    | Page background          |
| `--bg-secondary`  | `#111111`                    | Code blocks, math blocks |
| `--bg-card`       | `#161616`                    | Cards, nav, file download|
| `--bg-card-hover` | `#1c1c1c`                    | Card hover state         |
| `--text-primary`  | `#e8e4de`                    | Headings, strong text    |
| `--text-secondary`| `#8a8680`                    | Body text, descriptions  |
| `--text-dim`      | `#5a5650`                    | Captions, meta, labels   |
| `--accent`        | `#c8a45e`                    | Gold accent — links, tags, highlights |
| `--accent-dim`    | `rgba(200, 164, 94, 0.15)`   | Tag backgrounds, callout bg |
| `--accent-glow`   | `rgba(200, 164, 94, 0.08)`   | Subtle glow effects      |
| `--border`        | `rgba(255, 255, 255, 0.06)`  | Borders, dividers        |

### Typography
| Token            | Font                        | Usage                         |
|------------------|-----------------------------|-------------------------------|
| `--font-display` | Instrument Serif            | h1, h2, card titles, nav name|
| `--font-body`    | DM Sans (300, 400, 500, 600)| Body text, h3, UI labels      |
| `--font-mono`    | JetBrains Mono (400, 500)   | Code, tags, meta labels, captions |

All fonts loaded from Google Fonts CDN. The font link must appear in every HTML `<head>`.

### Spacing conventions
- Article max-width: 720px
- Wide breakout max-width: 1000px
- Homepage grid max-width: 1100px
- Section padding: 2rem horizontal on desktop, 1.25rem on mobile
- Between content blocks: 2rem margin
- Between sections (h2): 3rem margin-top

### Visual effects
- **Grain overlay**: SVG noise texture via `body::before`, fixed position, opacity 0.04
- **Scroll reveal**: Elements start at `opacity: 0; transform: translateY(20px)`, get `.visible` class via IntersectionObserver. Project cards stagger by 120ms per card index.
- **Nav hide/show**: Nav gets `.nav-hidden` (translateY(-100%)) on scroll-down, removes on scroll-up. Always visible within 80px of page top.
- **Hero canvas**: Floating amber particle mesh on homepage only. 50 particles, connection lines within 140px. Canvas element must have id `heroCanvas` — site.js auto-detects and only runs the animation if the canvas exists.
- **Card hover**: translateY(-4px) lift, amber border glow, image scale(1.04)

---

## Content Blocks Reference

Every block that can appear inside `<article class="article">` on a project page:

### Section heading
```html
<h2>Section Title</h2>
```

### Paragraph
```html
<p>Text with <strong>bold</strong> and <code>inline code</code>.</p>
```

### Divider (thin amber line between sections)
```html
<div class="divider"></div>
```

### Single image with caption
```html
<figure>
    <img src="../assets/your-image.jpg" alt="Description">
    <figcaption>Fig N — Caption</figcaption>
</figure>
```

### Two images side-by-side
```html
<div class="image-grid">
    <figure>
        <img src="../assets/left.jpg" alt="Left">
        <figcaption>Fig Na — Caption</figcaption>
    </figure>
    <figure>
        <img src="../assets/right.jpg" alt="Right">
        <figcaption>Fig Nb — Caption</figcaption>
    </figure>
</div>
```

### Wide image (breaks out of 720px article width)
```html
<div class="wide">
    <figure>
        <img src="../assets/wide.jpg" alt="Description">
        <figcaption>Fig N — Caption</figcaption>
    </figure>
</div>
```

### Code block
```html
<div class="code-block">
    <div class="code-header">
        <span class="code-lang">Language</span>
        <span class="code-filename">filename.ext</span>
    </div>
    <pre><code>your code here</code></pre>
</div>
```

### LaTeX — display mode
```html
<div class="math-block">
    $$your equation here$$
</div>
```

### LaTeX — inline
Write `$F = ma$` directly inside any `<p>` tag.

### Video — YouTube
```html
<div class="video-embed">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
</div>
```

### Video — local file
```html
<div class="video-embed">
    <video controls src="../assets/demo.mp4"></video>
</div>
```

### File download
```html
<a href="../assets/file.pdf" class="file-download" download>
    <div class="file-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <polyline points="9 15 12 18 15 15"/>
        </svg>
    </div>
    <div class="file-info">
        <div class="file-name">Display Name — filename.pdf</div>
        <div class="file-size">PDF · 2.4 MB</div>
    </div>
</a>
```

### Callout / note box
```html
<div class="callout">
    <p><strong>Label:</strong> Your note here.</p>
</div>
```

---

## How to Add a New Project

1. Copy `projects/project-01.html` → `projects/project-0N.html`
2. Update `<title>` in `<head>`
3. Fill in the project header: meta (number + date), h1, subtitle, tags
4. Replace hero image src
5. Write content in `<article>` using blocks above
6. Update prev/next nav links
7. On `index.html`: update the corresponding card (title, description, tags, thumbnail, href)

---

## Changelog

| Date       | Change                                    |
|------------|-------------------------------------------|
| 2026-04-01 | v1.0 — Initial build. Dark amber theme, homepage + project template. Inline styles/scripts. |
| 2026-04-01 | v2.0 — Refactored to external style.css + site.js. Added persistent nav to homepage. Added nav hide-on-scroll behavior. |

---

## Future Enhancements (not yet implemented)
- [ ] Dark/light mode toggle (add `.light-mode` variable overrides in style.css + toggle button in site.js)
- [ ] Syntax highlighting for code blocks (add Prism.js or Highlight.js CDN)
- [ ] Image lightbox / zoom on click
- [ ] Reading progress bar on project pages

---

## Claude Project Instructions

When working on this site in the Claude Project, follow these rules:

1. **All style changes go in `style.css` only.** Never add inline styles or `<style>` blocks to HTML.
2. **All behavior changes go in `site.js` only.** Never add `<script>` blocks to HTML (KaTeX onload is the sole exception).
3. **When generating modified files, always output the complete file.** Do not use diffs or partial snippets — I need to be able to copy-paste the full file directly.
4. **Maintain the existing CSS variable system.** New colors or values should be added as new variables in `:root`, not hardcoded.
5. **Preserve the grain overlay, scroll reveal, and nav behavior** unless I specifically ask to change them.
6. **Image paths**: homepage uses `assets/...`, project pages use `../assets/...`. Never break this convention.
7. **Test both pages mentally** when making changes. A CSS change affects both homepage and project pages — flag if something would look wrong on either.
