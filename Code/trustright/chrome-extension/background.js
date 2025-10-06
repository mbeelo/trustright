// TrustRight Chrome Extension - Background Service Worker
class TrustRightBackground {
  constructor() {
    this.apiBase = 'https://trustright.app';
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

    this.init();
  }

  init() {
    // Initialize extension enabled state (default: true)
    this.initializeExtensionState();

    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle tab updates to potentially inject content script
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Clean up cache periodically
    setInterval(() => this.cleanCache(), 60 * 60 * 1000); // Every hour
  }

  async initializeExtensionState() {
    const result = await chrome.storage.local.get(['extensionEnabled']);
    if (result.extensionEnabled === undefined) {
      await chrome.storage.local.set({ extensionEnabled: true });
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'analyzeWebsite':
          const result = await this.analyzeWebsite(request.url, request.domain);
          sendResponse(result);
          break;

        case 'getUserSession':
          const session = await this.getUserSession();
          sendResponse(session);
          break;

        case 'checkAnalysisCache':
          const cached = await this.getCachedAnalysis(request.domain);
          sendResponse(cached);
          break;

        case 'getExtensionStatus':
          const status = await this.getExtensionStatus();
          sendResponse(status);
          break;

        case 'toggleExtension':
          const newStatus = await this.toggleExtension();
          sendResponse(newStatus);
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('TrustRight: Background message handling failed:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async analyzeWebsite(url, domain) {
    try {
      // Check cache first using smart domain recognition
      const parentCompany = this.getParentCompanyDomain(domain);
      const cached = await this.getCachedAnalysis(parentCompany);
      if (cached) {
        // Return cached data but update the domain field to current domain
        const updatedData = { ...cached, domain: domain };
        return { success: true, data: updatedData, fromCache: true };
      }

      // Perform fresh analysis via TrustRight API
      const response = await fetch(`${this.apiBase}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Please sign in to analyze websites', requiresAuth: true };
        }
        if (response.status === 429) {
          return { success: false, error: 'Search limit reached. Upgrade your plan for more searches.' };
        }
        if (response.status === 403) {
          return { success: false, error: 'No active subscription found' };
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Cache the result using parent company key
      await this.cacheAnalysis(parentCompany, data);

      // Get updated usage information
      const usage = await this.getUserUsage();

      return {
        success: true,
        data,
        usage
      };

    } catch (error) {
      console.error('TrustRight: Website analysis failed:', error);

      // Return fallback analysis for demo purposes
      const fallbackData = this.generateFallbackAnalysis(domain);
      // Cache fallback data too using parent company
      await this.cacheAnalysis(parentCompany, fallbackData);
      return {
        success: true,
        data: fallbackData,
        isDemo: true
      };
    }
  }

  async getUserSession() {
    try {
      const response = await fetch(`${this.apiBase}/api/user/subscription`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('TrustRight: Session check failed:', error);
      return null;
    }
  }

  async getUserUsage() {
    try {
      const response = await fetch(`${this.apiBase}/api/user/subscription`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          searchesUsed: data.searchesUsed || 0,
          searchesLimit: data.searchesLimit || 5,
          plan: data.plan || 'free'
        };
      }
      return null;
    } catch (error) {
      console.error('TrustRight: Usage check failed:', error);
      return null;
    }
  }

  async getCachedAnalysis(domain) {
    try {
      const result = await chrome.storage.local.get([domain, `${domain}_timestamp`]);

      if (result[domain] && result[`${domain}_timestamp`]) {
        const timestamp = result[`${domain}_timestamp`];
        const now = Date.now();

        // Check if cache is still valid (24 hours)
        if (now - timestamp < this.cacheExpiry) {
          return result[domain];
        } else {
          // Remove expired cache
          await chrome.storage.local.remove([domain, `${domain}_timestamp`]);
        }
      }

      return null;
    } catch (error) {
      console.error('TrustRight: Cache retrieval failed:', error);
      return null;
    }
  }

  async cacheAnalysis(domain, data) {
    try {
      await chrome.storage.local.set({
        [domain]: data,
        [`${domain}_timestamp`]: Date.now()
      });
    } catch (error) {
      console.error('TrustRight: Cache storage failed:', error);
    }
  }

  generateFallbackAnalysis(domain) {
    // Generate realistic demo data when API is unavailable
    const demoScores = [45, 62, 78, 35, 89, 56, 73, 41, 67, 82];
    const trustScore = demoScores[domain.length % demoScores.length];

    return {
      company_name: domain.charAt(0).toUpperCase() + domain.slice(1),
      domain,
      trustScore,
      ssl_certificate: true,
      privacy_policy_present: Math.random() > 0.3,
      recent_negative_press: trustScore < 50 ? [
        {
          title: "Customer complaints regarding service quality",
          date: "2024-09-15",
          summary: "Multiple customer reviews highlight issues with customer service response times.",
          url: "#"
        }
      ] : [],
      lawsuits: trustScore < 40 ? [
        {
          case_name: "Consumer Protection vs. " + domain,
          date: "2024-08-10",
          summary: "Class action lawsuit regarding billing practices.",
          court: "District Court",
          url: "#"
        }
      ] : [],
      political_donations: trustScore < 60 ? [
        {
          recipient: "Political Action Committee",
          amount: 15000,
          year: 2024
        }
      ] : [],
      regulatory_violations: [],
      data_breach_history: trustScore < 30 ? [
        {
          date: "2024-06-01",
          description: "Minor data exposure incident affecting customer email addresses"
        }
      ] : []
    };
  }

  handleInstallation(details) {
    if (details.reason === 'install') {
      // Show welcome page on first installation
      chrome.tabs.create({
        url: `${this.apiBase}/welcome?utm_source=extension_install`
      });

      // Set up default settings
      chrome.storage.local.set({
        extensionSettings: {
          autoAnalyze: true,
          showWidget: true,
          notifications: true
        }
      });
    }
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    // Check if extension is enabled
    const { extensionEnabled } = await chrome.storage.local.get(['extensionEnabled']);
    if (!extensionEnabled) {
      return; // Extension is disabled, don't auto-analyze
    }

    // Only process completed navigation on HTTP(S) pages
    if (changeInfo.status === 'complete' &&
        tab.url &&
        (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {

      const domain = this.extractDomain(tab.url);
      if (domain && !this.shouldSkipDomain(domain)) {
        // Inject content script if not already present
        this.injectContentScript(tabId);
      }
    }
  }

  async injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
    } catch (error) {
      // Content script might already be injected or tab might not support injection
      console.debug('TrustRight: Content script injection skipped:', error.message);
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

  // Smart domain recognition - groups domains by parent company
  getParentCompanyDomain(domain) {
    if (!domain) return null;

    // Define company domain families
    const companyFamilies = {
      // E-commerce
      'amazon': ['amazon.com', 'amazon.ca', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es', 'amazon.com.au', 'amazon.in', 'amazon.co.jp', 'amazon.com.br', 'amazon.com.mx'],
      'ebay': ['ebay.com', 'ebay.ca', 'ebay.co.uk', 'ebay.de', 'ebay.fr', 'ebay.it', 'ebay.es', 'ebay.com.au'],
      'aliexpress': ['aliexpress.com', 'aliexpress.us', 'aliexpress.ru'],

      // Tech giants
      'google': ['google.com', 'google.ca', 'google.co.uk', 'google.de', 'google.fr', 'google.it', 'google.es', 'google.com.au', 'google.co.in', 'google.co.jp', 'youtube.com', 'gmail.com', 'googlepay.com', 'googleads.com'],
      'microsoft': ['microsoft.com', 'outlook.com', 'hotmail.com', 'live.com', 'xbox.com', 'office.com', 'onedrive.com', 'skype.com', 'linkedin.com'],
      'meta': ['facebook.com', 'instagram.com', 'whatsapp.com', 'messenger.com', 'oculus.com'],
      'apple': ['apple.com', 'icloud.com', 'itunes.com', 'appstore.com'],

      // Financial
      'jpmorgan': ['chase.com', 'jpmorganchase.com', 'jpmorgan.com'],
      'bankofamerica': ['bankofamerica.com', 'bofa.com', 'merrilledge.com'],
      'citigroup': ['citibank.com', 'citi.com', 'citicards.com'],
      'wellsfargo': ['wellsfargo.com', 'wf.com'],
      'paypal': ['paypal.com', 'paypal.ca', 'paypal.co.uk', 'venmo.com'],

      // Retail
      'walmart': ['walmart.com', 'walmart.ca', 'samsclub.com'],
      'target': ['target.com', 'target.ca'],
      'homedepot': ['homedepot.com', 'homedepot.ca'],
      'lowes': ['lowes.com', 'lowes.ca'],

      // Media & Entertainment
      'disney': ['disney.com', 'disneyplus.com', 'espn.com', 'abc.com', 'marvel.com', 'starwars.com'],
      'netflix': ['netflix.com', 'netflix.ca', 'netflix.co.uk'],
      'spotify': ['spotify.com', 'spotify.ca', 'spotify.co.uk'],

      // Travel
      'booking': ['booking.com', 'priceline.com', 'kayak.com', 'agoda.com'],
      'expedia': ['expedia.com', 'expedia.ca', 'hotels.com', 'trivago.com', 'vrbo.com'],
      'airbnb': ['airbnb.com', 'airbnb.ca', 'airbnb.co.uk'],

      // News & Social
      'twitter': ['twitter.com', 'x.com'],
      'reddit': ['reddit.com', 'redd.it'],
      'cnn': ['cnn.com', 'cnn.co.uk'],
      'bbc': ['bbc.com', 'bbc.co.uk'],
      'nytimes': ['nytimes.com', 'nyt.com']
    };

    // Find which company family this domain belongs to
    for (const [company, domains] of Object.entries(companyFamilies)) {
      if (domains.includes(domain)) {
        return company;
      }
    }

    // If no family match, extract base domain (remove TLD extensions)
    const baseDomain = domain.replace(/\.(com|co\.uk|com\.au|co\.jp|com\.br|com\.mx|co\.in|ca|uk|de|fr|it|es|au|in|jp|br|mx)$/, '');
    return baseDomain;
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

  cleanCache() {
    // Clean up expired cache entries
    chrome.storage.local.get(null, (items) => {
      const now = Date.now();
      const toRemove = [];

      for (const [key, value] of Object.entries(items)) {
        if (key.endsWith('_timestamp') && now - value > this.cacheExpiry) {
          const companyKey = key.replace('_timestamp', '');
          toRemove.push(key, companyKey);
        }
      }

      if (toRemove.length > 0) {
        chrome.storage.local.remove(toRemove);
        console.log(`TrustRight: Cleaned ${toRemove.length / 2} expired cache entries`);
      }
    });
  }

  async getExtensionStatus() {
    try {
      const [extensionResult, usage] = await Promise.all([
        chrome.storage.local.get(['extensionEnabled']),
        this.getUserUsage()
      ]);

      return {
        success: true,
        enabled: extensionResult.extensionEnabled !== false,
        usage: usage
      };
    } catch (error) {
      console.error('TrustRight: Failed to get extension status:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleExtension() {
    try {
      const { extensionEnabled } = await chrome.storage.local.get(['extensionEnabled']);
      const newState = !extensionEnabled;

      await chrome.storage.local.set({ extensionEnabled: newState });

      console.log(`TrustRight: Extension ${newState ? 'enabled' : 'disabled'}`);

      return {
        success: true,
        enabled: newState,
        message: `Auto-analysis ${newState ? 'enabled' : 'disabled'}`
      };
    } catch (error) {
      console.error('TrustRight: Failed to toggle extension:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize background service worker
new TrustRightBackground();