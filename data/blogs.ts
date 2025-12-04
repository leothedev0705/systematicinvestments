export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: Author;
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export type BlogCategory = 
  | 'mfd-news'
  | 'markets'
  | 'mutual-funds'
  | 'economy'
  | 'regulations'
  | 'wealth-management'
  | 'personal-finance'
  | 'expert-views';

export const categories: Record<BlogCategory, { name: string; color: string; description: string }> = {
  'mfd-news': { 
    name: 'MFD News', 
    color: '#DC2626',
    description: 'Latest updates for Mutual Fund Distributors'
  },
  'markets': { 
    name: 'Markets', 
    color: '#059669',
    description: 'Stock market analysis and insights'
  },
  'mutual-funds': { 
    name: 'Mutual Funds', 
    color: '#7C3AED',
    description: 'Fund performance and recommendations'
  },
  'economy': { 
    name: 'Economy', 
    color: '#0891B2',
    description: 'Macroeconomic news and analysis'
  },
  'regulations': { 
    name: 'Regulations', 
    color: '#CA8A04',
    description: 'SEBI and regulatory updates'
  },
  'wealth-management': { 
    name: 'Wealth Management', 
    color: '#0A2540',
    description: 'Strategies for HNI clients'
  },
  'personal-finance': { 
    name: 'Personal Finance', 
    color: '#DB2777',
    description: 'Tips for individual investors'
  },
  'expert-views': { 
    name: 'Expert Views', 
    color: '#EA580C',
    description: 'Opinions from industry leaders'
  },
};

export const authors: Author[] = [
  {
    name: 'Vivek Bhande',
    role: 'Founder & Chief Investment Advisor',
    avatar: '/images/founder.png',
  },
  {
    name: 'Market Desk',
    role: 'Research Team',
    avatar: '/images/logo.png',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'sebi-new-mfd-regulations-2024',
    title: 'SEBI Announces New MFD Regulations: What Distributors Need to Know in 2024',
    excerpt: 'The Securities and Exchange Board of India has released comprehensive guidelines affecting commission structures and compliance requirements for mutual fund distributors.',
    content: `
## Key Highlights of the New SEBI Regulations

The Securities and Exchange Board of India (SEBI) has unveiled a comprehensive set of regulations that will significantly impact how Mutual Fund Distributors (MFDs) operate in the coming year. These changes are aimed at enhancing transparency, protecting investor interests, and streamlining the distribution ecosystem.

### Commission Structure Changes

One of the most significant changes involves the restructuring of commission payouts. Under the new framework:

- **Trail commissions** will now be calculated on a daily basis rather than monthly
- **Upfront commissions** for equity schemes have been capped at 1% of the investment amount
- **Performance-linked incentives** are now permitted but subject to strict disclosure norms

### Enhanced Compliance Requirements

MFDs will need to comply with additional regulatory requirements:

1. **Annual certification renewal** is now mandatory with updated examination requirements
2. **Digital record-keeping** for a minimum of 8 years for all client transactions
3. **Monthly compliance reports** to be submitted through the AMFI portal
4. **Client risk profiling** must be updated every 12 months

### Impact on Small and Medium MFDs

The regulations have provisions specifically designed to support smaller distributors:

> "These measures ensure that the mutual fund distribution ecosystem remains vibrant and accessible to distributors of all sizes while maintaining the highest standards of investor protection." - SEBI Chairman

### Timeline for Implementation

| Requirement | Effective Date |
|-------------|----------------|
| Commission restructuring | April 1, 2024 |
| Enhanced KYC norms | July 1, 2024 |
| Digital compliance | October 1, 2024 |

### What MFDs Should Do Now

1. Review your current commission agreements with AMCs
2. Update your compliance infrastructure
3. Attend AMFI-certified training programs
4. Communicate changes to your clients proactively

The full circular with detailed guidelines is available on the SEBI website.
    `,
    category: 'mfd-news',
    author: authors[0],
    publishedAt: '2024-12-04T08:00:00Z',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    tags: ['SEBI', 'MFD', 'Regulations', 'Compliance'],
    featured: true,
    trending: true,
  },
  {
    id: '2',
    slug: 'nifty-50-hits-all-time-high-december-2024',
    title: 'Nifty 50 Hits All-Time High: FII Inflows Drive Market Rally',
    excerpt: 'Indian equity markets surged to record levels as foreign institutional investors pumped in over ₹15,000 crore in November, marking the strongest monthly inflow in 2024.',
    content: `
## Markets Scale New Peaks

The Nifty 50 index breached the 21,000 mark for the first time in history, driven by robust foreign institutional investor (FII) inflows and positive global cues.

### Key Market Movers

**Top Gainers:**
- Reliance Industries: +4.2%
- HDFC Bank: +3.8%
- Infosys: +3.5%
- TCS: +2.9%

**Sector Performance:**
- IT: +4.1%
- Banking: +3.2%
- Auto: +2.8%
- Pharma: +1.9%

### FII Activity Analysis

Foreign investors have been net buyers for 15 consecutive trading sessions, with cumulative inflows exceeding ₹45,000 crore in Q4 2024.

### Expert Take

"The current rally is supported by strong fundamentals. Corporate earnings growth remains robust, and India's macroeconomic stability makes it an attractive destination for global capital," says our Chief Investment Advisor.

### What Should Investors Do?

For long-term investors, systematic investment through SIPs remains the best strategy. Avoid timing the market and stay invested in quality funds aligned with your risk profile.
    `,
    category: 'markets',
    author: authors[1],
    publishedAt: '2024-12-03T14:30:00Z',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop',
    tags: ['Nifty', 'FII', 'Markets', 'Rally'],
    trending: true,
  },
  {
    id: '3',
    slug: 'best-performing-mutual-funds-2024',
    title: 'Top 10 Best Performing Mutual Funds of 2024: Complete Analysis',
    excerpt: 'A comprehensive review of the mutual funds that delivered exceptional returns this year, with insights on their investment strategies and future outlook.',
    content: `
## Year in Review: Mutual Fund Performance

2024 has been a remarkable year for equity mutual funds, with several schemes delivering returns exceeding 40%.

### Top Performers by Category

#### Large Cap Funds
1. **Axis Bluechip Fund** - 32.5% returns
2. **Mirae Asset Large Cap** - 31.2% returns
3. **ICICI Pru Bluechip** - 29.8% returns

#### Mid Cap Funds
1. **Kotak Emerging Equity** - 45.2% returns
2. **HDFC Mid-Cap Opportunities** - 42.1% returns
3. **Nippon India Growth** - 40.8% returns

#### Small Cap Funds
1. **Nippon India Small Cap** - 52.3% returns
2. **SBI Small Cap** - 48.7% returns
3. **Axis Small Cap** - 47.2% returns

### Selection Criteria

Our analysis considered:
- 1-year, 3-year, and 5-year returns
- Risk-adjusted performance (Sharpe ratio)
- Consistency of returns
- Fund manager experience
- AUM and expense ratio

### Investment Recommendation

Past performance doesn't guarantee future results. Investors should:
- Align fund selection with financial goals
- Consider their risk appetite
- Diversify across categories
- Review portfolios periodically
    `,
    category: 'mutual-funds',
    author: authors[0],
    publishedAt: '2024-12-02T10:00:00Z',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=600&fit=crop',
    tags: ['Mutual Funds', 'Performance', 'Best Funds', '2024'],
    featured: true,
  },
  {
    id: '4',
    slug: 'rbi-repo-rate-decision-impact-debt-funds',
    title: 'RBI Holds Repo Rate: Impact on Debt Mutual Funds Explained',
    excerpt: 'The Reserve Bank maintains status quo on interest rates. We analyze what this means for debt fund investors and the fixed income market.',
    content: `
## RBI Monetary Policy: Key Takeaways

The Reserve Bank of India has decided to keep the repo rate unchanged at 6.5% for the eighth consecutive time, citing inflation concerns.

### Impact on Debt Funds

**Short Duration Funds:**
- Likely to benefit from stable rates
- Expected returns: 7-7.5% over the next year

**Long Duration Funds:**
- May see moderate gains if rate cuts materialize in 2024
- Higher duration risk to consider

**Corporate Bond Funds:**
- Credit spreads remain attractive
- Quality issuers preferred

### Our Recommendation

Given the current scenario, we recommend:
1. **Maintain allocation** to short-duration funds for stability
2. **Gradual increase** in medium-duration funds
3. **Avoid** excessive exposure to long-duration strategies

### What's Next?

Market consensus suggests potential rate cuts starting Q2 2024, which could benefit gilt and long-duration funds.
    `,
    category: 'economy',
    author: authors[1],
    publishedAt: '2024-12-01T16:00:00Z',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop',
    tags: ['RBI', 'Repo Rate', 'Debt Funds', 'Interest Rates'],
  },
  {
    id: '5',
    slug: 'amfi-mfd-registration-process-2024',
    title: 'Complete Guide to AMFI MFD Registration: Step-by-Step Process',
    excerpt: 'Everything you need to know about becoming a registered Mutual Fund Distributor - eligibility, examination, documentation, and tips for success.',
    content: `
## How to Become a Mutual Fund Distributor

The mutual fund distribution business offers an excellent opportunity for financial professionals. Here's your complete guide to AMFI registration.

### Eligibility Criteria

- Minimum age: 18 years
- Educational qualification: Class 10 pass (minimum)
- Clean regulatory track record
- Valid PAN card

### Registration Process

#### Step 1: Pass the NISM Exam
- Enroll for NISM Series V-A: Mutual Fund Distributors Certification
- Exam fee: ₹1,500
- Validity: 3 years

#### Step 2: Documentation
Required documents:
- PAN card copy
- Address proof
- Educational certificates
- Passport size photographs
- NISM certificate

#### Step 3: ARN Application
- Apply through AMFI portal
- Pay registration fee (₹3,000 for individuals)
- Submit documents online

#### Step 4: Empanelment
- Register with individual AMCs
- Complete KYD (Know Your Distributor)
- Start distribution

### Tips for Success

1. Build domain knowledge continuously
2. Focus on client relationships
3. Embrace technology
4. Stay compliant
5. Join industry associations

### Commission Structure

| Scheme Type | Typical Commission |
|-------------|-------------------|
| Equity Funds | 0.5% - 1.0% trail |
| Debt Funds | 0.2% - 0.5% trail |
| Liquid Funds | 0.05% - 0.1% trail |
    `,
    category: 'mfd-news',
    author: authors[0],
    publishedAt: '2024-11-30T09:00:00Z',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    tags: ['AMFI', 'MFD Registration', 'NISM', 'Career'],
  },
  {
    id: '6',
    slug: 'sip-vs-lumpsum-market-highs',
    title: 'SIP vs Lumpsum at Market Highs: Data-Driven Analysis',
    excerpt: 'Should you invest lumpsum when markets are at all-time highs? Our 20-year analysis reveals surprising insights about investment timing.',
    content: `
## The Eternal Debate: SIP vs Lumpsum

With markets at record highs, investors often wonder: Should I wait for a correction or invest now?

### Historical Analysis (2004-2024)

We analyzed investments made at every all-time high over the past 20 years.

**Key Findings:**

- **85%** of lumpsum investments at ATH were profitable after 3 years
- **92%** were profitable after 5 years
- **100%** were profitable after 7+ years

### SIP Advantage

SIPs eliminate timing risk entirely:
- Rupee cost averaging smoothens volatility
- Disciplined approach removes emotional decisions
- Works in all market conditions

### Verdict

**For Available Corpus:**
- If you can stay invested 5+ years: Lumpsum is fine
- If horizon is shorter: Consider staggered deployment

**For Monthly Savings:**
- SIP remains the gold standard
- Never try to time SIP investments

### Case Study

₹10 Lakh invested at Nifty's ATH in October 2021:
- 1-year return: -8%
- 2-year return: +15%
- 3-year return (Dec 2024): +42%

Lesson: Time in the market beats timing the market.
    `,
    category: 'personal-finance',
    author: authors[0],
    publishedAt: '2024-11-29T11:30:00Z',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&h=600&fit=crop',
    tags: ['SIP', 'Lumpsum', 'Investment Strategy', 'Market Timing'],
    featured: true,
  },
  {
    id: '7',
    slug: 'wealth-management-strategies-hnI-2024',
    title: 'Wealth Management Strategies for HNI Investors in 2024',
    excerpt: 'Exclusive insights on portfolio construction, tax optimization, and succession planning for high net-worth individuals.',
    content: `
## Sophisticated Strategies for Wealth Preservation

High net-worth investors require customized approaches that go beyond standard investment advice.

### Asset Allocation Framework

**Conservative HNI (Age 55+):**
- Equity: 30-40%
- Fixed Income: 40-50%
- Alternatives: 10-20%
- Gold: 5-10%

**Growth-Oriented HNI:**
- Equity: 50-60%
- Fixed Income: 20-30%
- Alternatives: 15-25%
- Gold: 5%

### Tax Optimization Strategies

1. **Equity investments**: Utilize ₹1.25L LTCG exemption annually
2. **Debt allocation**: Consider tax-efficient categories
3. **Insurance**: Use term plans for pure protection
4. **Family structures**: Consider HUF for additional tax benefits

### Alternative Investments

For portfolios above ₹5 Crore, consider:
- Real Estate Investment Trusts (REITs)
- Infrastructure Investment Trusts (InvITs)
- Private equity (through Category II AIFs)
- Structured products

### Succession Planning

Essential documents:
- Will registration
- Nomination updates
- Power of attorney
- Family trust (for larger estates)

### Our HNI Services

At Systematic Investments, we offer personalized wealth management with dedicated relationship managers for clients with investible surplus above ₹1 Crore.
    `,
    category: 'wealth-management',
    author: authors[0],
    publishedAt: '2024-11-28T08:00:00Z',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=600&fit=crop',
    tags: ['HNI', 'Wealth Management', 'Tax Planning', 'Portfolio'],
  },
  {
    id: '8',
    slug: 'sebi-trail-commission-rationalization',
    title: 'SEBI Trail Commission Rationalization: Complete Impact Assessment',
    excerpt: 'Breaking down the new trail commission structure and its implications for MFDs, AMCs, and investors.',
    content: `
## Understanding the New Commission Framework

SEBI's rationalization of trail commissions marks a significant shift in the mutual fund distribution landscape.

### What's Changing?

**Old Structure:**
- Varying trail rates across AMCs
- Higher rates for AUM growth
- Minimal disclosure requirements

**New Structure:**
- Standardized trail across scheme categories
- Transparent disclosure to investors
- Performance-linked components

### Impact Matrix

| Stakeholder | Short-term Impact | Long-term Outlook |
|-------------|-------------------|-------------------|
| Large MFDs | Moderate | Positive |
| Small MFDs | Challenging | Neutral |
| AMCs | Negative | Positive |
| Investors | Positive | Positive |

### Adaptation Strategies for MFDs

1. **Diversify revenue streams**
   - Financial planning fees
   - Insurance distribution
   - Portfolio management referrals

2. **Enhance client relationships**
   - Focus on service quality
   - Regular portfolio reviews
   - Educational content

3. **Technology adoption**
   - Digital onboarding
   - Automated reporting
   - Client engagement tools

### Industry Response

Major AMCs have already begun restructuring their distribution agreements. MFDs should expect communication regarding revised terms.
    `,
    category: 'regulations',
    author: authors[1],
    publishedAt: '2024-11-27T13:00:00Z',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop',
    tags: ['SEBI', 'Trail Commission', 'MFD', 'Regulations'],
    trending: true,
  },
];

// Helper functions
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getFeaturedBlogs(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getTrendingBlogs(): BlogPost[] {
  return blogPosts.filter(post => post.trending);
}

export function getRelatedBlogs(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getBlogBySlug(currentSlug);
  if (!current) return [];
  
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === current.category)
    .slice(0, limit);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
}

