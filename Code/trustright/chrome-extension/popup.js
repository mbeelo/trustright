// TrustRight Chrome Extension - Popup Script
class TrustRightPopup {
  constructor() {
    this.currentTab = null;
    this.currentDomain = null;
    this.analysisData = null;
    this.userSession = null;
    this.apiBase = 'https://trustright.app';

    this.init();
  }

  async init() {
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
      this.currentDomain = this.extractDomain(tab.url);

      if (!this.currentDomain || this.shouldSkipDomain(this.currentDomain)) {
        this.showError('Cannot analyze this page');
        return;
      }

      // Update UI with current domain
      document.getElementById('current-domain').textContent = this.currentDomain;

      // Check for stored analysis
      await this.loadStoredData();

      // Initialize event listeners
      this.attachEventListeners();

      // Check authentication status
      await this.checkAuthStatus();

      // Show main content
      this.showMainContent();

    } catch (error) {
      console.error('TrustRight: Popup initialization failed:', error);
      this.showError('Failed to initialize extension');
    }
  }

  extractDomain(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }

  shouldSkipDomain(domain) {
    const skipDomains = [
      'trustright.app',
      'localhost',
      'chrome-extension:',
      'chrome:',
      'moz-extension:',
      'about:'
    ];
    return !domain || skipDomains.some(skip => domain.includes(skip));
  }

  async loadStoredData() {
    try {
      // Get extension status and other data
      const extensionStatus = await this.sendMessage({ action: 'getExtensionStatus' });

      const result = await chrome.storage.local.get([
        this.currentDomain,
        'userSession',
        'userUsage'
      ]);

      if (result[this.currentDomain]) {
        this.analysisData = result[this.currentDomain];
        this.displayAnalysisResults();
      }

      if (result.userSession) {
        this.userSession = result.userSession;
      }

      // Update extension toggle and usage display
      if (extensionStatus.success) {
        this.updateExtensionToggle(extensionStatus.enabled);
        if (extensionStatus.usage) {
          this.updateUsageDisplay(extensionStatus.usage);
        }
      }

      if (result.userUsage && !extensionStatus.usage) {
        this.updateUsageDisplay(result.userUsage);
      }
    } catch (error) {
      console.error('TrustRight: Failed to load stored data:', error);
    }
  }

  attachEventListeners() {
    // Analyze button
    document.getElementById('analyze-btn').addEventListener('click', () => {
      this.performAnalysis();
    });

    // Sign in button
    document.getElementById('sign-in-btn').addEventListener('click', () => {
      chrome.tabs.create({ url: `${this.apiBase}/auth/signin?utm_source=extension` });
    });

    // Dashboard button
    document.getElementById('dashboard-btn').addEventListener('click', () => {
      chrome.tabs.create({ url: `${this.apiBase}/dashboard?utm_source=extension` });
    });

    // Full report button
    document.getElementById('full-report-btn').addEventListener('click', () => {
      const url = this.currentTab?.url || '';
      chrome.tabs.create({
        url: `${this.apiBase}?url=${encodeURIComponent(url)}&utm_source=extension`
      });
    });

    // Extension toggle
    document.getElementById('extension-toggle').addEventListener('click', () => {
      this.toggleExtension();
    });
  }

  async checkAuthStatus() {
    try {
      // Check if user is signed in by trying to access a protected endpoint
      const response = await fetch(`${this.apiBase}/api/user/subscription`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        this.userSession = userData;
        await chrome.storage.local.set({ userSession: userData });
        this.updateUserInterface(userData);
      } else {
        // User not signed in
        this.showSignInPrompt();
      }
    } catch (error) {
      console.error('TrustRight: Auth check failed:', error);
      this.showSignInPrompt();
    }
  }

  async performAnalysis() {
    if (!this.currentTab?.url) {
      this.showError('No active tab found');
      return;
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    const originalText = analyzeBtn.textContent;

    try {
      analyzeBtn.textContent = 'Analyzing...';
      analyzeBtn.disabled = true;

      // Send message to background script to perform analysis
      const response = await chrome.runtime.sendMessage({
        action: 'analyzeWebsite',
        url: this.currentTab.url,
        domain: this.currentDomain
      });

      if (response.success) {
        this.analysisData = response.data;
        await chrome.storage.local.set({ [this.currentDomain]: this.analysisData });
        this.displayAnalysisResults();

        // Update usage if provided
        if (response.usage) {
          this.updateUsageDisplay(response.usage);
          await chrome.storage.local.set({ userUsage: response.usage });
        }
      } else {
        this.showError(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('TrustRight: Analysis failed:', error);
      this.showError('Failed to analyze website');
    } finally {
      analyzeBtn.textContent = originalText;
      analyzeBtn.disabled = false;
    }
  }

  displayAnalysisResults() {
    if (!this.analysisData) return;

    const {
      trustScore,
      company_name,
      recent_negative_press = [],
      lawsuits = [],
      political_donations = [],
      regulatory_violations = [],
      data_breach_history = []
    } = this.analysisData;

    // Update domain name if company name is available
    if (company_name) {
      document.getElementById('current-domain').textContent = company_name;
    }

    // Update trust score
    document.getElementById('score-value').textContent = `${trustScore}/100`;
    document.getElementById('score-indicator').textContent = this.getScoreEmoji(trustScore);

    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.className = `score-display ${this.getScoreClass(trustScore)}`;

    // Update quick stats
    const totalIssues = recent_negative_press.length + lawsuits.length + regulatory_violations.length + data_breach_history.length;
    document.getElementById('issues-count').textContent = totalIssues;
    document.getElementById('donations-count').textContent = political_donations.length;

    // Show analysis results
    document.getElementById('analysis-results').style.display = 'block';
  }

  updateUserInterface(userData) {
    if (!userData) return;

    // Show user info
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('sign-in-prompt').style.display = 'none';

    // Update user details
    const userName = userData.name || userData.email || 'User';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-avatar').textContent = userName.charAt(0).toUpperCase();

    const planName = this.getPlanName(userData.plan || 'free');
    document.getElementById('user-plan').textContent = planName;

    // Update usage
    this.updateUsageDisplay(userData);
  }

  updateUsageDisplay(usageData) {
    const searchesUsed = usageData.searchesUsed || 0;
    const searchesLimit = usageData.searchesLimit || 5;
    const usagePercentage = Math.min((searchesUsed / searchesLimit) * 100, 100);

    document.getElementById('usage-fill').style.width = `${usagePercentage}%`;
    document.getElementById('usage-text').textContent = `${searchesUsed} of ${searchesLimit} searches used`;

    // Enable/disable analyze button based on usage
    const analyzeBtn = document.getElementById('analyze-btn');
    if (searchesUsed >= searchesLimit) {
      analyzeBtn.textContent = 'Limit Reached';
      analyzeBtn.disabled = true;
    } else {
      analyzeBtn.textContent = 'Analyze';
      analyzeBtn.disabled = false;
    }
  }

  getPlanName(plan) {
    const planNames = {
      'free': 'Free Plan',
      'pro': 'Pro Plan',
      'enterprise': 'Enterprise Plan'
    };
    return planNames[plan] || 'Free Plan';
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

  showMainContent() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  }

  showSignInPrompt() {
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('sign-in-prompt').style.display = 'block';
  }

  showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').textContent = message;
    document.getElementById('error').style.display = 'block';

    // Still show main content for navigation
    setTimeout(() => {
      document.getElementById('main-content').style.display = 'block';
    }, 100);
  }

  updateExtensionToggle(enabled) {
    const toggle = document.getElementById('extension-toggle');
    const description = document.getElementById('toggle-description');

    if (enabled) {
      toggle.classList.add('active');
      description.textContent = 'Automatically analyze websites as you browse';
      description.classList.remove('disabled');
    } else {
      toggle.classList.remove('active');
      description.textContent = 'Auto-analysis disabled - click Analyze button to check websites';
      description.classList.add('disabled');
    }
  }

  async toggleExtension() {
    try {
      const result = await this.sendMessage({ action: 'toggleExtension' });

      if (result.success) {
        this.updateExtensionToggle(result.enabled);

        // Show feedback
        const description = document.getElementById('toggle-description');
        const originalText = description.textContent;

        description.textContent = result.message;
        description.style.color = result.enabled ? '#16a34a' : '#dc2626';

        setTimeout(() => {
          description.style.color = '';
          description.textContent = result.enabled
            ? 'Automatically analyze websites as you browse'
            : 'Auto-analysis disabled - click Analyze button to check websites';
        }, 2000);
      }
    } catch (error) {
      console.error('TrustRight: Failed to toggle extension:', error);
    }
  }
}

// Initialize popup when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new TrustRightPopup();
});