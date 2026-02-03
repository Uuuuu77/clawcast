import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CATEGORIES = ['sports', 'crypto', 'politics', 'tech', 'finance', 'culture', 'music'] as const;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing prediction query:', query);

    const systemPrompt = `You are ORACLE AI, an advanced prediction intelligence system that analyzes global events and provides probability-based predictions.

Your task is to analyze the user's question about a future event and provide:
1. A probability percentage (0-100) of the predicted outcome
2. A detailed analysis explaining your reasoning
3. Key factors that influence this prediction (3-5 bullet points)
4. The category this prediction belongs to (sports, crypto, politics, tech, finance, culture, or music)

Be honest about uncertainty. If an event is highly unpredictable, reflect that in your probability. Consider:
- Historical data and trends
- Current circumstances
- Expert opinions
- Market indicators (for finance/crypto)
- Recent news and developments

Respond in JSON format with this structure:
{
  "probability": <number 0-100>,
  "analysis": "<detailed analysis paragraph>",
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "category": "<category>",
  "sources": ["general source type 1", "general source type 2"]
}

Current date: ${new Date().toISOString().split('T')[0]}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI response received');

    // Parse the JSON response
    let prediction;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      prediction = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response as JSON:', content);
      // Fallback with default structure
      prediction = {
        probability: 50,
        analysis: content,
        keyFactors: ['Analysis based on available information'],
        category: 'tech',
        sources: ['AI analysis']
      };
    }

    // Validate and sanitize the response
    const result = {
      probability: Math.max(0, Math.min(100, Number(prediction.probability) || 50)),
      analysis: String(prediction.analysis || 'Analysis not available'),
      keyFactors: Array.isArray(prediction.keyFactors) 
        ? prediction.keyFactors.slice(0, 5).map(String)
        : ['Based on current trends'],
      category: CATEGORIES.includes(prediction.category) ? prediction.category : 'tech',
      sources: Array.isArray(prediction.sources)
        ? prediction.sources.slice(0, 4).map(String)
        : ['AI analysis']
    };

    console.log('Prediction result:', { probability: result.probability, category: result.category });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Oracle prediction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
