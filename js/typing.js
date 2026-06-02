/**
 * typing.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Typewriter animation engine for PadmajaAI.
 *          Used in the hero section for the animated subtitle
 *          and in the boot sequence for step-by-step text.
 *
 * LOGIC: Uses requestAnimationFrame for smooth, frame-rate-
 *        independent animation. Supports:
 *        - Single string typing
 *        - Array of strings (cycle with pause between each)
 *        - Configurable speed, delete speed, pause duration
 *        - Optional cursor element
 *
 * CUSTOMIZATION: Change HERO_STRINGS to update rotating text.
 *                Adjust TYPE_SPEED / DELETE_SPEED (ms per char).
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONFIGURATION ──────────────────────────────────────── */
  const CONFIG = {
    TYPE_SPEED:   55,    // ms between each character typed
    DELETE_SPEED: 30,    // ms between each character deleted
    PAUSE_AFTER:  2200,  // ms to wait after full string is typed
    PAUSE_BEFORE: 400,   // ms to wait before starting to delete
  };

  // Strings to cycle through in the hero subtitle area
  // CUSTOMIZATION POINT: update these to match Padmaja's focus areas
  const HERO_STRINGS = [
    'AI & Machine Learning Engineer',
    'Deep Learning Researcher',
    'NLP & Generative AI Builder',
    'Data Science Practitioner',
    'Open Source Contributor',
    'Agentic AI Explorer',
  ];

  /* ── TYPEWRITER CLASS ───────────────────────────────────── */
  class Typewriter {
    /**
     * @param {HTMLElement} el      - Element to type into
     * @param {string[]}    strings - Array of strings to cycle
     * @param {object}      opts    - Override default config
     */
    constructor(el, strings, opts = {}) {
      this.el          = el;
      this.strings     = strings;
      this.opts        = { ...CONFIG, ...opts };
      this.strIndex    = 0;   // current string index
      this.charIndex   = 0;   // current character index within string
      this.isDeleting  = false;
      this.isPaused    = false;
      this.rafId       = null;
      this.lastTime    = 0;
    }

    start() {
      this.tick(0);
      return this;
    }

    stop() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      return this;
    }

    tick(timestamp) {
      const elapsed   = timestamp - this.lastTime;
      const speed     = this.isDeleting ? this.opts.DELETE_SPEED : this.opts.TYPE_SPEED;

      if (elapsed >= speed && !this.isPaused) {
        this.lastTime = timestamp;
        const current = this.strings[this.strIndex];

        if (this.isDeleting) {
          // Remove one character
          this.charIndex--;
          this.el.textContent = current.substring(0, this.charIndex);

          // If fully deleted — move to next string
          if (this.charIndex === 0) {
            this.isDeleting = false;
            this.strIndex   = (this.strIndex + 1) % this.strings.length;
          }
        } else {
          // Add one character
          this.charIndex++;
          this.el.textContent = current.substring(0, this.charIndex);

          // If fully typed — pause then start deleting
          if (this.charIndex === current.length) {
            this.isPaused = true;
            setTimeout(() => {
              this.isPaused   = false;
              this.isDeleting = true;
            }, this.opts.PAUSE_AFTER);
          }
        }
      }

      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }
  }

  /* ── SINGLE SHOT TYPER ──────────────────────────────────── */
  /**
   * Types a string into an element once (no deletion).
   * Returns a Promise that resolves when typing is complete.
   * Used in the boot sequence for each log line.
   *
   * @param {HTMLElement} el     - Target element
   * @param {string}      text   - Text to type
   * @param {number}      speed  - ms per character
   * @returns {Promise<void>}
   */
  function typeOnce(el, text, speed = 40) {
    return new Promise((resolve) => {
      let i = 0;
      el.textContent = '';

      function step() {
        if (i < text.length) {
          el.textContent += text[i++];
          setTimeout(step, speed);
        } else {
          resolve();
        }
      }

      step();
    });
  }

  /* ── INITIALISE ON DOM READY ────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    // Hero subtitle typewriter
    const heroTypingEl = document.getElementById('hero-typing-text');
    if (heroTypingEl) {
      new Typewriter(heroTypingEl, HERO_STRINGS).start();
    }
  });

  /* ── EXPOSE API ─────────────────────────────────────────── */
  window.PadmajaTyping = { Typewriter, typeOnce };
})();
