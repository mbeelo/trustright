// Test script for smart domain recognition
// Run in browser console to test the logic

function getParentCompanyDomain(domain) {
  if (!domain) return null;

  // Define company domain families (same as in background.js)
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

// Test cases
const testCases = [
  // Amazon family
  ['amazon.com', 'amazon'],
  ['amazon.ca', 'amazon'],
  ['amazon.co.uk', 'amazon'],
  ['amazon.de', 'amazon'],

  // Google family
  ['google.com', 'google'],
  ['youtube.com', 'google'],
  ['gmail.com', 'google'],

  // Meta family
  ['facebook.com', 'meta'],
  ['instagram.com', 'meta'],
  ['whatsapp.com', 'meta'],

  // Unknown domains
  ['shopify.com', 'shopify'],
  ['example.co.uk', 'example'],
  ['test.com.au', 'test'],
  ['random.ca', 'random']
];

console.log('🧪 Testing Smart Domain Recognition');
console.log('='.repeat(40));

let passed = 0;
let failed = 0;

testCases.forEach(([input, expected]) => {
  const result = getParentCompanyDomain(input);
  const success = result === expected;

  console.log(`${success ? '✅' : '❌'} ${input} → ${result} ${success ? '' : `(expected: ${expected})`}`);

  if (success) passed++;
  else failed++;
});

console.log('='.repeat(40));
console.log(`📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! Smart domain recognition is working correctly.');
} else {
  console.log('⚠️ Some tests failed. Check the logic above.');
}