import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation constants
const MIN_QUERY_LENGTH = 5;
const MAX_QUERY_LENGTH = 500;

// Validate and sanitize user query input
function validateQuery(query: unknown): { valid: true; sanitized: string } | { valid: false; error: string } {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query is required and must be a string' };
  }

  const trimmed = query.trim();

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return { valid: false, error: `Query must be at least ${MIN_QUERY_LENGTH} characters` };
  }

  if (trimmed.length > MAX_QUERY_LENGTH) {
    return { valid: false, error: `Query must not exceed ${MAX_QUERY_LENGTH} characters` };
  }

  // Sanitize: remove potential prompt injection patterns and dangerous characters
  const sanitized = trimmed
    .replace(/[<>"'`]/g, '') // Remove HTML/script-like chars
    .replace(/\b(ignore|disregard)\s+(previous|above|all|instructions)/gi, '') // Remove injection attempts
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();

  if (sanitized.length < MIN_QUERY_LENGTH) {
    return { valid: false, error: 'Query contains too many invalid characters' };
  }

  return { valid: true, sanitized };
}

// Map internal errors to safe client-facing messages
function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('api_key') || msg.includes('apikey') || msg.includes('configured')) {
      return 'Service temporarily unavailable. Please try again later.';
    }
    if (msg.includes('rate limit')) {
      return 'Too many requests. Please try again in a moment.';
    }
    if (msg.includes('usage limit') || msg.includes('credits')) {
      return 'Service capacity reached. Please try again later.';
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return 'Request timed out. Please try again.';
    }
  }
  return 'Analysis request failed. Please try again.';
}

// Structured error logging for server-side debugging
function logError(context: string, error: unknown, metadata?: Record<string, unknown>) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? {
      message: error.message,
      name: error.name,
    } : String(error),
    metadata
  }));
}

interface EvidenceItem {
  id: string;
  source: string;
  url?: string;
  quote: string;
  timestamp: string;
  type: "news" | "market" | "prediction" | "analysis";
  relevanceScore?: number;
}

interface MarketOdds {
  platform: string;
  odds: string;
  url?: string;
}

// Gather evidence from web search via Firecrawl
async function gatherWebEvidence(query: string, apiKey: string): Promise<EvidenceItem[]> {
  const evidence: EvidenceItem[] = [];
  
  try {
    console.log('Searching web for:', query);
    
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        limit: 5,
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    if (!response.ok) {
      console.error('Firecrawl search failed:', response.status);
      return evidence;
    }

    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      for (const result of data.data) {
        // Extract a relevant quote from the content
        let quote = result.description || '';
        if (result.markdown) {
          // Get first meaningful paragraph
          const paragraphs = result.markdown.split('\n\n').filter((p: string) => 
            p.length > 50 && !p.startsWith('#') && !p.startsWith('!')
          );
          if (paragraphs.length > 0) {
            quote = paragraphs[0].slice(0, 300);
            if (paragraphs[0].length > 300) quote += '...';
          }
        }

        evidence.push({
          id: crypto.randomUUID(),
          source: result.title || new URL(result.url).hostname,
          url: result.url,
          quote: quote || 'No excerpt available',
          timestamp: new Date().toISOString().split('T')[0],
          type: 'news',
          relevanceScore: 0.8,
        });
      }
    }
  } catch (error) {
    console.error('Error gathering web evidence:', error);
  }

  return evidence;
}

// Gather crypto market data from CoinGecko
async function gatherCryptoEvidence(query: string): Promise<EvidenceItem[]> {
  const evidence: EvidenceItem[] = [];
  
  // Check if query mentions crypto terms
  const cryptoTerms = ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'solana', 'sol', 'xrp'];
  const lowerQuery = query.toLowerCase();
  const mentionedCrypto = cryptoTerms.find(term => lowerQuery.includes(term));
  
  if (!mentionedCrypto) return evidence;

  try {
    // Map common terms to CoinGecko IDs
    const coinMap: Record<string, string> = {
      'bitcoin': 'bitcoin', 'btc': 'bitcoin',
      'ethereum': 'ethereum', 'eth': 'ethereum',
      'solana': 'solana', 'sol': 'solana',
      'xrp': 'ripple',
      'crypto': 'bitcoin', // Default to BTC for general crypto queries
    };
    
    const coinId = coinMap[mentionedCrypto] || 'bitcoin';
    
    console.log('Fetching CoinGecko data for:', coinId);
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );

    if (!response.ok) {
      console.error('CoinGecko API failed:', response.status);
      return evidence;
    }

    const data = await response.json();
    
    const price = data.market_data?.current_price?.usd;
    const change24h = data.market_data?.price_change_percentage_24h;
    const change7d = data.market_data?.price_change_percentage_7d;
    const change30d = data.market_data?.price_change_percentage_30d;
    const marketCap = data.market_data?.market_cap?.usd;

    const formatNumber = (num: number) => {
      if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      return `$${num.toLocaleString()}`;
    };

    const formatChange = (num: number) => {
      const sign = num >= 0 ? '+' : '';
      return `${sign}${num.toFixed(2)}%`;
    };

    evidence.push({
      id: crypto.randomUUID(),
      source: 'CoinGecko',
      url: `https://www.coingecko.com/en/coins/${coinId}`,
      quote: `${data.name} (${data.symbol.toUpperCase()}) is currently trading at ${formatNumber(price)} with a market cap of ${formatNumber(marketCap)}. Price changes: 24h ${formatChange(change24h)}, 7d ${formatChange(change7d)}, 30d ${formatChange(change30d)}.`,
      timestamp: new Date().toISOString().split('T')[0],
      type: 'market',
      relevanceScore: 0.9,
    });
  } catch (error) {
    console.error('Error gathering crypto evidence:', error);
  }

  return evidence;
}

// Gather prediction market data from Polymarket
async function gatherPredictionMarketEvidence(query: string): Promise<{ evidence: EvidenceItem[], marketOdds: MarketOdds[] }> {
  const evidence: EvidenceItem[] = [];
  const marketOdds: MarketOdds[] = [];

  try {
    console.log('Searching Polymarket for:', query);
    
    // Polymarket gamma API for searching markets
    const response = await fetch(
      `https://gamma-api.polymarket.com/markets?closed=false&limit=3&search=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      console.error('Polymarket API failed:', response.status);
      return { evidence, marketOdds };
    }

    const markets = await response.json();

    if (Array.isArray(markets) && markets.length > 0) {
      for (const market of markets) {
        const yesPrice = market.outcomePrices ? 
          JSON.parse(market.outcomePrices)[0] : null;
        
        if (yesPrice) {
          const percentage = (parseFloat(yesPrice) * 100).toFixed(0);
          
          marketOdds.push({
            platform: 'Polymarket',
            odds: `${percentage}% Yes`,
            url: `https://polymarket.com/event/${market.slug || market.id}`,
          });

          evidence.push({
            id: crypto.randomUUID(),
            source: 'Polymarket',
            url: `https://polymarket.com/event/${market.slug || market.id}`,
            quote: `Prediction market "${market.question}" shows ${percentage}% probability. Volume: $${(market.volume || 0).toLocaleString()}.`,
            timestamp: new Date().toISOString().split('T')[0],
            type: 'prediction',
            relevanceScore: 0.95,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error gathering prediction market evidence:', error);
  }

  return { evidence, marketOdds };
}

// Synthesize evidence using AI
async function synthesizeAnalysis(
  query: string,
  evidence: EvidenceItem[],
  marketOdds: MarketOdds[],
  lovableApiKey: string
): Promise<{
  eventSummary: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  keyDrivers: string[];
  changeFactors: string[];
}> {
  const evidenceContext = evidence.map((e, i) => 
    `[Source ${i + 1}: ${e.source}] ${e.quote}`
  ).join('\n\n');

  const marketContext = marketOdds.length > 0 
    ? `\n\nPrediction Market Data:\n${marketOdds.map(m => `- ${m.platform}: ${m.odds}`).join('\n')}`
    : '';

  const systemPrompt = `You are ClawCast, an evidence-based analysis agent. Your core principles:

1. ONLY use evidence provided in context - never invent data
2. Every claim must be traceable to a source
3. Highlight disagreements between sources
4. Identify factors that could change the outcome
5. NEVER produce numeric probabilities - only HIGH/MEDIUM/LOW confidence

Confidence levels:
- HIGH: 3+ sources agree, prediction markets show >70% consensus, recent high-quality sources
- MEDIUM: Mixed signals, markets 40-70%, some uncertainty
- LOW: Conflicting sources, limited data, inherently unpredictable

Respond in JSON format:
{
  "eventSummary": "Clear 1-sentence summary of the event being analyzed",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "keyDrivers": ["3-5 bullet points explaining the assessment, citing sources"],
  "changeFactors": ["2-3 factors that could change this assessment"]
}

Be honest about uncertainty. If evidence is limited, say so.`;

  const userPrompt = `Query: "${query}"

Evidence Gathered:
${evidenceContext}
${marketContext}

Synthesize this evidence into an assessment. Remember:
- Only cite the evidence provided above
- Do not invent additional data points
- Be explicit about uncertainty`;

  console.log('Synthesizing with AI...');

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower for more consistent output
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError('AI Gateway request failed', new Error(`Status ${response.status}`), { 
      status: response.status,
      responsePreview: errorText.substring(0, 200) 
    });
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    if (response.status === 402) {
      throw new Error('Usage limit reached');
    }
    
    throw new Error('AI synthesis failed');
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from AI');
  }

  // Parse JSON response
  try {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
    const jsonStr = jsonMatch[1].trim();
    const parsed = JSON.parse(jsonStr);
    
    return {
      eventSummary: String(parsed.eventSummary || query),
      confidence: ['HIGH', 'MEDIUM', 'LOW'].includes(parsed.confidence) 
        ? parsed.confidence 
        : 'MEDIUM',
      keyDrivers: Array.isArray(parsed.keyDrivers) 
        ? parsed.keyDrivers.slice(0, 5).map(String) 
        : ['Based on available evidence'],
      changeFactors: Array.isArray(parsed.changeFactors) 
        ? parsed.changeFactors.slice(0, 3).map(String) 
        : ['New information could change this assessment'],
    };
  } catch {
    console.error('Failed to parse AI response:', content);
    return {
      eventSummary: query,
      confidence: 'MEDIUM',
      keyDrivers: ['Analysis based on available evidence'],
      changeFactors: ['Additional data could refine this assessment'],
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate content-type header
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize query input
    const queryInput = (body as Record<string, unknown>)?.query;
    const validation = validateQuery(queryInput);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const query = validation.sanitized;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY is not configured. Please connect Firecrawl in settings.');
    }

    console.log('Processing ClawCast query:', query);

    // Gather evidence in parallel
    const [webEvidence, cryptoEvidence, predictionData] = await Promise.all([
      gatherWebEvidence(query, FIRECRAWL_API_KEY),
      gatherCryptoEvidence(query),
      gatherPredictionMarketEvidence(query),
    ]);

    // Combine all evidence
    const allEvidence = [
      ...webEvidence,
      ...cryptoEvidence,
      ...predictionData.evidence,
    ];

    console.log(`Gathered ${allEvidence.length} evidence items`);

    // Synthesize analysis
    const analysis = await synthesizeAnalysis(
      query,
      allEvidence,
      predictionData.marketOdds,
      LOVABLE_API_KEY
    );

    const result = {
      eventSummary: analysis.eventSummary,
      confidence: analysis.confidence,
      keyDrivers: analysis.keyDrivers,
      changeFactors: analysis.changeFactors,
      evidence: allEvidence,
      marketOdds: predictionData.marketOdds,
    };

    console.log('Analysis complete:', { 
      confidence: result.confidence, 
      evidenceCount: allEvidence.length 
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logError('ClawCast analysis error', error);
    
    return new Response(
      JSON.stringify({ error: getSafeErrorMessage(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
