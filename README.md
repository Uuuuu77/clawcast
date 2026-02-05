# 🦞 ClawCast

**Evidence-based intelligence for better decisions.**

ClawCast is an AI agent that gathers evidence from multiple sources and shows you exactly what it found—no hidden reasoning, no fake confidence.

## What ClawCast Does

Ask about any future event. ClawCast:
- Searches news and web sources
- Checks prediction markets
- Tracks relevant cryptocurrency data
- Synthesizes findings with transparent AI analysis

**Examples:**
- "Will the Fed cut rates in March 2026?"
- "Ethereum ETF approval likelihood"
- "What's the outlook for AI regulation in Europe?"

## Why ClawCast

**Transparent Evidence**
Every claim cites its source. See the raw data, not just the conclusion.

**Real-Time Intelligence**
Live data from Firecrawl, Polymarket, CoinGecko, and news APIs.

**Honest Uncertainty**
Shows confidence levels and conflicting evidence. No false certainty.

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/clawcast.git
cd clawcast
npm install

# Set up environment
cp .env.example .env
# Add your API keys:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - FIRECRAWL_API_KEY
# - LOVABLE_API_KEY

# Run locally
npm run dev

# Deploy Edge Functions
supabase functions deploy clawcast-analyze
```

## Architecture

```
User Query
    ↓
[Input Validation & Rate Limiting]
    ↓
[Evidence Gathering] → Firecrawl API (news/web)
    ↓                → Polymarket (prediction markets)
    ↓                → CoinGecko (crypto data)
    ↓
[AI Synthesis via Claude Sonnet]
    ↓
[Transparent Results + Citations]
```

## Core Principles

Inspired by Claude's approach to AI assistance:

1. **Transparency First**: Every piece of evidence is visible and traceable
2. **Honest Uncertainty**: Acknowledge what we don't know
3. **Evidence Over Opinion**: Let the data speak
4. **User Agency**: Provide information, you make the decision

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **AI**: Anthropic Claude Sonnet 4
- **Data Sources**: Firecrawl, Polymarket, CoinGecko
- **Auth**: Supabase Auth + JWT
- **Deployment**: Lovable.dev

## Security

- JWT-based authentication with 15-minute access tokens
- Row-level security on all database operations
- Rate limiting: 10 queries/day (free), 100/day (premium)
- Input sanitization and validation
- API keys never exposed to client
- Content Security Policy enforced

## API Usage

### Analyze Query

```typescript
const { data, error } = await supabase.functions.invoke('clawcast-analyze', {
  body: { query: 'Will Bitcoin reach $100k in 2026?' },
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});
```

### Response Format

```json
{
  "success": true,
  "requestId": "uuid-here",
  "data": {
    "synthesis": "Based on current evidence...",
    "confidence": 0.65,
    "evidence": [
      {
        "source": "CoinDesk",
        "type": "news",
        "content": "...",
        "url": "https://...",
        "timestamp": "2026-02-05T10:30:00Z"
      }
    ],
    "markets": [...],
    "cryptoData": {...}
  }
}
```

## Limitations

**Not Financial Advice**: ClawCast provides information, not recommendations. Always do your own research.

**Data Recency**: Sources update at different rates. Check timestamps on evidence.

**API Dependencies**: Reliability depends on third-party APIs. Graceful degradation implemented.

**Rate Limits**: Free tier limited to 10 daily queries to manage costs.

## Contributing

We welcome contributions! Areas of focus:

- New evidence sources (APIs)
- Improved synthesis prompts
- UI/UX enhancements
- Security improvements
- Documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Roadmap

- [ ] Multi-turn conversations with context
- [ ] Historical tracking of predictions vs outcomes
- [ ] Custom alert notifications
- [ ] Export analysis reports
- [ ] API for developers
- [ ] Mobile app (iOS/Android)

## Philosophy

ClawCast exists because decisions about the future are hard. Too many tools either:
- Give you black-box predictions ("Trust me, here's what will happen")
- Overwhelm you with raw data ("Figure it out yourself")

We believe there's a better way: **show the evidence, explain the synthesis, acknowledge the uncertainty.** 

Like Claude, we think AI should be helpful, honest, and harmless. Like OpenClaw, we believe in transparent agent actions.

The future is uncertain. Let's navigate it with clear evidence and honest analysis.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contact

- **Issues**: [GitHub Issues]()
- **Discussions**: [GitHub Discussions]()
- **Email**: 

---

Built with 🦞 by the ClawCast team

*"See the evidence. Make better decisions."*
