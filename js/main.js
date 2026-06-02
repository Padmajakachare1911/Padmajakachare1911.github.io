/**
 * main.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Central coordinator for PadmajaAI. Handles:
 *   - Command Palette (Ctrl+K)
 *   - Easter Egg ("help" keyboard shortcut)
 *   - Features tab filtering
 *   - Research search & category filtering
 *   - Project modal open/close
 *   - Back-to-top button
 *   - Misc UI enhancements
 *
 * LOGIC: This is the "glue" module that wires together all
 *        the interactive UI features that don't fit neatly
 *        into a dedicated module.
 *
 * CUSTOMIZATION:
 *   - CMD_PALETTE_ITEMS to add/remove command palette entries.
 *   - EASTER_EGG_KEYWORD to change the trigger word.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     COMMAND PALETTE (Ctrl+K)
  ══════════════════════════════════════════════════════════ */

  // CUSTOMIZATION: Edit these commands to change the palette items
  const CMD_PALETTE_ITEMS = [
    { icon: '🔬', label: 'View Projects',       action: () => scrollTo('#experiments') },
    { icon: '📊', label: 'See Skills',           action: () => scrollTo('#features')    },
    { icon: '📚', label: 'Education Timeline',   action: () => scrollTo('#training')    },
    { icon: '🧪', label: 'Run Simulation',        action: () => scrollTo('#simulation') },
    { icon: '📔', label: 'Research Notebook',     action: () => scrollTo('#research')   },
    { icon: '📡', label: 'Contact / Deploy',      action: () => scrollTo('#deployment') },
    { icon: '📄', label: 'Download Resume',       action: downloadResume                },
    { icon: '🐙', label: 'Open GitHub',           action: () => openLink('https://github.com/Padmajakachare1911') },
    { icon: '💼', label: 'Open LinkedIn',         action: () => openLink('https://www.linkedin.com/in/padmaja-kachare/') },
    { icon: '🤖', label: 'Ask PadmajaAI',         action: openChat                      },
    { icon: '🌙', label: 'Toggle Dark/Light Mode',action: () => window.PadmajaTheme?.toggle() },
  ];

  let cmdOpen       = false;
  let cmdQuery      = '';
  let cmdFilteredItems = [...CMD_PALETTE_ITEMS];
  let cmdSelected   = 0;

  function openCmdPalette() {
    const palette = document.getElementById('cmd-palette');
    if (!palette) return;
    cmdOpen    = true;
    cmdQuery   = '';
    cmdSelected= 0;
    palette.classList.add('active');
    const input = document.getElementById('cmd-input');
    if (input) { input.value = ''; input.focus(); }
    renderCmdItems(CMD_PALETTE_ITEMS);
  }

  function closeCmdPalette() {
    const palette = document.getElementById('cmd-palette');
    if (!palette) return;
    cmdOpen = false;
    palette.classList.remove('active');
  }

  function renderCmdItems(items) {
    const list = document.getElementById('cmd-list');
    if (!list) return;

    list.innerHTML = '';
    if (items.length === 0) {
      list.innerHTML = '<div class="cmd-empty">No commands found</div>';
      return;
    }

    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = `cmd-item ${i === cmdSelected ? 'cmd-item--active' : ''}`;
      el.innerHTML = `<span class="cmd-item__icon">${item.icon}</span><span class="cmd-item__label">${item.label}</span>`;
      el.addEventListener('click', () => { item.action(); closeCmdPalette(); });
      el.addEventListener('mouseenter', () => {
        cmdSelected = i;
        renderCmdItems(items);
      });
      list.appendChild(el);
    });
  }

  function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    return CMD_PALETTE_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(q)
    );
  }

  function initCommandPalette() {
    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        cmdOpen ? closeCmdPalette() : openCmdPalette();
      }

      if (!cmdOpen) return;

      if (e.key === 'Escape') { closeCmdPalette(); return; }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        cmdSelected = Math.min(cmdSelected + 1, cmdFilteredItems.length - 1);
        renderCmdItems(cmdFilteredItems);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        cmdSelected = Math.max(cmdSelected - 1, 0);
        renderCmdItems(cmdFilteredItems);
      }

      if (e.key === 'Enter') {
        if (cmdFilteredItems[cmdSelected]) {
          cmdFilteredItems[cmdSelected].action();
          closeCmdPalette();
        }
      }
    });

    // Search input
    const input = document.getElementById('cmd-input');
    if (input) {
      input.addEventListener('input', (e) => {
        cmdQuery         = e.target.value;
        cmdSelected      = 0;
        cmdFilteredItems = filterCmdItems(cmdQuery);
        renderCmdItems(cmdFilteredItems);
      });
    }

    // Click overlay to close
    const overlay = document.getElementById('cmd-palette');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCmdPalette();
      });
    }

    // Navbar cmd button
    const cmdBtn = document.getElementById('cmd-palette-btn');
    if (cmdBtn) cmdBtn.addEventListener('click', openCmdPalette);
  }

  /* ══════════════════════════════════════════════════════════
     EASTER EGG — type "help" anywhere
  ══════════════════════════════════════════════════════════ */

  // CUSTOMIZATION: Change this keyword to trigger easter egg differently
  const EASTER_EGG_KEYWORD = 'help';
  let easterBuffer = '';

  function initEasterEgg() {
    document.addEventListener('keypress', (e) => {
      // Don't trigger when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      easterBuffer += e.key.toLowerCase();

      // Only keep last N chars (length of keyword)
      if (easterBuffer.length > EASTER_EGG_KEYWORD.length) {
        easterBuffer = easterBuffer.slice(-EASTER_EGG_KEYWORD.length);
      }

      if (easterBuffer === EASTER_EGG_KEYWORD) {
        showEasterEgg();
        easterBuffer = '';
      }
    });

    // Close easter egg
    const closeBtn = document.getElementById('easter-egg-close');
    if (closeBtn) closeBtn.addEventListener('click', hideEasterEgg);

    const overlay = document.getElementById('easter-egg');
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideEasterEgg();
    });
  }

  function showEasterEgg() {
    const el = document.getElementById('easter-egg');
    if (el) el.classList.add('active');
    typeEasterEgg();
  }

  function hideEasterEgg() {
    const el = document.getElementById('easter-egg');
    if (el) el.classList.remove('active');
    const output = document.getElementById('easter-output');
    if (output) output.innerHTML = '';
  }

  function typeEasterEgg() {
    const output = document.getElementById('easter-output');
    if (!output) return;

    const lines = [
      '> system.whoami',
      '  PadmajaAI v2.6 — Active Session',
      '',
      '> model.status',
      '  Training:    COMPLETE ✓',
      '  Accuracy:    97.3%',
      '  Overfitting: NONE (generalization is strong)',
      '  Deployment:  READY 🚀',
      '',
      '> padmaja.info',
      '  Name:        Padmaja Suresh Kachare',
      '  Role:        Aspiring AI & ML Engineer',
      '  Stack:       Python | TF | PyTorch | NLP | Agentic AI',
      '  Status:      Available for opportunities 🟢',
      '',
      '> secret.unlock',
      '  🎉 You found the secret console!',
      '  You have good taste — just like her models.',
      '',
      '> _',
    ];

    output.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i >= lines.length) { clearInterval(interval); return; }
      const line = document.createElement('div');
      line.textContent = lines[i];
      line.style.color = lines[i].startsWith('>') ? '#A78BFA' : '#94A3B8';
      if (lines[i].includes('🎉')) line.style.color = '#10B981';
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
      i++;
    }, 100);
  }

  /* ══════════════════════════════════════════════════════════
     FEATURES — TAB FILTERING
  ══════════════════════════════════════════════════════════ */

  function initFeatureTabs() {
    const tabs  = document.querySelectorAll('.features__tab');
    const cards = document.querySelectorAll('.skill-card');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        cards.forEach((card) => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            setTimeout(() => card.style.opacity = '1', 10);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 200);
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     RESEARCH — SEARCH & FILTER
  ══════════════════════════════════════════════════════════ */

  function initResearch() {
    const searchInput   = document.getElementById('research-search');
    const filterBtns    = document.querySelectorAll('.research__filter');
    const cards         = document.querySelectorAll('.notebook-card');
    const noResultsEl   = document.getElementById('research-no-results');
    let activeFilter    = 'all';

    function filterCards() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      let visible = 0;

      cards.forEach((card) => {
        const title    = card.querySelector('.notebook-card__title')?.textContent?.toLowerCase() || '';
        const excerpt  = card.querySelector('.notebook-card__excerpt')?.textContent?.toLowerCase() || '';
        const category = card.dataset.category || '';

        const matchesSearch   = !query || title.includes(query) || excerpt.includes(query);
        const matchesFilter   = activeFilter === 'all' || category === activeFilter;
        const shouldShow      = matchesSearch && matchesFilter;

        card.style.display   = shouldShow ? '' : 'none';
        card.style.opacity   = shouldShow ? '1' : '0';
        if (shouldShow) visible++;
      });

      if (noResultsEl) noResultsEl.classList.toggle('visible', visible === 0);
    }

    if (searchInput) searchInput.addEventListener('input', filterCards);

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter || 'all';
        filterCards();
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     PROJECT MODALS
  ══════════════════════════════════════════════════════════ */

  function initProjectModals() {
    const overlay = document.getElementById('project-modal-overlay');
    if (!overlay) return;

    // Open
    document.querySelectorAll('.experiment-card').forEach((card) => {
      // Only open if not clicking a button inside the card
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) return;
        const modalId = card.dataset.modal;
        if (modalId) openProjectModal(modalId);
      });
    });

    // Close via overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProjectModal();
    });

    // Close via close button
    document.querySelectorAll('.modal__close').forEach((btn) => {
      btn.addEventListener('click', closeProjectModal);
    });

    // Close via Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeProjectModal();
    });
  }

  function openProjectModal(id) {
    const overlay = document.getElementById('project-modal-overlay');
    const modals  = document.querySelectorAll('.project-modal');
    modals.forEach((m) => m.style.display = m.id === id ? '' : 'none');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate arch nodes inside opened modal
    const modal = document.getElementById(id);
    if (modal) {
      modal.querySelectorAll('.arch-node').forEach((node, i) => {
        node.style.animationDelay = `${i * 80}ms`;
      });
    }
  }

  function closeProjectModal() {
    const overlay = document.getElementById('project-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════════════════════════
     BACK TO TOP
  ══════════════════════════════════════════════════════════ */

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════ */

  function scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function downloadResume() {
    const link = document.createElement('a');
    link.href     = 'assets/resume/Padmaja_Kachare_Resume.pdf';
    link.download = 'Padmaja_Kachare_Resume.pdf';
    link.click();
  }

  function openChat() {
    const fab = document.getElementById('chat-fab');
    if (fab) fab.click();
  }

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    initCommandPalette();
    initEasterEgg();
    initFeatureTabs();
    initResearch();
    initProjectModals();
    initBackToTop();
  });

  // Expose for external use
  window.PadmajaUI = { openCmdPalette, closeCmdPalette, scrollTo };
})();
