# 🌌 Kiran Ganji — Personal Portfolio Website

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white)](https://github.com/kiranganji02/portfolio-website)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Modern_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> A modern, high-performance, and visually captivating personal portfolio website architected with vanilla web technologies and an interactive procedural 3D Three.js experience. Designed to showcase work across Artificial Intelligence, Computer Vision, Full-Stack Architectures, and Cloud Computing.

---

## 📑 Table of Contents
anscvjhbjabdckhlloooooo
- [Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🔍 Website Sections](#-website-sections)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🌐 Deployment](#-deployment)
- [🎨 Customization Guide](#-customization-guide)
- [📬 Connect With Me](#-connect-with-me)
- [📄 License](#-license)

---

## 🌟 Overview

This repository houses the source code for **Kiran Ganji's** official developer portfolio. The website blends clean typography, responsive design, dark/light theme persistence, dynamic scroll animations, and an interactive procedural 3D dragon hero canvas built using **Three.js**.

### 🎯 Core Objectives:
- Showcase technical projects in **Deep Learning**, **Computer Vision**, and **Full-Stack Development**.
- Provide a smooth, fluid user experience with zero runtime framework overhead (Pure HTML5, CSS3, Vanilla JS).
- Deliver an interactive 3D WebGL hero section with mouse tracking and click interactions.

---

## ✨ Key Features

- **🐉 Interactive Procedural 3D Dragon (Three.js)**:
  - Procedural PBR scale textures, striated horns, wing membrane physics, and segmented undulating tail.
  - Inverse-kinematic neck and head tracking that follows the mouse cursor.
  - Interactive click effect: triggers a roaring animation and a high-velocity particle fire burst.
  - Graceful fallback for devices with reduced motion preferences or unsupported WebGL.
- **🌗 Theme Toggle (Dark & Light Mode)**:
  - Instant theme switching with tailored contrast palettes, smooth transitions, and `localStorage` state persistence.
- **📱 100% Responsive & Mobile-Optimized**:
  - Custom sliding hamburger drawer navigation for touch devices with accessible ARIA semantics.
- **⚡ Scroll Enhancements**:
  - Live scroll-progress header indicator.
  - Smooth anchor link scrolling.
  - Intersection Observer-powered fade-in transitions and active navigation spy.
- **📬 Functional Contact Form**:
  - Form validation with a pre-configured `mailto:` fallback workflow.
- **🎨 Glassmorphism & Micro-Interactions**:
  - Polished badge glow effects, ticker marquee, hover cards, and gradient typography (`Inter Tight`).

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Core** | HTML5 (Semantic), CSS3 (Modern Custom Properties), Vanilla JavaScript (ES6+) |
| **3D Graphics** | [Three.js](https://threejs.org/) (WebGL Renderer, Shaders, Procedural Meshes & Particles) |
| **Typography** | [Google Fonts — Inter Tight](https://fonts.google.com/specimen/Inter+Tight) |
| **Icons & Assets** | Handcrafted inline SVGs & Unicode glyphs (zero external font icon bloat) |

---

## 📂 Project Structure

```text
portfolio/
├── index.html       # Main HTML markup with SEO metadata, semantic layout, and sections
├── style.css        # Global design tokens, dark/light themes, animations, and responsive rules
├── script.js       # App logic (theme toggle, scroll progress, IntersectionObservers, navigation)
├── three-hero.js    # Procedural 3D dragon WebGL canvas with physics, kinematics & fire particles
└── README.md        # Documentation and project overview
```

---

## 🔍 Website Sections

1. **Hero**: Headline, dynamic subtext, quick CTA actions, and the interactive procedural 3D dragon canvas.
2. **Stats Bar**: Highlights key competencies (Deep Learning, CGPA, Cloud & Web, Multi-language proficiency, Git certification).
3. **Marquee**: Infinite ticker showcasing core domain skills and keywords.
4. **My Story (`#about`)**: Narrative journey into computer science & design, AI/vision systems, and software engineering philosophy.
5. **Tech Stack (`#skills`)**: Categorized grid including:
   - *AI & Computer Vision* (TensorFlow, Keras, OpenCV, CNNs)
   - *Core Programming* (Java, Python, C/C++, Kotlin)
   - *Modern Web Ecosystem* (React.js, ES6+, Flask, Django)
   - *Database & Data Stores* (MySQL, MongoDB, RDBMS)
   - *Cloud & DevOps* (AWS, Git/GitHub, Linux)
   - *System & UI Design* (REST APIs, Responsive UX, OOP)
6. **Featured Builds (`#projects`)**:
   - `01` — **AI Image Classification System** (CNN document/photo classifier)
   - `02` — **Alumni Data Management System** (Full-stack database platform)
   - `03` — **Interactive 3D Engineering Portfolio** (Three.js WebGL experience)
   - `04` — **Smart Room Controller** (IoT hardware & sensor integration)
7. **Background & Credentials (`#education`)**: Academic background at Appa Institute of Engineering & Technology (Sharnbasva University) and Simplilearn certifications.
8. **Contact (`#contact`)**: Direct email links, GitHub, LinkedIn profiles, and interactive direct message form.

---

## 🚀 Quick Start & Local Setup

Because this project is built entirely on standard web technologies without heavy compilation steps, you can run it instantly using any static web server or browser.

### Option 1: Live Server in VS Code
1. Open the project folder in **Visual Studio Code**:
   ```bash
   code .
   ```
2. Install the **Live Server** extension (`ritwickdey.LiveServer`).
3. Right-click [`index.html`](file:///d:/project/portfolio/index.html) and select **"Open with Live Server"**.

### Option 2: Python HTTP Server
Run one of the following commands in the root directory:

```bash
# Python 3
python -m http.server 8000
```
Then visit [`http://localhost:8000`](http://localhost:8000) in your browser.

### Option 3: Node.js `serve` / `http-server`
```bash
npx serve .
# or
npx http-server -p 8080
```

---

## 🌐 Deployment

This website is ready for 1-click deployment on any static hosting provider:

### GitHub Pages
1. Push this repository to GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** (`main` / `root`).
4. Your site will be published at `https://<username>.github.io/<repo-name>/`.

### Vercel / Netlify
- Drag and drop the project folder or connect your GitHub repository for automated CI/CD deployments. No build configuration needed.

---

## 🎨 Customization Guide

- **Change Theme Colors**: Open [`style.css`](file:///d:/project/portfolio/style.css) and edit the `--accent`, `--accent2`, `--bg`, and `--text` variables under `:root` and `[data-theme="light"]`.
- **Add / Update Projects**: Edit the project cards inside the `<section id="projects">` container in [`index.html`](file:///d:/project/portfolio/index.html).
- **Configure Contact Form Target**: Update the `CONTACT_EMAIL` constant inside [`script.js`](file:///d:/project/portfolio/script.js#L70).

---

## 📬 Connect With Me

- **Name**: Kiran Ganji
- **Email**: [kiranganji0406@gmail.com](mailto:kiranganji0406@gmail.com) / [kiranganji.dev@gmail.com](mailto:kiranganji.dev@gmail.com)
- **GitHub**: [@kiranganji02](https://github.com/kiranganji02)
- **LinkedIn**: [kiran-ganji](https://www.linkedin.com/in/kiran-ganji-69a3b8329/)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, customize, and adapt it for your own portfolio.
