/**
 * animations.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Handles all scroll-triggered animations, animated
 *          counters, progress bar reveals, neural canvas
 *          particle background, and the boot sequence.
 *
 * LOGIC:
 *   - IntersectionObserver watches .reveal elements and adds
 *     .revealed class when they enter the viewport.
 *   - Animated counters increment from 0 to data-count value.
 *   - Progress bars animate their width on reveal.
 *   - Neural canvas draws nodes + edges that float gently.
 *   - Boot sequence runs a timed series of log lines then
 *     hides the overlay to reveal the site.
 *
 * CUSTOMIZATION:
 *   - BOOT_STEPS array controls the startup sequence text.
 *   - CANVAS_NODES controls particle density.
 *   - COUNTER_DURATION controls how fast counters count up.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     BOOT SEQUENCE
  ══════════════════════════════════════════════════════════ */

  // CUSTOMIZATION: Edit these steps to change startup text
  const BOOT_STEPS = [
    { icon: '📦', text: 'Loading Dataset...', delay: 500 },
    { icon: '⚙️', text: 'Extracting Features...', delay: 900 },
    { icon: '🧠', text: 'Training Neural Network...', delay: 1350 },
    { icon: '📊', text: 'Running Evaluation Metrics...', delay: 1850 },
    { icon: '🚀', text: 'Deployment Ready.', delay: 2300 },
  ];

  function runBootSequence() {
    const overlay     = document.getElementById('boot-overlay');
    const logContainer= document.getElementById('boot-log');
    const progressFill= document.getElementById('boot-progress');
    const progressLabel=document.getElementById('boot-progress-label');

    if (!overlay || !logContainer) return;

    // Create log line elements
    BOOT_STEPS.forEach((step, i) => {
      const line = document.createElement('div');
      line.className = 'boot__log-line loading';
      line.id = `boot-line-${i}`;
      line.innerHTML = `
        <span class="boot__log-status">⟳</span>
        <span class="boot__log-text">${step.text}</span>
      `;
      logContainer.appendChild(line);
    });

    // Animate each step
    BOOT_STEPS.forEach((step, i) => {
      setTimeout(() => {
        const line = document.getElementById(`boot-line-${i}`);
        if (line) {
          line.classList.add('visible');
          line.classList.remove('loading');

          // Mark previous as done
          if (i > 0) {
            const prev = document.getElementById(`boot-line-${i - 1}`);
            if (prev) {
              prev.classList.add('done');
              prev.querySelector('.boot__log-status').textContent = '✓';
            }
          }
        }

        // Update progress bar
        const pct = Math.round(((i + 1) / BOOT_STEPS.length) * 100);
        if (progressFill)  progressFill.style.width = pct + '%';
        if (progressLabel) progressLabel.textContent = pct + '%';
      }, step.delay);
    });

    // Mark last step done + hide overlay
    const lastDelay = BOOT_STEPS[BOOT_STEPS.length - 1].delay;
    setTimeout(() => {
      const lastLine = document.getElementById(`boot-line-${BOOT_STEPS.length - 1}`);
      if (lastLine) {
        lastLine.classList.add('done');
        lastLine.querySelector('.boot__log-status').textContent = '✓';
      }
    }, lastDelay + 400);

    setTimeout(() => {
      overlay.classList.add('hide');
      // After fade out, remove from DOM
      setTimeout(() => overlay.remove(), 900);
      // Start hero animations
      revealHero();
    }, lastDelay + 900);
  }

  function revealHero() {
    document.querySelectorAll('.hero-reveal').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, i * 120);
    });
    // Start metric card animations
    animateMetricCards();
  }

  /* ══════════════════════════════════════════════════════════
     INTERSECTION OBSERVER — SCROLL REVEALS
  ══════════════════════════════════════════════════════════ */

  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // Trigger counters inside revealed elements
            entry.target.querySelectorAll('[data-count]').forEach(animateCounter);

            // Trigger progress bars inside revealed elements
            entry.target.querySelectorAll('[data-progress]').forEach(animateProgressBar);

            // Unobserve after reveal (fire once)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Separate observer for section-level counter/bar triggers
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
            entry.target.querySelectorAll('[data-progress]').forEach(animateProgressBar);
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.section').forEach((el) => sectionObserver.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     ANIMATED COUNTERS
  ══════════════════════════════════════════════════════════ */

  // CUSTOMIZATION: Change COUNTER_DURATION for faster/slower counts
  const COUNTER_DURATION = 1800; // ms

  function animateCounter(el) {
    if (el.dataset.animated) return; // prevent re-animation
    el.dataset.animated = 'true';

    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const start   = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / COUNTER_DURATION, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ══════════════════════════════════════════════════════════
     PROGRESS BAR ANIMATIONS
  ══════════════════════════════════════════════════════════ */

  function animateProgressBar(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = el.dataset.progress || '0';
    // Slight delay so the animation is visible
    setTimeout(() => {
      el.style.width = target + '%';
    }, 150);
  }

  /* ══════════════════════════════════════════════════════════
     METRIC CARDS (HERO SECTION)
  ══════════════════════════════════════════════════════════ */

  function animateMetricCards() {
    document.querySelectorAll('.metric-card').forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';

        // Animate the card's progress bar
        const bar = card.querySelector('.progress-fill');
        if (bar && bar.dataset.progress) {
          setTimeout(() => {
            bar.style.width = bar.dataset.progress + '%';
          }, 200);
        }
      }, i * 100);
    });
  }

  /* ══════════════════════════════════════════════════════════
     NEURAL CANVAS PARTICLE BACKGROUND
  ══════════════════════════════════════════════════════════ */

  // CUSTOMIZATION: Change NODE_COUNT for more/fewer particles
  const CANVAS_CONFIG = {
    NODE_COUNT:     55,
    MAX_DIST:       140,   // max distance to draw an edge
    NODE_SPEED:     0.3,   // movement speed
    NODE_RADIUS:    2.5,   // base node radius
    PULSE_SPEED:    0.02,  // how fast nodes pulse
  };

  function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let rafId;
    let time = 0;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < CANVAS_CONFIG.NODE_COUNT; i++) {
        nodes.push({
          x:      Math.random() * canvas.width,
          y:      Math.random() * canvas.height,
          vx:     (Math.random() - 0.5) * CANVAS_CONFIG.NODE_SPEED,
          vy:     (Math.random() - 0.5) * CANVAS_CONFIG.NODE_SPEED,
          phase:  Math.random() * Math.PI * 2,
          size:   Math.random() * CANVAS_CONFIG.NODE_RADIUS + 1,
        });
      }
    }

    function getColors() {
      // Detect current theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        node: isDark ? 'rgba(139, 92, 246,' : 'rgba(139, 92, 246,',
        edge: isDark ? 'rgba(139, 92, 246,' : 'rgba(139, 92, 246,',
      };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += CANVAS_CONFIG.PULSE_SPEED;

      const colors = getColors();

      // Draw edges first
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CANVAS_CONFIG.MAX_DIST) {
            const alpha = (1 - dist / CANVAS_CONFIG.MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `${colors.edge}${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time + node.phase) * 0.5 + 0.5;
        const alpha = 0.3 + pulse * 0.4;
        const size  = node.size + pulse * 1.5;

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.node}${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.node}${alpha * 0.1})`;
        ctx.fill();

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width)  node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height)  node.vy *= -1;
      });

      rafId = requestAnimationFrame(draw);
    }

    // Pause when tab is hidden (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(draw);
    });

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      resize();
      createNodes();
    });
    resizeObserver.observe(canvas.parentElement);

    resize();
    createNodes();
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     NAVBAR SCROLL BEHAVIOR
  ══════════════════════════════════════════════════════════ */

  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const progressBar = document.querySelector('.navbar__status-bar');
    if (!navbar) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY  = window.scrollY;
          const maxScroll= document.body.scrollHeight - window.innerHeight;
          const progress = Math.min(scrollY / maxScroll, 1);

          // Glass effect when scrolled
          navbar.classList.toggle('scrolled', scrollY > 20);

          // Read progress bar
          if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     ACTIVE NAV SECTION HIGHLIGHTING
  ══════════════════════════════════════════════════════════ */

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ══════════════════════════════════════════════════════════
     RADAR CHART (Evaluation Section)
  ══════════════════════════════════════════════════════════ */

  function drawRadarChart() {
    const canvas = document.getElementById('eval-canvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const W      = canvas.width  = 280;
    const H      = canvas.height = 280;
    const cx     = W / 2;
    const cy     = H / 2;
    const r      = 100;

    const labels = ['ML/DL', 'NLP', 'Python', 'Projects', 'Research', 'Open Source'];
    const values = [0.88,     0.80,   0.95,      0.85,       0.78,      0.70];
    const N      = labels.length;

    // Animate values from 0 to actual
    let progress = 0;
    const duration = 1500;
    const start    = performance.now();

    function render(now) {
      progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, W, H);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      const labelColor = isDark ? '#94A3B8' : '#64748B';

      // Draw grid rings
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
          const x = cx + (r * ring / 4) * Math.cos(angle);
          const y = cy + (r * ring / 4) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // Draw axis lines
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        ctx.strokeStyle = gridColor;
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      values.forEach((v, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const rv    = r * v * ease;
        const x     = cx + rv * Math.cos(angle);
        const y     = cy + rv * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle   = 'rgba(139, 92, 246, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth   = 2;
      ctx.stroke();

      // Draw data points
      values.forEach((v, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const rv    = r * v * ease;
        const x     = cx + rv * Math.cos(angle);
        const y     = cy + rv * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      });

      // Draw labels
      ctx.font      = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = labelColor;
      ctx.textAlign = 'center';
      labels.forEach((label, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const lx    = cx + (r + 22) * Math.cos(angle);
        const ly    = cy + (r + 22) * Math.sin(angle) + 4;
        ctx.fillText(label, lx, ly);
      });

      if (progress < 1) requestAnimationFrame(render);
    }

    // Trigger when section is visible
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(render);
        obs.disconnect();
      }
    }, { threshold: 0.5 });

    const evalSection = document.getElementById('evaluation');
    if (evalSection) obs.observe(evalSection);

    // Re-draw when theme changes
    window.addEventListener('themechange', () => {
      const s2 = performance.now();
      const dur2 = 800;
      function rerender(now2) {
        progress = Math.min((now2 - s2) / dur2, 1);
        const ease2 = 1 - Math.pow(1 - progress, 3);
        // simplified redraw
        ctx.clearRect(0, 0, W, H);
        const isDark2 = document.documentElement.getAttribute('data-theme') === 'dark';
        const gc = isDark2 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        const lc = isDark2 ? '#94A3B8' : '#64748B';
        for (let ring = 1; ring <= 4; ring++) {
          ctx.beginPath();
          for (let i = 0; i < N; i++) {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            const x = cx + (r * ring / 4) * Math.cos(a);
            const y = cy + (r * ring / 4) * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.strokeStyle = gc; ctx.lineWidth = 1; ctx.stroke();
        }
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
          ctx.strokeStyle = gc; ctx.stroke();
        }
        ctx.beginPath();
        values.forEach((v, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const rv = r * v * ease2;
          const x = cx + rv * Math.cos(a); const y = cy + rv * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)'; ctx.fill();
        ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 2; ctx.stroke();
        values.forEach((v, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const rv = r * v * ease2;
          const x = cx + rv * Math.cos(a); const y = cy + rv * Math.sin(a);
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#8B5CF6'; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        });
        ctx.font = '11px "JetBrains Mono", monospace'; ctx.fillStyle = lc; ctx.textAlign = 'center';
        labels.forEach((label, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          ctx.fillText(label, cx + (r + 22) * Math.cos(a), cy + (r + 22) * Math.sin(a) + 4);
        });
        if (progress < 1) requestAnimationFrame(rerender);
      }
      requestAnimationFrame(rerender);
    });
  }

  /* ══════════════════════════════════════════════════════════
     SMOOTH SCROLL FOR NAV LINKS
  ══════════════════════════════════════════════════════════ */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu) mobileMenu.classList.remove('open');
          const hamburger = document.getElementById('hamburger');
          if (hamburger) hamburger.classList.remove('open');
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     MOBILE MENU TOGGLE
  ══════════════════════════════════════════════════════════ */

  function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    runBootSequence();
    initScrollReveal();
    initNavbarScroll();
    initActiveNav();
    initSmoothScroll();
    initMobileMenu();
    initNeuralCanvas();
    drawRadarChart();
  });

  // Expose for external use
  window.PadmajaAnimations = {
    animateCounter,
    animateProgressBar,
    drawRadarChart,
  };
})();
