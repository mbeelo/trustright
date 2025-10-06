# TrustRight Chrome Extension

**Instantly analyze any website's transparency, ownership, and trust score while you browse.**

## Features

### 🔍 **Automatic Website Analysis**
- Real-time trust scoring (0-100) for any website
- Comprehensive transparency reports including:
  - Company ownership and structure
  - Political donations and lobbying activities
  - Legal issues and regulatory violations
  - Security certificates and privacy policies
  - Recent news and controversies

### 🎯 **Smart Floating Widget**
- Appears automatically on new websites
- Draggable and minimizable interface
- Color-coded trust indicators
- Key findings at a glance
- Direct links to full reports

### 📊 **Professional Popup Interface**
- Clean, TrustRight-branded design
- Quick analysis trigger
- Usage tracking and limits display
- Seamless authentication integration
- Direct access to dashboard and full reports

### 🔐 **Seamless Integration**
- Works with existing TrustRight accounts
- Syncs usage across devices
- Respects subscription limits
- Secure API communication

## Installation

### From Chrome Web Store (Recommended)
*Coming soon - currently in development*

### Manual Installation (Developer Mode)
1. Download or clone the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `chrome-extension` folder
5. The TrustRight extension icon should appear in your toolbar

## Usage

### Automatic Analysis
- Simply browse the web normally
- The extension automatically detects new websites
- A floating widget appears with instant trust analysis
- Click for detailed breakdown or dismiss if not needed

### Manual Analysis
- Click the TrustRight extension icon in your toolbar
- View current page analysis and trust score
- Click "Analyze" to trigger fresh analysis
- Access full reports and dashboard

### Account Management
- Sign in through the popup or widget
- Track your usage across Free/Pro/Enterprise plans
- Manage subscriptions from the main TrustRight website

## Privacy & Permissions

### Required Permissions
- **Active Tab**: To analyze the current website you're viewing
- **Storage**: To cache analysis results and user preferences

### Host Permissions
- **TrustRight domains**: To communicate with our API for analysis

### What We Don't Do
- ❌ Read your browsing history
- ❌ Access personal data from other sites
- ❌ Track you across the web
- ❌ Share your data with third parties

## Technical Details

### Browser Compatibility
- Chrome 88+ (Manifest V3)
- Microsoft Edge 88+
- Other Chromium-based browsers

### Performance
- Lightweight: < 500KB total size
- Minimal impact on browsing speed
- 24-hour intelligent caching
- Lazy loading of analysis components

### Security
- Secure HTTPS-only communication
- No sensitive data stored locally
- Manifest V3 compliance
- Content Security Policy enforced

## Development

### Project Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Injected script for website analysis
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16px to 128px)
└── README.md             # This file
```

### Key Features Implementation
- **Content Script**: Automatically injects analysis widget
- **Background Worker**: Handles API communication and caching
- **Popup Interface**: Provides manual controls and account management
- **Local Storage**: Caches results for 24 hours to improve performance

### API Integration
- Communicates with TrustRight production API at `https://trustright.app`
- Handles authentication via cookies
- Graceful fallback with demo data when offline
- Proper error handling for rate limits and subscription issues

## Support

### Getting Help
- Visit [TrustRight Support](https://trustright.app/contact)
- Report issues via the contact form
- Check the FAQ section on our website

### Known Issues
- Some corporate networks may block analysis requests
- Extensions disabled in incognito mode by default
- Chrome's new tab page cannot be analyzed

## Privacy Policy

Your privacy is important to us. This extension:
- Only analyzes websites when you visit them
- Stores minimal data locally for caching
- Does not track your browsing habits
- Follows TrustRight's main privacy policy

For full details, see: [TrustRight Privacy Policy](https://trustright.app/privacy)

## License

© 2024 TrustRight. All rights reserved.

---

**TrustRight Chrome Extension v1.0.0**
*Know before you trust.*