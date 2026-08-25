import { GoogleGenAI, Type } from '@google/genai';

export interface AIValidationResult {
  allowed: boolean;
  reason: string;
  categorySuggestion?: string;
  confidence?: number;
}

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

export async function validatePromptWithAI(
  title: string,
  promptText: string,
  category: string
): Promise<AIValidationResult> {
  const client = getGeminiClient();

  // If no Gemini API key configured, use intelligent heuristic validation
  if (!client) {
    return heuristicValidation(title, promptText, category);
  }

  try {
    const promptPayload = `
You are a Quality & Safety Content Validator for a Community Prompt Library platform.
Your task is to analyze user-submitted AI prompts to ensure quality, safety, and relevance.

Check whether the content:
1. Is an actual meaningful AI prompt, system directive, instruction, or template (e.g. asking an AI to do a task, roleplay, code, analyze, write, design, summarize).
2. Is relevant for a community prompt repository.
3. Is NOT spam, meaningless gibberish (e.g. "asdfasdf 1234"), or placeholder junk.
4. Is NOT excessively vulgar, abusive, sexually explicit, hateful, or promoting harassment.
5. Is NOT malicious (e.g. malware generation instructions, exploiting personal privacy, phishing payloads).
6. Is suitable for a general-purpose prompt library.

Candidate Title: "${title}"
Category: "${category}"
Prompt Text:
"""
${promptText}
"""

Evaluate this candidate prompt and output JSON adhering to the schema.
`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptPayload,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allowed: {
              type: Type.BOOLEAN,
              description: 'Whether the prompt meets the quality, safety, and relevance criteria for the library'
            },
            reason: {
              type: Type.STRING,
              description: 'Clear, concise human-readable justification for approval or rejection'
            },
            categorySuggestion: {
              type: Type.STRING,
              description: 'Suggested best-fit category if the selected one could be improved, or same category'
            }
          },
          required: ['allowed', 'reason']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      return heuristicValidation(title, promptText, category);
    }

    const parsed = JSON.parse(responseText.trim()) as AIValidationResult;
    return {
      allowed: Boolean(parsed.allowed),
      reason: parsed.reason || (parsed.allowed ? 'Valid and well-structured AI prompt' : 'Content does not meet prompt guidelines'),
      categorySuggestion: parsed.categorySuggestion
    };
  } catch (error) {
    console.warn('Gemini AI validation error (falling back gracefully):', error);
    // Graceful fallback so API never breaks if external network or key is flaky
    return heuristicValidation(title, promptText, category);
  }
}

function heuristicValidation(
  title: string,
  promptText: string,
  category: string
): AIValidationResult {
  const cleanTitle = title.trim();
  const cleanText = promptText.trim();

  // Basic gibberish check
  const words = cleanText.split(/\s+/);
  if (words.length < 3) {
    return {
      allowed: false,
      reason: 'Prompt text is too brief to serve as a meaningful AI instruction. Please include more details or context.'
    };
  }

  // Check character repetition gibberish
  if (/(.)\1{9,}/i.test(cleanText)) {
    return {
      allowed: false,
      reason: 'Prompt contains repeated characters or apparent spam/gibberish.'
    };
  }

  // Common toxic / abusive terms filter
  const prohibitedPatterns = [
    /\b(kill yourself|suicide method|how to make bomb|ransomware script|ddos attack bot|stolen credit card)\b/i
  ];
  for (const pattern of prohibitedPatterns) {
    if (pattern.test(cleanText) || pattern.test(cleanTitle)) {
      return {
        allowed: false,
        reason: 'Content contains restricted or potentially harmful instructions.'
      };
    }
  }

  return {
    allowed: true,
    reason: 'Valid AI prompt verified by system quality and safety checks.'
  };
}
