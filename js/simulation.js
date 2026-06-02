/**
 * simulation.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Powers the "Candidate Simulation Engine" —
 *          the signature interactive section of PadmajaAI.
 *
 * LOGIC:
 *   1. User selects skill/requirement chips (multi-select).
 *   2. Clicks "Run Simulation" button.
 *   3. Animated processing steps appear with typed text.
 *   4. A compatibility score (always 94-99%) is calculated.
 *   5. The SVG ring animates to the score.
 *   6. Padmaja's candidate card appears as recommendation.
 *
 * CUSTOMIZATION:
 *   - SKILL_SCORES map controls how each skill contributes.
 *   - PROCESS_STEPS controls the animated messages shown.
 *   - MIN_SCORE / MAX_SCORE controls the score range.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONFIGURATION ──────────────────────────────────────── */
  const MIN_SCORE = 94;  // lowest possible score shown
  const MAX_SCORE = 99;  // highest possible score shown

  // How much each skill chip contributes to the score calculation
  // CUSTOMIZATION: Adjust weights to influence score variation
  const SKILL_SCORES = {
    'python':         10,
    'machine-learning': 9,
    'research':        8,
    'leadership':      6,
    'communication':   7,
    'problem-solving': 9,
    'open-source':     7,
    'teamwork':        6,
    'deep-learning':   9,
    'nlp':             8,
    'data-science':    8,
    'cloud':           7,
  };

  // Animated processing messages
  // CUSTOMIZATION: Edit these messages for different narrative
  const PROCESS_STEPS = [
    { text: 'Analyzing Requirements...', duration: 700 },
    { text: 'Scanning Candidate Database...', duration: 600 },
    { text: 'Matching Skills & Experience...', duration: 800 },
    { text: 'Evaluating Cultural Fit...', duration: 500 },
    { text: 'Calculating Compatibility Score...', duration: 700 },
    { text: 'Generating Recommendation...', duration: 400 },
  ];

  /* ── STATE ──────────────────────────────────────────────── */
  let selectedSkills = new Set();
  let isRunning      = false;

  /* ── DOM REFS ───────────────────────────────────────────── */
  let runBtn, counterEl, idleEl, processingEl, resultEl;
  let ringFill, scoreNumber, matchedSkillsEl;

  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    runBtn         = document.getElementById('sim-run-btn');
    counterEl      = document.getElementById('sim-counter');
    idleEl         = document.getElementById('sim-idle');
    processingEl   = document.getElementById('sim-processing');
    resultEl       = document.getElementById('sim-result');
    ringFill       = document.getElementById('sim-ring-fill');
    scoreNumber    = document.getElementById('sim-score-number');
    matchedSkillsEl= document.getElementById('sim-matched-skills');

    // Wire up chip selection
    document.querySelectorAll('.sim-chip').forEach((chip) => {
      chip.addEventListener('click', () => toggleChip(chip));
    });

    // Wire up run button — use onclick (not addEventListener) so we can
    // swap between runSimulation ↔ resetSimulation cleanly on result
    if (runBtn) runBtn.onclick = runSimulation;
  });

  /* ── TOGGLE CHIP SELECTION ──────────────────────────────── */
  function toggleChip(chip) {
    if (isRunning) return;
    const key = chip.dataset.skill;

    if (selectedSkills.has(key)) {
      selectedSkills.delete(key);
      chip.classList.remove('selected');
    } else {
      selectedSkills.add(key);
      chip.classList.add('selected');
    }

    updateCounter();
  }

  function updateCounter() {
    const count = selectedSkills.size;
    if (counterEl) {
      counterEl.innerHTML = `<span>${count}</span> requirement${count !== 1 ? 's' : ''} selected`;
    }
    if (runBtn) {
      runBtn.disabled = count === 0;
      runBtn.textContent = count === 0
        ? 'Select requirements to run'
        : `▶ Run Simulation (${count} parameter${count !== 1 ? 's' : ''})`;
    }
  }

  /* ── CALCULATE SCORE ────────────────────────────────────── */
  function calculateScore() {
    // Base score
    let score = MIN_SCORE;

    // Each selected skill adds a tiny variation
    let bonus = 0;
    selectedSkills.forEach((skill) => {
      bonus += (SKILL_SCORES[skill] || 5);
    });

    // Normalize bonus into the allowed range
    const range      = MAX_SCORE - MIN_SCORE;
    const maxBonus   = Object.values(SKILL_SCORES).reduce((a, b) => a + b, 0);
    const normalized = Math.min(bonus / maxBonus, 1);
    score = Math.round(MIN_SCORE + normalized * range);

    return Math.min(score, MAX_SCORE);
  }

  /* ── RUN SIMULATION ─────────────────────────────────────── */
  async function runSimulation() {
    if (isRunning || selectedSkills.size === 0) return;
    isRunning = true;
    runBtn.disabled = true;

    // Hide idle, show processing
    if (idleEl)       idleEl.style.display   = 'none';
    if (resultEl)     resultEl.classList.remove('show');
    if (processingEl) {
      processingEl.innerHTML = '';
      processingEl.classList.add('active');
    }

    // Create step elements
    const stepEls = PROCESS_STEPS.map((step, i) => {
      const el = document.createElement('div');
      el.className = 'process-step';
      el.innerHTML = `
        <span class="process-step__icon">⟳</span>
        <span>${step.text}</span>
      `;
      processingEl.appendChild(el);
      return el;
    });

    // Animate each step sequentially
    let cumulative = 0;
    for (let i = 0; i < PROCESS_STEPS.length; i++) {
      await delay(cumulative);
      stepEls[i].classList.add('running');
      if (i > 0) {
        stepEls[i - 1].classList.add('done');
        stepEls[i - 1].querySelector('.process-step__icon').textContent = '✓';
      }
      cumulative += PROCESS_STEPS[i].duration;
    }

    // Mark last step done
    await delay(PROCESS_STEPS[PROCESS_STEPS.length - 1].duration);
    const lastEl = stepEls[stepEls.length - 1];
    if (lastEl) {
      lastEl.classList.add('done');
      lastEl.querySelector('.process-step__icon').textContent = '✓';
    }

    // Compute score
    const score = calculateScore();

    // Brief pause, then show result
    await delay(400);
    processingEl.classList.remove('active');

    showResult(score);
  }

  /* ── SHOW RESULT ────────────────────────────────────────── */
  function showResult(score) {
    if (!resultEl) return;

    resultEl.classList.add('show');

    // Animate score number counting up
    let current = 0;
    const duration = 1200;
    const start    = performance.now();

    function countUp(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * score);

      if (scoreNumber) scoreNumber.textContent = current + '%';

      // Animate SVG ring
      // stroke-dasharray = 2πr = 2 * π * 45 ≈ 283
      const dashOffset = 283 - (283 * (eased * score / 100));
      if (ringFill) ringFill.style.strokeDashoffset = dashOffset;

      if (progress < 1) requestAnimationFrame(countUp);
    }

    requestAnimationFrame(countUp);

    // Show matched skills
    if (matchedSkillsEl) {
      matchedSkillsEl.innerHTML = '';
      selectedSkills.forEach((skill) => {
        const chip = document.createElement('span');
        chip.className = 'result__skill-match';
        chip.innerHTML = `✓ ${skill.replace(/-/g, ' ')}`;
        matchedSkillsEl.appendChild(chip);
      });
    }

    // Re-enable controls
    isRunning = false;

    if (runBtn) {
      runBtn.disabled = false;
      runBtn.textContent = '↺ Run Again';
    }

    // Add "run again" behavior
    runBtn.onclick = resetSimulation;
  }

  /* ── RESET SIMULATION ───────────────────────────────────── */
  function resetSimulation() {
    isRunning      = false;
    selectedSkills = new Set();

    document.querySelectorAll('.sim-chip').forEach((chip) => {
      chip.classList.remove('selected');
    });

    if (resultEl)     resultEl.classList.remove('show');
    if (processingEl) { processingEl.innerHTML = ''; processingEl.classList.remove('active'); }
    if (idleEl)       idleEl.style.display = 'flex';

    if (ringFill)     ringFill.style.strokeDashoffset = '283';
    if (scoreNumber)  scoreNumber.textContent = '0%';

    updateCounter();

    if (runBtn) {
      runBtn.onclick = runSimulation;
    }
  }

  /* ── HELPER ─────────────────────────────────────────────── */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Initialize counter display
  document.addEventListener('DOMContentLoaded', updateCounter);
})();
