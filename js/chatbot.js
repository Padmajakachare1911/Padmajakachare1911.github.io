/**
 * chatbot.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Powers the "Ask PadmajaAI" floating chatbot widget.
 *          Currently uses rule-based responses (no API needed).
 *          Code is structured for easy API integration later.
 *
 * LOGIC:
 *   1. User opens chat via FAB button.
 *   2. Suggested prompts are shown as clickable chips.
 *   3. User types or clicks a prompt.
 *   4. A typing indicator appears, then a response.
 *   5. Responses come from the RESPONSES lookup table.
 *
 * API INTEGRATION POINT:
 *   Replace the getResponse() function body with an actual
 *   fetch() call to OpenAI/Gemini API. The rest of the UI
 *   code remains unchanged.
 *
 *   // Example OpenAI integration:
 *   async function getResponse(userMessage) {
 *     const res = await fetch('https://api.openai.com/v1/chat/completions', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'Authorization': `Bearer ${YOUR_API_KEY}`
 *       },
 *       body: JSON.stringify({
 *         model: 'gpt-4',
 *         messages: [
 *           { role: 'system', content: SYSTEM_PROMPT },
 *           { role: 'user',   content: userMessage }
 *         ]
 *       })
 *     });
 *     const data = await res.json();
 *     return data.choices[0].message.content;
 *   }
 *
 * CUSTOMIZATION: Edit RESPONSES to change bot answers.
 *                Add new keywords and responses as needed.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── SYSTEM PROMPT (for future API use) ─────────────────── */
  // CUSTOMIZATION: This will become the system message for OpenAI/Gemini
  const SYSTEM_PROMPT = `
You are PadmajaAI, an intelligent assistant representing Padmaja Kachare's portfolio.
Padmaja is a B.Tech AI & Data Science student from SIES School of Graduate Technology, Navi Mumbai.
She is an aspiring AI & ML Engineer with expertise in Python, TensorFlow, NLP, Deep Learning,
and full-stack AI application development.
Be concise, professional, and enthusiastic about AI/ML topics.
Always speak positively about Padmaja's skills and experience.
  `.trim();

  /* ── RULE-BASED RESPONSES ───────────────────────────────── */
  // CUSTOMIZATION: Add/edit entries to expand bot knowledge
  const RESPONSES = {
    greet: {
      patterns: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy', 'sup'],
      reply: `👋 Hello! I'm **PadmajaAI v2.6** — your intelligent guide to Padmaja Kachare's portfolio.\n\nAsk me about her projects, skills, experience, or education. How can I help you today?`
    },
    about: {
      patterns: ['about', 'who is', 'tell me about', 'padmaja', 'introduce', 'background'],
      reply: `🧠 **Padmaja Suresh Kachare** is an aspiring AI & Machine Learning Engineer from Uran, Navi Mumbai.\n\n📚 Currently pursuing B.Tech in AI & Data Science at SIES School of Graduate Technology, Nerul.\n\n🎓 Completed her Diploma in AI & ML Engineering with **90%** from Government Polytechnic, Mumbai.\n\nShe has hands-on experience across 5 internships and 6+ impactful AI projects!`
    },
    skills: {
      patterns: ['skill', 'know', 'expertise', 'technology', 'tech stack', 'tools', 'programming', 'language'],
      reply: `⚙️ **Core Technical Skills:**\n\n🐍 **Python** (Primary Language)\n🧠 **ML/DL:** TensorFlow, Keras, Scikit-learn\n📝 **NLP:** NLTK, Hugging Face (BERT)\n🏗️ **Architectures:** RNN, LSTM, GRU, GANs, VAE\n🌐 **Frameworks:** Flask, FastAPI, Streamlit\n☁️ **Cloud:** Google Cloud, Vertex AI, Gemini\n🗃️ **Databases:** MySQL, SQL\n🔧 **Tools:** Git, GitHub, Jupyter, PowerBI`
    },
    projects: {
      patterns: ['project', 'experiment', 'built', 'created', 'work', 'portfolio', 'demo'],
      reply: `🔬 **Key Experiments & Deployments:**\n\n1. 🎯 **AI Career Prediction System** — TensorFlow + Streamlit\n2. 🏛️ **Agentic AI Gov Service Platform** — FastAPI + MySQL + JWT\n3. 🏙️ **Urban Risk Prediction System** — Scikit-learn + Data Viz\n4. 🧩 **ASD Detection Web App** — Flask + KNN + MySQL\n5. 🍛 **Lost Recipes Finder** — Streamlit + NLP\n6. 🗣️ **Real-Time Voice Translator** — SpeechRecognition + TTS\n\nClick on the **Experiments** section to explore each project in detail!`
    },
    education: {
      patterns: ['education', 'study', 'degree', 'college', 'university', 'diploma', 'school', 'academic', 'qualification'],
      reply: `🎓 **Academic Journey (Training Epochs):**\n\n📗 **B.Tech AI & Data Science** — SIES School of Graduate Technology, Nerul (2023–Present)\n\n📘 **Diploma in AI & ML Engineering** — Government Polytechnic, Mumbai | **90%** (2025)\n\n📙 **HSC** — St. Mary's Convent Jr. College, Uran | **82.5%** (2022)\n\n📕 **SSC** — St. Mary's Convent High School, Uran | **91%** (2020)`
    },
    internship: {
      patterns: ['intern', 'experience', 'job', 'work experience', 'company', 'industry'],
      reply: `💼 **Internship Experience (5 positions):**\n\n🔵 **Infosys Springboard** — AI Intern (Oct–Dec 2025)\n🟢 **IM1B** — AI & Data Science Intern (2025)\n🟡 **NullClass** — Data Science Intern (Apr–Jun 2025)\n🟠 **Prodigy Infotech** — Data Science Intern (Sep 2024)\n🔴 **SmartInternz** — AI/ML Intern (Jun–Jul 2024)\n\nEach internship added real-world ML/AI experience! 🚀`
    },
    certifications: {
      patterns: ['certification', 'certificate', 'course', 'credential', 'achievement', 'award'],
      reply: `🏆 **Certifications & Achievements:**\n\n✅ McKinsey Forward Program — McKinsey.org\n✅ TCS ION Career Edge — Young Professional\n✅ Develop GenAI Apps with Gemini & Streamlit — Google Cloud\n✅ Prompt Design in Vertex AI — Google Cloud\n✅ Get Started with GitHub Copilot — Microsoft Learn\n✅ British Airways Data Science Simulation — Forage\n✅ Cybersecurity Course — Tech Mahindra / Skill India\n\n+ Academic excellence: **90%+ throughout Diploma** 🎖️`
    },
    contact: {
      patterns: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'github', 'touch'],
      reply: `📡 **Deployment Endpoints:**\n\n📧 **Email:** padmajakachare1911@gmail.com\n💼 **LinkedIn:** linkedin.com/in/padmaja-kachare\n🐙 **GitHub:** github.com/Padmajakachare1911\n📄 **Resume:** Available for download in the Deployment section!\n\nPadmaja is **actively open to opportunities** in AI/ML roles, internships, and research collaborations! 🟢`
    },
    resume: {
      patterns: ['resume', 'cv', 'download', 'documentation', 'pdf'],
      reply: `📄 **Model Documentation (Resume)**\n\nYou can download Padmaja's full resume from the **Deployment Endpoint** section at the bottom of the page.\n\nLook for the 📥 **"Download Model Documentation"** button!\n\nIt includes all her experience, projects, skills, and certifications.`
    },
    research: {
      patterns: ['research', 'paper', 'blog', 'note', 'study', 'learn', 'article', 'concept'],
      reply: `📔 **Research & Learning:**\n\nPadmaja actively explores cutting-edge AI topics:\n\n🔹 RAG (Retrieval-Augmented Generation)\n🔹 AI Agents & Agentic Workflows\n🔹 LangGraph & LangChain\n🔹 Fine-tuning LLMs\n🔹 MLOps & Model Deployment\n🔹 Transformer architectures (BERT, GPT)\n\nCheck the **Research Notebook** section for her learning logs and notes!`
    },
    location: {
      patterns: ['location', 'where', 'city', 'from', 'based', 'india', 'mumbai', 'navi mumbai'],
      reply: `📍 **Location:** Uran, Navi Mumbai – 400702, Maharashtra, India\n\nPadmaja is open to **remote** and **on-site** opportunities across India!`
    },
    default: {
      reply: `🤔 Hmm, I'm not sure about that specific query yet!\n\nTry asking me about:\n• **Skills** — "What are Padmaja's skills?"\n• **Projects** — "Show me her projects"\n• **Education** — "Tell me about her education"\n• **Internships** — "What internships has she done?"\n• **Contact** — "How can I reach her?"\n\nOr explore the sections on this page! 🧭`
    }
  };

  /* ── TYPING DELAY SIMULATOR ─────────────────────────────── */
  // Simulates realistic AI response time
  function getTypingDelay(text) {
    const wordCount = text.split(' ').length;
    return Math.min(800 + wordCount * 18, 2500);
  }

  /* ── RULE-BASED RESPONSE LOOKUP ─────────────────────────── */
  // INTEGRATION POINT: Replace this function with actual API call
  async function getResponse(userMessage) {
    const lower = userMessage.toLowerCase().trim();

    for (const [, entry] of Object.entries(RESPONSES)) {
      if (!entry.patterns) continue;
      if (entry.patterns.some((p) => lower.includes(p))) {
        // Simulate network delay
        await delay(getTypingDelay(entry.reply));
        return entry.reply;
      }
    }

    // Default fallback
    await delay(1000);
    return RESPONSES.default.reply;
  }

  /* ── RENDER MARKDOWN-LITE ───────────────────────────────── */
  // Simple renderer for **bold** and newlines
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  /* ── ADD MESSAGE TO CHAT ────────────────────────────────── */
  function addMessage(role, text) {
    const messagesEl = document.getElementById('chat-messages');
    if (!messagesEl) return;

    const msgEl = document.createElement('div');
    msgEl.className = `chat-message chat-message--${role}`;

    if (role === 'ai') {
      msgEl.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div class="msg-bubble">${renderMarkdown(text)}</div>
      `;
    } else {
      msgEl.innerHTML = `<div class="msg-bubble">${escapeHTML(text)}</div>`;
    }

    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* ── TYPING INDICATOR ───────────────────────────────────── */
  function showTypingIndicator() {
    const messagesEl = document.getElementById('chat-messages');
    if (!messagesEl) return null;

    const indicator = document.createElement('div');
    indicator.className  = 'chat-message chat-message--ai';
    indicator.id         = 'typing-indicator';
    indicator.innerHTML  = `
      <div class="msg-avatar">🤖</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesEl.appendChild(indicator);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  /* ── SEND MESSAGE FLOW ──────────────────────────────────── */
  let isBusy = false;

  async function sendMessage(text) {
    if (isBusy || !text.trim()) return;
    isBusy = true;

    const input  = document.getElementById('chat-input');
    const sendBtn= document.getElementById('chat-send');

    if (input)   input.value  = '';
    if (sendBtn) sendBtn.disabled = true;

    // Hide suggestions after first message
    const suggestionsEl = document.getElementById('chat-suggestions');
    if (suggestionsEl) suggestionsEl.style.display = 'none';

    // Add user message
    addMessage('user', text);

    // Show typing
    showTypingIndicator();

    // Get response
    try {
      const response = await getResponse(text);
      removeTypingIndicator();
      addMessage('ai', response);
    } catch (err) {
      removeTypingIndicator();
      addMessage('ai', '⚠️ Connection issue. Please try again in a moment.');
      console.error('Chat error:', err);
    }

    isBusy = false;
    if (sendBtn) sendBtn.disabled = false;
    if (input)   input.focus();
  }

  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const fab       = document.getElementById('chat-fab');
    const window_   = document.getElementById('chat-window');
    const closeBtn  = document.getElementById('chat-close');
    const input     = document.getElementById('chat-input');
    const sendBtn   = document.getElementById('chat-send');
    const chips     = document.querySelectorAll('.suggestion-chip');

    // FAB toggle — use innerHTML to preserve the badge <span> child
    if (fab && window_) {
      fab.addEventListener('click', () => {
        const isOpen = window_.classList.toggle('open');
        fab.classList.toggle('open', isOpen);
        // Swap icon while preserving badge span
        const badge = fab.querySelector('.chat-badge');
        fab.textContent = isOpen ? '✕' : '🤖';
        if (badge && !isOpen) fab.appendChild(badge); // restore badge when closed

        // Show welcome message on first open
        const msgs = document.getElementById('chat-messages');
        if (msgs && msgs.children.length === 0) {
          addMessage('ai', `👋 Hi! I'm **PadmajaAI v2.6**.\n\nI can tell you all about Padmaja's skills, projects, experience, and more.\n\nWhat would you like to know?`);
        }
      });
    }

    // Close button
    if (closeBtn && window_) {
      closeBtn.addEventListener('click', () => {
        window_.classList.remove('open');
        if (fab) {
          fab.classList.remove('open');
          const badge = fab.querySelector('.chat-badge');
          fab.textContent = '🤖';
          if (badge) fab.appendChild(badge); // restore badge
        }
      });
    }

    // Send on button click
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => sendMessage(input.value));
    }

    // Send on Enter (Shift+Enter for newline)
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(input.value);
        }
      });

      // Auto-resize textarea
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 96) + 'px';
      });
    }

    // Suggestion chips
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        sendMessage(chip.textContent.trim());
      });
    });
  });

  /* ── HELPERS ────────────────────────────────────────────── */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Expose for external use
  window.PadmajaChat = { sendMessage };
})();
