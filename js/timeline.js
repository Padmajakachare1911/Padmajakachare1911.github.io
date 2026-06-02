/**
 * timeline.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Manages the "Training Epochs" education timeline —
 *          expand/collapse interactions, and active epoch state.
 *
 * LOGIC: Each .epoch card header is clickable.
 *        Clicking toggles the .expanded class which CSS uses
 *        to animate max-height on the card body.
 *        Only one epoch expands at a time (accordion behavior).
 *        The first epoch auto-expands on load.
 *
 * CUSTOMIZATION: Change SINGLE_OPEN to false to allow
 *                multiple epochs open at once.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // CUSTOMIZATION: Set to false to allow multiple open at once
  const SINGLE_OPEN = true;

  document.addEventListener('DOMContentLoaded', function () {
    const epochs = document.querySelectorAll('.epoch');

    epochs.forEach((epoch, index) => {
      const header = epoch.querySelector('.epoch__card-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isExpanded = epoch.classList.contains('expanded');

        // Close all if single-open mode
        if (SINGLE_OPEN) {
          epochs.forEach((e) => {
            e.classList.remove('expanded', 'active');
          });
        }

        // Toggle clicked epoch
        if (!isExpanded) {
          epoch.classList.add('expanded', 'active');

          // Scroll into view smoothly if needed
          setTimeout(() => {
            const rect = epoch.getBoundingClientRect();
            if (rect.bottom > window.innerHeight) {
              epoch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 350);
        }
      });

      // Auto-expand first epoch
      if (index === 0) {
        epoch.classList.add('expanded', 'active');
      }
    });
  });
})();
