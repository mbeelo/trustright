# TrustRight Chrome Extension - Installation Guide

## Quick Installation (Developer Mode)

### Prerequisites
- Google Chrome 88+ or Microsoft Edge 88+
- Developer mode access

### Step-by-Step Installation

1. **Download the Extension**
   ```bash
   # Clone the main repository
   git clone https://github.com/trustright/trustright.git
   cd trustright/chrome-extension
   ```

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or use menu: **⋮ → More tools → Extensions**

3. **Enable Developer Mode**
   - Toggle **"Developer mode"** switch in the top-right corner
   - You should see additional buttons appear

4. **Load the Extension**
   - Click **"Load unpacked"** button
   - Navigate to and select the `chrome-extension` folder
   - Click **"Select Folder"** (Windows) or **"Open"** (Mac)

5. **Verify Installation**
   - The TrustRight extension should appear in your extensions list
   - You should see the TrustRight "TR" icon in your browser toolbar
   - The extension status should show as "Enabled"

### Testing the Extension

1. **Visit Any Website**
   - Navigate to any website (e.g., `https://example.com`)
   - Wait 1-2 seconds for the analysis widget to appear
   - The widget should slide in from the top-right corner

2. **Use the Popup**
   - Click the TrustRight icon in your toolbar
   - The popup should show the current website analysis
   - Try clicking "Analyze" to trigger fresh analysis

3. **Sign In (Optional)**
   - Click "Sign In to TrustRight" in the popup
   - This will open TrustRight.app in a new tab
   - Sign in with your existing account or create a new one

## Building from Source

### For Developers

```bash
# Install development dependencies
npm install

# Validate the extension
npm run validate

# Create distribution package
npm run build
```

### Creating a ZIP Package

```bash
# Build the extension package
npm run package

# This creates: trustright-extension.zip
# Ready for Chrome Web Store submission
```

## Troubleshooting

### Extension Not Loading
- **Check Chrome Version**: Requires Chrome 88+ for Manifest V3 support
- **Verify Folder**: Make sure you selected the `chrome-extension` folder, not individual files
- **Developer Mode**: Ensure Developer mode is enabled
- **Reload**: Try removing and re-adding the extension

### Widget Not Appearing
- **Wait**: The widget appears 1 second after page load
- **Supported Sites**: Only works on HTTP/HTTPS pages (not chrome:// pages)
- **Cache**: Clear browser cache and reload the page
- **Console**: Check browser console (F12) for any error messages

### Analysis Not Working
- **Internet Connection**: Requires connection to TrustRight.app API
- **Blocked Domains**: Some corporate networks may block requests
- **Rate Limits**: Free accounts limited to 5 analyses per month
- **Authentication**: Some features require signing in

### Popup Issues
- **Extension Icon**: Make sure the TrustRight icon is visible in the toolbar
- **Pin Extension**: Right-click the icon and select "Pin" to keep it visible
- **Popup Blocked**: Ensure popup blockers aren't interfering

## Advanced Configuration

### Development Setup

```bash
# Clone the repository
git clone https://github.com/trustright/trustright.git
cd trustright/chrome-extension

# Install web-ext for validation
npm install -g web-ext

# Validate extension
web-ext lint --source-dir=.

# Run in Firefox (for cross-browser testing)
web-ext run --source-dir=.
```

### Custom API Endpoint
For development or testing with a local TrustRight instance:

1. Edit `background.js`
2. Change `this.apiBase = 'https://trustright.app'` to your local URL
3. Reload the extension in Chrome

### Debugging
- **Background Script**: `chrome://extensions/` → TrustRight → "Service worker" → "Inspect"
- **Content Script**: Right-click page → "Inspect" → Console tab
- **Popup**: Right-click extension icon → "Inspect popup"

## Security Notes

### Permissions Explained
- **activeTab**: Only analyzes the current tab you're viewing
- **storage**: Caches analysis results for 24 hours
- **host_permissions**: Communicates only with TrustRight.app domains

### What the Extension Cannot Do
- ❌ Access other tabs or browsing history
- ❌ Read personal data from websites
- ❌ Track your activity across sites
- ❌ Modify website content

### Privacy Protection
- Analysis data cached locally for 24 hours only
- No tracking or analytics beyond basic usage stats
- API communication only when you actively analyze a site
- Full privacy policy: https://trustright.app/privacy

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "TrustRight - Website Transparency"
3. Click **"Remove"**
4. Confirm removal
5. All cached data will be automatically cleared

## Support

- **Documentation**: [TrustRight Support](https://trustright.app/contact)
- **Issues**: Report via the TrustRight contact form
- **Updates**: Extension will notify when updates are available

---

**Need Help?** Visit [trustright.app/contact](https://trustright.app/contact) for support.