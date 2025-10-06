// TrustRight Chrome Extension - Content Script
// Automatically detects websites and provides trust analysis

class TrustRightWidget {
  constructor() {
    this.currentDomain = this.extractDomain(window.location.href);
    this.widget = null;
    this.isAnalyzing = false;
    this.analysisData = null;
    this.apiBase = 'https://trustright.app';

    this.init();
  }

  extractDomain(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }

  init() {
    // Skip for TrustRight's own domain and common dev/internal domains
    if (this.shouldSkipDomain(this.currentDomain)) return;

    this.injectStyles();
    this.createWidget();
    this.checkStoredAnalysis();
  }

  shouldSkipDomain(domain) {
    const skipDomains = [
      'trustright.app',
      'localhost',
      'chrome-extension:',
      'chrome:',
      'moz-extension:',
      'about:',
      'data:',
      'blob:'
    ];

    return !domain || skipDomains.some(skip => domain.includes(skip));
  }

  injectStyles() {
    if (document.getElementById('trustright-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'trustright-styles';
    styles.textContent = `
      .trustright-widget {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 280px;
        background: white;
        border: 2px solid #ea580c;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        font-family: system-ui, -apple-system, sans-serif;
        z-index: 2147483647;
        transition: all 0.3s ease;
        transform: translateY(-10px);
        opacity: 0;
        animation: trustright-slide-in 0.5s ease forwards;
      }

      @keyframes trustright-slide-in {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .trustright-widget.minimized {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }

      .trustright-header {
        background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: move;
      }

      .trustright-logo {
        font-weight: 700;
        font-size: 14px;
      }

      .trustright-controls {
        display: flex;
        gap: 8px;
      }

      .trustright-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: background 0.2s;
      }

      .trustright-btn:hover {
        background: rgba(255,255,255,0.3);
      }

      .trustright-content {
        padding: 16px;
      }

      .trustright-domain {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
        font-size: 14px;
      }

      .trustright-score {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 8px;
        background: #f9fafb;
      }

      .trustright-score-value {
        font-size: 24px;
        font-weight: 700;
      }

      .trustright-score-label {
        color: #6b7280;
        font-size: 12px;
      }

      .trustright-score.excellent { background: #dcfce7; }
      .trustright-score.good { background: #fef3c7; }
      .trustright-score.caution { background: #fed7aa; }
      .trustright-score.poor { background: #fee2e2; }

      .trustright-score.excellent .trustright-score-value { color: #16a34a; }
      .trustright-score.good .trustright-score-value { color: #ca8a04; }
      .trustright-score.caution .trustright-score-value { color: #ea580c; }
      .trustright-score.poor .trustright-score-value { color: #dc2626; }

      .trustright-highlights {
        margin-bottom: 16px;
      }

      .trustright-highlight {
        padding: 8px 12px;
        margin-bottom: 6px;
        border-radius: 6px;
        font-size: 13px;
        border-left: 3px solid;
      }

      .trustright-highlight.positive {
        background: #f0f9ff;
        border-color: #0ea5e9;
        color: #0c4a6e;
      }

      .trustright-highlight.warning {
        background: #fffbeb;
        border-color: #f59e0b;
        color: #92400e;
      }

      .trustright-highlight.negative {
        background: #fef2f2;
        border-color: #ef4444;
        color: #991b1b;
      }

      .trustright-actions {
        display: flex;
        gap: 8px;
      }

      .trustright-action-btn {
        flex: 1;
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        color: #374151;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .trustright-action-btn:hover {
        background: #f9fafb;
        border-color: #ea580c;
      }

      .trustright-action-btn.primary {
        background: #ea580c;
        color: white;
        border-color: #ea580c;
      }

      .trustright-action-btn.primary:hover {
        background: #dc2626;
      }

      .trustright-loading {
        text-align: center;
        padding: 20px;
        color: #6b7280;
      }

      .trustright-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #f3f4f6;
        border-top: 2px solid #ea580c;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .trustright-minimized-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 20px;
        font-weight: 700;
        color: white;
        background: #ea580c;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .trustright-widget {
          top: 10px;
          right: 10px;
          width: 260px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  createWidget() {
    this.widget = document.createElement('div');
    this.widget.className = 'trustright-widget';
    this.widget.innerHTML = `
      <div class="trustright-header">
        <div class="trustright-logo">TrustRight</div>
        <div class="trustright-controls">
          <button class="trustright-btn" id="trustright-minimize" title="Minimize">−</button>
          <button class="trustright-btn" id="trustright-close" title="Close">×</button>
        </div>
      </div>
      <div class="trustright-content">
        <div class="trustright-loading">
          <div class="trustright-spinner"></div>
          Analyzing ${this.currentDomain}...
        </div>
      </div>
    `;

    document.body.appendChild(this.widget);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const minimizeBtn = this.widget.querySelector('#trustright-minimize');
    const closeBtn = this.widget.querySelector('#trustright-close');

    minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
    closeBtn?.addEventListener('click', () => this.close());

    // Make widget draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    const header = this.widget.querySelector('.trustright-header');
    header?.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragOffset.x = e.clientX - this.widget.offsetLeft;
      dragOffset.y = e.clientY - this.widget.offsetTop;
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    });

    const handleDrag = (e) => {
      if (!isDragging) return;
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      this.widget.style.left = Math.max(0, Math.min(x, window.innerWidth - this.widget.offsetWidth)) + 'px';
      this.widget.style.top = Math.max(0, Math.min(y, window.innerHeight - this.widget.offsetHeight)) + 'px';
      this.widget.style.right = 'auto';
    };

    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
  }

  toggleMinimize() {
    this.widget.classList.toggle('minimized');
    if (this.widget.classList.contains('minimized')) {
      this.widget.innerHTML = '<div class="trustright-minimized-content">TR</div>';
      this.widget.addEventListener('click', () => this.toggleMinimize());
    } else {
      this.widget.removeEventListener('click', this.toggleMinimize);
      this.createWidgetContent();
      this.attachEventListeners();
    }
  }

  close() {
    this.widget.style.animation = 'trustright-slide-in 0.3s ease reverse forwards';
    setTimeout(() => {
      this.widget?.remove();
      chrome.storage.local.set({ [this.currentDomain + '_dismissed']: true });
    }, 300);
  }

  async checkStoredAnalysis() {
    try {
      const result = await chrome.storage.local.get([this.currentDomain, this.currentDomain + '_dismissed']);

      if (result[this.currentDomain + '_dismissed']) {
        this.close();
        return;
      }

      if (result[this.currentDomain]) {
        this.analysisData = result[this.currentDomain];
        this.displayAnalysis();
      } else {
        this.performAnalysis();
      }
    } catch (error) {
      console.error('TrustRight: Storage check failed:', error);
      this.performAnalysis();
    }
  }

  async performAnalysis() {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    try {
      // Send message to background script to perform analysis
      const response = await chrome.runtime.sendMessage({
        action: 'analyzeWebsite',
        url: window.location.href,
        domain: this.currentDomain
      });

      if (response.success) {
        this.analysisData = response.data;
        await chrome.storage.local.set({ [this.currentDomain]: this.analysisData });
        this.displayAnalysis();
      } else {
        this.displayError(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('TrustRight: Analysis failed:', error);
      this.displayError('Unable to analyze website');
    } finally {
      this.isAnalyzing = false;
    }
  }

  displayAnalysis() {
    if (!this.analysisData) return;

    const { trustScore, company_name, recent_negative_press, lawsuits, political_donations } = this.analysisData;

    const scoreClass = this.getScoreClass(trustScore);
    const highlights = this.generateHighlights();

    this.widget.querySelector('.trustright-content').innerHTML = `
      <div class="trustright-domain">${company_name || this.currentDomain}</div>

      <div class="trustright-score ${scoreClass}">
        <div>
          <div class="trustright-score-value">${trustScore}/100</div>
          <div class="trustright-score-label">Trust Score</div>
        </div>
        <div class="trustright-score-indicator">
          ${this.getScoreEmoji(trustScore)}
        </div>
      </div>

      <div class="trustright-highlights">
        ${highlights.map(h => `
          <div class="trustright-highlight ${h.type}">
            ${h.text}
          </div>
        `).join('')}
      </div>

      <div class="trustright-actions">
        <button class="trustright-action-btn" onclick="window.open('${this.apiBase}?url=${encodeURIComponent(window.location.href)}', '_blank')">
          View Full Report
        </button>
        <button class="trustright-action-btn primary" onclick="window.open('${this.apiBase}/dashboard', '_blank')">
          Dashboard
        </button>
      </div>
    `;
  }

  getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'caution';
    return 'poor';
  }

  getScoreEmoji(score) {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    if (score >= 40) return '🔶';
    return '❌';
  }

  generateHighlights() {
    if (!this.analysisData) return [];

    const highlights = [];
    const { ssl_certificate, privacy_policy_present, recent_negative_press, lawsuits, political_donations, data_breach_history } = this.analysisData;

    // Positive indicators
    if (ssl_certificate) {
      highlights.push({ type: 'positive', text: '🔒 Secure SSL certificate detected' });
    }
    if (privacy_policy_present) {
      highlights.push({ type: 'positive', text: '📋 Privacy policy available' });
    }

    // Warning indicators
    if (political_donations?.length > 0) {
      highlights.push({ type: 'warning', text: `💰 ${political_donations.length} political donation(s) found` });
    }
    if (recent_negative_press?.length > 0) {
      highlights.push({ type: 'warning', text: `📰 ${recent_negative_press.length} recent negative press mention(s)` });
    }

    // Negative indicators
    if (lawsuits?.length > 0) {
      highlights.push({ type: 'negative', text: `⚖️ ${lawsuits.length} lawsuit(s) on record` });
    }
    if (data_breach_history?.length > 0) {
      highlights.push({ type: 'negative', text: `🛡️ ${data_breach_history.length} data breach(es) in history` });
    }

    return highlights.slice(0, 3); // Show max 3 highlights
  }

  displayError(message) {
    this.widget.querySelector('.trustright-content').innerHTML = `
      <div class="trustright-loading">
        <div style="color: #dc2626; margin-bottom: 12px;">⚠️</div>
        ${message}
        <div style="margin-top: 12px;">
          <button class="trustright-action-btn primary" onclick="window.open('${this.apiBase}', '_blank')">
            Analyze on TrustRight.app
          </button>
        </div>
      </div>
    `;
  }

  createWidgetContent() {
    if (this.analysisData) {
      this.displayAnalysis();
    } else {
      this.widget.innerHTML = `
        <div class="trustright-header">
          <div class="trustright-logo">TrustRight</div>
          <div class="trustright-controls">
            <button class="trustright-btn" id="trustright-minimize" title="Minimize">−</button>
            <button class="trustright-btn" id="trustright-close" title="Close">×</button>
          </div>
        </div>
        <div class="trustright-content">
          <div class="trustright-loading">
            <div class="trustright-spinner"></div>
            Analyzing ${this.currentDomain}...
          </div>
        </div>
      `;
      this.performAnalysis();
    }
  }
}

// Initialize the widget when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new TrustRightWidget(), 1000);
  });
} else {
  setTimeout(() => new TrustRightWidget(), 1000);
}