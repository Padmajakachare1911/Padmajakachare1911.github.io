# PadmajaAI v2.6 — Interactive AI Portfolio

> An immersive AI-themed portfolio website for **Padmaja Suresh Kachare**, aspiring AI & Machine Learning Engineer.
> The site presents itself as an interactive AI system — not a portfolio.

[![GitHub](https://img.shields.io/badge/GitHub-Padmajakachare1911-8B5CF6?style=flat&logo=github)](https://github.com/Padmajakachare1911)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-padmaja--kachare-8B5CF6?style=flat&logo=linkedin)](https://www.linkedin.com/in/padmaja-kachare/)
[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-8B5CF6?style=flat&logo=github)](https://padmajakachare1911.github.io)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🚀 **Boot Sequence** | Animated startup sequence before revealing the site |
| 🧠 **Neural Canvas** | Live particle/neural network background animation |
| 🌙 **Dark/Light Mode** | Persisted via localStorage |
| ⌨️ **Typewriter Effect** | Rotating hero subtitle with typing animation |
| 🔬 **Simulation Engine** | Interactive candidate compatibility calculator |
| 🤖 **AI Chatbot** | Rule-based chat with OpenAI/Gemini API integration points |
| ⌘ **Command Palette** | Ctrl+K to navigate the entire site |
| 🐣 **Easter Egg** | Type "help" anywhere to open secret AI console |
| 📊 **Radar Chart** | Animated skill competency visualization |
| 🗂️ **Project Modals** | Expandable architecture diagrams for each project |
| 📱 **Fully Responsive** | Mobile, tablet, laptop, desktop, ultrawide |
| ♿ **Accessible** | Semantic HTML, ARIA labels, focus management |

---

## 🗂️ Project Structure

```
padmaja portfolio ai theme/
│
├── index.html              ← Main HTML (single page)
│
├── css/
│   ├── variables.css       ← Design tokens (colors, spacing, fonts)
│   ├── global.css          ← Reset, base styles, utilities
│   ├── navbar.css          ← Sticky AI pipeline navbar
│   ├── hero.css            ← Boot overlay + hero section
│   ├── dataset.css         ← About / profile section
│   ├── features.css        ← Skills / feature importance
│   ├── training.css        ← Education timeline epochs
│   ├── experiments.css     ← Projects + modals + architecture
│   ├── simulation.css      ← Candidate simulation engine
│   ├── evaluation.css      ← Stats + radar chart + certs
│   ├── research.css        ← Research notebook + search
│   ├── chatbot.css         ← AI chat widget
│   ├── deployment.css      ← Contact / API endpoints
│   ├── footer.css          ← Footer
│   └── responsive.css      ← All breakpoints + print + a11y
│
├── js/
│   ├── darkmode.js         ← Theme toggle (loaded in <head>)
│   ├── typing.js           ← Typewriter animation engine
│   ├── animations.js       ← Boot, scroll reveals, canvas, charts
│   ├── timeline.js         ← Epoch expand/collapse accordion
│   ├── simulation.js       ← Simulation engine logic
│   ├── chatbot.js          ← Chatbot + API integration hooks
│   ├── analytics.js        ← Analytics stub (GA4/Plausible ready)
│   └── main.js             ← Command palette, modals, misc UI
│
├── assets/
│   ├── images/             ← Add profile photo here
│   ├── icons/              ← Add custom icons here
│   └── resume/             ← Place resume PDF here:
│       └── Padmaja_Kachare_Resume.pdf
│
└── README.md
```

---

## 🚀 Quick Start

### Local Development

1. Clone or download this repository
2. Open `index.html` directly in a modern browser
   - No build step, no npm install, no server needed
   - Works with the `file://` protocol

```bash
# Or serve with any static server
npx serve .
# OR
python -m http.server 8000
```

### GitHub Pages Deployment

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your site will be live at `https://yourusername.github.io/repo-name`

---

## 🎨 Customization

### Update Personal Info
Edit content directly in `index.html` — all text, links, and data are in the HTML.

### Change Colors
Edit `css/variables.css`:
```css
:root {
  --color-primary:   #8B5CF6;  /* Main brand violet */
  --color-secondary: #A78BFA;  /* Lighter violet */
  --color-accent:    #C4B5FD;  /* Lavender accent */
}
```

### Update Typewriter Strings
Edit `js/typing.js`:
```js
const HERO_STRINGS = [
  'AI & Machine Learning Engineer',
  'Deep Learning Researcher',
  // Add your own here
];
```

### Add Projects
Copy an `.experiment-card` block in `index.html` and add a corresponding modal.

### Connect Real AI Chatbot
In `js/chatbot.js`, replace `getResponse()` with a fetch call to OpenAI/Gemini API.
The integration point is clearly marked with comments.

### Add Resume PDF
Place your resume at:
```
assets/resume/Padmaja_Kachare_Resume.pdf
```

---

## 🎮 Easter Eggs & Special Features

| Trigger | Effect |
|---|---|
| `Ctrl + K` | Opens command palette |
| Type `help` anywhere | Opens secret AI console |
| Click skill cards | Hover reveals project/confidence details |
| Select sim chips + Run | Animated candidate simulation |
| Open chatbot | Ask anything about Padmaja |

---

## 📊 Performance

- ✅ No external CSS frameworks
- ✅ No JavaScript bundles / npm dependencies
- ✅ Google Fonts loaded with `display=swap`
- ✅ IntersectionObserver for lazy animation triggers
- ✅ `requestAnimationFrame` for smooth animations
- ✅ Canvas pauses when tab is hidden
- ✅ Reduced motion media query respected
- 🎯 Target Lighthouse score: **90+**

---

## 🧰 Tech Stack

```
HTML5      → Semantic structure, ARIA accessibility
CSS3       → Custom properties, Grid, Flexbox, Animations
JavaScript → Vanilla ES6+, IntersectionObserver, Canvas API
Fonts      → Inter + JetBrains Mono (Google Fonts)
```

Zero frameworks. Zero dependencies. 100% hand-crafted.

---

## 📬 Contact

- **Email:** padmajakachare1911@gmail.com
- **GitHub:** [github.com/Padmajakachare1911](https://github.com/Padmajakachare1911)
- **LinkedIn:** [linkedin.com/in/padmaja-kachare](https://www.linkedin.com/in/padmaja-kachare/)

---

*PadmajaAI v2.6 — Training in progress. Deployment ready. 🚀*
