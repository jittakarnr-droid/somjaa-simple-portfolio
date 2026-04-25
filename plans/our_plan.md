# Portfolio Website Plan: "Somjaa" (Product Manager)

## Objective
Create a modern, clean, and functional portfolio website hosted on GitHub Pages, showcasing experience as a Product Manager.

## Design Specifications
- **Typography:** JetBrains Mono (monospaced, modern, professional).
- **Style:** Minimalist, clean, modern theme.
- **Color Palette:** High-contrast, monochromatic (e.g., black background with white text, or deep gray/white).
- **Hero Section:** Prominent display of "Somjaa" + professional tagline.

## Implementation Steps

### 1. Project Setup
- [ ] Initialize repository and file structure (`index.html`, `style.css`, `script.js`).

### 2. Development (Local)
- [ ] **HTML Structure (`index.html`):**
    - Semantic HTML5 (header, main, section, footer).
    - Meta tags for viewport optimization.
    - Font link: `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">`.
    - Hero: `<section id="hero">` containing `<h1>` (Somjaa) and `<p>` (Tagline).
    - Projects: `<section id="projects">` using `grid` layout with 3 project `<article>` cards.
    - Contact: `<footer>` with `<a>` links for Email, LinkedIn, and GitHub.
- [ ] **Styling (`style.css`):**
    - Reset browser defaults (`box-sizing: border-box`, `margin: 0`).
    - Body: Set global `font-family: 'JetBrains Mono', monospace;`, line-height, and background/text colors.
    - Layout: Use `CSS Grid` for the project cards with `gap: 2rem` and responsive columns (`repeat(auto-fit, minmax(300px, 1fr))`).
    - Accessibility: Ensure sufficient color contrast and focus states for links (`:focus { outline: 2px solid ... }`).
- [ ] **Interactivity (`script.js`):**
    - (Optional) Add smooth scrolling for navigation.
    - (Optional) Basic hover effects or simple animations if required.

### 3. Deployment
- [ ] Commit and push code to the `main` branch.
- [ ] Enable GitHub Pages in repository settings pointing to `main` / `/ (root)`.

## Verification
- [ ] Lighthouse audit: Ensure accessibility score > 90.
- [ ] Font rendering: Verify JetBrains Mono loads correctly.
- [ ] Responsiveness: Check mobile (320px) and desktop (1200px+) layouts.
- [ ] Functionality: Test all outbound links (LinkedIn, Email, etc.).
