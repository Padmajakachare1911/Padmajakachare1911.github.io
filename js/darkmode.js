/**
 * darkmode.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Manages dark/light theme toggling for PadmajaAI.
 *          Persists user preference in localStorage.
 *
 * LOGIC:
 *   1. On page load, read saved theme from localStorage.
 *   2. If none saved, check OS preference (prefers-color-scheme).
 *   3. Apply theme to <html data-theme="..."> attribute.
 *   4. Toggle button switches between 'light' and 'dark'.
 *   5. Changes are instant (no flash) because this script is
 *      loaded in <head> before body renders.
 *
 * CUSTOMIZATION: Change STORAGE_KEY to use a different key.
 *                Add/remove theme variants by extending THEMES.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONSTANTS ──────────────────────────────────────────── */
  const STORAGE_KEY = 'padmajaai-theme';       // localStorage key
  const THEMES      = { DARK: 'dark', LIGHT: 'light' };
  const ICONS       = { dark: '🌙', light: '☀️' };  // toggle icon per mode

  /* ── DETECT INITIAL THEME ───────────────────────────────── */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && Object.values(THEMES).includes(saved)) return saved;

    // Fallback: use OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEMES.DARK : THEMES.LIGHT;
  }

  /* ── APPLY THEME ────────────────────────────────────────── */
  function applyTheme(theme) {
    // Set attribute on root element — CSS variables switch via [data-theme="dark"]
    document.documentElement.setAttribute('data-theme', theme);

    // Persist choice
    localStorage.setItem(STORAGE_KEY, theme);

    // Update toggle button icon if it exists
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = ICONS[theme];
      btn.setAttribute('aria-label', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`);
      btn.setAttribute('title', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`);
    }

    // Dispatch custom event so other modules can react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /* ── TOGGLE FUNCTION ────────────────────────────────────── */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || THEMES.DARK;
    const next    = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    applyTheme(next);
  }

  /* ── APPLY IMMEDIATELY (before paint) ──────────────────── */
  applyTheme(getInitialTheme());

  /* ── WIRE UP AFTER DOM READY ────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }

    // Also listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      // Only auto-switch if user has not saved a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    });
  });

  // Expose to global scope for other scripts that may need it
  window.PadmajaTheme = { toggle: toggleTheme, apply: applyTheme };
})();
