
# ClawCast Edge Function Optimization Plan

## Current State Analysis

After thorough investigation, I found:
- The edge function is **operational** (test call returned 200 with valid data)
- Polymarket search returns irrelevant results (Bitcoin query returned deportation markets)
- React forwardRef warnings in QueryInput and DisclaimerFooter components
- No timeout protection, retry logic, or response caching

---

## Implementation Plan

### Phase 1: Fix React Warnings

**Files to modify:**
- `src/components/clawcast/QueryInput.tsx`
- `src/components/clawcast/DisclaimerFooter.tsx`

**Changes:**
- Add `React.forwardRef` wrapper to both components to fix the ref warnings

---

### Phase 2: Edge Function Robustness

**File to modify:** `supabase/functions/clawcast-analyze/index.ts`

#### 2.1 Startup Diagnostics
Add logging at function start to confirm API keys are configured:
```text
console.log('ClawCast Edge Function Started', {
  timestamp: new Date().toISOString(),
  hasLovableKey: !!LOVABLE_API_KEY,
  hasFirecrawlKey: !!FIRECRAWL_API_KEY
});
```

#### 2.2 Request Timeout Protection
Wrap each external API call with a timeout helper:
```text
async function fetchWithTimeout(url, options, timeoutMs = 15000)
  - Uses AbortController for timeout
  - Returns null on timeout instead of throwing
  - Logs timeout events for debugging
```

#### 2.3 Retry Logic with Exponential Backoff
Create utility for retrying failed requests:
```text
async function fetchWithRetry(url, options, maxRetries = 2)
  - Attempts request up to 3 times total
  - Exponential backoff: 1s, 2s delays
  - Only retries on network errors and 5xx status codes
  - Returns null if all retries exhausted
```

#### 2.4 Improved Polymarket Integration
Fix the irrelevant results issue:
```text
- Add query preprocessing to extract key terms
- Filter markets by relevance to the original query
- Handle malformed outcomePrices gracefully
- Add validation before JSON.parse
```

#### 2.5 CoinGecko Improvements
Expand cryptocurrency support:
```text
- Add more crypto aliases (doge, dogecoin, cardano, ada, etc.)
- Handle API rate limits (429 status)
- Add fallback message when coin data unavailable
```

#### 2.6 Firecrawl Error Handling
Improve web evidence gathering:
```text
- Better error logging with response details
- Handle rate limits
- Validate response structure before processing
- Extract better quotes from markdown content
```

---

### Phase 3: UI Error Handling Improvements

**Files to modify:**
- `src/hooks/useClawcastAnalysis.ts`
- `src/pages/Index.tsx`

**Changes:**

#### 3.1 Enhanced Error Messages
Map specific error types to user-friendly messages:
```text
- "Service temporarily unavailable" -> "Our analysis service is busy. Please try again in a moment."
- "Request timed out" -> "This query is taking longer than expected. Please try again."
- Network errors -> "Unable to connect. Please check your internet connection."
```

#### 3.2 Partial Results Handling
If the edge function returns partial data (some sources failed), still show available results:
```text
- Add warning badge when evidence sources are limited
- Show which sources succeeded vs failed
```

#### 3.3 Retry Button
Add a retry button in the error state toast:
```text
- Store last query
- Allow one-click retry
- Clear error state on retry
```

---

### Phase 4: Loading State Improvements

**File to modify:** `src/components/clawcast/LoadingAnimation.tsx`

**Changes:**
- Replace simulated step progression with actual progress tracking
- Show "Searching [source]..." dynamically based on real fetch status
- Add elapsed time indicator

---

## Technical Details

### Timeout Implementation Pattern
```text
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15000);

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    console.log('Request timed out');
    return null;
  }
  throw error;
}
```

### Polymarket Relevance Filter
```text
function isRelevantMarket(market, queryTerms):
  - Extract key entities from query (bitcoin, ethereum, fed, etc.)
  - Check if market.question contains any query entities
  - Skip markets with < 50% relevance
```

---

## Files Summary

| File | Changes |
|------|---------|
| `supabase/functions/clawcast-analyze/index.ts` | Add timeouts, retries, better error handling, fix Polymarket relevance |
| `src/components/clawcast/QueryInput.tsx` | Add forwardRef wrapper |
| `src/components/clawcast/DisclaimerFooter.tsx` | Add forwardRef wrapper |
| `src/hooks/useClawcastAnalysis.ts` | Enhanced error messages, partial results handling |
| `src/pages/Index.tsx` | Retry button in error state |
| `src/components/clawcast/LoadingAnimation.tsx` | Real progress tracking |

---

## Testing Checklist

After implementation, verify:
1. Query "Will Bitcoin reach $100k?" returns relevant evidence (no deportation markets)
2. Edge function handles slow/failed API calls gracefully
3. Loading animation shows realistic progress
4. Error messages are user-friendly and actionable
5. React forwardRef warnings are resolved
6. Partial results display when some sources fail

---

## Out of Scope (Per User Requirements)

The following are explicitly NOT included in this plan:
- User accounts / authentication
- Response caching (requires database tables)
- Rate limiting per IP (requires database state)
- Document upload feature
- Real-time streaming
- Numeric probabilities
