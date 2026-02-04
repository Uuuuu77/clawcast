

# CLAWCAST MVP Implementation Plan

A complete rebuild focused on **evidence transparency** and **honest uncertainty** - no numeric probabilities, just High/Medium/Low confidence with full citation trails.

---

## Architecture Overview

```text
+------------------+     +-------------------+     +----------------------+
|   Landing Page   | --> |  Query Interface  | --> |  Evidence Gathering  |
|  (Single focus)  |     |  (NL input only)  |     |     Edge Function    |
+------------------+     +-------------------+     +----------------------+
                                                            |
                              +-----------------------------+
                              v
                    +-------------------+
                    |  OpenClaw Agent   |
                    |  (Synthesis only) |
                    +-------------------+
                              |
                              v
                    +-------------------+
                    |   Result Page     |
                    | - Confidence Badge|
                    | - Key Drivers     |
                    | - Evidence Drawer |
                    +-------------------+
```

---

## Phase 1: Core Rebrand and UI Overhaul

### 1.1 Rename and Restructure
- Rename all `oracle` references to `clawcast`
- Update branding: "CLAWCAST" with lobster/claw theme
- New tagline: "Evidence-based event intelligence"

### 1.2 Simplified Landing Page
- Single-purpose: one search box, no distractions
- Remove: category filters, trending events, prediction cards
- Add: trust-building copy and clear disclaimers
- Mobile-first, minimal design

### 1.3 Confidence Badge System (replaces probability meter)
Replace numeric percentages with three-tier system:
- HIGH (green): Strong agreement across sources
- MEDIUM (yellow): Mixed signals or limited data  
- LOW (red): High uncertainty or conflicting evidence

---

## Phase 2: Evidence Gathering Engine

### 2.1 Multi-Source Edge Function
Create `clawcast-analyze` edge function that gathers from:

**Web Sources (via Firecrawl)**
- News articles (Google Search results)
- Blog posts and analysis

**Market Data (CoinGecko API - free tier)**
- Price, market cap, volume for crypto queries
- 24h/7d/30d change percentages

**Prediction Markets (direct API calls)**
- Polymarket gamma API (public endpoints)
- Kalshi public market data

### 2.2 Evidence Schema
Each evidence item includes:
- Source name and URL
- Timestamp of data
- Relevance score
- Quote/data point extracted

---

## Phase 3: OpenClaw Agent Integration

### 3.1 Architecture Decision
OpenClaw is a CLI-based local agent framework. For a web app, we have two options:

**Option A: Lovable AI with Tool-Gated Prompting (Recommended)**
- Use existing Lovable AI Gateway
- Implement tool-gated behavior via structured prompting
- Agent cannot "browse freely" - only synthesizes provided evidence
- Faster to ship, no additional dependencies

**Option B: Self-Hosted OpenClaw**
- Requires user to run `npm i -g openclaw` locally
- Not suitable for a web-based SaaS product
- Better for developer tools, not end-user apps

We will implement **Option A** - a "ClawCast Agent" using Lovable AI that behaves like OpenClaw's principles: synthesis-only, cannot invent data, must cite sources.

### 3.2 Agent Behavior Rules
The AI prompt will enforce:
1. Only use evidence provided in context
2. Cannot make claims without citations
3. Must highlight disagreements between sources
4. Must identify "what could change this"
5. Cannot produce numeric probabilities

---

## Phase 4: Result Page Design

### 4.1 Core Components
- **Event Summary**: Parsed query with entities/timeframe
- **Confidence Badge**: Large, prominent (HIGH/MEDIUM/LOW)
- **Key Drivers**: 3-5 bullet points explaining the assessment
- **"What Could Change This"**: Explicit uncertainty factors

### 4.2 Evidence Transparency Panel
Expandable drawer showing:
- All evidence items with source links
- Prediction market odds (as reference, not recommendation)
- Timestamps for each data point
- Source credibility indicators

### 4.3 Disclaimer Footer
Permanent footer with:
- "Not financial advice"
- "Decision-support tool only"
- "Predictions may be wrong"

---

## Phase 5: Optional Document Upload (P1)

### 5.1 Simple RAG Implementation
- Accept PDF/DOC/TXT uploads (max 20MB)
- Parse and chunk documents
- Include document content in agent context
- Document claims override web data
- Cite document sections in response

---

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `src/components/clawcast/QueryInput.tsx` | Single focused search input |
| `src/components/clawcast/ConfidenceBadge.tsx` | HIGH/MEDIUM/LOW indicator |
| `src/components/clawcast/EvidencePanel.tsx` | Expandable source drawer |
| `src/components/clawcast/KeyDrivers.tsx` | Bullet point reasoning |
| `src/components/clawcast/ResultCard.tsx` | Main result display |
| `src/components/clawcast/DisclaimerFooter.tsx` | Legal/trust disclaimers |
| `src/components/clawcast/LoadingAnimation.tsx` | "Gathering evidence..." |
| `src/hooks/useClawcastAnalysis.ts` | Analysis hook |
| `src/pages/Result.tsx` | Result display page |
| `supabase/functions/clawcast-analyze/index.ts` | Main analysis engine |
| `supabase/functions/gather-evidence/index.ts` | Evidence collection |

### Files to Delete
| File | Reason |
|------|--------|
| `src/components/oracle/*` | All oracle components replaced |
| `src/hooks/usePrediction.ts` | Replaced by useClawcastAnalysis |
| `supabase/functions/oracle-predict/*` | Replaced by clawcast-analyze |

### Files to Modify
| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Complete redesign for simple landing |
| `src/index.css` | Updated color scheme (keep dark theme) |
| `tailwind.config.ts` | New clawcast color variables |
| `index.html` | Update title/meta to "ClawCast" |

---

## Technical Implementation Details

### Evidence Gathering Flow
```text
1. User submits query
2. Edge function parses query (extract event, timeframe, entities)
3. Parallel evidence gathering:
   - Firecrawl search for news/articles
   - CoinGecko API for crypto data (if relevant)
   - Polymarket/Kalshi public endpoints
4. Deduplicate and rank evidence
5. Pass to synthesis agent with strict prompt
6. Agent returns structured response
7. Display result with full citations
```

### Confidence Classification Logic
```text
HIGH: 
  - 3+ sources agree
  - Prediction markets >70% consensus
  - Recent, high-quality sources

MEDIUM:
  - Mixed signals across sources
  - Prediction markets 40-70%
  - Some uncertainty acknowledged

LOW:
  - Conflicting sources
  - Limited data available
  - High inherent unpredictability
```

### API Integrations Required
1. **Firecrawl**: Connect via standard connector for web search
2. **CoinGecko**: Free public API (no key needed for basic endpoints)
3. **Polymarket**: Public gamma API endpoints
4. **Lovable AI**: Already configured (LOVABLE_API_KEY)

---

## MVP Timeline Alignment (6-8 weeks)

| Week | Deliverable |
|------|-------------|
| 1-2 | Core rebrand, landing page, confidence badge system |
| 3-4 | Evidence gathering edge function (Firecrawl + CoinGecko) |
| 5-6 | Synthesis agent, result page, evidence panel |
| 7-8 | Polish, disclaimers, testing, document upload (P1) |

---

## What's Explicitly OUT (per your spec)

- User accounts/authentication
- Personalization
- Real-time streaming
- Numeric probabilities
- Social features
- Prediction history dashboards
- Token incentives
- Automated trading

---

## Success Criteria (from your spec)

- Percentage of responses with 3+ independent sources
- Percentage of answers marked Medium/Low (honesty metric)
- User trust feedback collection
- Full audit trail logging for all analyses

---

## Dependencies Needed

1. **Firecrawl Connector**: For web search capabilities
2. **No additional secrets**: CoinGecko and Polymarket have public endpoints

---

## Key Differentiators

This MVP wins because:
- **Clear uncertainty** - never pretends to know more than it does
- **Receipts for every claim** - full evidence transparency
- **Refuses to fake confidence** - honest about limitations
- **No gambling vibes** - decision-support, not betting

