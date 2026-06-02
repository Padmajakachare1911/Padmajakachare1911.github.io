/**
 * analytics.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Lightweight analytics stub for PadmajaAI.
 *          Tracks page views, section dwell time, and
 *          interaction events without any external service.
 *          Data is stored in sessionStorage for the current visit.
 *
 * LOGIC: Uses PerformanceObserver + IntersectionObserver to
 *        measure how long each section is visible.
 *        Events are logged to the console in dev mode.
 *
 * INTEGRATION POINT: Replace the logEvent() function body
 *   with your analytics service call (Google Analytics,
 *   Mixpanel, Plausible, etc.):
 *
 *   function logEvent(name, props) {
 *     gtag('event', name, props);         // Google Analytics 4
 *     // OR
 *     window.plausible(name, { props });  // Plausible
 *     // OR
 *     mixpanel.track(name, props);        // Mixpanel
 *   }
 *
 * CUSTOMIZATION: Set DEV_MODE = false in production to
 *                suppress console logs.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const DEV_MODE    = true;  // CUSTOMIZATION: set false in production
  const SESSION_KEY = 'padmajaai-analytics';

  /* ── SESSION DATA ───────────────────────────────────────── */
  let session = {
    startTime:    Date.now(),
    pageView:     true,
    sectionViews: {},
    interactions: [],
    theme:        document.documentElement.getAttribute('data-theme') || 'dark',
    referrer:     document.referrer || 'direct',
    viewport:     `${window.innerWidth}x${window.innerHeight}`,
  };

  /* ── LOG EVENT (integration point) ─────────────────────── */
  function logEvent(name, props = {}) {
    const event = { name, props, ts: Date.now() };

    // Store in session
    session.interactions.push(event);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (_) { /* ignore storage errors */ }

    // Dev console output
    if (DEV_MODE) {
      console.log(`%c[PadmajaAI Analytics] ${name}`, 'color:#8B5CF6;font-weight:bold', props);
    }

    // ── INTEGRATION POINT ──────────────────────────────────
    // Uncomment and configure your analytics service here:
    //
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', name, props);
    // }
    //
    // if (typeof window.plausible !== 'undefined') {
    //   window.plausible(name, { props });
    // }
    // ──────────────────────────────────────────────────────
  }

  /* ── PAGE VIEW ──────────────────────────────────────────── */
  function trackPageView() {
    logEvent('page_view', {
      path:     window.location.pathname,
      referrer: session.referrer,
      viewport: session.viewport,
      theme:    session.theme,
    });
  }

  /* ── SECTION DWELL TIME ─────────────────────────────────── */
  function trackSectionDwell() {
    const sections = document.querySelectorAll('section[id]');
    const dwellMap = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            dwellMap[id] = Date.now();
          } else if (dwellMap[id]) {
            const dwell = Date.now() - dwellMap[id];
            session.sectionViews[id] = (session.sectionViews[id] || 0) + dwell;
            delete dwellMap[id];

            if (dwell > 2000) { // Only log if viewed for > 2 seconds
              logEvent('section_view', { section: id, dwell_ms: dwell });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── INTERACTION TRACKING ───────────────────────────────── */
  function trackInteractions() {
    // Project card clicks
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.experiment-card');
      if (projectCard) {
        logEvent('project_click', {
          project: projectCard.querySelector('.experiment-card__title')?.textContent?.trim(),
        });
      }

      // Simulation run
      if (e.target.id === 'sim-run-btn') {
        logEvent('simulation_run', {
          skills_selected: document.querySelectorAll('.sim-chip.selected').length,
        });
      }

      // Resume download
      if (e.target.closest('[data-track="resume-download"]')) {
        logEvent('resume_download');
      }

      // Chatbot open
      if (e.target.id === 'chat-fab') {
        logEvent('chatbot_open');
      }

      // Theme toggle
      if (e.target.id === 'theme-toggle') {
        const theme = document.documentElement.getAttribute('data-theme');
        logEvent('theme_change', { to: theme });
      }

      // Nav links
      const navLink = e.target.closest('.navbar__link');
      if (navLink) {
        logEvent('nav_click', { target: navLink.getAttribute('href') });
      }
    });
  }

  /* ── TIME ON PAGE ───────────────────────────────────────── */
  function trackTimeOnPage() {
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - session.startTime) / 1000);
      logEvent('page_exit', {
        time_on_page_s:  timeOnPage,
        sections_viewed: Object.keys(session.sectionViews).length,
      });
    });
  }

  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    trackPageView();
    trackSectionDwell();
    trackInteractions();
    trackTimeOnPage();
  });

  // Expose for manual tracking
  window.PadmajaAnalytics = { logEvent };
})();
