import OpenAI from 'openai';

// Create OpenAI client lazily to avoid build-time errors
let _openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // During build time or when API key is missing, return null
      // This prevents build-time errors during static generation
      return null;
    }
    _openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return _openai;
}

export interface WebsiteAnalysis {
  // Business Identity
  company_name: string;
  company_type: string | null;
  physical_location: { city: string | null; state: string | null; country: string | null };
  years_in_operation: number | null;
  domain_age_years: number | null;
  parent_company: string | null;
  ownership_structure: string | null;

  // Reputation Score
  average_review_rating: number | null;
  review_count: number | null;
  complaint_flags: string[];

  // Security & Safety
  ssl_certificate: boolean;
  secure_payment_methods: string[];
  privacy_policy_present: boolean;
  data_breach_history: Array<{ date: string; description: string }>;

  // Contact Verification
  phone_number: { value: string | null; status: "verified" | "unverified" | null };
  email_address: { value: string | null; status: "verified" | "unverified" | null };
  physical_address: { value: string | null; status: "verified" | "unverified" | "PO Box" | null };

  // Recent News & Controversies
  recent_news_mentions: Array<{ title: string; date: string; summary: string; url: string }>;
  lawsuits: Array<{ case_name: string; date: string; summary: string; court: string; url: string }>;
  regulatory_violations: Array<{ agency: string; violation: string; date: string; url: string }>;
  product_recalls: Array<{ product: string; date: string; description: string; url: string }>;
  major_controversies: Array<{ topic: string; date: string; summary: string; url: string }>;

  // Political & Financial Influence
  lobbying_activity: { status: boolean; expenditures: number | null; details: string | null };
  political_donations: Array<{ recipient: string; amount: number; year: number }>;
  pac_contributions: Array<{ pac_name: string; amount: number; year: number }>;
  trade_association_memberships: string[];
  industry_lobbying_positions: string[];

  // Corporate Behavior
  labor_practices_news: Array<{ title: string; date: string; summary: string; url: string }>;
  environmental_record: Array<{ issue: string; date: string; summary: string; url: string }>;
  tax_practices_controversies: Array<{ issue: string; year: number; summary: string; url: string }>;
  monopolistic_behavior: Array<{ incident: string; year: number; summary: string; url: string }>;
  exec_vs_worker_pay_ratio: number | null;

  // Red Flags Alert
  domain_age_under_6_months: boolean;
  whois_privacy_enabled: boolean;
  scam_database_matches: string[];
  excessive_discount_claims: boolean;
  missing_contact_info: boolean;
  recent_negative_press: Array<{ title: string; date: string; summary: string; url: string }>;

  // Trust Indicators
  bbb_accreditation_status: "accredited" | "not accredited" | "unverified";
  bbb_rating: string | null;
  industry_certifications: string[];
  social_media_presence_verified: boolean;
  return_policy_clearly_stated: boolean;
  business_registration_verified: boolean;
  charitable_giving_or_bcorp_status: string | null;

  // Legacy fields for compatibility
  domain: string;
  trustScore: number;
}

function getFallbackAnalysis(domain: string): WebsiteAnalysis {
  return {
    // Business Identity
    company_name: domain.charAt(0).toUpperCase() + domain.slice(1),
    company_type: null,
    physical_location: { city: null, state: null, country: null },
    years_in_operation: null,
    domain_age_years: null,
    parent_company: null,
    ownership_structure: null,

    // Reputation Score
    average_review_rating: null,
    review_count: null,
    complaint_flags: [],

    // Security & Safety
    ssl_certificate: true,
    secure_payment_methods: [],
    privacy_policy_present: false,
    data_breach_history: [],

    // Contact Verification
    phone_number: { value: null, status: null },
    email_address: { value: null, status: null },
    physical_address: { value: null, status: null },

    // Recent News & Controversies
    recent_news_mentions: [],
    lawsuits: [],
    regulatory_violations: [],
    product_recalls: [],
    major_controversies: [],

    // Political & Financial Influence
    lobbying_activity: { status: false, expenditures: null, details: null },
    political_donations: [],
    pac_contributions: [],
    trade_association_memberships: [],
    industry_lobbying_positions: [],

    // Corporate Behavior
    labor_practices_news: [],
    environmental_record: [],
    tax_practices_controversies: [],
    monopolistic_behavior: [],
    exec_vs_worker_pay_ratio: null,

    // Red Flags Alert
    domain_age_under_6_months: false,
    whois_privacy_enabled: false,
    scam_database_matches: [],
    excessive_discount_claims: false,
    missing_contact_info: true,
    recent_negative_press: [],

    // Trust Indicators
    bbb_accreditation_status: "unverified" as const,
    bbb_rating: null,
    industry_certifications: [],
    social_media_presence_verified: false,
    return_policy_clearly_stated: false,
    business_registration_verified: false,
    charitable_giving_or_bcorp_status: null,

    // Legacy fields
    domain: domain,
    trustScore: 50
  };
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

  console.log('Using native web search analysis for:', domain);

  const prompt = `Analyze the website at this URL: ${url}

CRITICAL: This is a transparency tool that helps users make informed decisions about which companies to support. Focus on finding ALL CONTROVERSIAL, HIDDEN, or CONCERNING information that users would want to know. Be COMPREHENSIVE and dig deep into the company's full history of controversies.

PRIORITIZE NEWS FROM THE LAST 5 YEARS - Focus especially on recent news mentions, lawsuits, and controversies.

Look for:

1. POLITICAL ACTIVITIES: Political donations, lobbying expenditures, PAC contributions, which politicians/parties they support. Include specific names and dollar amounts - if exact amounts unknown, note "Active, $ unknown"
2. CONTROVERSIAL BUSINESS PRACTICES: Who they refuse service to, exclusive partnerships, concerning client relationships, controversial stances
3. FINANCIAL TRANSPARENCY: Executive compensation ratios, tax avoidance strategies, offshore operations, major investors
4. CORPORATE BEHAVIOR: Labor disputes, environmental violations, regulatory fines, discrimination lawsuits, worker treatment
5. OWNERSHIP & CONTROL: Hidden parent companies, major investors, board connections to other controversial entities
6. LEGAL ISSUES: Search extensively for ALL lawsuits (not just recent ones), regulatory violations, government fines, settlement agreements, consent decrees
7. ENVIRONMENTAL/SAFETY RECORD: Pollution incidents, safety violations, environmental disasters, spills, contamination
8. HISTORICAL CONTROVERSIES: Past scandals, cover-ups, unethical practices, even if from previous years

IMPORTANT: Be COMPREHENSIVE - don't limit to just recent items. Look back 5-10 years for major controversies. Large corporations often have extensive histories of legal issues, violations, and scandals. Include specific dollar amounts, dates, names, and details.

For companies like oil companies, tobacco companies, pharmaceutical companies, tech giants, etc. - these typically have EXTENSIVE legal and regulatory histories that users should know about.

Research thoroughly using web search to find the COMPLETE picture of controversial information that would surprise users or influence their decision to support this company.

Return a JSON object with exactly these fields (use null/empty arrays if data not found):

{
  "company_name": "string",
  "company_type": "string or null",
  "physical_location": {"city": "string or null", "state": "string or null", "country": "string or null"},
  "years_in_operation": "number or null",
  "domain_age_years": "number or null",
  "parent_company": "string or null",
  "ownership_structure": "string or null",
  "average_review_rating": "number or null",
  "review_count": "number or null",
  "complaint_flags": ["array of strings"],
  "ssl_certificate": "boolean",
  "secure_payment_methods": ["array of strings"],
  "privacy_policy_present": "boolean",
  "data_breach_history": [{"date": "string", "description": "string"}],
  "phone_number": {"value": "string or null", "status": "verified/unverified/null"},
  "email_address": {"value": "string or null", "status": "verified/unverified/null"},
  "physical_address": {"value": "string or null", "status": "verified/unverified/PO Box/null"},
  "recent_news_mentions": [{"title": "string", "date": "string", "summary": "string", "url": "string"}],
  "lawsuits": [{"case_name": "string", "date": "string", "summary": "string", "court": "string", "url": "string"}],
  "regulatory_violations": [{"agency": "string", "violation": "string", "date": "string", "url": "string"}],
  "product_recalls": [{"product": "string", "date": "string", "description": "string", "url": "string"}],
  "major_controversies": [{"topic": "string", "date": "string", "summary": "string", "url": "string"}],
  "lobbying_activity": {"status": "boolean", "expenditures": "number or null", "details": "string or null"},
  "political_donations": [{"recipient": "string", "amount": "number", "year": "number"}],
  "pac_contributions": [{"pac_name": "string", "amount": "number", "year": "number"}],
  "trade_association_memberships": ["array of strings"],
  "industry_lobbying_positions": ["array of strings"],
  "labor_practices_news": [{"title": "string", "date": "string", "summary": "string", "url": "string"}],
  "environmental_record": [{"issue": "string", "date": "string", "summary": "string", "url": "string"}],
  "tax_practices_controversies": [{"issue": "string", "year": "number", "summary": "string", "url": "string"}],
  "monopolistic_behavior": [{"incident": "string", "year": "number", "summary": "string", "url": "string"}],
  "exec_vs_worker_pay_ratio": "number or null",
  "domain_age_under_6_months": "boolean",
  "whois_privacy_enabled": "boolean",
  "scam_database_matches": ["array of strings"],
  "excessive_discount_claims": "boolean",
  "missing_contact_info": "boolean",
  "recent_negative_press": [{"title": "string", "date": "string", "summary": "string", "url": "string"}],
  "bbb_accreditation_status": "accredited/not accredited/unverified",
  "bbb_rating": "string or null",
  "industry_certifications": ["array of strings"],
  "social_media_presence_verified": "boolean",
  "return_policy_clearly_stated": "boolean",
  "business_registration_verified": "boolean",
  "charitable_giving_or_bcorp_status": "string or null",
  "domain": "${domain}",
  "trustScore": "number 1-100"
}

Return ONLY the JSON object. No explanations, no markdown, no code blocks.`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log('OpenAI client not available (missing API key), using fallback data for', domain);
      return getFallbackAnalysis(domain);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-search-preview",
      web_search_options: {},
      messages: [
        {
          role: "system",
          content: "You are a business intelligence expert with web search capabilities. Research the company thoroughly using web search, then return ONLY valid JSON with all required fields."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    let response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Clean up the response - remove markdown code blocks if present
    response = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Parse JSON response
    let analysis: WebsiteAnalysis;
    try {
      analysis = JSON.parse(response);
      console.log('Web search analysis successful for:', domain);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', response);
      return getFallbackAnalysis(domain);
    }

    // Validate required fields
    if (!analysis.company_name || typeof analysis.trustScore !== 'number') {
      console.error('Invalid analysis structure, using fallback...');
      return getFallbackAnalysis(domain);
    }

    // Ensure required legacy fields exist for compatibility
    if (!analysis.domain) analysis.domain = domain;

    // Ensure arrays exist and are properly initialized
    const arrayFields = [
      'complaint_flags', 'secure_payment_methods', 'data_breach_history',
      'recent_news_mentions', 'lawsuits', 'regulatory_violations', 'product_recalls',
      'major_controversies', 'political_donations', 'pac_contributions',
      'trade_association_memberships', 'industry_lobbying_positions',
      'labor_practices_news', 'environmental_record', 'tax_practices_controversies',
      'monopolistic_behavior', 'scam_database_matches', 'recent_negative_press',
      'industry_certifications'
    ];

    arrayFields.forEach(field => {
      if (!Array.isArray((analysis as Record<string, unknown>)[field])) {
        (analysis as Record<string, unknown>)[field] = [];
      }
    });

    return analysis;
  } catch (error) {
    console.error('Error analyzing website:', error);
    console.log('Using fallback data for', domain);
    return getFallbackAnalysis(domain);
  }
}