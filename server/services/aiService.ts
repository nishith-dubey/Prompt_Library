import { GoogleGenAI, Type } from '@google/genai';

export interface AIValidationResult {
  allowed: boolean;
  reason: string;
}

type PromptMedia = {
  type: 'image' | 'video';
  url: string;
};

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return geminiClient;
}

export async function validatePromptWithAI(
  title: string,
  promptText: string,
  category: string,
  media?: PromptMedia[]
): Promise<AIValidationResult> {
  const client = getGeminiClient();

  // Basic validation first
  const basicValidation = basicPromptValidation(
    title,
    promptText,
    category
  );

  if (!basicValidation.allowed) {
    return basicValidation;
  }

  // If Gemini is not configured, use fallback validation
  if (!client) {
    return heuristicValidation(title, promptText, category);
  }

  try {
    /*
     * Only images are sent to Gemini.
     * Videos are handled by normal file validation.
     */
    const images = (media ?? []).filter(
      (item) =>
        item.type === 'image' &&
        item.url.startsWith('data:image/')
    );

    const promptPayload = `
You are a Quality and Safety Validator for a community AI Prompt Library.

Analyze BOTH the prompt text and any attached images.

The prompt must:

1. Be a meaningful AI prompt, instruction, directive, or reusable template.
2. Be relevant to a community prompt library.
3. Not be spam, gibberish, or meaningless placeholder text.
4. Not contain excessive vulgarity, sexual content, hateful content, or harassment.
5. Not contain clearly malicious instructions such as malware, phishing, credential theft, or harmful exploitation.
6. Be appropriate for a general-purpose community platform.

If images are attached, ALSO check:

7. The image is reasonably relevant to the submitted prompt.
8. The image is appropriate and safe for a general-purpose platform.
9. The image is not sexually explicit, excessively vulgar, hateful, or abusive.
10. The image is not completely unrelated to the prompt.
11. The image should provide some useful context, example, result, screenshot, or demonstration related to the prompt.

Important:
- Do not reject a prompt just because it is simple.
- A short but meaningful prompt can be valid.
- Do not judge whether the prompt is professionally written.
- Focus on legitimacy, relevance, safety, and usefulness.

Candidate Title:
${title}

Category:
${category}

Prompt Text:
"""
${promptText}
"""

Return ONLY valid JSON:

{
  "allowed": true,
  "reason": "Short explanation"
}

Set "allowed" to false if either:
- the prompt itself is unacceptable, OR
- an attached image is clearly unsafe or unrelated.
`;

    /*
     * Build multimodal Gemini contents.
     *
     * First send the validation instructions.
     * Then send every uploaded image that is available as base64.
     */
    const contents: Array<
      { text: string } |
      {
        inlineData: {
          mimeType: string;
          data: string;
        };
      }
    > = [
      {
        text: promptPayload,
      },
    ];

    for (const image of images) {
      try {
        const commaIndex = image.url.indexOf(',');

        if (commaIndex === -1) {
          continue;
        }

        const header = image.url.substring(0, commaIndex);
        const data = image.url.substring(commaIndex + 1);

        const mimeMatch = header.match(
          /^data:(image\/[a-zA-Z0-9.+-]+);base64$/
        );

        if (!mimeMatch || !data) {
          continue;
        }

        contents.push({
          inlineData: {
            mimeType: mimeMatch[1],
            data,
          },
        });
      } catch (imageError) {
        console.warn(
          'Could not prepare image for AI validation:',
          imageError
        );
      }
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allowed: {
              type: Type.BOOLEAN,
              description:
                'Whether the prompt and attached images are acceptable for the platform.',
            },
            reason: {
              type: Type.STRING,
              description:
                'Short human-readable reason for approval or rejection.',
            },
          },
          required: ['allowed', 'reason'],
        },
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      console.warn(
        'Gemini returned an empty validation response. Using fallback.'
      );

      return heuristicValidation(
        title,
        promptText,
        category
      );
    }

    let parsed: AIValidationResult;

    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.warn(
        'Could not parse Gemini validation response:',
        parseError
      );

      return heuristicValidation(
        title,
        promptText,
        category
      );
    }

    return {
      allowed: Boolean(parsed.allowed),
      reason:
        parsed.reason ||
        (parsed.allowed
          ? 'Prompt passed AI quality and safety checks.'
          : 'Prompt did not pass AI quality and safety checks.'),
    };
  } catch (error: any) {
    console.warn(
      'Gemini AI validation error (falling back gracefully):',
      error
    );

    /*
     * If Gemini is temporarily unavailable, do not crash the application.
     * Use local validation as a fallback.
     */
    return heuristicValidation(
      title,
      promptText,
      category
    );
  }
}

/*
 * Basic application-level validation.
 * These checks do not require AI.
 */
function basicPromptValidation(
  title: string,
  promptText: string,
  category: string
): AIValidationResult {
  const cleanTitle = title.trim();
  const cleanText = promptText.trim();
  const cleanCategory = category.trim();

  if (!cleanTitle) {
    return {
      allowed: false,
      reason: 'Prompt title is required.',
    };
  }

  if (!cleanText) {
    return {
      allowed: false,
      reason: 'Prompt instruction is required.',
    };
  }

  if (!cleanCategory) {
    return {
      allowed: false,
      reason: 'Prompt category is required.',
    };
  }

  if (cleanTitle.length > 200) {
    return {
      allowed: false,
      reason: 'Prompt title is too long.',
    };
  }

  if (cleanText.length > 20000) {
    return {
      allowed: false,
      reason: 'Prompt text is too long.',
    };
  }

  return {
    allowed: true,
    reason: 'Basic validation passed.',
  };
}

/*
 * Local fallback validation.
 * This runs when Gemini is unavailable.
 */
function heuristicValidation(
  title: string,
  promptText: string,
  category: string
): AIValidationResult {
  const cleanTitle = title.trim();
  const cleanText = promptText.trim();

  if (!cleanTitle || !cleanText || !category.trim()) {
    return {
      allowed: false,
      reason: 'Title, category, and prompt text are required.',
    };
  }

  const words = cleanText.split(/\s+/);

  if (words.length < 3) {
    return {
      allowed: false,
      reason:
        'Prompt text is too brief to serve as a meaningful AI instruction.',
    };
  }

  // Repeated characters / obvious gibberish
  if (/(.)\1{9,}/i.test(cleanText)) {
    return {
      allowed: false,
      reason:
        'Prompt contains repeated characters or apparent spam/gibberish.',
    };
  }

  // Common clearly harmful patterns
  const prohibitedPatterns = [
    /\b(kill yourself|suicide method)\b/i,
    /\bhow to make (a )?bomb\b/i,
    /\bransomware script\b/i,
    /\bddos attack bot\b/i,
    /\bstolen credit card\b/i,
    /\bcredit card dump\b/i,
    /\bcredential stealer\b/i,
    /\bpassword stealer\b/i,
    /\bphishing kit\b/i,
  ];

  for (const pattern of prohibitedPatterns) {
    if (
      pattern.test(cleanText) ||
      pattern.test(cleanTitle)
    ) {
      return {
        allowed: false,
        reason:
          'Content contains restricted or potentially harmful instructions.',
      };
    }
  }

  return {
    allowed: true,
    reason:
      'Prompt passed local quality and safety checks.',
  };
}