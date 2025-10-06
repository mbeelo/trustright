import puppeteer from 'puppeteer';
import { whois } from 'whois';
import { promisify } from 'util';

const whoisAsync = promisify(whois);

export interface ScrapedData {
  // Technical verification
  ssl_certificate: boolean;
  domain_age_years: number | null;
  domain_age_under_6_months: boolean;
  whois_privacy_enabled: boolean;

  // Contact information extracted from website
  phone_number: { value: string | null; status: 'verified' | 'unverified' | null };
  email_address: { value: string | null; status: 'verified' | 'unverified' | null };
  physical_address: { value: string | null; status: 'verified' | 'unverified' | 'PO Box' | null };

  // Business details from website
  company_name: string;
  company_type: string | null;
  physical_location: { city: string | null; state: string | null; country: string | null };

  // Website analysis
  privacy_policy_present: boolean;
  return_policy_clearly_stated: boolean;
  secure_payment_methods: string[];

  // Content analysis
  excessive_discount_claims: boolean;
  missing_contact_info: boolean;

  // Security headers and indicators
  security_headers: string[];
}

export async function scrapeWebsiteData(url: string): Promise<ScrapedData> {
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

  let browser;
  const scrapedData: ScrapedData = {
    ssl_certificate: false,
    domain_age_years: null,
    domain_age_under_6_months: false,
    whois_privacy_enabled: false,
    phone_number: { value: null, status: null },
    email_address: { value: null, status: null },
    physical_address: { value: null, status: null },
    company_name: domain.charAt(0).toUpperCase() + domain.slice(1),
    company_type: null,
    physical_location: { city: null, state: null, country: null },
    privacy_policy_present: false,
    return_policy_clearly_stated: false,
    secure_payment_methods: [],
    excessive_discount_claims: false,
    missing_contact_info: false,
    security_headers: [],
  };

  try {
    // Launch browser for web scraping
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set user agent and viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the website with timeout
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await page.goto(fullUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Check SSL certificate
    scrapedData.ssl_certificate = fullUrl.startsWith('https://');

    // Extract page content (stored for potential future use)
    await page.content();
    const title = await page.title();

    // Update company name from title if available
    if (title && title.length > 0 && title !== domain) {
      scrapedData.company_name = title.split('|')[0].split('-')[0].trim();
    }

    // Look for contact information
    const pageText = await page.evaluate(() => document.body.innerText);

    // Phone number detection
    const phoneRegex = /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g;
    const phoneMatches = pageText.match(phoneRegex);
    if (phoneMatches && phoneMatches.length > 0) {
      scrapedData.phone_number = {
        value: phoneMatches[0].trim(),
        status: 'unverified' // We found it on the site but haven't verified it works
      };
    }

    // Email detection
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = pageText.match(emailRegex);
    if (emailMatches && emailMatches.length > 0) {
      // Filter out obvious spam/generic emails
      const validEmails = emailMatches.filter(email =>
        !email.includes('example.com') &&
        !email.includes('test@') &&
        !email.includes('noreply')
      );
      if (validEmails.length > 0) {
        scrapedData.email_address = {
          value: validEmails[0],
          status: 'unverified'
        };
      }
    }

    // Address detection (simple pattern matching)
    const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)/gi;
    const addressMatches = pageText.match(addressRegex);
    if (addressMatches && addressMatches.length > 0) {
      scrapedData.physical_address = {
        value: addressMatches[0].trim(),
        status: addressMatches[0].toLowerCase().includes('po box') ||
                addressMatches[0].toLowerCase().includes('p.o. box') ? 'PO Box' : 'unverified'
      };
    }

    // Check for privacy policy
    const privacyLinks = await page.$$eval('a[href*="privacy"], a[href*="Privacy"]', links =>
      links.map(link => link.href)
    );
    scrapedData.privacy_policy_present = privacyLinks.length > 0;

    // Check for return policy
    const returnLinks = await page.$$eval('a[href*="return"], a[href*="refund"], a[href*="Return"]', links =>
      links.map(link => link.href)
    );
    scrapedData.return_policy_clearly_stated = returnLinks.length > 0;

    // Look for payment methods
    const paymentText = pageText.toLowerCase();
    const paymentMethods = [];
    if (paymentText.includes('visa') || paymentText.includes('mastercard') || paymentText.includes('credit card')) {
      paymentMethods.push('Credit Cards');
    }
    if (paymentText.includes('paypal')) paymentMethods.push('PayPal');
    if (paymentText.includes('stripe')) paymentMethods.push('Stripe');
    if (paymentText.includes('apple pay')) paymentMethods.push('Apple Pay');
    if (paymentText.includes('google pay')) paymentMethods.push('Google Pay');
    scrapedData.secure_payment_methods = paymentMethods;

    // Check for excessive discount claims
    const discountRegex = /(\d{2,3}%\s*off|save\s*\d{2,3}%|\d{2,3}%\s*discount)/gi;
    scrapedData.excessive_discount_claims = (pageText.match(discountRegex) || []).length > 3;

    // Check if contact info is missing
    scrapedData.missing_contact_info = !scrapedData.phone_number.value &&
                                       !scrapedData.email_address.value &&
                                       !scrapedData.physical_address.value;

    // Get security headers
    const securityHeaders = [];
    if (response) {
      const headers = response.headers();
      if (headers['strict-transport-security']) securityHeaders.push('HSTS');
      if (headers['content-security-policy']) securityHeaders.push('CSP');
      if (headers['x-frame-options']) securityHeaders.push('X-Frame-Options');
      if (headers['x-content-type-options']) securityHeaders.push('X-Content-Type-Options');
    }
    scrapedData.security_headers = securityHeaders;

  } catch (error) {
    console.error('Error scraping website:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Get WHOIS data for domain age and registration info
  try {
    const whoisData = await whoisAsync(domain);
    if (whoisData) {
      // Parse creation date
      const creationDateMatch = whoisData.match(/Creation Date:\s*(.+)/i) ||
                               whoisData.match(/Created:\s*(.+)/i) ||
                               whoisData.match(/Registered:\s*(.+)/i);

      if (creationDateMatch) {
        const creationDate = new Date(creationDateMatch[1].trim());
        const now = new Date();
        const ageInYears = (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

        scrapedData.domain_age_years = Math.floor(ageInYears);
        scrapedData.domain_age_under_6_months = ageInYears < 0.5;
      }

      // Check for privacy protection
      scrapedData.whois_privacy_enabled = whoisData.toLowerCase().includes('privacy') ||
                                          whoisData.toLowerCase().includes('redacted') ||
                                          whoisData.toLowerCase().includes('whoisguard');
    }
  } catch (error) {
    console.error('Error getting WHOIS data:', error);
  }

  return scrapedData;
}